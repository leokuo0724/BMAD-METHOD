# Analyze Architecture Workflow Validation Checklist

## Pre-Execution Validation

- [ ] Configuration file `bmad/sdd/config.yaml` exists
- [ ] `tech_architecture_doc_path` is configured in config.yaml
- [ ] Target project/directory for analysis is accessible
- [ ] User has specified analysis scope clearly (full project / layer / specific implementation)

## Scope Selection

- [ ] User selected appropriate analysis scope
- [ ] Target layer identified (fe/, be/, db/, infra/, shared/, other)
- [ ] Specific implementation description provided (if applicable)
- [ ] Target directory correctly determined

## Analysis Phase

- [ ] Codebase scan completed for target scope
- [ ] Patterns and conventions identified
- [ ] Dependencies and libraries catalogued
- [ ] Related implementations found and analyzed
- [ ] Relatedness criteria applied correctly:
  - [ ] > 70% shared logic → MERGE recommendation
  - [ ] 50-70% shared logic → ASK USER
  - [ ] <50% shared logic → SEPARATE recommendation

## Documentation Plan

- [ ] AI proposed documentation structure with filenames
- [ ] Filenames are descriptive and follow kebab-case
- [ ] Layer structure is appropriate (fe/, be/, db/, etc.)
- [ ] Flat structure by default (subfolders only if user requested)
- [ ] Merge/separate decisions are justified with % shared logic
- [ ] Estimated content length is reasonable (50-300 lines per file)
- [ ] User reviewed and confirmed or edited the plan

## overview.md Generation

- [ ] High-level architecture description is concise (3-5 paragraphs max)
- [ ] Tech stack information is accurate and complete
- [ ] Architectural style identified (monolith, microservices, etc.)
- [ ] Key patterns documented (top 3-5)
- [ ] Documentation index includes all generated/planned files
- [ ] Index organized by layers (fe/, be/, db/, etc.)
- [ ] "How to Use" section explains progressive documentation
- [ ] "Last Updated" timestamp is current
- [ ] Content is concise and focused on AI-useful information

## Generated Documentation Files

### Structure Validation

- [ ] Each file follows standard structure:
  - [ ] Title and metadata (Last Updated, Layer, Related Files)
  - [ ] Overview section (2-3 sentences)
  - [ ] Key Patterns section (bullet points)
  - [ ] Dependencies section (libraries, hooks, utilities)
  - [ ] Usage Example (concise, 10-20 lines max)
  - [ ] Gotchas section (common pitfalls)
  - [ ] Related Implementations (links to other docs)
  - [ ] Footer with workflow attribution

### Content Quality

- [ ] Content is concise and focused on AI-useful patterns
- [ ] Includes: Coding patterns, common utilities, API conventions
- [ ] Includes: Gotchas, dependencies, concise examples
- [ ] Excludes: Full source code, historical evolution
- [ ] Excludes: Verbose explanations, design discussions
- [ ] Excludes: Multiple redundant examples
- [ ] Information is actionable for AI implementation
- [ ] Patterns are clearly explained with sufficient context

### Length Targets

- [ ] Simple implementations: 50-100 lines
- [ ] Medium complexity: 100-200 lines
- [ ] Complex implementations: 200-300 lines
- [ ] Warning given if >300 lines (suggest splitting)

### Code Examples

- [ ] Examples are concise (10-20 lines maximum)
- [ ] Examples demonstrate key patterns only (not full implementation)
- [ ] Code blocks have proper language tags
- [ ] Examples are accurate and follow project conventions

## File Management

- [ ] Directories created as needed ({tech_architecture_doc_path}/{{layer}}/)
- [ ] Existing files handled appropriately:
  - [ ] Overwrite with backup (.backup extension) if selected
  - [ ] Merge preserving relevant content if selected
  - [ ] Skip unchanged if selected
  - [ ] Compare shown first if selected
- [ ] All files saved to correct paths
- [ ] File permissions are appropriate

## Index Updates

- [ ] overview.md index updated with new documentation
- [ ] Index entries in appropriate layer sections
- [ ] Index alphabetically sorted within each layer
- [ ] Brief descriptions are concise (one line each)
- [ ] "Last Updated" timestamp updated
- [ ] All links work correctly (relative paths)

## Documentation Structure Validation

- [ ] Follows progressive documentation principle (incremental additions)
- [ ] Layer organization is logical (fe/, be/, db/, infra/, shared/)
- [ ] Structure is flat by default (unless user created subfolders)
- [ ] File naming is consistent and descriptive
- [ ] Related documents are properly cross-linked
- [ ] Structure supports easy future extensions

## Quality Assurance

- [ ] No spelling errors in generated content
- [ ] Markdown formatting is correct throughout
- [ ] Code blocks properly formatted with language tags
- [ ] Links between documents work correctly
- [ ] File paths are absolute and correct
- [ ] No placeholder text or TODO markers remain
- [ ] Generated content is genuinely useful for AI implementation
- [ ] Content passes conciseness test (no verbosity)

## #yolo Mode Compliance

- [ ] If #yolo active: All confirmations skipped appropriately
- [ ] If #yolo active: Default choices applied (Overwrite with backup)
- [ ] If normal mode: User confirmations obtained at key decision points
- [ ] Mode behavior consistent throughout execution

## User Experience

- [ ] Workflow principles explained clearly at start
- [ ] Progressive documentation concept communicated
- [ ] User given appropriate choices at decision points
- [ ] Communication in {communication_language}
- [ ] Progress indicated throughout workflow
- [ ] File save confirmations displayed (✓ Saved {{filename}}.md)

## Completion Summary

- [ ] Comprehensive summary displayed
- [ ] All generated files listed with line counts
- [ ] Documentation structure tree shown
- [ ] Total file count and line count displayed
- [ ] Location confirmed ({tech_architecture_doc_path})
- [ ] Next steps provided:
  - [ ] Review documentation instructions
  - [ ] Usage in dev workflows explained
  - [ ] Progressive documentation guidance
  - [ ] Team sharing suggestions
- [ ] Configuration path mentioned (bmad/sdd/config.yaml)
- [ ] Option to analyze more, exit, or view docs offered

## Progressive Documentation Ready

- [ ] Documentation can be easily extended with future runs
- [ ] Structure supports incremental additions
- [ ] Index makes navigation easy for humans and AI
- [ ] Instructions for adding more documentation provided
- [ ] Workflow can be re-run for additional implementations
- [ ] Existing files can be merged or overwritten as needed

## Integration with Development Workflows

- [ ] Documentation is ready for use in dev-flow workflow
- [ ] Documentation is ready for use in create-tech-spec workflow
- [ ] Path configured correctly in bmad/sdd/config.yaml
- [ ] Documentation format is AI-friendly
- [ ] Content provides sufficient context for implementation

## Critical Issues Check

**If any of these are found, workflow execution should be corrected:**

- ❌ Generic or placeholder content in documents
- ❌ Incorrect technology stack identification
- ❌ Missing key architectural patterns
- ❌ Broken references between documents
- ❌ Files not saved to configured path
- ❌ User-selected documents not generated
- ❌ Incomplete document sections
- ❌ Verbose content (>300 lines without justification)
- ❌ Full source code instead of concise examples
- ❌ Missing gotchas or dependencies
- ❌ No actionable patterns for AI implementation
