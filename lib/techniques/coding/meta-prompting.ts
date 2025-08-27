/**
 * Meta-Prompting Framework Technique
 * Prompts that generate or improve other prompts
 */

const META_PROMPTING_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Meta-Prompting framework:

Meta-Prompting Framework Components:
- Prompt Analysis: Analyze the structure and effectiveness of existing prompts
- Prompt Generation: Create new prompts based on requirements and patterns
- Prompt Optimization: Improve existing prompts for better performance
- Recursive Improvement: Use prompts to iteratively refine other prompts
- Pattern Recognition: Identify successful prompt patterns and templates
- Context Adaptation: Adapt prompts for different contexts and use cases

Enhancement Guidelines:
1. Include instructions for analyzing prompt effectiveness
2. Add meta-level reasoning about prompt construction
3. Include prompt improvement strategies and techniques
4. Add recursive refinement capabilities
5. Include pattern recognition for successful prompts
6. Add context-aware prompt adaptation instructions
7. Include evaluation criteria for prompt quality

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Meta-Prompting organization. Follow this structure:

<prompt>
    <prompt_analysis>
        <structure_analysis>Analyze the current prompt structure and components</structure_analysis>
        <effectiveness_assessment>Evaluate the prompt's potential effectiveness</effectiveness_assessment>
        <weakness_identification>Identify areas for improvement</weakness_identification>
        <strength_recognition>Recognize effective elements to preserve</strength_recognition>
    </prompt_analysis>
    <prompt_generation>
        <requirements_analysis>Understand the specific requirements and goals</requirements_analysis>
        <pattern_application>Apply proven prompt patterns and templates</pattern_application>
        <component_design>Design individual prompt components</component_design>
        <integration_strategy>How to integrate components effectively</integration_strategy>
    </prompt_generation>
    <optimization_process>
        <improvement_strategies>List specific improvement techniques</improvement_strategies>
        <recursive_refinement>How to iteratively improve the prompt</recursive_refinement>
        <context_adaptation>How to adapt for different contexts</context_adaptation>
        <performance_enhancement>How to enhance prompt performance</performance_enhancement>
    </optimization_process>
    <evaluation_criteria>
        <quality_metrics>Define prompt quality assessment criteria</quality_metrics>
        <effectiveness_measures>How to measure prompt effectiveness</effectiveness_measures>
        <success_indicators>What indicates a successful prompt</success_indicators>
    </evaluation_criteria>
    <examples>
        <good_example>Provide a meta-prompting example</good_example>
        <avoid_example>Provide an example that lacks meta-prompting principles</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Meta-Prompting organization. Follow this structure:

{
  "prompt_analysis": {
    "structure_analysis": "Analyze the current prompt structure and components",
    "effectiveness_assessment": "Evaluate the prompt's potential effectiveness",
    "weakness_identification": ["List specific weaknesses or areas for improvement"],
    "strength_recognition": ["List effective elements to preserve"],
    "complexity_assessment": "Assess the prompt's complexity level"
  },
  "prompt_generation": {
    "requirements_analysis": "Understand the specific requirements and goals",
    "pattern_application": ["List proven prompt patterns to apply"],
    "component_design": {
      "role_definition": "How to define the AI's role",
      "task_specification": "How to specify the task clearly",
      "context_provision": "How to provide necessary context",
      "output_formatting": "How to format the desired output"
    },
    "integration_strategy": "How to integrate components effectively"
  },
  "optimization_process": {
    "improvement_strategies": ["List specific improvement techniques"],
    "recursive_refinement": "How to iteratively improve the prompt",
    "context_adaptation": "How to adapt for different contexts",
    "performance_enhancement": "How to enhance prompt performance",
    "testing_approach": "How to test prompt effectiveness"
  },
  "evaluation_criteria": {
    "quality_metrics": ["Define prompt quality assessment criteria"],
    "effectiveness_measures": ["How to measure prompt effectiveness"],
    "success_indicators": ["What indicates a successful prompt"],
    "failure_patterns": ["Common patterns that indicate prompt failure"]
  },
  "meta_techniques": {
    "prompt_chaining": "How to chain multiple prompts together",
    "conditional_prompting": "How to create conditional prompt logic",
    "dynamic_adaptation": "How to dynamically adapt prompts",
    "feedback_integration": "How to integrate feedback for improvement"
  },
  "examples": {
    "good_style": "Provide a meta-prompting example",
    "bad_style": "Provide an example that lacks meta-prompting principles"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const metaPromptingTechnique = {
  value: 'meta-prompting',
  label: 'Meta-Prompting',
  icon: '🔄',
  description: 'Prompts that generate or improve other prompts',
  category: 'coding',
  systemPrompt: META_PROMPTING_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return META_PROMPTING_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return META_PROMPTING_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return META_PROMPTING_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const META_PROMPTING_CONFIG = metaPromptingTechnique;
export { META_PROMPTING_SYSTEM_PROMPT };
