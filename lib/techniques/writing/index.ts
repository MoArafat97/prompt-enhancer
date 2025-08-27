/**
 * Creative Writing Techniques Index
 * Techniques focused on creative writing, storytelling, and content creation
 */

// Export all writing techniques
export * from './creative';
export * from './storytelling';
export * from './aida';
export * from './scamper';

// Import technique instances
import { creativeTechnique } from './creative';
import { storytellingTechnique } from './storytelling';
import { aidaTechnique } from './aida';
import { scamperTechnique } from './scamper';

// Collect all writing techniques
export const WRITING_TECHNIQUES = [
  creativeTechnique,
  storytellingTechnique,
  aidaTechnique,
  scamperTechnique,
] as const;

// Export for easy access
export const WRITING_TECHNIQUE_REGISTRY = new Map<string, (typeof WRITING_TECHNIQUES)[number]>();

WRITING_TECHNIQUES.forEach(technique => {
  WRITING_TECHNIQUE_REGISTRY.set(technique.value, technique);
});
