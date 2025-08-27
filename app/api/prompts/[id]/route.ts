import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { getAdminDb } from '@/lib/server/firebase-admin';
import { ApiResponse } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get prompt document
    const resolvedParams = await params;
    const promptDoc = await db.collection('prompts').doc(resolvedParams.id).get();

    if (!promptDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt not found',
          message: 'The requested prompt does not exist',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const promptData = promptDoc.data()!;

    // Check if user owns this prompt
    if (promptData.userId !== authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'You can only access your own prompts',
        } as ApiResponse,
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: promptDoc.id,
        ...promptData,
        createdAt: promptData.createdAt?.toDate()?.toISOString(),
        updatedAt: promptData.updatedAt?.toDate()?.toISOString(),
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Prompt fetch error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch prompt',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: authResult.error || 'You must be logged in to update prompts',
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, originalPrompt, enhancedPrompt, technique, format, tags, isFavorite } = body;

    // Validate title length if provided
    if (title && title.length > 200) {
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

    // Get existing prompt
    const resolvedParams = await params;
    const promptRef = db.collection('prompts').doc(resolvedParams.id);
    const promptDoc = await promptRef.get();

    if (!promptDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt not found',
          message: 'The requested prompt does not exist',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const existingData = promptDoc.data()!;

    // Check if user owns this prompt
    if (existingData.userId !== authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'You can only update your own prompts',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Build update data (only include provided fields)
    const updateData: any = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (originalPrompt !== undefined) updateData.originalPrompt = originalPrompt.trim();
    if (enhancedPrompt !== undefined) updateData.enhancedPrompt = enhancedPrompt.trim();
    if (technique !== undefined) updateData.technique = technique;
    if (format !== undefined) updateData.format = format;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (isFavorite !== undefined) updateData.isFavorite = Boolean(isFavorite);

    // Update document
    await promptRef.update(updateData);

    // Get updated document
    const updatedDoc = await promptRef.get();
    const updatedData = updatedDoc.data()!;

    return NextResponse.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedData,
        createdAt: updatedData.createdAt?.toDate()?.toISOString(),
        updatedAt: updatedData.updatedAt?.toDate()?.toISOString(),
      },
    } as ApiResponse);

  } catch (error) {
    console.error('Prompt update error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update prompt',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const authResult = await requireAuth(request);
    
    if (!authResult.success || !authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          message: authResult.error || 'You must be logged in to delete prompts',
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

    // Get prompt document
    const resolvedParams = await params;
    const promptRef = db.collection('prompts').doc(resolvedParams.id);
    const promptDoc = await promptRef.get();

    if (!promptDoc.exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt not found',
          message: 'The requested prompt does not exist',
        } as ApiResponse,
        { status: 404 }
      );
    }

    const promptData = promptDoc.data()!;

    // Check if user owns this prompt
    if (promptData.userId !== authResult.userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied',
          message: 'You can only delete your own prompts',
        } as ApiResponse,
        { status: 403 }
      );
    }

    // Delete document
    await promptRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully',
    } as ApiResponse);

  } catch (error) {
    console.error('Prompt delete error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete prompt',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
