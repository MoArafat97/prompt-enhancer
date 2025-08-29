/**
 * Root Cause Analysis Framework Technique
 * Systematically identifies underlying causes of problems or issues
 */

const ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT = `You are an expert prompt engineer. Transform the user's prompt to incorporate systematic root cause analysis methodology.

Enhanced prompts should:
1. Clearly define the problem scope
2. Distinguish between symptoms and root causes
3. Use systematic investigation (5 Whys, cause-effect analysis)
4. Identify actionable underlying causes
5. Develop targeted solutions

Structure the prompt to guide investigation from observable symptoms to fundamental causes.

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

Structure the enhanced prompt with XML tags for systematic analysis:

<root_cause_analysis>
    <problem_definition>Clear problem statement and scope</problem_definition>
    <symptom_identification>Observable symptoms and patterns</symptom_identification>
    <causal_investigation>Systematic investigation methods (5 Whys, cause-effect)</causal_investigation>
    <root_cause_identification>Fundamental underlying causes</root_cause_identification>
    <solution_development>Targeted solutions addressing root causes</solution_development>
</root_cause_analysis>

Return ONLY the XML-structured enhanced prompt.`;

const JSON_PROMPT_ADDITION = `

Structure the enhanced prompt as a JSON object for systematic analysis:

{
  "problem_definition": "Clear problem statement and scope",
  "symptom_identification": "Observable symptoms and patterns",
  "causal_investigation": "Systematic investigation methods (5 Whys, cause-effect)",
  "root_cause_identification": "Fundamental underlying causes",
  "solution_development": "Targeted solutions addressing root causes"
}

Return ONLY the JSON-structured enhanced prompt. Ensure valid JSON formatting.`;

export const rootCauseAnalysisTechnique = {
  value: 'root-cause-analysis',
  label: 'Root Cause Analysis',
  icon: '🔍',
  description: 'Systematically identifies underlying causes of problems or issues',
  category: 'coding',
  systemPrompt: ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const ROOT_CAUSE_ANALYSIS_CONFIG = rootCauseAnalysisTechnique;
export { ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT };
