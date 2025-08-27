/**
 * Eisenhower Matrix Framework Technique
 * Urgent/Important prioritization matrix
 */

const EISENHOWER_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Eisenhower Matrix framework:

Eisenhower Matrix Quadrants:
- Quadrant 1 (Urgent & Important): Do First - Critical tasks requiring immediate attention
- Quadrant 2 (Important, Not Urgent): Schedule - Important tasks for long-term success
- Quadrant 3 (Urgent, Not Important): Delegate - Tasks that can be delegated to others
- Quadrant 4 (Not Urgent, Not Important): Eliminate - Tasks that should be minimized or eliminated

Enhancement Guidelines:
1. Analyze the prompt to identify urgent and important elements
2. Prioritize critical tasks that need immediate attention (Quadrant 1)
3. Plan for important but not urgent strategic activities (Quadrant 2)
4. Identify tasks that could be delegated or automated (Quadrant 3)
5. Eliminate or minimize low-value activities (Quadrant 4)
6. Focus on moving from reactive (Q1) to proactive (Q2) approaches
7. Create clear prioritization and action frameworks

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Eisenhower Matrix organization. Follow this structure:

<prompt>
    <quadrant_1_urgent_important>
        <description>Critical tasks requiring immediate attention</description>
        <tasks>List urgent and important tasks to do first</tasks>
        <timeline>Immediate action required</timeline>
        <consequences>What happens if not addressed immediately</consequences>
    </quadrant_1_urgent_important>
    <quadrant_2_important_not_urgent>
        <description>Important tasks for long-term success</description>
        <tasks>List important but not urgent tasks to schedule</tasks>
        <timeline>Plan and schedule these activities</timeline>
        <strategic_value>Long-term benefits and strategic importance</strategic_value>
    </quadrant_2_important_not_urgent>
    <quadrant_3_urgent_not_important>
        <description>Tasks that can be delegated to others</description>
        <tasks>List urgent but not important tasks to delegate</tasks>
        <delegation_options>Who or what can handle these tasks</delegation_options>
        <efficiency_gains>Benefits of delegation or automation</efficiency_gains>
    </quadrant_3_urgent_not_important>
    <quadrant_4_not_urgent_not_important>
        <description>Tasks that should be minimized or eliminated</description>
        <tasks>List tasks to eliminate or minimize</tasks>
        <elimination_strategy>How to reduce or eliminate these activities</elimination_strategy>
        <time_savings>Time and resources freed up</time_savings>
    </quadrant_4_not_urgent_not_important>
    <prioritization_strategy>
        <focus_areas>Primary areas of focus based on matrix analysis</focus_areas>
        <action_sequence>Recommended sequence of actions</action_sequence>
        <resource_allocation>How to allocate time and resources</resource_allocation>
    </prioritization_strategy>
    <examples>
        <good_example>Provide an Eisenhower Matrix-prioritized example</good_example>
        <avoid_example>Provide an example lacking clear prioritization</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Eisenhower Matrix organization. Follow this structure:

{
  "quadrant_1_urgent_important": {
    "description": "Critical tasks requiring immediate attention",
    "tasks": ["List urgent and important tasks to do first"],
    "timeline": "Immediate action required",
    "consequences": "What happens if not addressed immediately",
    "action_plan": ["Specific steps for immediate execution"]
  },
  "quadrant_2_important_not_urgent": {
    "description": "Important tasks for long-term success",
    "tasks": ["List important but not urgent tasks to schedule"],
    "timeline": "Plan and schedule these activities",
    "strategic_value": "Long-term benefits and strategic importance",
    "scheduling_recommendations": ["When and how to schedule these tasks"]
  },
  "quadrant_3_urgent_not_important": {
    "description": "Tasks that can be delegated to others",
    "tasks": ["List urgent but not important tasks to delegate"],
    "delegation_options": ["Who or what can handle these tasks"],
    "efficiency_gains": "Benefits of delegation or automation",
    "delegation_strategy": ["How to effectively delegate these tasks"]
  },
  "quadrant_4_not_urgent_not_important": {
    "description": "Tasks that should be minimized or eliminated",
    "tasks": ["List tasks to eliminate or minimize"],
    "elimination_strategy": ["How to reduce or eliminate these activities"],
    "time_savings": "Time and resources freed up",
    "alternatives": ["Better uses of time and resources"]
  },
  "prioritization_strategy": {
    "focus_areas": ["Primary areas of focus based on matrix analysis"],
    "action_sequence": ["Recommended sequence of actions"],
    "resource_allocation": "How to allocate time and resources",
    "success_metrics": ["How to measure prioritization effectiveness"]
  },
  "examples": {
    "good_style": "Provide an Eisenhower Matrix-prioritized example",
    "bad_style": "Provide an example lacking clear prioritization"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const eisenhowerTechnique = {
  value: 'eisenhower',
  label: 'Eisenhower Matrix',
  icon: '📋',
  description: 'Urgent/Important prioritization matrix',
  category: 'strategic',
  systemPrompt: EISENHOWER_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return EISENHOWER_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return EISENHOWER_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return EISENHOWER_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const EISENHOWER_CONFIG = eisenhowerTechnique;
export { EISENHOWER_SYSTEM_PROMPT };
