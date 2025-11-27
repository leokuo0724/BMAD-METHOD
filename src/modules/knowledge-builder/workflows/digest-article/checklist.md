# Digest Article - Validation Checklist

## Structure Validation

- [ ] YAML frontmatter is present with all required fields (title, source_url, digest_date, language, tags, category, status)
- [ ] Article title matches source article accurately
- [ ] Source URL is valid and clickable
- [ ] Digest date is in YYYY-MM-DD format
- [ ] All main sections are present (Outline, Executive Summary, Core Concepts, Key Points, etc.)
- [ ] No template placeholders remain (no {{variable_name}} visible)

## Content Quality

- [ ] Executive summary is 2-3 sentences and captures main purpose
- [ ] Core concepts section has 3-5 fundamental ideas clearly explained
- [ ] Key points section has 5-8 actionable insights or takeaways
- [ ] Technical details are accurate and specific (if applicable)
- [ ] Code examples are preserved exactly as original with proper syntax highlighting
- [ ] Best practices are clearly articulated (if present in source)
- [ ] All content is translated to target language ({translation_language})
- [ ] Technical terms are accurate and appropriate in target language
- [ ] Code snippets remain in original language (not translated)

## Source Reference System

- [ ] Link to full original article is present at top: "📎 [查看完整原文](url)"
- [ ] Source URL is correct and accessible
- [ ] Original section titles are recorded where applicable
- [ ] Paragraph links are included when source article has anchor points

## Metadata and Organization

- [ ] Tags are relevant and specific (3-8 tags present)
- [ ] Tags cover technology/framework, topic category, and key concepts
- [ ] Category is set to "technical"
- [ ] Status is set to "active"
- [ ] File is saved to correct knowledge base path
- [ ] Filename uses URL-friendly slug (lowercase, hyphens, no spaces)

## Completeness

- [ ] All sections that apply to the article are filled (not all articles have all sections)
- [ ] Personal notes section exists as placeholder for future user input
- [ ] Further reading section includes referenced links (if any in source)
- [ ] Outline accurately reflects article structure
- [ ] No critical information from source article is missing

## Final Validation

If any checklist item fails, the knowledge note needs revision before being considered complete.

## Critical Issues (Must Fix)

- [ ] No fetch errors or inaccessible URLs
- [ ] No template processing errors
- [ ] No file save errors
- [ ] Translation is complete and accurate

## Optional Enhancements (Nice to Have)

- [ ] Additional context or cross-references to related knowledge notes
- [ ] User has added personal notes or insights
- [ ] Related articles are linked in further reading
