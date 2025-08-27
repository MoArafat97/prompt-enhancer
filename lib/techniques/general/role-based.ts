/**
 * Role-Based Technique
 * Defines specific roles or personas for the AI
 */

const ROLE_BASED_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt by adding role-based context:
1. Define a specific expert role or persona
2. Add relevant expertise context
3. Include professional perspective
4. Enhance authority and credibility
5. Maintain professional tone

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
  "role": "Define a specific, detailed role or persona for the AI (e.g., 'experienced marketing manager', 'senior software engineer', 'professional copywriter')",
  "persona_details": {
    "expertise": "List areas of expertise for this role",
    "experience_level": "Specify experience level (e.g., 'senior', 'expert', '10+ years')",
    "communication_style": "Describe how this role typically communicates",
    "perspective": "What unique perspective does this role bring"
  },
  "task": "State the main task or objective clearly from the role's perspective",
  "context": {
    "target_audience": "Specify the intended audience",
    "constraints": ["List any constraints or limitations"],
    "background_info": "Provide relevant background information"
  },
  "requirements": {
    "length": "Specify desired length (e.g., 'brief', 'detailed', '500 words')",
    "tone": "Define the tone appropriate for this role (e.g., 'professional', 'authoritative', 'friendly')",
    "must_include": ["List elements that must be included", "Role-specific insights", "Professional expertise"],
    "avoid": ["List what should be avoided"]
  },
  "output_format": {
    "structure": "Describe the desired output format from the role's perspective",
    "format_type": "Specify the format type (e.g., 'email', 'report', 'list')"
  },
  "examples": {
    "good_style": "Provide a positive example showing the role's expertise",
    "bad_style": "Provide a negative example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const roleBasedTechnique = {
  value: 'role-based',
  label: 'Role-Based',
  icon: '👤',
  description: 'Define a specific role or persona',
  category: 'general',
  systemPrompt: ROLE_BASED_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return ROLE_BASED_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return ROLE_BASED_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return ROLE_BASED_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const ROLE_BASED_CONFIG = roleBasedTechnique;
export { ROLE_BASED_SYSTEM_PROMPT };
