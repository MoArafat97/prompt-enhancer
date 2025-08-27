/**
 * OKR Framework Technique
 * Objectives and Key Results methodology
 */

const OKR_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the OKR (Objectives and Key Results) framework:

OKR Framework Components:
- Objectives: Qualitative, inspirational goals that define what you want to achieve
- Key Results: Quantitative, measurable outcomes that indicate progress toward objectives
- Alignment: Connection to broader organizational or personal goals
- Time-bound: Specific timeframes for achievement (typically quarterly)

Enhancement Guidelines:
1. Transform vague requests into clear, inspirational objectives
2. Define 2-4 measurable key results for each objective
3. Ensure key results are specific, measurable, and time-bound
4. Establish alignment with broader goals or context
5. Make objectives ambitious but achievable
6. Focus on outcomes rather than activities
7. Create accountability and tracking mechanisms

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with OKR organization. Follow this structure:

<prompt>
    <objectives>
        <primary_objective>
            <description>State the main qualitative, inspirational goal</description>
            <rationale>Explain why this objective matters</rationale>
            <alignment>Connect to broader goals or strategy</alignment>
        </primary_objective>
        <supporting_objectives>
            <objective>Additional supporting objective if applicable</objective>
        </supporting_objectives>
    </objectives>
    <key_results>
        <result_1>
            <description>First measurable outcome</description>
            <metric>Specific metric or measurement</metric>
            <target>Target value or achievement level</target>
            <timeline>Timeframe for achievement</timeline>
        </result_1>
        <result_2>
            <description>Second measurable outcome</description>
            <metric>Specific metric or measurement</metric>
            <target>Target value or achievement level</target>
            <timeline>Timeframe for achievement</timeline>
        </result_2>
        <result_3>
            <description>Third measurable outcome</description>
            <metric>Specific metric or measurement</metric>
            <target>Target value or achievement level</target>
            <timeline>Timeframe for achievement</timeline>
        </result_3>
    </key_results>
    <tracking>
        <measurement_methods>How progress will be measured</measurement_methods>
        <review_frequency>How often progress will be reviewed</review_frequency>
        <accountability>Who is responsible for tracking</accountability>
    </tracking>
    <examples>
        <good_example>Provide an OKR-structured example</good_example>
        <avoid_example>Provide a poorly structured example to avoid</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with OKR organization. Follow this structure:

{
  "objectives": {
    "primary_objective": {
      "description": "State the main qualitative, inspirational goal",
      "rationale": "Explain why this objective matters",
      "alignment": "Connect to broader goals or strategy",
      "timeframe": "Specify the timeframe (e.g., quarterly, annual)"
    },
    "supporting_objectives": [
      {
        "description": "Additional supporting objective if applicable",
        "rationale": "Why this supporting objective is important"
      }
    ]
  },
  "key_results": [
    {
      "description": "First measurable outcome",
      "metric": "Specific metric or measurement method",
      "baseline": "Current state or starting point",
      "target": "Target value or achievement level",
      "timeline": "Timeframe for achievement"
    },
    {
      "description": "Second measurable outcome",
      "metric": "Specific metric or measurement method",
      "baseline": "Current state or starting point",
      "target": "Target value or achievement level",
      "timeline": "Timeframe for achievement"
    },
    {
      "description": "Third measurable outcome",
      "metric": "Specific metric or measurement method",
      "baseline": "Current state or starting point",
      "target": "Target value or achievement level",
      "timeline": "Timeframe for achievement"
    }
  ],
  "tracking": {
    "measurement_methods": ["How progress will be measured"],
    "review_frequency": "How often progress will be reviewed",
    "accountability": "Who is responsible for tracking",
    "reporting_format": "How results will be reported"
  },
  "examples": {
    "good_style": "Provide an OKR-structured example",
    "bad_style": "Provide a poorly structured example to avoid"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const okrTechnique = {
  value: 'okr',
  label: 'OKR Framework',
  icon: '🎯',
  description: 'Objectives and Key Results methodology',
  category: 'strategic',
  systemPrompt: OKR_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return OKR_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return OKR_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return OKR_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const OKR_CONFIG = okrTechnique;
export { OKR_SYSTEM_PROMPT };
