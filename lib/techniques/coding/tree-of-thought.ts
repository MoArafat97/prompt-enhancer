/**
 * Tree of Thought Framework Technique
 * Explores multiple reasoning paths and evaluates them systematically
 */

const TREE_OF_THOUGHT_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Tree of Thought framework:

Tree of Thought Framework Components:
- Thought Generation: Generate multiple possible reasoning paths or solutions
- Thought Evaluation: Assess the quality and viability of each thought
- Thought Selection: Choose the most promising thoughts to explore further
- Branching Logic: Create decision trees with multiple branches
- Backtracking: Return to previous nodes when paths prove unfruitful
- Systematic Exploration: Methodically explore the solution space

Enhancement Guidelines:
1. Structure the prompt to generate multiple alternative approaches
2. Include evaluation criteria for assessing different thoughts
3. Add branching logic to explore different solution paths
4. Include backtracking mechanisms for dead-end paths
5. Add systematic exploration strategies
6. Include thought comparison and selection processes
7. Ensure comprehensive coverage of the solution space

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Tree of Thought organization. Follow this structure:

<prompt>
    <thought_generation>
        <initial_thoughts>Generate multiple initial approaches or solutions</initial_thoughts>
        <branching_strategy>How to create branches from each initial thought</branching_strategy>
        <creativity_guidelines>How to ensure diverse and creative thinking</creativity_guidelines>
        <thought_diversity>Ensure thoughts cover different aspects and approaches</thought_diversity>
    </thought_generation>
    <thought_evaluation>
        <evaluation_criteria>
            <criterion>Feasibility assessment</criterion>
            <criterion>Quality measurement</criterion>
            <criterion>Potential effectiveness</criterion>
            <criterion>Resource requirements</criterion>
        </evaluation_criteria>
        <scoring_system>How to score and rank different thoughts</scoring_system>
        <comparative_analysis>How to compare thoughts against each other</comparative_analysis>
    </thought_evaluation>
    <thought_selection>
        <selection_strategy>How to choose the most promising thoughts</selection_strategy>
        <pruning_criteria>When to eliminate less promising branches</pruning_criteria>
        <exploration_depth>How deep to explore each branch</exploration_depth>
        <resource_allocation>How to allocate effort across different branches</resource_allocation>
    </thought_selection>
    <exploration_process>
        <systematic_approach>Step-by-step exploration methodology</systematic_approach>
        <backtracking_rules>When and how to backtrack to previous nodes</backtracking_rules>
        <convergence_criteria>When to stop exploring and converge on a solution</convergence_criteria>
        <documentation>How to document the exploration process</documentation>
    </exploration_process>
    <synthesis>
        <integration_strategy>How to integrate insights from different branches</integration_strategy>
        <final_selection>How to make the final solution selection</final_selection>
        <learning_capture>How to capture learnings from the exploration</learning_capture>
    </synthesis>
    <examples>
        <good_example>Provide a Tree of Thought example</good_example>
        <avoid_example>Provide an example that lacks systematic exploration</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Tree of Thought organization. Follow this structure:

{
  "thought_generation": {
    "initial_thoughts": "Generate multiple initial approaches or solutions",
    "branching_strategy": "How to create branches from each initial thought",
    "creativity_guidelines": "How to ensure diverse and creative thinking",
    "thought_diversity": "Ensure thoughts cover different aspects and approaches",
    "generation_techniques": ["List techniques for generating diverse thoughts"]
  },
  "thought_evaluation": {
    "evaluation_criteria": [
      "Feasibility assessment",
      "Quality measurement", 
      "Potential effectiveness",
      "Resource requirements",
      "Risk assessment"
    ],
    "scoring_system": "How to score and rank different thoughts",
    "comparative_analysis": "How to compare thoughts against each other",
    "evaluation_metrics": ["List specific metrics for evaluation"]
  },
  "thought_selection": {
    "selection_strategy": "How to choose the most promising thoughts",
    "pruning_criteria": "When to eliminate less promising branches",
    "exploration_depth": "How deep to explore each branch",
    "resource_allocation": "How to allocate effort across different branches",
    "selection_thresholds": "Minimum thresholds for thought selection"
  },
  "exploration_process": {
    "systematic_approach": "Step-by-step exploration methodology",
    "backtracking_rules": "When and how to backtrack to previous nodes",
    "convergence_criteria": "When to stop exploring and converge on a solution",
    "documentation": "How to document the exploration process",
    "iteration_strategy": "How to iterate through the thought tree"
  },
  "branching_logic": {
    "decision_points": "How to identify key decision points",
    "branch_creation": "How to create new branches systematically",
    "branch_management": "How to manage multiple active branches",
    "depth_vs_breadth": "How to balance depth vs breadth exploration"
  },
  "synthesis": {
    "integration_strategy": "How to integrate insights from different branches",
    "final_selection": "How to make the final solution selection",
    "learning_capture": "How to capture learnings from the exploration",
    "solution_refinement": "How to refine the selected solution"
  },
  "examples": {
    "good_style": "Provide a Tree of Thought example",
    "bad_style": "Provide an example that lacks systematic exploration"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const treeOfThoughtTechnique = {
  value: 'tree-of-thought',
  label: 'Tree of Thought',
  icon: '🌳',
  description: 'Explores multiple reasoning paths and evaluates them systematically',
  category: 'coding',
  systemPrompt: TREE_OF_THOUGHT_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return TREE_OF_THOUGHT_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return TREE_OF_THOUGHT_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return TREE_OF_THOUGHT_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const TREE_OF_THOUGHT_CONFIG = treeOfThoughtTechnique;
export { TREE_OF_THOUGHT_SYSTEM_PROMPT };
