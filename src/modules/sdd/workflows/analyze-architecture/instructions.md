# Analyze Architecture Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/analyze-architecture/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>Content MUST be concise - only include context useful for AI implementation</critical>

<workflow>

<step n="1" goal="Determine analysis scope">
<action>Welcome {user_name} to the Analyze Architecture workflow</action>

<action>Explain workflow purpose in {communication_language}:

This workflow generates focused, concise architecture documentation that helps AI understand your codebase patterns.

Key principles:

- Progressive documentation (analyze what you need, when you need it)
- Concise content (only patterns and context useful for AI implementation)
- Flexible structure (organized by layers: fe/, be/, db/, etc.)
- Easy to extend (add more documentation over time)

Documentation will be saved to: {tech_architecture_doc_path}</action>

<ask>What would you like to analyze?

1. **Entire Project** - Generate high-level overview of the whole codebase
2. **Specific Layer** - Focus on frontend, backend, database, or infrastructure
3. **Specific Implementation** - Analyze a particular component, API, service, or feature

Select [1/2/3]:</ask>

<action>Store selection as {{analysis_scope_type}}</action>

<check if="analysis_scope_type == 2">
  <ask>Which layer would you like to analyze?

Options:

- Frontend (fe/)
- Backend (be/)
- Database (db/)
- Infrastructure (infra/)
- Shared/Utils (shared/)
- Other (please specify)

Enter layer name or choose from options:</ask>

<action>Store as {{target_layer}}</action>
<action>Set {{target_directory}} based on layer (e.g., "src/components" for frontend)</action>
</check>

<check if="analysis_scope_type == 3">
  <ask>Please describe the specific implementation you want to analyze:

Examples:

- "Dropdown component"
- "User authentication API"
- "Zustand state management"
- "AG Grid table implementation"

Your description:</ask>

<action>Store as {{specific_implementation}}</action>
<action>Based on description, infer {{target_layer}} (fe/be/db/etc.) and {{target_directory}}</action>
</check>

<check if="analysis_scope_type == 1">
  <action>Set {{analysis_scope}} = "full_project"</action>
  <action>Set {{target_directory}} = project root</action>
</check>

<template-output>scope_selection</template-output>
</step>

<step n="2" goal="Analyze codebase and propose documentation plan">
<action>Perform targeted codebase analysis based on {{analysis_scope_type}}:

**Scan Scope:**

- If full_project: Scan entire codebase at high level
- If specific_layer: Deep scan of {{target_layer}} directory
- If specific_implementation: Focused scan on {{specific_implementation}} and related files

**Analysis Focus:**

1. Identify files and directories relevant to scope
2. Detect patterns, conventions, and common utilities
3. Identify dependencies and libraries used
4. Analyze code structure and organization
5. Find related implementations (for grouping decisions)

**Conciseness Filter:**

- Extract ONLY patterns useful for AI implementation
- Ignore historical context, design discussions, verbose explanations
- Focus on: patterns, conventions, gotchas, dependencies, key examples</action>

<action>Identify related implementations and suggest grouping:

**Relatedness Criteria:**

- Share >50% of patterns, hooks, utilities
- Use same libraries/frameworks
- Similar API design
- Part of same feature area

**Grouping Decision:**

- MERGE if highly related (>70% shared logic)
- SEPARATE if different implementations (<50% shared logic)
- ASK USER if borderline (50-70% shared logic)</action>

<action>Propose documentation structure:

**For full_project:**

```
{tech_architecture_doc_path}/
└── overview.md (high-level architecture + index)
```

**For specific_layer (e.g., frontend):**

```
{tech_architecture_doc_path}/
├── overview.md (update index)
└── fe/
    ├── coding-convention.md
    ├── component-dropdown.md
    └── state-zustand.md
```

**For specific_implementation:**

```
{tech_architecture_doc_path}/
├── overview.md (update index)
└── {{layer}}/
    └── {{suggested_filename}}.md
```

Generate suggested filenames based on:

- Implementation name (kebab-case)
- Category prefix if helpful (component-, api-, service-, util-)
- Descriptive but concise</action>

<action>Display analysis summary and documentation plan in {communication_language}:

Format:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Analysis Complete - Documentation Plan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Scope:** {{analysis_scope_description}}

**Detected Implementations:**
✓ Implementation 1 (using Library X)
✓ Implementation 2 (using Library X)
✓ Implementation 3 (using Library Y)

**Relatedness Analysis:**

- Implementation 1 & 2: Share 80% logic → SUGGEST MERGE
- Implementation 3: Independent → SEPARATE

**Proposed Documentation:**

