/**
 * Clarity Enhancement Technique
 * Improves clarity and specificity of prompts
 */

const CLARITY_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt by:
1. Making it more specific and clear
2. Removing ambiguity
3. Adding relevant context
4. Ensuring the request is actionable
5. Maintaining the original intent

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with hierarchical organization. Follow this structure:

<prompt>
    <role>Define the AI's role or persona here</role>
    <task>State the main task or objective clearly</task>
    <context>Provide background information and constraints</context>
    <requirements>
        <length>Specify desired length</length>
        <tone>Define the tone (e.g., professional, casual, etc.)</tone>
        <include>List what must be included</include>
        <avoid>List what should be avoided</avoid>
    </requirements>
    <format>
        <output_structure>Describe the desired output format</output_structure>
    </format>
    <examples>
        <good_example>Provide a positive example</good_example>
        <avoid_example>Provide a negative example to avoid</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with hierarchical organization. Follow this structure:

{
  "role": "Define the AI's role or persona here",
  "task": "State the main task or objective clearly",
  "context": {
    "target_audience": "Specify the intended audience",
    "constraints": ["List any constraints or limitations"],
    "background_info": "Provide relevant background information"
  },
  "requirements": {
    "length": "Specify desired length (e.g., 'brief', 'detailed', '500 words')",
    "tone": "Define the tone (e.g., 'professional', 'casual', 'friendly')",
    "must_include": ["List elements that must be included"],
    "avoid": ["List what should be avoided"]
  },
  "output_format": {
    "structure": "Describe the desired output format",
    "format_type": "Specify the format type (e.g., 'email', 'report', 'list')"
  },
  "examples": {
    "good_style": "Provide a positive example or description",
    "bad_style": "Provide a negative example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const clarityTechnique = {
  value: 'clarity',
  label: 'Clarity Enhancement',
  icon: '✨',
  description: 'Improve clarity and specificity of your prompt',
  category: 'general',
  systemPrompt: CLARITY_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return CLARITY_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return CLARITY_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return CLARITY_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const CLARITY_CONFIG = clarityTechnique;
export { CLARITY_SYSTEM_PROMPT };
