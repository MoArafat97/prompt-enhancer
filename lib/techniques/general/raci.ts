/**
 * RACI Framework Technique
 * Responsible, Accountable, Consulted, Informed roles and responsibilities
 */

const RACI_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the RACI framework:

RACI Framework Roles:
- Responsible: Who does the work and performs the tasks
- Accountable: Who is ultimately answerable for the completion and success
- Consulted: Who provides input, expertise, and feedback (two-way communication)
- Informed: Who needs to be kept updated on progress and decisions (one-way communication)

Enhancement Guidelines:
1. Identify all stakeholders and their roles in the process
2. Clearly define who is responsible for executing each task
3. Establish who is accountable for overall success and decision-making
4. Specify who should be consulted for input and expertise
5. Determine who needs to be informed of progress and outcomes
6. Ensure clear communication channels and responsibilities
7. Avoid role confusion and accountability gaps

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with RACI organization. Follow this structure:

<prompt>
    <responsible>
        <description>Who does the work and performs the tasks</description>
        <roles>List specific roles responsible for execution</roles>
        <tasks>Define specific tasks and deliverables</tasks>
        <skills_required>Skills and capabilities needed</skills_required>
    </responsible>
    <accountable>
        <description>Who is ultimately answerable for completion and success</description>
        <decision_maker>Primary decision maker and owner</decision_maker>
        <authority>Level of authority and decision-making power</authority>
        <success_criteria>What they are accountable for achieving</success_criteria>
    </accountable>
    <consulted>
        <description>Who provides input, expertise, and feedback</description>
        <stakeholders>List stakeholders to be consulted</stakeholders>
        <expertise_areas>Areas of expertise they contribute</expertise_areas>
        <consultation_process>How and when consultation will occur</consultation_process>
    </consulted>
    <informed>
        <description>Who needs to be kept updated on progress and decisions</description>
        <stakeholders>List stakeholders to be informed</stakeholders>
        <information_needs>What information they need to receive</information_needs>
        <communication_frequency>How often they should be updated</communication_frequency>
    </informed>
    <communication_plan>
        <channels>Communication channels and methods</channels>
        <frequency>Regular communication schedule</frequency>
        <escalation>Escalation procedures for issues</escalation>
        <documentation>How decisions and progress will be documented</documentation>
    </communication_plan>
    <examples>
        <good_example>Provide a RACI-structured example</good_example>
        <avoid_example>Provide an example with unclear roles and responsibilities</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with RACI organization. Follow this structure:

{
  "responsible": {
    "description": "Who does the work and performs the tasks",
    "roles": ["List specific roles responsible for execution"],
    "tasks": ["Define specific tasks and deliverables"],
    "skills_required": ["Skills and capabilities needed"],
    "time_commitment": "Expected time commitment for responsible parties"
  },
  "accountable": {
    "description": "Who is ultimately answerable for completion and success",
    "decision_maker": "Primary decision maker and owner",
    "authority": "Level of authority and decision-making power",
    "success_criteria": ["What they are accountable for achieving"],
    "escalation_authority": "Who they escalate to if needed"
  },
  "consulted": {
    "description": "Who provides input, expertise, and feedback",
    "stakeholders": ["List stakeholders to be consulted"],
    "expertise_areas": ["Areas of expertise they contribute"],
    "consultation_process": "How and when consultation will occur",
    "input_requirements": ["What type of input is needed from each"]
  },
  "informed": {
    "description": "Who needs to be kept updated on progress and decisions",
    "stakeholders": ["List stakeholders to be informed"],
    "information_needs": ["What information they need to receive"],
    "communication_frequency": "How often they should be updated",
    "preferred_channels": ["Preferred communication methods"]
  },
  "communication_plan": {
    "channels": ["Communication channels and methods"],
    "frequency": "Regular communication schedule",
    "escalation": "Escalation procedures for issues",
    "documentation": "How decisions and progress will be documented",
    "feedback_mechanisms": ["How feedback will be collected and processed"]
  },
  "examples": {
    "good_style": "Provide a RACI-structured example",
    "bad_style": "Provide an example with unclear roles and responsibilities"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const raciTechnique = {
  value: 'raci',
  label: 'RACI Framework',
  icon: '👥',
  description: 'Responsible, Accountable, Consulted, Informed roles',
  category: 'strategic',
  systemPrompt: RACI_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return RACI_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return RACI_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return RACI_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const RACI_CONFIG = raciTechnique;
export { RACI_SYSTEM_PROMPT };
