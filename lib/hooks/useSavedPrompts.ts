import { useState, useEffect } from 'react';
import { SavedPrompt } from '@/lib/firebase/types';
import { 
  subscribeToUserPrompts, 
  deletePrompt, 
  updatePrompt,
  getUserPrompts,
  searchUserPrompts,
  getUserFavoritePrompts
} from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';

interface UseSavedPromptsOptions {
  realtime?: boolean;
  favoritesOnly?: boolean;
  limit?: number;
}

export function useSavedPrompts(options: UseSavedPromptsOptions = {}) {
  const { realtime = true, favoritesOnly = false, limit = 20 } = options;
  const { user } = useAuth();
  const { addToast } = useToast();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load prompts
  useEffect(() => {
    if (!user) {
      setPrompts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Real-time subscription
    if (realtime) {
      console.log('Setting up real-time subscription for user:', user.uid);

      const setupSubscription = async () => {
        const unsubscribe = await subscribeToUserPrompts(
          user.uid,
          (updatedPrompts) => {
            console.log('Received prompts update:', updatedPrompts.length, 'prompts');
            if (favoritesOnly) {
              setPrompts(updatedPrompts.filter(p => p.isFavorite));
            } else {
              setPrompts(updatedPrompts);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Error in prompts subscription:', err);
            setError(err);
            setLoading(false);
            addToast({
              title: 'Error loading prompts',
              description: err.message,
              type: 'error',
            });
          }
        );

        return unsubscribe;
      };

      let unsubscribePromise: Promise<(() => void) | null> | null = null;

      setupSubscription().then((unsubscribe) => {
        unsubscribePromise = Promise.resolve(unsubscribe);
      }).catch((err) => {
        console.error('Error setting up subscription:', err);
        setError(err);
        setLoading(false);
      });

      return () => {
        if (unsubscribePromise) {
          unsubscribePromise.then((unsubscribe) => {
            if (unsubscribe) {
              unsubscribe();
            }
          });
        }
      };
    } else {
      // One-time fetch
      const loadPrompts = async () => {
        try {
          let fetchedPrompts: SavedPrompt[];
          
          if (favoritesOnly) {
            fetchedPrompts = await getUserFavoritePrompts(user.uid);
          } else {
            const result = await getUserPrompts(user.uid, limit);
            fetchedPrompts = result.prompts;
          }
          
          setPrompts(fetchedPrompts);
        } catch (err) {
          setError(err as Error);
          addToast({
            title: 'Error loading prompts',
            description: (err as Error).message,
            type: 'error',
          });
        } finally {
          setLoading(false);
        }
      };

      loadPrompts();
    }
  }, [user, realtime, favoritesOnly, limit, addToast]);

  // Toggle favorite status
  const toggleFavorite = async (promptId: string, currentStatus: boolean) => {
    try {
      await updatePrompt(promptId, { isFavorite: !currentStatus });
      addToast({
        title: currentStatus ? 'Removed from favorites' : 'Added to favorites',
        type: 'success',
      });
    } catch (err) {
      setError(err as Error);
      addToast({
        title: 'Failed to update favorite status',
        description: (err as Error).message,
        type: 'error',
      });
    }
  };

  // Remove prompt
  const removePrompt = async (promptId: string) => {
    try {
      await deletePrompt(promptId);
      addToast({
        title: 'Prompt deleted',
        description: 'The prompt has been removed from your saved items',
        type: 'success',
      });
    } catch (err) {
      setError(err as Error);
      addToast({
        title: 'Failed to delete prompt',
        description: (err as Error).message,
        type: 'error',
      });
    }
  };

  // Search prompts
  const searchPrompts = async (searchTerm: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const results = await searchUserPrompts(user.uid, searchTerm);
      setPrompts(results);
    } catch (err) {
      setError(err as Error);
      addToast({
        title: 'Search failed',
        description: (err as Error).message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update prompt
  const updatePromptData = async (promptId: string, updates: Partial<SavedPrompt>) => {
    try {
      await updatePrompt(promptId, updates);
      addToast({
        title: 'Prompt updated',
        description: 'Your changes have been saved',
        type: 'success',
      });
    } catch (err) {
      setError(err as Error);
      addToast({
        title: 'Failed to update prompt',
        description: (err as Error).message,
        type: 'error',
      });
    }
  };

  return {
    prompts,
    loading,
    error,
    toggleFavorite,
    removePrompt,
    searchPrompts,
    updatePromptData,
  };
}