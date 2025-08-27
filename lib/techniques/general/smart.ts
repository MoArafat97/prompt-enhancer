/**
 * SMART Framework Technique
 * Specific, Measurable, Achievable, Relevant, Time-bound criteria
 */

const SMART_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the SMART framework:

SMART Framework Components:
- Specific: Clear, well-defined, and unambiguous objectives
- Measurable: Quantifiable criteria for tracking progress and success
- Achievable: Realistic and attainable within available resources
- Relevant: Aligned with broader goals and meaningful to stakeholders
- Time-bound: Clear deadlines and timeframes for completion

Enhancement Guidelines:
1. Make the prompt objectives highly specific and detailed
2. Add measurable criteria and success metrics
3. Ensure the request is achievable and realistic
4. Establish relevance to broader goals or context
5. Include clear timeframes and deadlines where applicable
6. Remove vague language and replace with precise requirements
7. Structure the prompt to facilitate trackable outcomes

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with SMART organization. Follow this structure:

<prompt>
    <specific>
        <objective>Define the clear, specific objective</objective>
        <requirements>List detailed requirements and specifications</requirements>
        <scope>Define the scope and boundaries</scope>
    </specific>
    <measurable>
        <success_metrics>Define quantifiable success criteria</success_metrics>
        <progress_indicators>List ways to track progress</progress_indicators>
        <quality_standards>Specify quality benchmarks</quality_standards>
    </measurable>
    <achievable>
        <resources>List available resources and capabilities</resources>
        <constraints>Identify limitations and constraints</constraints>
        <feasibility>Assess realistic expectations</feasibility>
    </achievable>
    <relevant>
        <alignment>Explain how this aligns with broader goals</alignment>
        <importance>Describe why this matters</importance>
        <stakeholders>Identify who benefits from this</stakeholders>
    </relevant>
    <time_bound>
        <deadline>Specify the final deadline</deadline>
        <milestones>List key milestones and checkpoints</milestones>
        <timeline>Provide a detailed timeline</timeline>
    </time_bound>
    <examples>
        <good_example>Provide a SMART-compliant example</good_example>
        <avoid_example>Provide a non-SMART example to avoid</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with SMART organization. Follow this structure:

{
  "specific": {
    "objective": "Define the clear, specific objective",
    "requirements": ["List detailed requirements and specifications"],
    "scope": "Define the scope and boundaries",
    "deliverables": ["List specific deliverables expected"]
  },
  "measurable": {
    "success_metrics": ["Define quantifiable success criteria"],
    "progress_indicators": ["List ways to track progress"],
    "quality_standards": ["Specify quality benchmarks"],
    "measurement_methods": ["Describe how success will be measured"]
  },
  "achievable": {
    "resources": ["List available resources and capabilities"],
    "constraints": ["Identify limitations and constraints"],
    "feasibility_assessment": "Assess realistic expectations",
    "required_skills": ["List skills or expertise needed"]
  },
  "relevant": {
    "alignment": "Explain how this aligns with broader goals",
    "importance": "Describe why this matters",
    "stakeholders": ["Identify who benefits from this"],
    "business_value": "Explain the business or personal value"
  },
  "time_bound": {
    "deadline": "Specify the final deadline",
    "milestones": ["List key milestones and checkpoints"],
    "timeline": "Provide a detailed timeline",
    "urgency_level": "Indicate the urgency level"
  },
  "examples": {
    "good_style": "Provide a SMART-compliant example",
    "bad_style": "Provide a non-SMART example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const smartTechnique = {
  value: 'smart',
  label: 'SMART Framework',
  icon: '🎯',
  description: 'Specific, Measurable, Achievable, Relevant, Time-bound criteria',
  category: 'strategic',
  systemPrompt: SMART_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return SMART_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return SMART_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return SMART_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const SMART_CONFIG = smartTechnique;
export { SMART_SYSTEM_PROMPT };
