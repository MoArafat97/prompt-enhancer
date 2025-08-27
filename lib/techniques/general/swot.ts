/**
 * SWOT Framework Technique
 * Strengths, Weaknesses, Opportunities, Threats analysis
 */

const SWOT_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the SWOT analysis framework:

SWOT Framework Components:
- Strengths: Internal positive factors, advantages, and capabilities
- Weaknesses: Internal negative factors, limitations, and areas for improvement
- Opportunities: External positive factors, potential advantages, and favorable conditions
- Threats: External negative factors, potential risks, and challenges

Enhancement Guidelines:
1. Analyze the prompt context to identify relevant SWOT elements
2. Incorporate internal strengths and capabilities into the request
3. Address internal weaknesses and limitations that need consideration
4. Leverage external opportunities and favorable conditions
5. Mitigate external threats and potential risks
6. Create a balanced perspective that considers all four quadrants
7. Use SWOT insights to refine objectives and approaches

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with SWOT organization. Follow this structure:

<prompt>
    <strengths>
        <internal_advantages>List internal positive factors and advantages</internal_advantages>
        <capabilities>Identify existing capabilities and resources</capabilities>
        <competitive_advantages>Highlight unique strengths</competitive_advantages>
    </strengths>
    <weaknesses>
        <internal_limitations>List internal negative factors and limitations</internal_limitations>
        <skill_gaps>Identify areas lacking expertise or resources</skill_gaps>
        <improvement_areas>Highlight areas needing development</improvement_areas>
    </weaknesses>
    <opportunities>
        <external_advantages>List external positive factors and opportunities</external_advantages>
        <market_conditions>Identify favorable market or environmental conditions</market_conditions>
        <potential_benefits>Highlight potential gains or advantages</potential_benefits>
    </opportunities>
    <threats>
        <external_risks>List external negative factors and threats</external_risks>
        <challenges>Identify potential obstacles or difficulties</challenges>
        <risk_mitigation>Suggest ways to address or minimize threats</risk_mitigation>
    </threats>
    <strategic_implications>
        <leverage_strengths>How to leverage strengths for opportunities</leverage_strengths>
        <address_weaknesses>How to address weaknesses and threats</address_weaknesses>
        <action_priorities>Priority actions based on SWOT analysis</action_priorities>
    </strategic_implications>
    <examples>
        <good_example>Provide a SWOT-informed example</good_example>
        <avoid_example>Provide an example that ignores SWOT factors</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with SWOT organization. Follow this structure:

{
  "strengths": {
    "internal_advantages": ["List internal positive factors and advantages"],
    "capabilities": ["Identify existing capabilities and resources"],
    "competitive_advantages": ["Highlight unique strengths"],
    "assets": ["List valuable assets or resources"]
  },
  "weaknesses": {
    "internal_limitations": ["List internal negative factors and limitations"],
    "skill_gaps": ["Identify areas lacking expertise or resources"],
    "improvement_areas": ["Highlight areas needing development"],
    "resource_constraints": ["List resource limitations"]
  },
  "opportunities": {
    "external_advantages": ["List external positive factors and opportunities"],
    "market_conditions": ["Identify favorable market or environmental conditions"],
    "potential_benefits": ["Highlight potential gains or advantages"],
    "emerging_trends": ["Identify beneficial trends or developments"]
  },
  "threats": {
    "external_risks": ["List external negative factors and threats"],
    "challenges": ["Identify potential obstacles or difficulties"],
    "competitive_pressures": ["List competitive threats"],
    "environmental_factors": ["Identify unfavorable external conditions"]
  },
  "strategic_implications": {
    "leverage_strengths": ["How to leverage strengths for opportunities"],
    "address_weaknesses": ["How to address weaknesses and threats"],
    "action_priorities": ["Priority actions based on SWOT analysis"],
    "strategic_recommendations": ["Strategic recommendations from analysis"]
  },
  "examples": {
    "good_style": "Provide a SWOT-informed example",
    "bad_style": "Provide an example that ignores SWOT factors"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const swotTechnique = {
  value: 'swot',
  label: 'SWOT Framework',
  icon: '📊',
  description: 'Strengths, Weaknesses, Opportunities, Threats analysis',
  category: 'strategic',
  systemPrompt: SWOT_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return SWOT_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return SWOT_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return SWOT_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const SWOT_CONFIG = swotTechnique;
export { SWOT_SYSTEM_PROMPT };
