/**
 * Chain of Thought Technique
 * Adds step-by-step reasoning structure to prompts
 */

const CHAIN_OF_THOUGHT_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt by adding chain-of-thought reasoning:
1. Break down complex tasks into steps
2. Add "Let's think step by step" or similar phrases
3. Include reasoning structure
4. Guide the AI through logical progression
5. Maintain clarity and focus

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
  "task": "State the main task or objective clearly with step-by-step reasoning structure",
  "context": {
    "target_audience": "Specify the intended audience",
    "constraints": ["List any constraints or limitations"],
    "background_info": "Provide relevant background information"
  },
  "requirements": {
    "length": "Specify desired length (e.g., 'brief', 'detailed', '500 words')",
    "tone": "Define the tone (e.g., 'professional', 'casual', 'friendly')",
    "must_include": ["List elements that must be included", "Step-by-step reasoning", "Chain of thought structure"],
    "avoid": ["List what should be avoided"]
  },
  "output_format": {
    "structure": "Describe the desired output format with reasoning steps",
    "format_type": "Specify the format type (e.g., 'email', 'report', 'list')"
  },
  "reasoning_structure": {
    "approach": "Let's think step by step",
    "steps": ["Step 1: Description", "Step 2: Description", "Step 3: Description"],
    "logical_flow": "Describe how each step connects to the next"
  },
  "examples": {
    "good_style": "Provide a positive example with clear reasoning steps",
    "bad_style": "Provide a negative example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const chainOfThoughtTechnique = {
  value: 'chain-of-thought',
  label: 'Chain of Thought',
  icon: '🔗',
  description: 'Add step-by-step reasoning structure',
  category: 'general',
  systemPrompt: CHAIN_OF_THOUGHT_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return CHAIN_OF_THOUGHT_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return CHAIN_OF_THOUGHT_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return CHAIN_OF_THOUGHT_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const CHAIN_OF_THOUGHT_CONFIG = chainOfThoughtTechnique;
export { CHAIN_OF_THOUGHT_SYSTEM_PROMPT };
