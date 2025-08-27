/**
 * Coding/Technical Techniques Index
 * Techniques focused on technical analysis, programming, and system design
 */

// Export all coding techniques
export * from './program-aided-language-models';
export * from './meta-prompting';
export * from './constitutional-ai';
export * from './tree-of-thought';
export * from './root-cause-analysis';
export * from './systems-thinking';

// Import technique instances
import { palTechnique } from './program-aided-language-models';
import { metaPromptingTechnique } from './meta-prompting';
import { constitutionalAiTechnique } from './constitutional-ai';
import { treeOfThoughtTechnique } from './tree-of-thought';
import { rootCauseAnalysisTechnique } from './root-cause-analysis';
import { systemsThinkingTechnique } from './systems-thinking';

// Collect all coding techniques
export const CODING_TECHNIQUES = [
  palTechnique,
  metaPromptingTechnique,
  constitutionalAiTechnique,
  treeOfThoughtTechnique,
  rootCauseAnalysisTechnique,
  systemsThinkingTechnique,
] as const;

// Export for easy access
export const CODING_TECHNIQUE_REGISTRY = new Map<string, (typeof CODING_TECHNIQUES)[number]>();

CODING_TECHNIQUES.forEach(technique => {
  CODING_TECHNIQUE_REGISTRY.set(technique.value, technique);
});
