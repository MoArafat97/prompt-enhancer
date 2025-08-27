// Main Techniques Index
// Single import point for all prompt enhancement techniques

// Export all categorized techniques
export * from './general';
export * from './writing';
export * from './coding';

// Import categorized technique collections
import { GENERAL_TECHNIQUES } from './general';
import { WRITING_TECHNIQUES } from './writing';
import { CODING_TECHNIQUES } from './coding';

// Collect all techniques from all categories
export const ALL_TECHNIQUES = [
  ...GENERAL_TECHNIQUES,
  ...WRITING_TECHNIQUES,
  ...CODING_TECHNIQUES,
] as const;

// Export categorized collections for filtering
export { GENERAL_TECHNIQUES, WRITING_TECHNIQUES, CODING_TECHNIQUES };

// Create technique registry for easy lookup
export const TECHNIQUE_REGISTRY = new Map<string, (typeof ALL_TECHNIQUES)[number]>();

ALL_TECHNIQUES.forEach(technique => {
  TECHNIQUE_REGISTRY.set(technique.value, technique);
});

/**
 * Get a technique by its value/identifier
 * @param value - The technique identifier
 * @returns The technique instance or undefined if not found
 */
export function getTechnique(value: string): (typeof ALL_TECHNIQUES)[number] | undefined {
  return TECHNIQUE_REGISTRY.get(value);
}

/**
 * Get system prompt for a technique
 * @param value - The technique identifier
 * @param outputFormat - The desired output format
 * @returns The system prompt or undefined if technique not found
 */
export function getSystemPrompt(value: string, outputFormat: 'natural' | 'json' | 'xml' = 'natural'): string | undefined {
  const technique = getTechnique(value);
  return technique?.getSystemPrompt(outputFormat);
}

// Export configurations for backward compatibility
export const ENHANCEMENT_TECHNIQUES = ALL_TECHNIQUES.map(t => ({
  value: t.value,
  label: t.label,
  icon: t.icon,
  description: t.description,
}));

export const SYSTEM_PROMPTS = Object.fromEntries(
  ALL_TECHNIQUES.map(t => [t.value, t.systemPrompt])
);
