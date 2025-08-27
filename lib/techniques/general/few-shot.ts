/**
 * Few-Shot Learning Technique
 * Includes examples to guide AI behavior
 */

const FEW_SHOT_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt by adding few-shot examples:
1. Include 2-3 relevant examples
2. Show input-output patterns
3. Demonstrate the desired format
4. Provide context through examples
5. Maintain consistency in style

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
    "must_include": ["List elements that must be included", "2-3 relevant examples", "Input-output patterns"],
    "avoid": ["List what should be avoided"]
  },
  "output_format": {
    "structure": "Describe the desired output format with examples",
    "format_type": "Specify the format type (e.g., 'email', 'report', 'list')"
  },
  "examples": {
    "example_1": {
      "input": "Provide first example input",
      "output": "Show expected output for first example"
    },
    "example_2": {
      "input": "Provide second example input",
      "output": "Show expected output for second example"
    },
    "example_3": {
      "input": "Provide third example input",
      "output": "Show expected output for third example"
    },
    "pattern_explanation": "Explain the pattern demonstrated by the examples"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const fewShotTechnique = {
  value: 'few-shot',
  label: 'Few-Shot Learning',
  icon: '🎯',
  description: 'Include examples to guide the AI',
  category: 'general',
  systemPrompt: FEW_SHOT_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return FEW_SHOT_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return FEW_SHOT_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return FEW_SHOT_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const FEW_SHOT_CONFIG = fewShotTechnique;
export { FEW_SHOT_SYSTEM_PROMPT };
