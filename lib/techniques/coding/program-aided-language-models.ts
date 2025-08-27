/**
 * Program-Aided Language Models (PAL) Framework Technique
 * Combines natural language reasoning with programmatic computation
 */

const PAL_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Program-Aided Language Models (PAL) framework:

PAL Framework Components:
- Natural Language Reasoning: Break down problems into logical steps using natural language
- Programmatic Computation: Identify computational steps that can be solved with code
- Hybrid Approach: Combine reasoning and computation for accurate problem-solving
- Step-by-Step Execution: Execute reasoning and computational steps in sequence
- Verification: Validate results through both logical and computational means

Enhancement Guidelines:
1. Identify parts of the problem that require logical reasoning vs computation
2. Structure the prompt to separate reasoning steps from computational steps
3. Include explicit instructions for when to use code vs natural language
4. Add verification steps to check computational results
5. Ensure clear handoff between reasoning and computation phases
6. Include examples of the hybrid reasoning-computation approach

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with PAL organization. Follow this structure:

<prompt>
    <reasoning_phase>
        <problem_analysis>Break down the problem into logical components</problem_analysis>
        <reasoning_steps>
            <step>Natural language reasoning step 1</step>
            <step>Natural language reasoning step 2</step>
        </reasoning_steps>
        <computational_identification>Identify which parts need programmatic computation</computational_identification>
    </reasoning_phase>
    <computation_phase>
        <computational_steps>
            <step>
                <description>What needs to be computed</description>
                <approach>How to compute it programmatically</approach>
                <verification>How to verify the result</verification>
            </step>
        </computational_steps>
        <code_requirements>Specify programming language and libraries if needed</code_requirements>
    </computation_phase>
    <integration_phase>
        <hybrid_approach>How to combine reasoning and computation</hybrid_approach>
        <execution_order>Step-by-step execution sequence</execution_order>
        <validation>How to validate the final result</validation>
    </integration_phase>
    <examples>
        <good_example>Provide a PAL-based example</good_example>
        <avoid_example>Provide an example that doesn't use PAL principles</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with PAL organization. Follow this structure:

{
  "reasoning_phase": {
    "problem_analysis": "Break down the problem into logical components",
    "reasoning_steps": [
      "Natural language reasoning step 1",
      "Natural language reasoning step 2",
      "Natural language reasoning step 3"
    ],
    "computational_identification": "Identify which parts need programmatic computation",
    "reasoning_approach": "Describe the logical reasoning methodology"
  },
  "computation_phase": {
    "computational_steps": [
      {
        "description": "What needs to be computed",
        "approach": "How to compute it programmatically",
        "verification": "How to verify the result",
        "complexity": "Computational complexity if relevant"
      }
    ],
    "code_requirements": {
      "language": "Specify programming language",
      "libraries": ["List required libraries or tools"],
      "environment": "Specify execution environment if needed"
    },
    "data_handling": "How to handle input/output data"
  },
  "integration_phase": {
    "hybrid_approach": "How to combine reasoning and computation effectively",
    "execution_order": ["Step 1: Description", "Step 2: Description"],
    "validation": "How to validate the final result",
    "error_handling": "How to handle computational errors"
  },
  "output_format": {
    "structure": "Describe the desired output format",
    "reasoning_documentation": "How to document the reasoning process",
    "computational_results": "How to present computational results"
  },
  "examples": {
    "good_style": "Provide a PAL-based example",
    "bad_style": "Provide an example that doesn't use PAL principles"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const palTechnique = {
  value: 'pal',
  label: 'Program-Aided Language Models (PAL)',
  icon: '🔧',
  description: 'Combines natural language reasoning with programmatic computation',
  category: 'coding',
  systemPrompt: PAL_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return PAL_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return PAL_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return PAL_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const PAL_CONFIG = palTechnique;
export { PAL_SYSTEM_PROMPT };
