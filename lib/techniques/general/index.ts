/**
 * General Purpose Techniques Index
 * Core prompt enhancement techniques and business frameworks
 */

// Export all general techniques
export * from './clarity';
export * from './chain-of-thought';
export * from './few-shot';
export * from './role-based';
export * from './co-star';
export * from './smart';
export * from './coast';
export * from './okr';
export * from './swot';
export * from './5w1h';
export * from './grow';
export * from './pdca';
export * from './eisenhower';
export * from './moscow';
export * from './raci';
export * from './balanced-scorecard';
export * from './star';
export * from './prep';
export * from './race';
export * from './tag';
export * from './crispe';
export * from './ooda-loop';
export * from './design-thinking';
export * from './lean-canvas';
export * from './value-proposition-canvas';
export * from './business-model-canvas';
export * from './soar';
export * from './heart';
export * from './rice';
export * from './ice';
export * from './kano-model';
export * from './porters-five-forces';
export * from './bcg-matrix';
export * from './ansoff-matrix';
export * from './pest-analysis';
export * from './stakeholder-analysis';
export * from './risk-assessment-matrix';
export * from './decision-matrix';
export * from './pareto-analysis';
export * from './fishbone-diagram';
export * from './mind-mapping';
export * from './affinity-mapping';

// Import technique instances
import { clarityTechnique } from './clarity';
import { chainOfThoughtTechnique } from './chain-of-thought';
import { fewShotTechnique } from './few-shot';
import { roleBasedTechnique } from './role-based';
import { coStarTechnique } from './co-star';
import { smartTechnique } from './smart';
import { coastTechnique } from './coast';
import { okrTechnique } from './okr';
import { swotTechnique } from './swot';
import { fiveWOneHTechnique } from './5w1h';
import { growTechnique } from './grow';
import { pdcaTechnique } from './pdca';
import { eisenhowerTechnique } from './eisenhower';
import { moscowTechnique } from './moscow';
import { raciTechnique } from './raci';
import { balancedScorecardTechnique } from './balanced-scorecard';
import { starTechnique } from './star';
import { prepTechnique } from './prep';
import { raceTechnique } from './race';
import { tagTechnique } from './tag';
import { crispeTechnique } from './crispe';
import { oodaLoopTechnique } from './ooda-loop';
import { designThinkingTechnique } from './design-thinking';
import { leanCanvasTechnique } from './lean-canvas';
import { valuePropositionCanvasTechnique } from './value-proposition-canvas';
import { businessModelCanvasTechnique } from './business-model-canvas';
import { soarTechnique } from './soar';
import { heartTechnique } from './heart';
import { riceTechnique } from './rice';
import { iceTechnique } from './ice';
import { kanoModelTechnique } from './kano-model';
import { portersFiveForcesTechnique } from './porters-five-forces';
import { bcgMatrixTechnique } from './bcg-matrix';
import { ansoffMatrixTechnique } from './ansoff-matrix';
import { pestAnalysisTechnique } from './pest-analysis';
import { stakeholderAnalysisTechnique } from './stakeholder-analysis';
import { riskAssessmentMatrixTechnique } from './risk-assessment-matrix';
import { decisionMatrixTechnique } from './decision-matrix';
import { paretoAnalysisTechnique } from './pareto-analysis';
import { fishboneDiagramTechnique } from './fishbone-diagram';
import { mindMappingTechnique } from './mind-mapping';
import { affinityMappingTechnique } from './affinity-mapping';

// Collect all general techniques
export const GENERAL_TECHNIQUES = [
  // Core general-purpose techniques
  clarityTechnique,
  chainOfThoughtTechnique,
  fewShotTechnique,
  roleBasedTechnique,
  // Business and strategic frameworks
  coStarTechnique,
  smartTechnique,
  coastTechnique,
  okrTechnique,
  swotTechnique,
  fiveWOneHTechnique,
  growTechnique,
  pdcaTechnique,
  eisenhowerTechnique,
  moscowTechnique,
  raciTechnique,
  balancedScorecardTechnique,
  starTechnique,
  prepTechnique,
  // Strategic Planning Frameworks
  raceTechnique,
  tagTechnique,
  crispeTechnique,
  oodaLoopTechnique,
  designThinkingTechnique,
  leanCanvasTechnique,
  valuePropositionCanvasTechnique,
  businessModelCanvasTechnique,
  // Communication Frameworks
  soarTechnique,
  heartTechnique,
  riceTechnique,
  iceTechnique,
  kanoModelTechnique,
  // Analysis Frameworks
  portersFiveForcesTechnique,
  bcgMatrixTechnique,
  ansoffMatrixTechnique,
  pestAnalysisTechnique,
  stakeholderAnalysisTechnique,
  riskAssessmentMatrixTechnique,
  decisionMatrixTechnique,
  paretoAnalysisTechnique,
  fishboneDiagramTechnique,
  mindMappingTechnique,
  affinityMappingTechnique,
] as const;

// Export for easy access
export const GENERAL_TECHNIQUE_REGISTRY = new Map<string, (typeof GENERAL_TECHNIQUES)[number]>();

GENERAL_TECHNIQUES.forEach(technique => {
  GENERAL_TECHNIQUE_REGISTRY.set(technique.value, technique);
});
