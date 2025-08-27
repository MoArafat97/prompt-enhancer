// Output Formats Index
// Handles different output format configurations and processing

import { OutputFormat } from '../types';

/**
 * Configuration for an output format
 */
export interface FormatConfig {
  value: OutputFormat;
  label: string;
  icon: string;
  description: string;
}

/**
 * Available output formats
 */
export const OUTPUT_FORMATS: FormatConfig[] = [
  {
    value: 'natural',
    label: 'Natural Language',
    icon: '💬',
    description: 'Human-readable enhanced prompt'
  },
  {
    value: 'json',
    label: 'JSON Format',
    icon: '{ }',
    description: 'Structured JSON output'
  },
  {
    value: 'xml',
    label: 'XML Format',
    icon: '</>',
    description: 'XML tagged format'
  }
];

/**
 * Format output text according to the specified format
 * @param text - The text to format
 * @param format - The desired output format
 * @returns The formatted text
 */
export function formatOutput(text: string, format: OutputFormat): string {
  switch (format) {
    case 'json':
      // Clean up the text and check if it's already structured JSON
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json') && cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(7, -3).trim();
      } else if (cleanedText.startsWith('```') && cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(3, -3).trim();
      }

      // Check if the cleaned text is already valid structured JSON
      try {
        const parsed = JSON.parse(cleanedText);

        // Check if it has the expected structured format (role, task, context, etc.)
        if (typeof parsed === 'object' && parsed !== null &&
            (parsed.role || parsed.task || parsed.context || parsed.requirements ||
             parsed.persona_details || parsed.reasoning_structure || parsed.examples ||
             parsed.creative_elements)) {
          // It's already structured JSON, return it formatted without any wrapper
          return JSON.stringify(parsed, null, 2);
        }
      } catch (e) {
        // Not valid JSON, continue with fallback
      }

      // If we reach here, the AI didn't generate proper structured JSON
      // This should not happen with the new JSON system prompts, but we'll keep a fallback
      // Return the text as-is and let the frontend handle it
      return cleanedText;
      
    case 'xml':
      // Clean up the text and extract XML content
      let xmlCleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (xmlCleanedText.startsWith('```xml') && xmlCleanedText.endsWith('```')) {
        xmlCleanedText = xmlCleanedText.slice(6, -3).trim();
      } else if (xmlCleanedText.startsWith('```') && xmlCleanedText.endsWith('```')) {
        xmlCleanedText = xmlCleanedText.slice(3, -3).trim();
      }

      // Check if the cleaned text is already XML-structured
      if (xmlCleanedText.startsWith('<?xml') || (xmlCleanedText.startsWith('<') && xmlCleanedText.includes('>'))) {
        // Add XML declaration if missing
        if (!xmlCleanedText.startsWith('<?xml')) {
          xmlCleanedText = `<?xml version="1.0" encoding="UTF-8"?>\n${xmlCleanedText}`;
        }
        return xmlCleanedText;
      } else {
        // Text is not XML-structured, wrap it in basic XML structure
        return `<?xml version="1.0" encoding="UTF-8"?>
<prompt>
  <enhanced><![CDATA[${xmlCleanedText}]]></enhanced>
  <metadata>
    <format>xml</format>
    <generated_at>${new Date().toISOString()}</generated_at>
  </metadata>
</prompt>`;
      }
      
    case 'natural':
    default:
      return text;
  }
}
