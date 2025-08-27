/**
 * GROW Framework Technique
 * Goal, Reality, Options, Will/Way forward coaching model
 */

const GROW_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the GROW coaching framework:

GROW Framework Components:
- Goal: Clear, specific objectives and desired outcomes
- Reality: Current situation, facts, and existing conditions
- Options: Alternative approaches, strategies, and possible solutions
- Will/Way forward: Commitment to action, next steps, and implementation plan

Enhancement Guidelines:
1. Define clear, specific goals and desired outcomes (Goal)
2. Assess the current situation and existing conditions (Reality)
3. Explore multiple approaches and alternative solutions (Options)
4. Establish commitment and concrete next steps (Will/Way forward)
5. Create a logical progression from goal through to action
6. Encourage exploration and consideration of alternatives
7. Focus on actionable outcomes and accountability

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with GROW organization. Follow this structure:

<prompt>
    <goal>
        <primary_objective>Define the main goal or desired outcome</primary_objective>
        <specific_targets>List specific, measurable targets</specific_targets>
        <success_criteria>Define what success looks like</success_criteria>
        <motivation>Explain why this goal matters</motivation>
    </goal>
    <reality>
        <current_situation>Describe the present state or condition</current_situation>
        <existing_resources>List available resources and capabilities</existing_resources>
        <constraints>Identify limitations and obstacles</constraints>
        <past_attempts>Note any previous efforts or experiences</past_attempts>
    </reality>
    <options>
        <approach_1>
            <description>First possible approach or strategy</description>
            <pros>Benefits and advantages</pros>
            <cons>Drawbacks and challenges</cons>
        </approach_1>
        <approach_2>
            <description>Second possible approach or strategy</description>
            <pros>Benefits and advantages</pros>
            <cons>Drawbacks and challenges</cons>
        </approach_2>
        <approach_3>
            <description>Third possible approach or strategy</description>
            <pros>Benefits and advantages</pros>
            <cons>Drawbacks and challenges</cons>
        </approach_3>
        <creative_alternatives>Explore unconventional or innovative options</creative_alternatives>
    </options>
    <will_way_forward>
        <chosen_approach>Selected strategy or combination of approaches</chosen_approach>
        <action_steps>Specific steps to be taken</action_steps>
        <timeline>When actions will be completed</timeline>
        <accountability>How progress will be tracked and measured</accountability>
        <support_needed>What support or resources are required</support_needed>
    </will_way_forward>
    <examples>
        <good_example>Provide a GROW-structured example</good_example>
        <avoid_example>Provide an example lacking GROW structure</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with GROW organization. Follow this structure:

{
  "goal": {
    "primary_objective": "Define the main goal or desired outcome",
    "specific_targets": ["List specific, measurable targets"],
    "success_criteria": ["Define what success looks like"],
    "motivation": "Explain why this goal matters",
    "timeframe": "Specify the timeframe for achievement"
  },
  "reality": {
    "current_situation": "Describe the present state or condition",
    "existing_resources": ["List available resources and capabilities"],
    "constraints": ["Identify limitations and obstacles"],
    "past_attempts": ["Note any previous efforts or experiences"],
    "stakeholder_perspectives": ["Consider different viewpoints"]
  },
  "options": [
    {
      "approach": "First possible approach or strategy",
      "description": "Detailed description of this option",
      "pros": ["Benefits and advantages"],
      "cons": ["Drawbacks and challenges"],
      "feasibility": "Assessment of how realistic this option is"
    },
    {
      "approach": "Second possible approach or strategy",
      "description": "Detailed description of this option",
      "pros": ["Benefits and advantages"],
      "cons": ["Drawbacks and challenges"],
      "feasibility": "Assessment of how realistic this option is"
    },
    {
      "approach": "Third possible approach or strategy",
      "description": "Detailed description of this option",
      "pros": ["Benefits and advantages"],
      "cons": ["Drawbacks and challenges"],
      "feasibility": "Assessment of how realistic this option is"
    }
  ],
  "will_way_forward": {
    "chosen_approach": "Selected strategy or combination of approaches",
    "action_steps": ["Specific steps to be taken"],
    "timeline": ["When actions will be completed"],
    "accountability": "How progress will be tracked and measured",
    "support_needed": ["What support or resources are required"],
    "potential_obstacles": ["Anticipated challenges and how to address them"]
  },
  "examples": {
    "good_style": "Provide a GROW-structured example",
    "bad_style": "Provide an example lacking GROW structure"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const growTechnique = {
  value: 'grow',
  label: 'GROW Framework',
  icon: '🌱',
  description: 'Goal, Reality, Options, Will/Way forward coaching model',
  category: 'strategic',
  systemPrompt: GROW_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return GROW_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return GROW_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return GROW_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const GROW_CONFIG = growTechnique;
export { GROW_SYSTEM_PROMPT };
