/**
 * SCAMPER Framework Technique
 * Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse
 */

const SCAMPER_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the SCAMPER framework:

SCAMPER Framework Components:
- Substitute: What can be substituted or replaced?
- Combine: What can be combined or merged?
- Adapt: What can be adapted from elsewhere?
- Modify: What can be modified, magnified, or minimized?
- Put to other uses: How can this be used differently?
- Eliminate: What can be removed or simplified?
- Reverse: What can be reversed, rearranged, or inverted?

Enhancement Guidelines:
1. Apply each SCAMPER technique to explore creative alternatives
2. Generate multiple options for each SCAMPER category
3. Encourage systematic creative exploration
4. Include specific questions for each SCAMPER element
5. Promote innovative thinking and problem-solving
6. Combine SCAMPER insights for novel solutions
7. Use SCAMPER to break conventional thinking patterns

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with SCAMPER organization. Follow this structure:

<prompt>
    <substitute>
        <substitution_opportunities>What elements can be substituted or replaced?</substitution_opportunities>
        <alternative_materials>What alternative materials, methods, or approaches could be used?</alternative_materials>
        <replacement_options>What could be used instead of current components?</replacement_options>
        <substitution_benefits>What benefits would substitutions provide?</substitution_benefits>
    </substitute>
    <combine>
        <combination_possibilities>What elements can be combined or merged?</combination_possibilities>
        <synergy_opportunities>What combinations would create synergy?</synergy_opportunities>
        <integration_strategies>How can different elements be integrated?</integration_strategies>
        <hybrid_solutions>What hybrid approaches could be created?</hybrid_solutions>
    </combine>
    <adapt>
        <adaptation_sources>What can be adapted from other contexts or industries?</adaptation_sources>
        <analogous_solutions>What analogous solutions exist elsewhere?</analogous_solutions>
        <cross_pollination>How can ideas from other fields be applied?</cross_pollination>
        <adaptation_modifications>What modifications are needed for adaptation?</adaptation_modifications>
    </adapt>
    <modify>
        <magnification_options>What can be magnified, enlarged, or emphasized?</magnification_options>
        <minimization_options>What can be minimized, reduced, or simplified?</minimization_options>
        <enhancement_opportunities>What can be enhanced or improved?</enhancement_opportunities>
        <transformation_possibilities>How can elements be transformed?</transformation_possibilities>
    </modify>
    <put_to_other_uses>
        <alternative_applications>How can this be used for different purposes?</alternative_applications>
        <new_contexts>In what new contexts could this be applied?</new_contexts>
        <repurposing_opportunities>What repurposing opportunities exist?</repurposing_opportunities>
        <unconventional_uses>What unconventional uses are possible?</unconventional_uses>
    </put_to_other_uses>
    <eliminate>
        <removal_candidates>What can be removed or eliminated?</removal_candidates>
        <simplification_opportunities>What can be simplified?</simplification_opportunities>
        <unnecessary_elements>What elements are unnecessary?</unnecessary_elements>
        <streamlining_options>How can the process be streamlined?</streamlining_options>
    </eliminate>
    <reverse>
        <reversal_opportunities>What can be reversed or inverted?</reversal_opportunities>
        <rearrangement_options>What can be rearranged or reordered?</rearrangement_options>
        <opposite_approaches>What would the opposite approach look like?</opposite_approaches>
        <perspective_shifts>How can perspectives be shifted or flipped?</perspective_shifts>
    </reverse>
    <creative_synthesis>
        <idea_combination>How can SCAMPER insights be combined?</idea_combination>
        <innovative_solutions>What innovative solutions emerge from SCAMPER analysis?</innovative_solutions>
        <breakthrough_potential>What breakthrough opportunities are identified?</breakthrough_potential>
    </creative_synthesis>
    <examples>
        <good_example>Provide a comprehensive SCAMPER example</good_example>
        <avoid_example>Provide an example that lacks creative exploration</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with SCAMPER organization. Follow this structure:

{
  "substitute": {
    "substitution_opportunities": "What elements can be substituted or replaced?",
    "alternative_materials": ["What alternative materials, methods, or approaches could be used?"],
    "replacement_options": ["What could be used instead of current components?"],
    "substitution_benefits": "What benefits would substitutions provide?",
    "substitution_criteria": "Criteria for evaluating substitution options"
  },
  "combine": {
    "combination_possibilities": "What elements can be combined or merged?",
    "synergy_opportunities": ["What combinations would create synergy?"],
    "integration_strategies": "How can different elements be integrated?",
    "hybrid_solutions": ["What hybrid approaches could be created?"],
    "combination_benefits": "Benefits of combining elements"
  },
  "adapt": {
    "adaptation_sources": ["What can be adapted from other contexts or industries?"],
    "analogous_solutions": ["What analogous solutions exist elsewhere?"],
    "cross_pollination": "How can ideas from other fields be applied?",
    "adaptation_modifications": "What modifications are needed for adaptation?",
    "adaptation_success_factors": "What makes adaptations successful?"
  },
  "modify": {
    "magnification_options": ["What can be magnified, enlarged, or emphasized?"],
    "minimization_options": ["What can be minimized, reduced, or simplified?"],
    "enhancement_opportunities": ["What can be enhanced or improved?"],
    "transformation_possibilities": "How can elements be transformed?",
    "modification_impact": "Impact assessment of modifications"
  },
  "put_to_other_uses": {
    "alternative_applications": ["How can this be used for different purposes?"],
    "new_contexts": ["In what new contexts could this be applied?"],
    "repurposing_opportunities": ["What repurposing opportunities exist?"],
    "unconventional_uses": ["What unconventional uses are possible?"],
    "use_case_expansion": "How to expand use cases systematically"
  },
  "eliminate": {
    "removal_candidates": ["What can be removed or eliminated?"],
    "simplification_opportunities": ["What can be simplified?"],
    "unnecessary_elements": ["What elements are unnecessary?"],
    "streamlining_options": "How can the process be streamlined?",
    "elimination_benefits": "Benefits of elimination and simplification"
  },
  "reverse": {
    "reversal_opportunities": ["What can be reversed or inverted?"],
    "rearrangement_options": ["What can be rearranged or reordered?"],
    "opposite_approaches": "What would the opposite approach look like?",
    "perspective_shifts": ["How can perspectives be shifted or flipped?"],
    "reversal_insights": "Insights gained from reversal thinking"
  },
  "creative_synthesis": {
    "idea_combination": "How can SCAMPER insights be combined?",
    "innovative_solutions": ["What innovative solutions emerge from SCAMPER analysis?"],
    "breakthrough_potential": "What breakthrough opportunities are identified?",
    "synthesis_methodology": "How to synthesize SCAMPER insights effectively"
  },
  "examples": {
    "good_style": "Provide a comprehensive SCAMPER example",
    "bad_style": "Provide an example that lacks creative exploration"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const scamperTechnique = {
  value: 'scamper',
  label: 'SCAMPER Framework',
  icon: '🔧',
  description: 'Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse',
  category: 'writing',
  systemPrompt: SCAMPER_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return SCAMPER_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return SCAMPER_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return SCAMPER_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const SCAMPER_CONFIG = scamperTechnique;
export { SCAMPER_SYSTEM_PROMPT };
