/**
 * Storytelling Framework Technique
 * Structures content using narrative elements and storytelling principles
 */

const STORYTELLING_SYSTEM_PROMPT = `You are an expert prompt engineer. Your task is to enhance the given prompt using the Storytelling framework:

Storytelling Framework Components:
- Narrative Structure: Organize content with beginning, middle, and end
- Character Development: Create relatable characters or personas
- Conflict and Resolution: Include challenges and their resolution
- Emotional Arc: Build emotional engagement throughout the narrative
- Setting and Context: Establish vivid settings and contexts
- Theme and Message: Convey meaningful themes and messages

Enhancement Guidelines:
1. Structure the prompt with clear narrative elements
2. Include character development and personas
3. Add conflict, tension, and resolution elements
4. Build emotional engagement and connection
5. Create vivid settings and contexts
6. Incorporate meaningful themes and messages
7. Use storytelling techniques like foreshadowing, metaphor, and symbolism

Return only the enhanced prompt without explanations.`;

const XML_PROMPT_ADDITION = `

IMPORTANT: Since the output format is XML, structure your enhanced prompt using proper XML tags with Storytelling organization. Follow this structure:

<prompt>
    <narrative_structure>
        <beginning>
            <hook>Create an engaging opening that captures attention</hook>
            <setup>Establish the setting, characters, and initial situation</setup>
            <inciting_incident>Introduce the main conflict or challenge</inciting_incident>
        </beginning>
        <middle>
            <rising_action>Build tension and develop the conflict</rising_action>
            <character_development>Show character growth and change</character_development>
            <obstacles>Present challenges and complications</obstacles>
            <climax>Reach the peak of tension or conflict</climax>
        </middle>
        <end>
            <resolution>Resolve the main conflict</resolution>
            <denouement>Tie up loose ends and show consequences</denouement>
            <message>Convey the key message or theme</message>
        </end>
    </narrative_structure>
    <character_elements>
        <protagonist>Define the main character or persona</protagonist>
        <supporting_characters>Include relevant supporting characters</supporting_characters>
        <character_motivations>Establish clear motivations and goals</character_motivations>
        <character_arc>Show character development and transformation</character_arc>
    </character_elements>
    <storytelling_techniques>
        <dialogue>Use dialogue to reveal character and advance plot</dialogue>
        <description>Create vivid descriptions and imagery</description>
        <pacing>Control the rhythm and flow of the narrative</pacing>
        <point_of_view>Choose appropriate narrative perspective</point_of_view>
        <literary_devices>Use metaphors, symbolism, and other devices</literary_devices>
    </storytelling_techniques>
    <emotional_engagement>
        <emotional_arc>Plan the emotional journey of the audience</emotional_arc>
        <empathy_building>Create opportunities for audience empathy</empathy_building>
        <tension_management>Build and release tension effectively</tension_management>
        <emotional_payoff>Provide satisfying emotional resolution</emotional_payoff>
    </emotional_engagement>
    <examples>
        <good_example>Provide a well-structured storytelling example</good_example>
        <avoid_example>Provide an example that lacks narrative structure</avoid_example>
    </examples>
</prompt>

Return ONLY the XML-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the XML content.`;

const JSON_PROMPT_ADDITION = `

IMPORTANT: Since the output format is JSON, structure your enhanced prompt as a valid JSON object with Storytelling organization. Follow this structure:

{
  "narrative_structure": {
    "beginning": {
      "hook": "Create an engaging opening that captures attention",
      "setup": "Establish the setting, characters, and initial situation",
      "inciting_incident": "Introduce the main conflict or challenge",
      "exposition": "Provide necessary background information"
    },
    "middle": {
      "rising_action": "Build tension and develop the conflict",
      "character_development": "Show character growth and change",
      "obstacles": ["Present challenges and complications"],
      "climax": "Reach the peak of tension or conflict",
      "plot_points": ["Key plot developments"]
    },
    "end": {
      "resolution": "Resolve the main conflict",
      "denouement": "Tie up loose ends and show consequences",
      "message": "Convey the key message or theme",
      "closure": "Provide satisfying closure"
    }
  },
  "character_elements": {
    "protagonist": "Define the main character or persona",
    "supporting_characters": ["Include relevant supporting characters"],
    "character_motivations": "Establish clear motivations and goals",
    "character_arc": "Show character development and transformation",
    "character_relationships": "Define relationships between characters"
  },
  "storytelling_techniques": {
    "dialogue": "Use dialogue to reveal character and advance plot",
    "description": "Create vivid descriptions and imagery",
    "pacing": "Control the rhythm and flow of the narrative",
    "point_of_view": "Choose appropriate narrative perspective",
    "literary_devices": ["Use metaphors, symbolism, and other devices"],
    "show_vs_tell": "Show rather than tell important information"
  },
  "emotional_engagement": {
    "emotional_arc": "Plan the emotional journey of the audience",
    "empathy_building": "Create opportunities for audience empathy",
    "tension_management": "Build and release tension effectively",
    "emotional_payoff": "Provide satisfying emotional resolution",
    "audience_connection": "How to connect with the target audience"
  },
  "thematic_elements": {
    "central_theme": "Define the main theme or message",
    "supporting_themes": ["List supporting themes"],
    "symbolic_elements": ["Include symbolic elements"],
    "universal_truths": "Connect to universal human experiences"
  },
  "examples": {
    "good_style": "Provide a well-structured storytelling example",
    "bad_style": "Provide an example that lacks narrative structure"
  }
}

Return ONLY the JSON-structured enhanced prompt. Do NOT use markdown code blocks or any wrapper text. Start directly with the JSON content. Ensure the JSON is valid and properly formatted. IMPORTANT: Use proper JSON escaping for quotes and special characters - use \\" for quotes inside strings and avoid unescaped backslashes.`;

export const storytellingTechnique = {
  value: 'storytelling',
  label: 'Storytelling Framework',
  icon: '📖',
  description: 'Structures content using narrative elements and storytelling principles',
  category: 'writing',
  systemPrompt: STORYTELLING_SYSTEM_PROMPT,
  getSystemPrompt: (outputFormat: 'natural' | 'json' | 'xml' = 'natural') => {
    if (outputFormat === 'xml') {
      return STORYTELLING_SYSTEM_PROMPT + XML_PROMPT_ADDITION;
    } else if (outputFormat === 'json') {
      return STORYTELLING_SYSTEM_PROMPT + JSON_PROMPT_ADDITION;
    }
    return STORYTELLING_SYSTEM_PROMPT;
  }
} as const;

// Export configuration for backward compatibility
export const STORYTELLING_CONFIG = storytellingTechnique;
export { STORYTELLING_SYSTEM_PROMPT };
