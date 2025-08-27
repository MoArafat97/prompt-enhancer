/**
 * Constitutional AI Prompting Framework Technique
 * Incorporates ethical principles and safety constraints into AI responses
 */

const CONSTITUTIONAL_AI_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Constitutional AI framework:

Constitutional AI Framework Components:
- Constitutional Principles: Define core ethical and safety principles
- Harmlessness Constraints: Ensure responses avoid harmful content
- Helpfulness Guidelines: Maintain usefulness while adhering to principles
- Transparency Requirements: Be clear about limitations and reasoning
- Bias Mitigation: Address potential biases in responses
- Safety Checks: Include safety verification steps

Enhancement Guidelines:
1. Define clear constitutional principles relevant to the task
2. Include explicit harmlessness and safety constraints
3. Add helpfulness guidelines that work within ethical boundaries
4. Include transparency requirements for AI reasoning
5. Add bias awareness and mitigation strategies
6. Include safety verification and self-correction mechanisms
7. Balance helpfulness with safety and ethical considerations

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Constitutional AI organization. Follow this structure:

<prompt>
    <constitutional_principles>
        <core_principles>
            <principle>Define fundamental ethical principle 1</principle>
            <principle>Define fundamental ethical principle 2</principle>
            <principle>Define fundamental ethical principle 3</principle>
        </core_principles>
        <application_guidelines>How to apply these principles in practice</application_guidelines>
        <conflict_resolution>How to resolve conflicts between principles</conflict_resolution>
    </constitutional_principles>
    <safety_constraints>
        <harmlessness_rules>
            <rule>Specific harmlessness constraint 1</rule>
            <rule>Specific harmlessness constraint 2</rule>
        </harmlessness_rules>
        <content_restrictions>What types of content to avoid</content_restrictions>
        <risk_mitigation>How to mitigate potential risks</risk_mitigation>
    </safety_constraints>
    <helpfulness_guidelines>
        <assistance_principles>How to be helpful within ethical boundaries</assistance_principles>
        <quality_standards>Standards for response quality and accuracy</quality_standards>
        <user_benefit>How to maximize benefit to the user safely</user_benefit>
    </helpfulness_guidelines>
    <transparency_requirements>
        <reasoning_disclosure>When and how to explain reasoning</reasoning_disclosure>
        <limitation_acknowledgment>How to acknowledge limitations</limitation_acknowledgment>
        <uncertainty_expression>How to express uncertainty appropriately</uncertainty_expression>
    </transparency_requirements>
    <verification_process>
        <self_check>How to verify response against constitutional principles</self_check>
        <correction_mechanism>How to self-correct if principles are violated</correction_mechanism>
        <escalation_criteria>When to escalate or refuse a request</escalation_criteria>
    </verification_process>
    <examples>
        <good_example>Provide a constitutionally-aligned example</good_example>
        <avoid_example>Provide an example that violates constitutional principles</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Constitutional AI organization. Follow this structure:

{
  "constitutional_principles": {
    "core_principles": [
      "Define fundamental ethical principle 1",
      "Define fundamental ethical principle 2", 
      "Define fundamental ethical principle 3"
    ],
    "application_guidelines": "How to apply these principles in practice",
    "conflict_resolution": "How to resolve conflicts between principles",
    "principle_hierarchy": "Priority order when principles conflict"
  },
  "safety_constraints": {
    "harmlessness_rules": [
      "Specific harmlessness constraint 1",
      "Specific harmlessness constraint 2",
      "Specific harmlessness constraint 3"
    ],
    "content_restrictions": ["List types of content to avoid"],
    "risk_mitigation": "How to mitigate potential risks",
    "safety_verification": "How to verify safety of responses"
  },
  "helpfulness_guidelines": {
    "assistance_principles": "How to be helpful within ethical boundaries",
    "quality_standards": ["Standards for response quality and accuracy"],
    "user_benefit": "How to maximize benefit to the user safely",
    "balanced_approach": "How to balance helpfulness with safety"
  },
  "transparency_requirements": {
    "reasoning_disclosure": "When and how to explain reasoning",
    "limitation_acknowledgment": "How to acknowledge limitations",
    "uncertainty_expression": "How to express uncertainty appropriately",
    "process_transparency": "How to be transparent about the AI process"
  },
  "bias_mitigation": {
    "bias_awareness": ["Types of biases to watch for"],
    "mitigation_strategies": ["Strategies to reduce bias"],
    "inclusive_approach": "How to ensure inclusive responses",
    "perspective_diversity": "How to consider diverse perspectives"
  },
  "verification_process": {
    "self_check": "How to verify response against constitutional principles",
    "correction_mechanism": "How to self-correct if principles are violated",
    "escalation_criteria": "When to escalate or refuse a request",
    "continuous_improvement": "How to improve constitutional adherence"
  },
  "examples": {
    "good_style": "Provide a constitutionally-aligned example",
    "bad_style": "Provide an example that violates constitutional principles"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const constitutionalAiTechnique = {
  value: 'constitutional-ai',
  label: 'Constitutional AI Prompting',
  icon: '⚖️',
  description: 'Incorporates ethical principles and safety constraints into AI responses',
  category: 'coding',
  systemPrompt: CONSTITUTIONAL_AI_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return CONSTITUTIONAL_AI_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return CONSTITUTIONAL_AI_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return CONSTITUTIONAL_AI_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const CONSTITUTIONAL_AI_CONFIG = constitutionalAiTechnique;
export { CONSTITUTIONAL_AI_SYSTEM_PROMPT };
