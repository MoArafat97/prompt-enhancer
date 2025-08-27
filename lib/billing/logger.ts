import { getAdminDb } from '@/lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface BillingLogEntry {
  id?: string;
  timestamp: Date;
  level: LogLevel;
  event: string;
  userId?: string;
  customerId?: string;
  subscriptionId?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

export class BillingLogger {
  private db: FirebaseFirestore.Firestore | null;
  private collectionName = 'billing_logs';

  constructor() {
    this.db = getAdminDb();
  }

  /**
   * Log a billing event
   */
  async log(entry: Omit<BillingLogEntry, 'id' | 'timestamp'>): Promise<void> {
    try {
      const logEntry: BillingLogEntry = {
        ...entry,
        timestamp: new Date(),
      };

      // Console log for immediate visibility
      this.consoleLog(logEntry);

      // Store in Firestore for persistence
      if (this.db) {
        await this.db.collection(this.collectionName).add({
          ...logEntry,
          timestamp: FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Failed to log billing event:', error);
    }
  }

  /**
   * Log debug information
   */
  async debug(event: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({
      level: LogLevel.DEBUG,
      event,
      metadata,
      userId,
    });
  }

  /**
   * Log informational events
   */
  async info(event: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      event,
      metadata,
      userId,
    });
  }

  /**
   * Log warnings
   */
  async warn(event: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({
      level: LogLevel.WARN,
      event,
      metadata,
      userId,
    });
  }

  /**
   * Log errors
   */
  async error(event: string, error: Error, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      event,
      metadata,
      userId,
      error: {
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      },
    });
  }

  /**
   * Log subscription events
   */
  async logSubscriptionEvent(
    event: string,
    subscriptionId: string,
    customerId: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      event: `subscription.${event}`,
      subscriptionId,
      customerId,
      userId,
      metadata,
    });
  }

  /**
   * Log payment events
   */
  async logPaymentEvent(
    event: string,
    amount: number,
    currency: string,
    customerId: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      event: `payment.${event}`,
      amount,
      currency,
      customerId,
      userId,
      metadata,
    });
  }

  /**
   * Log webhook events
   */
  async logWebhookEvent(
    event: string,
    webhookType: string,
    success: boolean,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.log({
      level: success ? LogLevel.INFO : LogLevel.ERROR,
      event: `webhook.${event}`,
      metadata: {
        ...metadata,
        webhookType,
        success,
      },
    });
  }

  /**
   * Get billing logs with filtering
   */
  async getLogs(options: {
    userId?: string;
    customerId?: string;
    subscriptionId?: string;
    level?: LogLevel;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}): Promise<BillingLogEntry[]> {
    if (!this.db) {
      console.warn('Database not available, returning empty logs');
      return [];
    }

    try {
      let query = this.db.collection(this.collectionName).orderBy('timestamp', 'desc');

      // Apply filters
      if (options.userId) {
        query = query.where('userId', '==', options.userId);
      }
      if (options.customerId) {
        query = query.where('customerId', '==', options.customerId);
      }
      if (options.subscriptionId) {
        query = query.where('subscriptionId', '==', options.subscriptionId);
      }
      if (options.level) {
        query = query.where('level', '==', options.level);
      }
      if (options.startDate) {
        query = query.where('timestamp', '>=', options.startDate);
      }
      if (options.endDate) {
        query = query.where('timestamp', '<=', options.endDate);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as BillingLogEntry[];
    } catch (error) {
      console.error('Failed to get billing logs:', error);
      return [];
    }
  }

  /**
   * Clean up old logs (keep last 30 days)
   */
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    if (!this.db) {
      console.warn('Database not available, skipping log cleanup');
      return;
    }

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const oldLogsQuery = this.db
        .collection(this.collectionName)
        .where('timestamp', '<', cutoffDate)
        .limit(500); // Process in batches

      const snapshot = await oldLogsQuery.get();
      
      if (snapshot.empty) {
        console.log('No old logs to clean up');
        return;
      }

      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${snapshot.size} old billing logs`);

      // If there were 500 docs, there might be more
      if (snapshot.size === 500) {
        await this.cleanupOldLogs(daysToKeep);
      }
    } catch (error) {
      console.error('Failed to clean up old logs:', error);
    }
  }

  /**
   * Console log with formatting
   */
  private consoleLog(entry: BillingLogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const level = entry.level.toUpperCase();
    const prefix = `[${timestamp}] [BILLING] [${level}]`;

    const message = `${prefix} ${entry.event}`;
    const details = {
      userId: entry.userId,
      customerId: entry.customerId,
      subscriptionId: entry.subscriptionId,
      amount: entry.amount,
      currency: entry.currency,
      metadata: entry.metadata,
      error: entry.error,
    };

    // Filter out undefined values
    const filteredDetails = Object.fromEntries(
      Object.entries(details).filter(([_, value]) => value !== undefined)
    );

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(message, filteredDetails);
        break;
      case LogLevel.WARN:
        console.warn(message, filteredDetails);
        break;
      case LogLevel.DEBUG:
        console.debug(message, filteredDetails);
        break;
      default:
        console.log(message, filteredDetails);
    }
  }
}

// Singleton instance
export const billingLogger = new BillingLogger();

// Convenience functions
export const logBillingEvent = billingLogger.log.bind(billingLogger);
export const logBillingError = billingLogger.error.bind(billingLogger);
export const logBillingInfo = billingLogger.info.bind(billingLogger);
export const logBillingWarn = billingLogger.warn.bind(billingLogger);
export const logBillingDebug = billingLogger.debug.bind(billingLogger);
