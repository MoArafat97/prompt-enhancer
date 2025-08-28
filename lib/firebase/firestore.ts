import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Unsubscribe,
  WriteBatch,
  writeBatch,
} from 'firebase/firestore';
import { ensureFirebaseClient, getFirebaseInstances } from './config';
import { SavedPrompt, EnhancementHistory } from './types';

// Helper function to get Firestore instance
const getDb = async () => {
  if (typeof window === 'undefined') return null;
  
  const initSuccess = await ensureFirebaseClient();
  if (!initSuccess) return null;
  
  const { db } = getFirebaseInstances();
  return db;
};

// Helper function to get collection references
const getCollections = async () => {
  const db = await getDb();
  if (!db) return { promptsCollection: null, enhancementHistoryCollection: null };
  
  return {
    promptsCollection: collection(db, 'prompts'),
    enhancementHistoryCollection: collection(db, 'enhancement_results'),
  };
};

// Prompts Collection Operations
export const savePrompt = async (
  userId: string,
  promptData: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const { promptsCollection } = await getCollections();
    if (!promptsCollection) {
      throw new Error('Firestore not initialized');
    }

    const docRef = await addDoc(promptsCollection, {
      ...promptData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }
};

export const updatePrompt = async (
  promptId: string,
  updates: Partial<SavedPrompt>
): Promise<void> => {
  try {
    const promptRef = doc(promptsCollection, promptId);
    await updateDoc(promptRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating prompt:', error);
    throw error;
  }
};

export const deletePrompt = async (promptId: string): Promise<void> => {
  try {
    const promptRef = doc(promptsCollection, promptId);
    await deleteDoc(promptRef);
  } catch (error) {
    console.error('Error deleting prompt:', error);
    throw error;
  }
};

export const getPrompt = async (promptId: string): Promise<SavedPrompt | null> => {
  try {
    const promptRef = doc(promptsCollection, promptId);
    const promptSnap = await getDoc(promptRef);
    
    if (promptSnap.exists()) {
      return { id: promptSnap.id, ...promptSnap.data() } as SavedPrompt;
    }
    return null;
  } catch (error) {
    console.error('Error getting prompt:', error);
    throw error;
  }
};

export const getUserPrompts = async (
  userId: string,
  limitCount = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  prompts: SavedPrompt[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  try {
    let q = query(
      promptsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const prompts: SavedPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      prompts.push({ id: doc.id, ...data } as SavedPrompt);
    });

    return {
      prompts,
      lastDoc: (querySnapshot.docs[querySnapshot.docs.length - 1] as any) || null,
    };
  } catch (error) {
    console.error('Error getting user prompts:', error);
    throw error;
  }
};

export const getUserFavoritePrompts = async (
  userId: string
): Promise<SavedPrompt[]> => {
  try {
    const q = query(
      promptsCollection,
      where('userId', '==', userId),
      where('isFavorite', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const prompts: SavedPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      prompts.push({ id: doc.id, ...data } as SavedPrompt);
    });

    return prompts;
  } catch (error) {
    console.error('Error getting favorite prompts:', error);
    throw error;
  }
};

export const searchUserPrompts = async (
  userId: string,
  searchTerm: string
): Promise<SavedPrompt[]> => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches in title
    // For production, consider using Algolia or Elasticsearch
    const q = query(
      promptsCollection,
      where('userId', '==', userId),
      orderBy('title'),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const prompts: SavedPrompt[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      prompts.push({ id: doc.id, ...data } as SavedPrompt);
    });

    return prompts;
  } catch (error) {
    console.error('Error searching prompts:', error);
    throw error;
  }
};

export const subscribeToUserPrompts = (
  userId: string,
  callback: (prompts: SavedPrompt[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  const q = query(
    promptsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (querySnapshot) => {
      const prompts: SavedPrompt[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as any;
        prompts.push({ id: doc.id, ...data } as SavedPrompt);
      });
      callback(prompts);
    },
    (error) => {
      console.error('Error in prompts subscription:', error);
      if (onError) onError(error);
    }
  );
};

// Enhancement History Operations
export const saveEnhancementHistory = async (
  userId: string,
  historyData: Omit<EnhancementHistory, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(enhancementHistoryCollection, {
      ...historyData,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving enhancement history:', error);
    throw error;
  }
};

export const getUserEnhancementHistory = async (
  userId: string,
  limitCount = 50
): Promise<EnhancementHistory[]> => {
  try {
    const q = query(
      enhancementHistoryCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history: EnhancementHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as any;
      history.push({ id: doc.id, ...data } as EnhancementHistory);
    });

    return history;
  } catch (error) {
    console.error('Error getting enhancement history:', error);
    throw error;
  }
};

// Batch operations for better performance
export const batchDeletePrompts = async (promptIds: string[]): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  try {
    const batch: WriteBatch = writeBatch(db);

    promptIds.forEach((promptId) => {
      const promptRef = doc(promptsCollection, promptId);
      batch.delete(promptRef);
    });

    await batch.commit();
  } catch (error) {
    console.error('Error batch deleting prompts:', error);
    throw error;
  }
};

export const batchUpdatePrompts = async (
  updates: Array<{ id: string; data: Partial<SavedPrompt> }>
): Promise<void> => {
  if (!db) {
    throw new Error('Firebase is not configured');
  }

  try {
    const batch: WriteBatch = writeBatch(db);

    updates.forEach(({ id, data }) => {
      const promptRef = doc(promptsCollection, id);
      batch.update(promptRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error batch updating prompts:', error);
    throw error;
  }
};

// User statistics
export const getUserStatistics = async (userId: string): Promise<{
  totalPrompts: number;
  favoritePrompts: number;
  totalEnhancements: number;
  techniqueUsage: Record<string, number>;
}> => {
  try {
    // Get total prompts
    const promptsQuery = query(
      promptsCollection,
      where('userId', '==', userId)
    );
    const promptsSnapshot = await getDocs(promptsQuery);
    const totalPrompts = promptsSnapshot.size;
    
    // Get favorite prompts
    const favoritesQuery = query(
      promptsCollection,
      where('userId', '==', userId),
      where('isFavorite', '==', true)
    );
    const favoritesSnapshot = await getDocs(favoritesQuery);
    const favoritePrompts = favoritesSnapshot.size;
    
    // Get enhancement history for technique usage
    const historyQuery = query(
      enhancementHistoryCollection,
      where('userId', '==', userId)
    );
    const historySnapshot = await getDocs(historyQuery);
    const totalEnhancements = historySnapshot.size;
    
    const techniqueUsage: Record<string, number> = {};
    historySnapshot.forEach((doc) => {
      const data = doc.data() as EnhancementHistory;
      techniqueUsage[data.technique] = (techniqueUsage[data.technique] || 0) + 1;
    });
    
    return {
      totalPrompts,
      favoritePrompts,
      totalEnhancements,
      techniqueUsage,
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw error;
  }
};