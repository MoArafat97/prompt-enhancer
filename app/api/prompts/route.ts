import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getAdminDb } from '@/lib/server/firebase-admin';
import { ApiResponse } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: authResult.error || 'You must be logged in to save prompts',
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, originalPrompt, enhancedPrompt, technique, format, tags, isFavorite } = body;

    // Validate required fields
    if (!title || !originalPrompt || !enhancedPrompt || !technique) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'title, originalPrompt, enhancedPrompt, and technique are required',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Validate title length
    if (title.length > 200) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title too long',
          message: 'Title must be 200 characters or less',
        } as ApiResponse,
        { status: 400 }
      );
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database unavailable',
          message: 'Unable to connect to database',
        } as ApiResponse,
        { status: 500 }
      );
    }



    // Create prompt document
    const promptData = {
      title: title.trim(),
      originalPrompt: originalPrompt.trim(),
      enhancedPrompt: enhancedPrompt.trim(),
      technique,
      format: format || 'natural',
      tags: Array.isArray(tags) ? tags : [],
      isFavorite: Boolean(isFavorite),
      userId: authResult.userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    const promptRef = await db.collection('prompts').add(promptData);

    return NextResponse.json({
      success: true,
      data: {
        id: promptRef.id,
        ...promptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Prompt save error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to save prompt',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: authResult.error || 'You must be logged in to view prompts',
        } as ApiResponse,
        { status: 401 }
      );
    }

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database unavailable',
          message: 'Unable to connect to database',
        } as ApiResponse,
        { status: 500 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const favoritesOnly = url.searchParams.get('favorites') === 'true';
    const search = url.searchParams.get('search');
    const technique = url.searchParams.get('technique');

    // Build query
    let query = db.collection('prompts')
      .where('userId', '==', authResult.userId);

    if (favoritesOnly) {
      query = query.where('isFavorite', '==', true);
    }

    if (technique) {
      query = query.where('technique', '==', technique);
    }

    // Order by creation date (newest first)
    query = query.orderBy('createdAt', 'desc');

    // Apply pagination
    if (offset > 0) {
      const offsetSnapshot = await query.limit(offset).get();
      if (!offsetSnapshot.empty) {
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
    }

    query = query.limit(limit);

    // Execute query
    const snapshot = await query.get();
    const prompts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
    }));

    // Apply text search filter if provided (client-side filtering for simplicity)
    let filteredPrompts = prompts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPrompts = prompts.filter((prompt: any) =>
        prompt.title?.toLowerCase().includes(searchLower) ||
        prompt.originalPrompt?.toLowerCase().includes(searchLower) ||
        prompt.enhancedPrompt?.toLowerCase().includes(searchLower) ||
        (prompt.tags && prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        prompts: filteredPrompts,
        pagination: {
          limit,
          offset,
          hasMore: snapshot.size === limit, // Simple check
        },
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Prompts fetch error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch prompts',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
