/**
 * PREP Framework Technique
 * Point, Reason, Example, Point - Clear communication structure
 */

const PREP_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the PREP framework:

PREP Framework Components:
- Point: State the main point or position clearly
- Reason: Provide the reasoning or rationale behind the point
- Example: Give specific examples or evidence to support the point
- Point: Restate or reinforce the main point

Enhancement Guidelines:
1. Start with a clear, concise main point
2. Provide logical reasoning and rationale
3. Include specific, relevant examples or evidence
4. Conclude by reinforcing the main point
5. Ensure logical flow and coherence
6. Use persuasive and clear language
7. Make the structure easy to follow

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with PREP organization. Follow this structure:

<prompt>
    <point_opening>
        <main_statement>State the primary point or position clearly and concisely</main_statement>
        <thesis>Articulate the central thesis or argument</thesis>
        <position_clarity>Ensure the position is unambiguous and specific</position_clarity>
        <audience_relevance>Connect the point to audience interests or needs</audience_relevance>
    </point_opening>
    <reason>
        <logical_rationale>Provide logical reasoning behind the main point</logical_rationale>
        <supporting_arguments>
            <argument>Supporting argument 1 with explanation</argument>
            <argument>Supporting argument 2 with explanation</argument>
            <argument>Supporting argument 3 with explanation</argument>
        </supporting_arguments>
        <cause_effect>Explain cause-and-effect relationships</cause_effect>
        <evidence_basis>Describe the evidence basis for the reasoning</evidence_basis>
    </reason>
    <example>
        <specific_examples>
            <example>Concrete example 1 that illustrates the point</example>
            <example>Concrete example 2 that supports the reasoning</example>
            <example>Concrete example 3 that demonstrates application</example>
        </specific_examples>
        <case_studies>Include relevant case studies or scenarios</case_studies>
        <data_evidence>Provide statistical or factual evidence</data_evidence>
        <analogies>Use analogies or comparisons to clarify concepts</analogies>
    </example>
    <point_closing>
        <restatement>Restate the main point with reinforcement</restatement>
        <synthesis>Synthesize how reason and examples support the point</synthesis>
        <call_to_action>Include appropriate call to action or next steps</call_to_action>
        <memorable_conclusion>Create a memorable and impactful conclusion</memorable_conclusion>
    </point_closing>
    <communication_principles>
        <clarity>Ensure clear and understandable communication</clarity>
        <conciseness>Maintain conciseness while being comprehensive</conciseness>
        <persuasiveness>Use persuasive techniques effectively</persuasiveness>
        <logical_flow>Maintain logical flow throughout the structure</logical_flow>
    </communication_principles>
    <examples>
        <good_example>Provide an effective PREP example</good_example>
        <avoid_example>Provide an example that lacks PREP structure</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with PREP organization. Follow this structure:

{
  "point_opening": {
    "main_statement": "State the primary point or position clearly and concisely",
    "thesis": "Articulate the central thesis or argument",
    "position_clarity": "Ensure the position is unambiguous and specific",
    "audience_relevance": "Connect the point to audience interests or needs",
    "hook": "Create an engaging opening that captures attention"
  },
  "reason": {
    "logical_rationale": "Provide logical reasoning behind the main point",
    "supporting_arguments": [
      "Supporting argument 1 with explanation",
      "Supporting argument 2 with explanation",
      "Supporting argument 3 with explanation"
    ],
    "cause_effect": "Explain cause-and-effect relationships",
    "evidence_basis": "Describe the evidence basis for the reasoning",
    "reasoning_strength": "Assess and strengthen the reasoning"
  },
  "example": {
    "specific_examples": [
      "Concrete example 1 that illustrates the point",
      "Concrete example 2 that supports the reasoning",
      "Concrete example 3 that demonstrates application"
    ],
    "case_studies": ["Include relevant case studies or scenarios"],
    "data_evidence": ["Provide statistical or factual evidence"],
    "analogies": ["Use analogies or comparisons to clarify concepts"],
    "example_relevance": "Ensure examples are relevant and compelling"
  },
  "point_closing": {
    "restatement": "Restate the main point with reinforcement",
    "synthesis": "Synthesize how reason and examples support the point",
    "call_to_action": "Include appropriate call to action or next steps",
    "memorable_conclusion": "Create a memorable and impactful conclusion",
    "reinforcement_strategy": "Strategy for reinforcing the main point"
  },
  "communication_principles": {
    "clarity": "Ensure clear and understandable communication",
    "conciseness": "Maintain conciseness while being comprehensive",
    "persuasiveness": "Use persuasive techniques effectively",
    "logical_flow": "Maintain logical flow throughout the structure",
    "audience_engagement": "Keep the audience engaged throughout"
  },
  "prep_optimization": {
    "transition_techniques": "How to smoothly transition between PREP elements",
    "emphasis_strategies": "How to emphasize key points effectively",
    "coherence_maintenance": "How to maintain coherence across all elements",
    "impact_maximization": "How to maximize the impact of the message"
  },
  "examples": {
    "good_style": "Provide an effective PREP example",
    "bad_style": "Provide an example that lacks PREP structure"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const prepTechnique = {
  value: 'prep',
  label: 'PREP Framework',
  icon: '📝',
  description: 'Point, Reason, Example, Point - Clear communication structure',
  category: 'general',
  systemPrompt: PREP_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return PREP_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return PREP_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return PREP_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const PREP_CONFIG = prepTechnique;
export { PREP_SYSTEM_PROMPT };
