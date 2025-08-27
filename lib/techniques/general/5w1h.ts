/**
 * 5W1H Framework Technique
 * Who, What, When, Where, Why, How analysis
 */

const FIVE_W_ONE_H_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the 5W1H framework:

5W1H Framework Components:
- Who: People involved, target audience, stakeholders, and responsible parties
- What: Specific tasks, deliverables, outcomes, and objectives
- When: Timelines, deadlines, schedules, and time-related constraints
- Where: Location, environment, context, and setting
- Why: Purpose, rationale, motivation, and underlying reasons
- How: Methods, processes, approaches, and implementation strategies

Enhancement Guidelines:
1. Clearly identify all relevant people and stakeholders (Who)
2. Specify exactly what needs to be accomplished (What)
3. Define precise timing and deadlines (When)
4. Establish context, location, or environment (Where)
5. Articulate the purpose and rationale (Why)
6. Detail the methods and approaches (How)
7. Ensure all six questions are comprehensively addressed
8. Create logical connections between the different elements

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with 5W1H organization. Follow this structure:

<prompt>
    <who>
        <target_audience>Identify the primary audience or users</target_audience>
        <stakeholders>List all relevant stakeholders</stakeholders>
        <responsible_parties>Define who is responsible for what</responsible_parties>
        <decision_makers>Identify key decision makers</decision_makers>
    </who>
    <what>
        <primary_objectives>Define the main goals and objectives</primary_objectives>
        <deliverables>List specific deliverables expected</deliverables>
        <scope>Define the scope and boundaries</scope>
        <requirements>Specify detailed requirements</requirements>
    </what>
    <when>
        <timeline>Provide overall timeline</timeline>
        <deadlines>List specific deadlines</deadlines>
        <milestones>Define key milestones</milestones>
        <scheduling_constraints>Note any time constraints</scheduling_constraints>
    </when>
    <where>
        <location>Specify physical or virtual location</location>
        <environment>Describe the operating environment</environment>
        <context>Provide situational context</context>
        <platform>Identify relevant platforms or systems</platform>
    </where>
    <why>
        <purpose>Explain the fundamental purpose</purpose>
        <rationale>Provide reasoning and justification</rationale>
        <benefits>Describe expected benefits</benefits>
        <motivation>Explain underlying motivations</motivation>
    </why>
    <how>
        <methodology>Describe the approach or methodology</methodology>
        <processes>Outline key processes</processes>
        <tools_resources>List required tools and resources</tools_resources>
        <implementation_strategy>Define implementation approach</implementation_strategy>
    </how>
    <examples>
        <good_example>Provide a comprehensive 5W1H example</good_example>
        <avoid_example>Provide an incomplete example to avoid</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with 5W1H organization. Follow this structure:

{
  "who": {
    "target_audience": "Identify the primary audience or users",
    "stakeholders": ["List all relevant stakeholders"],
    "responsible_parties": ["Define who is responsible for what"],
    "decision_makers": ["Identify key decision makers"],
    "subject_matter_experts": ["List relevant experts"]
  },
  "what": {
    "primary_objectives": ["Define the main goals and objectives"],
    "deliverables": ["List specific deliverables expected"],
    "scope": "Define the scope and boundaries",
    "requirements": ["Specify detailed requirements"],
    "success_criteria": ["Define what success looks like"]
  },
  "when": {
    "timeline": "Provide overall timeline",
    "deadlines": ["List specific deadlines"],
    "milestones": ["Define key milestones"],
    "scheduling_constraints": ["Note any time constraints"],
    "frequency": "Specify frequency if applicable"
  },
  "where": {
    "location": "Specify physical or virtual location",
    "environment": "Describe the operating environment",
    "context": "Provide situational context",
    "platform": ["Identify relevant platforms or systems"],
    "channels": ["List communication or distribution channels"]
  },
  "why": {
    "purpose": "Explain the fundamental purpose",
    "rationale": "Provide reasoning and justification",
    "benefits": ["Describe expected benefits"],
    "motivation": "Explain underlying motivations",
    "business_case": "Present the business case or value proposition"
  },
  "how": {
    "methodology": "Describe the approach or methodology",
    "processes": ["Outline key processes"],
    "tools_resources": ["List required tools and resources"],
    "implementation_strategy": "Define implementation approach",
    "quality_assurance": "Describe quality control measures"
  },
  "examples": {
    "good_style": "Provide a comprehensive 5W1H example",
    "bad_style": "Provide an incomplete example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const fiveWOneHTechnique = {
  value: '5w1h',
  label: '5W1H Framework',
  icon: '❓',
  description: 'Who, What, When, Where, Why, How analysis',
  category: 'strategic',
  systemPrompt: FIVE_W_ONE_H_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return FIVE_W_ONE_H_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return FIVE_W_ONE_H_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return FIVE_W_ONE_H_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const FIVE_W_ONE_H_CONFIG = fiveWOneHTechnique;
export { FIVE_W_ONE_H_SYSTEM_PROMPT };
