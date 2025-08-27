import React from 'react';
import { Metadata } from 'next';
import { BlogPost } from '../_components/BlogPost';

const post = {
  id: '8',
  title: 'CRISPE Framework: Make Prompts Clear and Consistent',
  excerpt: 'Write precise, reliable prompts with CRISPE. Improve clarity, add parameters, and show examples for consistent AI outputs.',
  content: `
# CRISPE Framework: Make Prompts Clear and Consistent 🧼

**TL;DR**: CRISPE = Clarity + Relevance + Iteration + Specificity + Parameters + Examples. Perfect for precision tasks that need consistent, reliable outputs.

The CRISPE framework is a systematic approach to prompt engineering that emphasizes precision, clarity, and consistency. Developed for scenarios where output quality and reliability are critical, CRISPE helps you create prompts that deliver predictable results every time.

## What is CRISPE? 🧩

CRISPE stands for:
- **Clarity**: Unambiguous language and clear instructions
- **Relevance**: Include only information that matters
- **Iteration**: Build in feedback and refinement loops
- **Specificity**: Concrete details, metrics, and constraints
- **Parameters**: Explicit inputs, controls, and variables
- **Examples**: Positive and negative exemplars

## CRISPE Template 📋

\`\`\`
**Clarity**: [Clear, unambiguous instructions]
**Relevance**: [Only essential information]
**Iteration**: [Feedback and refinement process]
**Specificity**: [Concrete details and metrics]
**Parameters**: [Explicit controls and variables]
**Examples**: [Good and bad output samples]
\`\`\`

## When to Use CRISPE

| Scenario | Why CRISPE Works | Alternative |
|----------|------------------|-------------|
| **Data processing** | Parameters + examples ensure consistency | Custom scripts |
| **Content templates** | Specificity + iteration improve quality | Manual review |
| **Technical docs** | Clarity + relevance reduce confusion | Multiple drafts |
| **Automated workflows** | Parameters enable reusability | Hard-coded solutions |

## Practical Examples

### 1. Sales Email Generation
**Clarity**: "Generate a personalized sales email for B2B prospects"

**Relevance**: "Use only: prospect name, company, industry, pain point, and our solution benefit"

**Iteration**: "Ask 3 clarifying questions before generating: What's their current solution? What's their budget range? What's their decision timeline?"

**Specificity**: "Target: VP/Director level at 100-1000 employee companies. Length: 150-200 words. Include: personalized opening, specific pain point, one benefit, clear CTA."

**Parameters**: 
- tone: professional but conversational
- format: plain text email
- personalization_level: high
- cta_type: demo_request

**Examples**: 
- Good: "Hi [Name], I noticed [Company] recently expanded into [Market]. Many companies your size struggle with [Specific Pain Point]..."
- Bad: "Dear Sir/Madam, We have a great product that can help your business..."

### 2. Data Transformation Task
**Clarity**: "Convert customer data from CSV format to JSON with specific field mappings"

**Relevance**: "Process only: customer_id, name, email, signup_date, plan_type. Ignore: internal_notes, temp_fields"

**Iteration**: "Validate each record before conversion. Flag any missing required fields or invalid formats for manual review."

**Specificity**: "Input: CSV with 1000-5000 records. Output: Valid JSON array. Required fields: id, name, email. Optional: signup_date, plan_type."

**Parameters**:
- date_format: "YYYY-MM-DD"
- email_validation: true
- null_handling: "exclude_record"
- output_structure: "flat_array"

**Examples**:
- Good JSON: \`{"id": "12345", "name": "John Doe", "email": "john@company.com", "signup_date": "2024-01-15", "plan_type": "pro"}\`
- Bad JSON: \`{"customer_id": 12345, "full_name": null, "email_address": "invalid-email"}\`

### 3. Technical Documentation
**Clarity**: "Create API documentation for the user authentication endpoint"

**Relevance**: "Include: endpoint URL, HTTP methods, request/response formats, error codes, authentication requirements. Exclude: internal implementation details."

**Iteration**: "Review with development team before publishing. Update based on feedback and testing results."

**Specificity**: "Target audience: External developers with REST API experience. Format: Markdown with code examples. Length: 500-800 words per endpoint."

**Parameters**:
- code_language: "curl, JavaScript, Python"
- response_format: "JSON"
- error_detail_level: "user-friendly"
- example_complexity: "realistic_use_cases"

**Examples**:
- Good: Clear endpoint description, complete request/response examples, all possible error codes
- Bad: Vague descriptions, incomplete examples, missing error handling

## Best Practices ✅

### Clarity Guidelines
- Use active voice and specific verbs
- Avoid jargon unless defined
- Break complex instructions into steps
- Test instructions with someone unfamiliar with the task

### Relevance Filters
- List what to include explicitly
- List what to exclude explicitly
- Prioritize information by importance
- Remove redundant or conflicting details

### Iteration Strategies
- Build in checkpoints and validation
- Ask clarifying questions upfront
- Plan for feedback incorporation
- Set quality thresholds and retry logic

### Specificity Standards
- Use numbers, not ranges when possible
- Define success criteria measurably
- Specify formats, lengths, and structures
- Include edge cases and constraints

### Parameter Design
- Make all variables explicit
- Provide default values
- Document parameter interactions
- Enable easy customization

### Example Selection
- Show both positive and negative examples
- Cover edge cases and common mistakes
- Use realistic, not toy examples
- Update examples based on real outputs

{{CONTEXTUAL_CTA}}

## Common Anti-Patterns ❌

### Clarity Issues
- **Ambiguous pronouns**: "It should be clear" (what is "it"?)
- **Undefined terms**: "Make it professional" (define "professional")
- **Multiple interpretations**: "Optimize the content" (for what?)

### Relevance Problems
- **Information overload**: Including every possible detail
- **Missing context**: Assuming background knowledge
- **Conflicting requirements**: Contradictory instructions

### Iteration Failures
- **No feedback loops**: One-shot prompts for complex tasks
- **Unclear success criteria**: No way to measure quality
- **No refinement process**: Can't improve based on results

### Specificity Gaps
- **Vague quantities**: "Some examples" vs "3-5 examples"
- **Undefined formats**: "List format" vs "numbered list with descriptions"
- **Missing constraints**: No length, tone, or style guidelines

## CRISPE vs Other Frameworks

| Framework | Strength | Best Use Case |
|-----------|----------|---------------|
| **CRISPE** | Precision and consistency | Repeatable, quality-critical tasks |
| **CO-STAR** | Audience and tone focus | Professional communications |
| **STAR** | Action orientation | Workflow and process tasks |

## Advanced CRISPE Techniques

### Parameter Libraries
Create reusable parameter sets:
- **tone_professional**: formal, respectful, authoritative
- **format_email**: subject line, greeting, body, signature
- **length_brief**: 100-200 words, 2-3 paragraphs

### Example Databases
Maintain collections of good/bad examples:
- Categorized by task type
- Updated based on real outputs
- Annotated with quality criteria
- Version controlled for consistency

### Quality Scoring
Develop rubrics for output evaluation:
- Clarity score (1-10)
- Relevance score (1-10)
- Completeness score (1-10)
- Format compliance (pass/fail)

## FAQ

**Q: How many examples should I include?**
A: 2-3 positive examples and 1-2 negative examples usually work well. More for complex tasks.

**Q: CRISPE vs CO-STAR - which should I use?**
A: Use CRISPE for precision tasks, CO-STAR for audience-focused communications.

**Q: Can I skip the Iteration component?**
A: For simple tasks, yes. For complex or critical outputs, iteration is essential.

**Q: How detailed should Parameters be?**
A: Detailed enough that someone else could use your prompt and get similar results.

## Ready to Try CRISPE?

{{SOFT_CONCLUSION}}

## Related Reading

- [STAR Framework: Structured Workflows](/blog/mastering-star-framework)
- [CO-STAR Framework: Professional Communications](/blog/co-star-framework-prompts)
- [Tree of Thought: Complex Reasoning](/blog/advanced-tree-of-thought)

---

*Precision prompt templates with CRISPE methodology ➜ [Explore Quality Tools](/)*
  `,
  author: 'Mohammed Arafat Khot',
  publishedAt: '2025-08-12',
  readTime: '7 min read',
  category: 'Frameworks',
  tags: ['CRISPE', 'Clarity', 'Parameters', 'Examples'],
  featuredImage: '/blog/crispe-framework.jpg',
  slug: 'crispe-framework-prompts'
};

