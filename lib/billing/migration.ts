import { getAdminDb } from '@/lib/server/firebase-admin';
import { GoCardlessService } from './gocardless-service';
import { FieldValue } from 'firebase-admin/firestore';

export class BillingMigration {
  private db: FirebaseFirestore.Firestore | null;
  private goCardlessService: GoCardlessService;

  constructor() {
    this.db = getAdminDb();
    this.goCardlessService = new GoCardlessService();
  }

  /**
   * Migrate users from old subscription structure to GoCardless billing
   */
  async migrateUsersToGoCardlessBilling(): Promise<void> {
    console.log('Starting migration to GoCardless billing...');

    if (!this.db) {
      console.error('Database not available, cannot perform migration');
      return;
    }

    try {
      // Get all users
      const usersSnapshot = await this.db.collection('users').get();
      let migratedCount = 0;
      let errorCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        try {
          const userData = userDoc.data();
          const userId = userDoc.id;

          // Skip if user already has GoCardless billing setup
          if (userData.billing?.goCardlessCustomerId) {
            console.log(`User ${userId} already has GoCardless billing, skipping...`);
            continue;
          }

          // Create GoCardless customer
          const customer = await this.goCardlessService.createCustomer({
            email: userData.email,
            givenName: userData.displayName?.split(' ')[0] || 'User',
            familyName: userData.displayName?.split(' ').slice(1).join(' ') || '',
          });

          // Determine current plan status
          const currentPlan = this.determinePlanFromLegacyData(userData);

          // Update user with GoCardless billing information
          const billingData = {
            goCardlessCustomerId: customer.id,
            planId: currentPlan.planId,
            status: currentPlan.status,
            usage: {
              promptsUsed: userData.subscription?.promptsUsed || 0,
              monthlyLimit: currentPlan.monthlyLimit,
              resetDate: userData.subscription?.resetDate || FieldValue.serverTimestamp(),
            },
          };

          await this.db.collection('users').doc(userId).update({
            billing: billingData,
            updatedAt: FieldValue.serverTimestamp(),
          });

          console.log(`Migrated user ${userId} to GoCardless billing`);
          migratedCount++;
        } catch (error) {
          console.error(`Error migrating user ${userDoc.id}:`, error);
          errorCount++;
        }
      }

      console.log(`Migration completed: ${migratedCount} users migrated, ${errorCount} errors`);
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Determine plan from legacy subscription data
   */
  private determinePlanFromLegacyData(userData: any): {
    planId: string;
    status: 'free' | 'active' | 'canceled' | 'past_due' | 'trialing';
    monthlyLimit: number;
  } {
    // Check if user had a legacy subscription
    const subscription = userData.subscription;
    
    if (!subscription) {
      return {
        planId: 'free',
        status: 'free',
        monthlyLimit: 50,
      };
    }

    // Map legacy plan to new plan structure
    const legacyPlan = subscription.plan;
    
    if (legacyPlan === 'pro' || subscription.monthlyLimit > 50) {
      return {
        planId: 'pro',
        status: 'active', // Assume active for migration
        monthlyLimit: -1, // Unlimited
      };
    }

    return {
      planId: 'free',
      status: 'free',
      monthlyLimit: 50,
    };
  }

  /**
   * Clean up old Lemon Squeezy references
   */
  async cleanupLemonSqueezyReferences(): Promise<void> {
    console.log('Cleaning up Lemon Squeezy references...');

    if (!this.db) {
      console.error('Database not available, cannot perform cleanup');
      return;
    }

    try {
      const usersSnapshot = await this.db.collection('users').get();
      let cleanedCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        let needsUpdate = false;
        const updates: any = {};

        // Remove old subscription field if it exists
        if (userData.subscription) {
          updates.subscription = FieldValue.delete();
          needsUpdate = true;
        }

        // Remove any Lemon Squeezy specific fields
        if (userData.lemonSqueezyCustomerId) {
          updates.lemonSqueezyCustomerId = FieldValue.delete();
          needsUpdate = true;
        }

        if (userData.lemonSqueezySubscriptionId) {
          updates.lemonSqueezySubscriptionId = FieldValue.delete();
          needsUpdate = true;
        }

        if (needsUpdate) {
          updates.updatedAt = FieldValue.serverTimestamp();
          await this.db.collection('users').doc(userDoc.id).update(updates);
          cleanedCount++;
        }
      }

      console.log(`Cleaned up ${cleanedCount} user records`);
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }

  /**
   * Validate migration results
   */
  async validateMigration(): Promise<{
    totalUsers: number;
    migratedUsers: number;
    freeUsers: number;
    proUsers: number;
    errors: string[];
  }> {
    console.log('Validating migration...');

    const results = {
      totalUsers: 0,
      migratedUsers: 0,
      freeUsers: 0,
      proUsers: 0,
      errors: [] as string[],
    };

    if (!this.db) {
      console.error('Database not available, cannot validate migration');
      results.errors.push('Database not available');
      return results;
    }

    try {
      const usersSnapshot = await this.db.collection('users').get();
      results.totalUsers = usersSnapshot.size;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Check if user has GoCardless billing
        if (userData.billing?.goCardlessCustomerId) {
          results.migratedUsers++;

          // Count by plan
          if (userData.billing.planId === 'free') {
            results.freeUsers++;
          } else {
            results.proUsers++;
          }

          // Validate GoCardless customer exists
          try {
            const customer = await this.goCardlessService.getCustomer(userData.billing.goCardlessCustomerId);
            if (!customer) {
              results.errors.push(`User ${userId}: GoCardless customer not found`);
            }
          } catch (error) {
            results.errors.push(`User ${userId}: Error validating GoCardless customer - ${error}`);
          }
        } else {
          results.errors.push(`User ${userId}: No GoCardless billing information`);
        }
      }

      console.log('Migration validation results:', results);
      return results;
    } catch (error) {
      console.error('Validation failed:', error);
      throw error;
    }
  }

