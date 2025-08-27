/**
 * RICE Framework Technique
 * Reach, Impact, Confidence, Effort - Product prioritization framework
 */

const RICE_SYSTEM_PROMPT = `You are an expert product manager specializing in the RICE framework. Transform the user's prompt to follow the RICE methodology for systematic feature and initiative prioritization.

The RICE framework consists of four key scoring components:

**REACH** - How many people will be affected
- Number of users or customers impacted
- Percentage of user base affected
- Market size and addressable audience
- Geographic and demographic reach
- Time period for impact measurement
- Frequency of user interaction
- Scope of feature or initiative exposure
- Viral or network effect potential

**IMPACT** - How much will it move the needle
- Business metric improvement potential
- User experience enhancement level
- Revenue or cost impact magnitude
- Strategic value and competitive advantage
- Customer satisfaction improvement
- Operational efficiency gains
- Risk mitigation and compliance value
- Innovation and learning potential

**CONFIDENCE** - How sure are we about our estimates
- Data quality and research backing
- Historical precedent and experience
- Market validation and user feedback
- Technical feasibility assessment
- Resource availability and capability
- External dependency reliability
- Assumption validation level
- Risk and uncertainty factors

**EFFORT** - How much work is required
- Development time and complexity
- Resource requirements and allocation
- Technical debt and infrastructure needs
- Design and research requirements
- Testing and quality assurance effort
- Deployment and rollout complexity
- Training and change management needs
- Ongoing maintenance and support

**RICE SCORE CALCULATION**
RICE Score = (Reach × Impact × Confidence) ÷ Effort

Structure your enhanced prompt to systematically evaluate and score initiatives using the RICE framework, enabling data-driven prioritization decisions.

Focus on creating objective, measurable assessments that can be compared across different types of initiatives and projects.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt as a valid XML document with RICE organization. Follow this structure:

<prompt>
    <context>Describe the product/initiative and prioritization context</context>
    <reach_assessment>
        <user_impact>Number and percentage of users affected</user_impact>
        <market_scope>Market size and addressable audience</market_scope>
        <interaction_frequency>How often users will encounter this</interaction_frequency>
        <time_period>Time frame for measuring reach impact</time_period>
        <reach_score>Quantified reach score (1-10 scale)</reach_score>
    </reach_assessment>
    <impact_evaluation>
        <business_metrics>Expected improvement in key business metrics</business_metrics>
        <user_experience>Level of UX enhancement and value</user_experience>
        <strategic_value>Competitive advantage and strategic importance</strategic_value>
        <financial_impact>Revenue, cost, or efficiency improvements</financial_impact>
        <impact_score>Quantified impact score (1-10 scale)</impact_score>
    </impact_evaluation>
    <confidence_analysis>
        <data_quality>Strength of supporting data and research</data_quality>
        <validation_level>Market and user validation evidence</validation_level>
        <feasibility_assessment>Technical and resource feasibility</feasibility_assessment>
        <risk_factors>Uncertainties and potential obstacles</risk_factors>
        <confidence_score>Confidence percentage (0-100%)</confidence_score>
    </confidence_analysis>
    <effort_estimation>
        <development_effort>Engineering time and complexity</development_effort>
        <resource_requirements>Team members and skills needed</resource_requirements>
        <infrastructure_needs>Technical debt and system requirements</infrastructure_needs>
        <additional_work>Design, research, testing, and deployment effort</additional_work>
        <effort_score>Total effort in person-months or story points</effort_score>
    </effort_estimation>
    <rice_calculation>
        <score_formula>RICE Score = (Reach × Impact × Confidence) ÷ Effort</score_formula>
        <final_score>Calculated RICE score for prioritization</final_score>
        <ranking_context>How this compares to other initiatives</ranking_context>
        <decision_factors>Additional qualitative factors to consider</decision_factors>
    </rice_calculation>
    <examples>
        <good_example>Provide a RICE-scored initiative example</good_example>
        <avoid_example>Provide an example lacking systematic RICE evaluation</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with RICE organization. Follow this structure:

{
  "context": "Describe the product/initiative and prioritization context",
  "rice_framework": {
    "reach": {
      "user_impact": "Number and percentage of users affected",
      "market_scope": "Market size and addressable audience",
      "interaction_frequency": "How often users will encounter this",
      "time_period": "Time frame for measuring reach impact",
      "reach_score": "Quantified reach score (1-10 scale)"
    },
    "impact": {
      "business_metrics": "Expected improvement in key business metrics",
      "user_experience": "Level of UX enhancement and value",
      "strategic_value": "Competitive advantage and strategic importance",
      "financial_impact": "Revenue, cost, or efficiency improvements",
      "impact_score": "Quantified impact score (1-10 scale)"
    },
    "confidence": {
      "data_quality": "Strength of supporting data and research",
      "validation_level": "Market and user validation evidence",
      "feasibility_assessment": "Technical and resource feasibility",
      "risk_factors": "Uncertainties and potential obstacles",
      "confidence_score": "Confidence percentage (0-100%)"
    },
    "effort": {
      "development_effort": "Engineering time and complexity",
      "resource_requirements": "Team members and skills needed",
      "infrastructure_needs": "Technical debt and system requirements",
      "additional_work": "Design, research, testing, and deployment effort",
      "effort_score": "Total effort in person-months or story points"
    },
    "rice_calculation": {
      "score_formula": "RICE Score = (Reach × Impact × Confidence) ÷ Effort",
      "final_score": "Calculated RICE score for prioritization",
      "ranking_context": "How this compares to other initiatives",
      "decision_factors": "Additional qualitative factors to consider"
    }
  },
  "examples": {
    "good_example": "Provide a RICE-scored initiative example",
    "avoid_example": "Provide an example lacking systematic RICE evaluation"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content.`;

export const riceTechnique = {
  value: 'rice',
  label: 'RICE Framework',
  icon: '🍚',
  description: 'Reach, Impact, Confidence, Effort - Product prioritization framework',
  category: 'general',
  systemPrompt: RICE_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return RICE_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return RICE_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return RICE_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const RICE_CONFIG = riceTechnique;
export { RICE_SYSTEM_PROMPT };
