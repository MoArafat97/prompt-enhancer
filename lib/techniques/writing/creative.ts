/**
 * Creative Expansion Technique
 * Enhances creativity and imagination in prompts
 */

const CREATIVE_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt for creative output:
1. Add imaginative elements
2. Encourage creative thinking
3. Include sensory details
4. Expand creative possibilities
5. Maintain engaging tone

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
  "role": "Define the AI's creative role or persona here (e.g., 'creative writer', 'innovative designer', 'imaginative storyteller')",
  "task": "State the main creative task or objective clearly",
  "context": {
    "target_audience": "Specify the intended audience",
    "constraints": ["List any constraints or limitations"],
    "background_info": "Provide relevant background information",
    "creative_direction": "Specify the creative direction or theme"
  },
  "requirements": {
    "length": "Specify desired length (e.g., 'brief', 'detailed', '500 words')",
    "tone": "Define the creative tone (e.g., 'imaginative', 'whimsical', 'bold', 'inspiring')",
    "must_include": ["List elements that must be included", "Creative elements", "Imaginative aspects", "Original ideas"],
    "avoid": ["List what should be avoided", "Clichés", "Generic responses"]
  },
  "output_format": {
    "structure": "Describe the desired creative output format",
    "format_type": "Specify the format type (e.g., 'story', 'poem', 'creative brief', 'concept')"
  },
  "creative_elements": {
    "inspiration_sources": ["List potential sources of inspiration"],
    "creative_techniques": ["List creative techniques to employ"],
    "innovation_level": "Specify desired level of creativity (e.g., 'moderate', 'high', 'groundbreaking')"
  },
  "examples": {
    "good_style": "Provide a positive creative example",
    "bad_style": "Provide a negative example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const creativeTechnique = {
  value: 'creative',
  label: 'Creative Expansion',
  icon: '🎨',
  description: 'Enhance creativity and imagination',
  category: 'general',
  systemPrompt: CREATIVE_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return CREATIVE_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return CREATIVE_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return CREATIVE_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const CREATIVE_CONFIG = creativeTechnique;
export { CREATIVE_SYSTEM_PROMPT };