{tech_architecture_doc_path}/
{{#if update_overview}}
├── overview.md (will be updated)
{{/if}}
└── {{target_layer}}/
├── {{filename_1}}.md (Implementation 1 + 2 merged)
└── {{filename_2}}.md (Implementation 3)

**Estimated Content:**

- {{filename_1}}.md: ~150 lines (concise patterns + examples)
- {{filename_2}}.md: ~100 lines (concise patterns + examples)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<ask if="#yolo mode NOT active">Review this documentation plan:

Options:

- [Enter] Confirm and proceed
- [e] Edit (change filenames, structure, merge/separate decisions)
- [r] Reanalyze with different scope

Your choice:</ask>

<check if="user_choice == 'e'">
  <ask>What would you like to change?

You can:

1. Rename files (e.g., "rename {{filename_1}} to component-form-controls")
2. Change structure (e.g., "create subfolder fe/components/")
3. Split merged files (e.g., "separate Implementation 1 and 2")
4. Merge separate files (e.g., "merge {{filename_1}} and {{filename_2}}")

Your changes:</ask>

<action>Apply user's changes to documentation plan</action>
<action>Display updated plan</action>
<goto step="2">Return to plan confirmation</goto>
</check>

<check if="user_choice == 'r'">
  <goto step="1">Return to scope selection</goto>
</check>

<action>Finalize documentation plan and store as {{documentation_plan}}</action>

<template-output>documentation_plan</template-output>
</step>

<step n="3" goal="Generate or update overview.md">
<check if="overview.md exists at {tech_architecture_doc_path}/overview.md">
  <action>Load existing overview.md</action>
  <action>Determine update strategy: Add new section or update existing index</action>
</check>

<check if="overview.md does NOT exist">
  <action>Plan to create new overview.md with:

# Architecture Documentation

**Last Updated:** {date}
**Project:** {{project_name}}

## High-Level Architecture

[Concise description - 3-5 paragraphs maximum]

**Tech Stack:**

- Frontend: {{frontend_stack}}
- Backend: {{backend_stack}}
- Database: {{database_stack}}
- Infrastructure: {{infra_stack}}

**Architectural Style:** {{arch_style}} (e.g., monolith, microservices, serverless)

**Key Patterns:**

- {{pattern_1}}
- {{pattern_2}}
- {{pattern_3}}

## Documentation Index

{{#each layers}}

### {{layer_name}}

{{#each documents}}

- [{{doc_title}}](./{{layer}}/{{filename}}.md) - {{brief_description}}
  {{/each}}
  {{/each}}

## How to Use

**For AI Implementation:**
Reference relevant docs when implementing features to follow established patterns.

**For Progressive Documentation:**
Run `workflow analyze-architecture` to add more documentation as needed.

</action>
</check>

<action>Generate or update overview.md content:

**If creating:** Generate full overview based on analysis
**If updating:** Add new entries to index section, update "Last Updated" timestamp

Keep content concise - focus on information useful for AI context.</action>

<action>Display overview.md preview to user</action>

<ask if="#yolo mode NOT active">Review overview.md:

[Enter] Save and continue
[r] Regenerate
[e] I'll edit manually

Your choice:</ask>

<check if="user_choice == 'r'">
  <action>Regenerate overview.md with user feedback</action>
  <goto step="3">Return to overview review</goto>
</check>

<action>Save overview.md to {tech_architecture_doc_path}/overview.md</action>

<template-output>overview_document</template-output>
</step>

<step n="4" goal="Generate documentation files" repeat="for-each-file-in-plan">
<action>For each file in {{documentation_plan}}:</action>

<action>Extract target file path: {{file_path}} = {tech_architecture_doc_path}/{{layer}}/{{filename}}.md</action>

<check if="file exists at {{file_path}}">
  <ask if="#yolo mode NOT active">The file {{filename}}.md already exists. How should I proceed?

1. **Overwrite** - Replace with new content (backup saved as .backup)
2. **Merge** - Combine new analysis with existing content
3. **Skip** - Keep existing file unchanged
4. **Compare** - Show differences first

Select [1/2/3/4]:</ask>

<action if="#yolo mode active">Default to option 1 (Overwrite with backup)</action>

  <action if="user selected 4 (Compare)">
    <action>Generate new content</action>
    <action>Display side-by-side comparison</action>
    <ask>After reviewing, select: [1] Overwrite / [2] Merge / [3] Skip</ask>
  </action>

  <check if="user selected 3 (Skip)">
    <action>Skip this file and continue to next</action>
    <goto step="4">Next file in plan</goto>
  </check>
</check>

<action>Perform deep analysis for {{filename}}:

**Analysis Process:**

1. Scan all files related to this implementation
2. Extract patterns, conventions, common utilities
3. Identify key dependencies and libraries
4. Find gotchas and important notes
5. Select 1-2 concise code examples

**Content Extraction Focus:**
✓ Include:

- Coding patterns (how to implement similar features)
- Common utilities/hooks and usage
- API conventions (props, function signatures)
- Gotchas (common pitfalls)
- Dependencies (libraries used)
- One concise example (key patterns only)

✗ Exclude:

- Full source code
- Historical evolution
- Verbose explanations
- Multiple redundant examples
- Design discussions

**Length Target:**

- Simple: 50-100 lines
- Medium: 100-200 lines
- Complex: 200-300 lines (consider splitting if larger)
  </action>

<action>Generate concise documentation with structure:

# {{Document Title}}

**Last Updated:** {date}
**Layer:** {{layer}}
**Related Files:** [Brief list]

## Overview

[2-3 sentences describing what this is and when to use it]

## Key Patterns

[Bullet points of important patterns AI should follow]

## Dependencies

- Library 1 (purpose)
- Hook/Utility 1 (usage)

## Usage Example

```{{lang}}
[Concise example showing key patterns - 10-20 lines maximum]
```

## Gotchas

- [Important pitfall or consideration]
- [Another gotcha]

## Related Implementations

[Links to related docs if applicable]

---

_Generated by analyze-architecture workflow_
</action>

<action>Check content length and conciseness:

If content >300 lines: WARN user and suggest splitting
If content has redundancy: Remove duplicates
If examples are verbose: Simplify to key patterns only</action>

<action>Display generated content preview (first 50 lines + last 10 lines)</action>

<ask if="#yolo mode NOT active">Review {{filename}}.md:

[Enter] Save and continue
[r] Regenerate with different focus
[e] I'll edit manually

Your choice:</ask>

<check if="user_choice == 'r'">
  <ask>What should I focus on differently?</ask>
  <action>Regenerate with user guidance</action>
  <goto step="4">Return to file review</goto>
</check>

<action>Create directory {tech_architecture_doc_path}/{{layer}}/ if it doesn't exist</action>

<check if="user selected 2 (Merge) earlier">
  <action>Merge new content with existing file:
  - Keep existing sections that are still relevant
  - Add new patterns and gotchas
  - Update code examples if improved
  - Update "Last Updated" timestamp
  - Add note: "Merged with updates from {date}"
  </action>
</check>

<action>Save file to {{file_path}}</action>

<action if="user selected 1 (Overwrite)">Create backup at {{file_path}}.backup</action>

<action>Confirm file saved: ✓ Saved {{filename}}.md ({{line_count}} lines)</action>

<template-output>{{filename}}\_document</template-output>
</step>

<step n="5" goal="Update overview.md index">
<action>Update overview.md to include new documentation:

1. Add entries to appropriate layer section in index
2. Update "Last Updated" timestamp
3. Keep index alphabetically sorted within each layer
4. Ensure brief descriptions are concise (one line each)</action>

<action>Save updated overview.md</action>

<template-output>updated_overview</template-output>
</step>

<step n="6" goal="Completion summary">
<action>Display comprehensive summary in {communication_language}:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Architecture Documentation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Documentation Created/Updated:**

{{#each generated_files}}
✓ {{layer}}/{{filename}}.md ({{line_count}} lines)
{{/each}}

**Location:** {tech_architecture_doc_path}

**Documentation Structure:**

```
{tech_architecture_doc_path}/
├── overview.md (updated)
{{#each layers_with_docs}}
└── {{layer}}/
    {{#each files}}
    ├── {{filename}}.md
    {{/each}}
{{/each}}
```

**Total Files Generated:** {{file_count}}
**Total Lines:** {{total_lines}} (concise and focused)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Next Steps:**

1. **Review Documentation:**
   Open {tech_architecture_doc_path}/overview.md to navigate all docs

2. **Use in Development:**
   - dev-flow and create-tech-spec workflows automatically reference these docs
   - AI will use patterns documented here during implementation

3. **Progressive Documentation:**
   When you encounter new implementations needing documentation:

   ```
   workflow analyze-architecture
   → Select "Specific Implementation"
   → Describe the implementation
   → Documentation will be added incrementally
   ```

4. **Share with Team:**
   - Commit these docs to version control
   - Team members can use for onboarding
   - AI-assisted development will be more consistent

**Configuration:**
Documentation path is set in: bmad/sdd/config.yaml
Key: tech_architecture_doc_path = {tech_architecture_doc_path}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<ask>Would you like to:

1. **Done** - Exit workflow
2. **Analyze More** - Document another implementation
3. **View Docs** - Show me the documentation structure

Select [1/2/3]:</ask>

<check if="user selected 2">
  <goto step="1">Return to scope selection for new analysis</goto>
</check>

<check if="user selected 3">
  <action>Display full documentation tree with file sizes</action>
  <action>Offer to open specific files</action>
</check>

<action>Thank {user_name} for using analyze-architecture workflow</action>

<template-output>completion_summary</template-output>
</step>

</workflow>