  /**
   * Rollback migration (emergency use only)
   */
  async rollbackMigration(): Promise<void> {
    console.log('WARNING: Rolling back migration...');

    if (!this.db) {
      console.error('Database not available, cannot perform rollback');
      return;
    }

    try {
      const usersSnapshot = await this.db.collection('users').get();
      let rolledBackCount = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        if (userData.billing) {
          await this.db.collection('users').doc(userDoc.id).update({
            billing: FieldValue.delete(),
            updatedAt: FieldValue.serverTimestamp(),
          });
          rolledBackCount++;
        }
      }

      console.log(`Rolled back ${rolledBackCount} user records`);
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}

// CLI script for running migration
if (require.main === module) {
  const migration = new BillingMigration();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'migrate':
      migration.migrateUsersToGoCardlessBilling()
        .then(() => console.log('Migration completed successfully'))
        .catch(console.error);
      break;
      
    case 'cleanup':
      migration.cleanupLemonSqueezyReferences()
        .then(() => console.log('Cleanup completed successfully'))
        .catch(console.error);
      break;
      
    case 'validate':
      migration.validateMigration()
        .then((results) => {
          console.log('Validation results:', JSON.stringify(results, null, 2));
        })
        .catch(console.error);
      break;
      
    case 'rollback':
      console.log('Are you sure you want to rollback? This will remove all Square billing data.');
      console.log('Type "yes" to confirm:');
      process.stdin.once('data', (data) => {
        if (data.toString().trim() === 'yes') {
          migration.rollbackMigration()
            .then(() => console.log('Rollback completed'))
            .catch(console.error);
        } else {
          console.log('Rollback cancelled');
        }
        process.exit(0);
      });
      break;
      
    default:
      console.log('Usage: node migration.js [migrate|cleanup|validate|rollback]');
      console.log('');
      console.log('Commands:');
      console.log('  migrate  - Migrate users to Square billing');
      console.log('  cleanup  - Remove old Lemon Squeezy references');
      console.log('  validate - Validate migration results');
      console.log('  rollback - Rollback migration (emergency use only)');
      break;
  }
}