export const metadata: Metadata = {
  title: 'CRISPE Framework: Clarity, Relevance, Iteration, Specificity, Parameters, Examples | Prompt Enhancer Blog',
  description: 'Write precise, reliable prompts with CRISPE. Improve clarity, add parameters, and show examples for consistent AI outputs.',
  keywords: ['CRISPE prompt framework', 'clarity in prompts', 'parameterized prompts', 'prompt examples', 'consistent AI outputs'],
  authors: [{ name: 'Mohammed Arafat Khot' }],
  openGraph: {
    title: 'CRISPE Framework: Make Prompts Clear and Consistent',
    description: 'Write precise, reliable prompts with CRISPE. Improve clarity, add parameters, and show examples for consistent AI outputs.',
    type: 'article',
    url: '/blog/crispe-framework-prompts',
    images: [
      {
        url: '/blog/crispe-framework.jpg',
        width: 1200,
        height: 630,
        alt: 'CRISPE Framework for AI Prompts'
      }
    ],
    publishedTime: '2025-08-12',
    authors: ['Mohammed Arafat Khot']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRISPE Framework: Make Prompts Clear and Consistent',
    description: 'Write precise, reliable prompts with CRISPE. Improve clarity, add parameters, and show examples for consistent AI outputs.',
    images: ['/blog/crispe-framework.jpg']
  },
  alternates: {
    canonical: '/blog/crispe-framework-prompts'
  }
};

export default function CRISPEFrameworkPage() {
  return <BlogPost post={post} />;
}
