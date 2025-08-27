/**
 * STAR Framework Technique
 * Situation, Task, Action, Result - Structured response methodology
 */

const STAR_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the STAR framework:

STAR Framework Components:
- Situation: Describe the context and background situation
- Task: Explain the specific task or challenge that needed to be addressed
- Action: Detail the specific actions taken to address the task
- Result: Describe the outcomes and results achieved

Enhancement Guidelines:
1. Structure responses with clear STAR components
2. Provide specific, concrete details for each element
3. Focus on measurable outcomes and results
4. Include relevant context and background
5. Emphasize actions taken and decision-making process
6. Quantify results where possible
7. Ensure logical flow from situation to result

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with STAR organization. Follow this structure:

<prompt>
    <situation>
        <context>Provide detailed background context and setting</context>
        <circumstances>Describe the specific circumstances or conditions</circumstances>
        <stakeholders>Identify key stakeholders involved</stakeholders>
        <constraints>Outline any constraints or limitations present</constraints>
        <timeline>Establish the timeframe and timeline</timeline>
    </situation>
    <task>
        <objective>Define the specific objective or goal</objective>
        <requirements>List specific requirements or expectations</requirements>
        <challenges>Identify key challenges or obstacles</challenges>
        <success_criteria>Define what success looks like</success_criteria>
        <scope>Clarify the scope and boundaries of the task</scope>
    </task>
    <action>
        <approach>Describe the overall approach or strategy</approach>
        <specific_steps>
            <step>Detail specific action step 1</step>
            <step>Detail specific action step 2</step>
            <step>Detail specific action step 3</step>
        </specific_steps>
        <decision_making>Explain key decisions made and rationale</decision_making>
        <resources_used>Describe resources utilized</resources_used>
        <collaboration>Detail any collaboration or teamwork involved</collaboration>
    </action>
    <result>
        <outcomes>Describe the specific outcomes achieved</outcomes>
        <metrics>Provide quantifiable metrics and measurements</metrics>
        <impact>Explain the broader impact or significance</impact>
        <lessons_learned>Identify key lessons learned</lessons_learned>
        <follow_up>Describe any follow-up actions or next steps</follow_up>
    </result>
    <examples>
        <good_example>Provide a well-structured STAR example</good_example>
        <avoid_example>Provide an example that lacks STAR structure</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with STAR organization. Follow this structure:

{
  "situation": {
    "context": "Provide detailed background context and setting",
    "circumstances": "Describe the specific circumstances or conditions",
    "stakeholders": ["Identify key stakeholders involved"],
    "constraints": ["Outline any constraints or limitations present"],
    "timeline": "Establish the timeframe and timeline",
    "environment": "Describe the working environment or conditions"
  },
  "task": {
    "objective": "Define the specific objective or goal",
    "requirements": ["List specific requirements or expectations"],
    "challenges": ["Identify key challenges or obstacles"],
    "success_criteria": ["Define what success looks like"],
    "scope": "Clarify the scope and boundaries of the task",
    "priority_level": "Indicate the priority or urgency level"
  },
  "action": {
    "approach": "Describe the overall approach or strategy",
    "specific_steps": [
      "Detail specific action step 1",
      "Detail specific action step 2", 
      "Detail specific action step 3"
    ],
    "decision_making": "Explain key decisions made and rationale",
    "resources_used": ["Describe resources utilized"],
    "collaboration": "Detail any collaboration or teamwork involved",
    "problem_solving": "Describe problem-solving approaches used"
  },
  "result": {
    "outcomes": "Describe the specific outcomes achieved",
    "metrics": ["Provide quantifiable metrics and measurements"],
    "impact": "Explain the broader impact or significance",
    "lessons_learned": ["Identify key lessons learned"],
    "follow_up": "Describe any follow-up actions or next steps",
    "success_assessment": "Assess the level of success achieved"
  },
  "star_principles": {
    "specificity": "Ensure all elements are specific and concrete",
    "relevance": "Maintain relevance to the objective throughout",
    "clarity": "Provide clear and understandable descriptions",
    "completeness": "Ensure all STAR elements are thoroughly covered"
  },
  "examples": {
    "good_style": "Provide a well-structured STAR example",
    "bad_style": "Provide an example that lacks STAR structure"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const starTechnique = {
  value: 'star',
  label: 'STAR Framework',
  icon: '⭐',
  description: 'Situation, Task, Action, Result - Structured response methodology',
  category: 'general',
  systemPrompt: STAR_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return STAR_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return STAR_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return STAR_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const STAR_CONFIG = starTechnique;
export { STAR_SYSTEM_PROMPT };
