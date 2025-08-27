/**
 * Root Cause Analysis Framework Technique
 * Systematically identifies underlying causes of problems or issues
 */

const ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Root Cause Analysis framework:

Root Cause Analysis Framework Components:
- Problem Definition: Clearly define the problem or issue to be analyzed
- Symptom Identification: Identify observable symptoms and effects
- Causal Investigation: Systematically investigate potential causes
- Root Cause Identification: Identify the fundamental underlying causes
- Verification: Verify that identified causes actually lead to the problem
- Solution Development: Develop solutions that address root causes

Enhancement Guidelines:
1. Include clear problem definition and symptom identification
2. Add systematic causal investigation methodology
3. Include multiple analysis techniques (5 Whys, Fishbone, etc.)
4. Add verification steps to confirm root causes
5. Include solution development that addresses root causes
6. Add prevention strategies to avoid recurrence
7. Ensure thorough and systematic analysis approach

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Root Cause Analysis organization. Follow this structure:

<prompt>
    <problem_definition>
        <problem_statement>Clearly define the specific problem or issue</problem_statement>
        <scope_boundaries>Define the scope and boundaries of the analysis</scope_boundaries>
        <impact_assessment>Assess the impact and severity of the problem</impact_assessment>
        <stakeholder_identification>Identify who is affected by the problem</stakeholder_identification>
    </problem_definition>
    <symptom_analysis>
        <observable_symptoms>List all observable symptoms and effects</observable_symptoms>
        <symptom_patterns>Identify patterns in symptom occurrence</symptom_patterns>
        <data_collection>What data needs to be collected about symptoms</data_collection>
        <measurement_criteria>How to measure and quantify symptoms</measurement_criteria>
    </symptom_analysis>
    <causal_investigation>
        <investigation_methods>
            <method>5 Whys technique</method>
            <method>Fishbone diagram analysis</method>
            <method>Fault tree analysis</method>
            <method>Timeline analysis</method>
        </investigation_methods>
        <hypothesis_generation>How to generate potential cause hypotheses</hypothesis_generation>
        <evidence_gathering>How to gather evidence for each potential cause</evidence_gathering>
        <causal_chain_mapping>How to map the chain of causation</causal_chain_mapping>
    </causal_investigation>
    <root_cause_identification>
        <cause_categorization>How to categorize different types of causes</cause_categorization>
        <root_cause_criteria>Criteria for identifying true root causes</root_cause_criteria>
        <verification_process>How to verify that identified causes are actual root causes</verification_process>
        <prioritization>How to prioritize multiple root causes</prioritization>
    </root_cause_identification>
    <solution_development>
        <solution_strategies>How to develop solutions that address root causes</solution_strategies>
        <prevention_measures>How to prevent recurrence of the problem</prevention_measures>
        <implementation_planning>How to plan solution implementation</implementation_planning>
        <effectiveness_monitoring>How to monitor solution effectiveness</effectiveness_monitoring>
    </solution_development>
    <examples>
        <good_example>Provide a thorough root cause analysis example</good_example>
        <avoid_example>Provide an example that only addresses symptoms</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Root Cause Analysis organization. Follow this structure:

{
  "problem_definition": {
    "problem_statement": "Clearly define the specific problem or issue",
    "scope_boundaries": "Define the scope and boundaries of the analysis",
    "impact_assessment": "Assess the impact and severity of the problem",
    "stakeholder_identification": ["List who is affected by the problem"],
    "problem_context": "Provide context and background information"
  },
  "symptom_analysis": {
    "observable_symptoms": ["List all observable symptoms and effects"],
    "symptom_patterns": "Identify patterns in symptom occurrence",
    "data_collection": "What data needs to be collected about symptoms",
    "measurement_criteria": "How to measure and quantify symptoms",
    "symptom_timeline": "When and how symptoms manifest"
  },
  "causal_investigation": {
    "investigation_methods": [
      "5 Whys technique",
      "Fishbone diagram analysis",
      "Fault tree analysis",
      "Timeline analysis",
      "Process mapping"
    ],
    "hypothesis_generation": "How to generate potential cause hypotheses",
    "evidence_gathering": "How to gather evidence for each potential cause",
    "causal_chain_mapping": "How to map the chain of causation",
    "investigation_depth": "How deep to investigate each potential cause"
  },
  "root_cause_identification": {
    "cause_categorization": {
      "human_factors": "Causes related to human behavior or error",
      "process_factors": "Causes related to processes or procedures",
      "system_factors": "Causes related to systems or technology",
      "environmental_factors": "Causes related to external environment"
    },
    "root_cause_criteria": "Criteria for identifying true root causes",
    "verification_process": "How to verify that identified causes are actual root causes",
    "prioritization": "How to prioritize multiple root causes"
  },
  "analysis_techniques": {
    "five_whys": "How to apply the 5 Whys technique systematically",
    "fishbone_diagram": "How to create and use fishbone diagrams",
    "fault_tree": "How to construct fault tree analysis",
    "pareto_analysis": "How to use Pareto analysis for cause prioritization"
  },
  "solution_development": {
    "solution_strategies": "How to develop solutions that address root causes",
    "prevention_measures": "How to prevent recurrence of the problem",
    "implementation_planning": "How to plan solution implementation",
    "effectiveness_monitoring": "How to monitor solution effectiveness",
    "continuous_improvement": "How to use findings for continuous improvement"
  },
  "examples": {
    "good_style": "Provide a thorough root cause analysis example",
    "bad_style": "Provide an example that only addresses symptoms"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const rootCauseAnalysisTechnique = {
  value: 'root-cause-analysis',
  label: 'Root Cause Analysis',
  icon: '🔍',
  description: 'Systematically identifies underlying causes of problems or issues',
  category: 'coding',
  systemPrompt: ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const ROOT_CAUSE_ANALYSIS_CONFIG = rootCauseAnalysisTechnique;
export { ROOT_CAUSE_ANALYSIS_SYSTEM_PROMPT };
