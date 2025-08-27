/**
 * Systems Thinking Framework Technique
 * Analyzes problems and solutions from a holistic systems perspective
 */

const SYSTEMS_THINKING_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Systems Thinking framework:

Systems Thinking Framework Components:
- Holistic Perspective: View problems as part of larger interconnected systems
- Interconnections: Identify relationships and dependencies between components
- Feedback Loops: Recognize reinforcing and balancing feedback mechanisms
- System Structure: Understand how system structure drives behavior
- Mental Models: Challenge assumptions and mental models about the system
- Leverage Points: Identify high-impact intervention points

Enhancement Guidelines:
1. Expand the scope to consider the broader system context
2. Identify key system components and their relationships
3. Map feedback loops and system dynamics
4. Consider unintended consequences and side effects
5. Look for root causes in system structure rather than events
6. Identify leverage points for maximum impact
7. Consider multiple stakeholder perspectives within the system

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Systems Thinking organization. Follow this structure:

<prompt>
    <system_definition>
        <system_boundaries>Define the boundaries of the system being analyzed</system_boundaries>
        <system_purpose>Identify the purpose and function of the system</system_purpose>
        <system_context>Describe the broader context and environment</system_context>
        <stakeholder_mapping>Map all stakeholders and their roles in the system</stakeholder_mapping>
    </system_definition>
    <component_analysis>
        <key_components>Identify the main components of the system</key_components>
        <component_relationships>Map relationships between components</component_relationships>
        <interdependencies>Identify critical interdependencies</interdependencies>
        <component_functions>Describe the function of each component</component_functions>
    </component_analysis>
    <dynamics_analysis>
        <feedback_loops>
            <reinforcing_loops>Identify reinforcing feedback loops</reinforcing_loops>
            <balancing_loops>Identify balancing feedback loops</balancing_loops>
            <delays>Identify delays in the system</delays>
        </feedback_loops>
        <system_behavior>Analyze patterns of system behavior over time</system_behavior>
        <emergent_properties>Identify emergent properties of the system</emergent_properties>
    </dynamics_analysis>
    <leverage_analysis>
        <intervention_points>Identify potential intervention points</intervention_points>
        <leverage_assessment>Assess the leverage potential of each intervention</leverage_assessment>
        <unintended_consequences>Consider potential unintended consequences</unintended_consequences>
        <systemic_solutions>Develop solutions that address system structure</systemic_solutions>
    </leverage_analysis>
    <mental_models>
        <assumption_identification>Identify underlying assumptions about the system</assumption_identification>
        <model_testing>How to test and challenge mental models</model_testing>
        <perspective_diversity>Consider multiple perspectives on the system</perspective_diversity>
    </mental_models>
    <examples>
        <good_example>Provide a systems thinking example</good_example>
        <avoid_example>Provide an example that lacks systems perspective</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Systems Thinking organization. Follow this structure:

{
  "system_definition": {
    "system_boundaries": "Define the boundaries of the system being analyzed",
    "system_purpose": "Identify the purpose and function of the system",
    "system_context": "Describe the broader context and environment",
    "stakeholder_mapping": ["Map all stakeholders and their roles in the system"],
    "system_hierarchy": "Identify the system's position in larger systems"
  },
  "component_analysis": {
    "key_components": ["Identify the main components of the system"],
    "component_relationships": "Map relationships between components",
    "interdependencies": ["Identify critical interdependencies"],
    "component_functions": "Describe the function of each component",
    "component_interactions": "How components interact with each other"
  },
  "dynamics_analysis": {
    "feedback_loops": {
      "reinforcing_loops": ["Identify reinforcing feedback loops"],
      "balancing_loops": ["Identify balancing feedback loops"],
      "delays": ["Identify delays in the system"],
      "loop_interactions": "How feedback loops interact with each other"
    },
    "system_behavior": "Analyze patterns of system behavior over time",
    "emergent_properties": ["Identify emergent properties of the system"],
    "system_archetypes": "Identify common system behavior patterns"
  },
  "leverage_analysis": {
    "intervention_points": ["Identify potential intervention points"],
    "leverage_assessment": "Assess the leverage potential of each intervention",
    "unintended_consequences": ["Consider potential unintended consequences"],
    "systemic_solutions": "Develop solutions that address system structure",
    "leverage_hierarchy": "Rank intervention points by leverage potential"
  },
  "mental_models": {
    "assumption_identification": ["Identify underlying assumptions about the system"],
    "model_testing": "How to test and challenge mental models",
    "perspective_diversity": "Consider multiple perspectives on the system",
    "paradigm_shifts": "Identify needed paradigm shifts"
  },
  "systems_principles": {
    "holistic_thinking": "How to maintain holistic perspective",
    "non_linear_thinking": "How to think about non-linear relationships",
    "long_term_perspective": "How to consider long-term system effects",
    "complexity_management": "How to manage system complexity"
  },
  "examples": {
    "good_style": "Provide a systems thinking example",
    "bad_style": "Provide an example that lacks systems perspective"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const systemsThinkingTechnique = {
  value: 'systems-thinking',
  label: 'Systems Thinking',
  icon: '🔄',
  description: 'Analyzes problems and solutions from a holistic systems perspective',
  category: 'coding',
  systemPrompt: SYSTEMS_THINKING_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return SYSTEMS_THINKING_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return SYSTEMS_THINKING_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return SYSTEMS_THINKING_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const SYSTEMS_THINKING_CONFIG = systemsThinkingTechnique;
export { SYSTEMS_THINKING_SYSTEM_PROMPT };
