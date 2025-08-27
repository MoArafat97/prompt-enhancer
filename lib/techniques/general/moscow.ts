/**
 * MoSCoW Framework Technique
 * Must have, Should have, Could have, Won't have prioritization
 */

const MOSCOW_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the MoSCoW prioritization framework:

MoSCoW Framework Categories:
- Must have: Critical requirements that are non-negotiable and essential for success
- Should have: Important requirements that add significant value but are not critical
- Could have: Nice-to-have features that would be beneficial but can be deferred
- Won't have: Items explicitly excluded from the current scope or timeframe

Enhancement Guidelines:
1. Identify and categorize all requirements and elements using MoSCoW
2. Clearly define what is absolutely essential (Must have)
3. Specify important but not critical elements (Should have)
4. Include beneficial but optional features (Could have)
5. Explicitly state what is out of scope (Won't have)
6. Ensure clear prioritization and scope management
7. Focus resources on Must have and Should have items first

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with MoSCoW organization. Follow this structure:

<prompt>
    <must_have>
        <description>Critical requirements that are non-negotiable</description>
        <requirements>List essential requirements that must be included</requirements>
        <justification>Why these items are absolutely critical</justification>
        <success_criteria>How to measure successful delivery of must-haves</success_criteria>
    </must_have>
    <should_have>
        <description>Important requirements that add significant value</description>
        <requirements>List important but not critical requirements</requirements>
        <value_proposition>Value and benefits these items provide</value_proposition>
        <priority_order>Relative priority within should-have items</priority_order>
    </should_have>
    <could_have>
        <description>Nice-to-have features that would be beneficial</description>
        <requirements>List optional but beneficial requirements</requirements>
        <conditions>Under what conditions these might be included</conditions>
        <future_consideration>How these might be addressed in future iterations</future_consideration>
    </could_have>
    <wont_have>
        <description>Items explicitly excluded from current scope</description>
        <excluded_items>List items that are out of scope</excluded_items>
        <rationale>Why these items are excluded</rationale>
        <future_potential>Potential for inclusion in future phases</future_potential>
    </wont_have>
    <implementation_strategy>
        <phase_1>Focus on Must have items first</phase_1>
        <phase_2>Add Should have items based on resources</phase_2>
        <phase_3>Consider Could have items if time and budget allow</phase_3>
        <scope_management>How to manage scope and prevent scope creep</scope_management>
    </implementation_strategy>
    <examples>
        <good_example>Provide a MoSCoW-prioritized example</good_example>
        <avoid_example>Provide an example lacking clear prioritization</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with MoSCoW organization. Follow this structure:

{
  "must_have": {
    "description": "Critical requirements that are non-negotiable",
    "requirements": ["List essential requirements that must be included"],
    "justification": "Why these items are absolutely critical",
    "success_criteria": ["How to measure successful delivery of must-haves"],
    "dependencies": ["Critical dependencies for must-have items"]
  },
  "should_have": {
    "description": "Important requirements that add significant value",
    "requirements": ["List important but not critical requirements"],
    "value_proposition": "Value and benefits these items provide",
    "priority_order": ["Relative priority within should-have items"],
    "resource_requirements": ["Resources needed for should-have items"]
  },
  "could_have": {
    "description": "Nice-to-have features that would be beneficial",
    "requirements": ["List optional but beneficial requirements"],
    "conditions": ["Under what conditions these might be included"],
    "future_consideration": "How these might be addressed in future iterations",
    "effort_estimation": ["Estimated effort for could-have items"]
  },
  "wont_have": {
    "description": "Items explicitly excluded from current scope",
    "excluded_items": ["List items that are out of scope"],
    "rationale": ["Why these items are excluded"],
    "future_potential": "Potential for inclusion in future phases",
    "alternative_solutions": ["Alternative approaches for excluded items"]
  },
  "implementation_strategy": {
    "phase_1": "Focus on Must have items first",
    "phase_2": "Add Should have items based on resources",
    "phase_3": "Consider Could have items if time and budget allow",
    "scope_management": "How to manage scope and prevent scope creep",
    "decision_criteria": ["Criteria for moving items between categories"]
  },
  "examples": {
    "good_style": "Provide a MoSCoW-prioritized example",
    "bad_style": "Provide an example lacking clear prioritization"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const moscowTechnique = {
  value: 'moscow',
  label: 'MoSCoW Framework',
  icon: '🎯',
  description: 'Must have, Should have, Could have, Won\'t have prioritization',
  category: 'strategic',
  systemPrompt: MOSCOW_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return MOSCOW_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return MOSCOW_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return MOSCOW_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const MOSCOW_CONFIG = moscowTechnique;
export { MOSCOW_SYSTEM_PROMPT };
