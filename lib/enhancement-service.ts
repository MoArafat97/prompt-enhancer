import OpenAI from 'openai';
import { EnhanceRequest, EnhancementResult, OutputFormat, EnhancementTechnique } from './types';
import { generateCacheKey } from './utils';
import { API_CONFIG, DEFAULT_MODEL, AVAILABLE_MODELS } from './constants';
import { getSystemPrompt } from './techniques';
import { formatOutput } from './formats';

export class EnhancementService {
  private openrouter: OpenAI;
  private cache: Map<string, EnhancementResult>;

  constructor(apiKey?: string) {
    const effectiveKey = apiKey || process.env.OPENROUTER_API_KEY;
    if (!effectiveKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }

    this.openrouter = new OpenAI({
      apiKey: effectiveKey,
      baseURL: API_CONFIG.OPENROUTER_CONFIG.baseURL,
      defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Prompt Enhancer',
      },
    });

    // In-memory cache (in production, use Redis)
    this.cache = new Map();
  }

  async enhance(request: EnhanceRequest): Promise<EnhancementResult> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      // Update processing time for cached results
      cached.metadata.processingTime = Date.now() - startTime;
      return { ...cached };
    }

    try {
      // Generate enhancement
      const enhanced = await this.generateEnhancement(request);

      // Format output
      const formatted = formatOutput(enhanced, request.outputFormat);
      
      const result: EnhancementResult = {
        original: request.prompt,
        enhanced: formatted,
        technique: request.technique,
        format: request.outputFormat,
        metadata: {
          processingTime: Date.now() - startTime,
          model: DEFAULT_MODEL.name,
          confidence: this.calculateConfidence(enhanced),
          timestamp: new Date().toISOString(),
        },
      };

      console.log('Enhancement result created:', result); // Debug log

      // Cache result
      this.cache.set(cacheKey, result);
      
      // Clean up cache if it gets too large
      if (this.cache.size > 1000) {
        this.cleanupCache();
      }

      return result;
    } catch (error) {
      console.error('Enhancement generation failed:', error);
      throw new Error('Failed to generate enhancement');
    }
  }

  private async generateEnhancement(request: EnhanceRequest): Promise<string> {
    const systemPrompt = getSystemPrompt(request.technique, request.outputFormat);

    if (!systemPrompt) {
      throw new Error(`Unknown technique: ${request.technique}`);
    }

    // Use the requested model first if provided, otherwise use default model, then fallback to other models
    const requestedModel = request.model ? AVAILABLE_MODELS.find(m => m.id === request.model) : null;
    const modelsToTry = requestedModel
      ? [requestedModel, ...AVAILABLE_MODELS.filter(m => m.id !== requestedModel.id)]
      : [DEFAULT_MODEL, ...AVAILABLE_MODELS.filter(m => m.id !== DEFAULT_MODEL.id)];

    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model.name} (${model.id})`);

        // Add timeout wrapper for the API call - shorter timeout for complex prompts
        const isComplexPrompt = systemPrompt.length > 3000; // Complex prompts like root cause analysis
        const timeoutMs = isComplexPrompt ? 20000 : 25000; // 20s for complex, 25s for normal
        
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
        });

        // Reduce max tokens for complex prompts to improve response time
        const maxTokens = isComplexPrompt 
          ? Math.min(1500, model.maxTokens) 
          : Math.min(API_CONFIG.OPENROUTER_CONFIG.max_tokens, model.maxTokens);

        const completionPromise = this.openrouter.chat.completions.create({
          model: model.id,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: request.prompt },
          ],
          temperature: API_CONFIG.OPENROUTER_CONFIG.temperature,
          max_tokens: maxTokens,
          top_p: API_CONFIG.OPENROUTER_CONFIG.top_p,
          frequency_penalty: API_CONFIG.OPENROUTER_CONFIG.frequency_penalty,
          presence_penalty: API_CONFIG.OPENROUTER_CONFIG.presence_penalty,
        });

        const completion = await Promise.race([completionPromise, timeoutPromise]);

        const enhanced = completion.choices[0]?.message?.content;

        if (!enhanced) {
          throw new Error(`No response from model ${model.name}`);
        }

        console.log(`Successfully used model: ${model.name}`);
        return enhanced.trim();

      } catch (error) {
        console.warn(`Model ${model.name} failed:`, error);
        lastError = error as Error;

        // If it's an auth error, don't try other models
        if (error instanceof Error && (
          error.message.includes('API key') ||
          error.message.includes('401') ||
          error.message.includes('authentication')
        )) {
          throw new Error('Invalid OpenRouter API key');
        }

        // If it's a 503 error or timeout, try the next model
        if (error instanceof Error && (
          error.message.includes('503') ||
          error.message.includes('timeout') ||
          error.message.includes('Request timeout')
        )) {
          console.log(`Model ${model.name} timed out or unavailable, trying next model...`);
          continue;
        }

        // Continue to next model for other errors
        continue;
      }
    }

    // If all models failed, throw the last error
    if (lastError) {
      if (lastError.message.includes('quota') || lastError.message.includes('402')) {
        throw new Error('OpenRouter API quota exceeded');
      }
      if (lastError.message.includes('rate limit') || lastError.message.includes('429')) {
        throw new Error('OpenRouter API rate limit exceeded');
      }
      if (lastError.message.includes('503') || lastError.message.includes('timeout')) {
        throw new Error('Service temporarily unavailable. Please try again.');
      }
      throw new Error(`All models failed. Last error: ${lastError.message}`);
    }

    throw new Error('No models available');
  }



  private generateCacheKey(request: EnhanceRequest): string {
    return generateCacheKey(request.prompt, request.technique, request.outputFormat);
  }

  private calculateConfidence(enhanced: string): number {
    // Simple confidence calculation based on enhancement quality indicators
    let confidence = 0.7; // Base confidence
    
    // Check for specific improvements
    if (enhanced.length > 50) confidence += 0.1;
    if (enhanced.includes('step') || enhanced.includes('Step')) confidence += 0.05;
    if (enhanced.includes('specific') || enhanced.includes('detailed')) confidence += 0.05;
    if (enhanced.includes('example') || enhanced.includes('Example')) confidence += 0.05;
    if (enhanced.includes('context') || enhanced.includes('Context')) confidence += 0.05;
    
    // Cap at 0.95 to be realistic
    return Math.min(confidence, 0.95);
  }

  private cleanupCache(): void {
    // Simple LRU-style cleanup - remove oldest entries
    const entries = Array.from(this.cache.entries());
    const toRemove = entries.slice(0, Math.floor(entries.length / 2));
    
    toRemove.forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  // Method to clear cache (useful for testing)
  public clearCache(): void {
    this.cache.clear();
  }

  // Method to get cache stats
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
