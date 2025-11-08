# Create Tech Spec - Standalone Tech Spec Generation Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/create-tech-spec/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Welcome and determine input method">
<action>Welcome {user_name} to the Create Tech Spec workflow</action>

<action>Explain the workflow purpose: This workflow generates a technical specification for a development task. It focuses on planning only - you can implement later using the implement-task workflow.</action>

<ask>How would you like to provide the task?

1. **Jira task** - Provide Jira task number (e.g., FIS-00002)
2. **Manual input** - Describe the task directly

Select [1/2]:</ask>

<action>Store the input method selection as {{input_method}}</action>

<template-output>input_method</template-output>
</step>

<step n="2" goal="Fetch or collect task details">
<check if="input_method == jira">
  <ask>Please provide the Jira task number (e.g., FIS-00002):</ask>

<action>Store as {{jira_task_number}} and parse to get {{jira_proj}} and {{jira_number}}</action>
<action>Invoke sync-jira workflow to fetch task details from Jira</action>

  <check if="jira fetch successful">
    <action>Extract task title, description, acceptance criteria, and labels</action>
    <action>Check for UI spec links in the Jira ticket (in description, comments, or attachments)</action>
    <action>If UI spec link found, store as {{ui_spec_link}}</action>
    <action>Store as {{task_details}}</action>
  </check>

  <check if="jira fetch failed">
    <action>Inform user that Jira connection failed</action>
    <ask>Would you like to:
    1. Provide Jira credentials and retry
    2. Describe the task manually instead

    Select [1/2]:</ask>

    <action if="user selected 1">Guide user through Jira setup and retry fetch</action>
    <action if="user selected 2">Switch to manual input mode</action>

  </check>
</check>

<check if="input_method == manual">
  <ask>Please describe the development task:

Include:

- Task title
- What needs to be built/changed
- Acceptance criteria (if any)
- Technical constraints
- Any relevant context</ask>

<action>Store as {{task_details}}</action>
<action>Set default values for {{jira_proj}} and {{jira_number}} if needed (e.g., "MANUAL-001")</action>
</check>

<template-output>task_input</template-output>
</step>

<step n="3" goal="Load codebase context and architecture">
<action>Analyze the codebase to understand patterns, architecture, and conventions</action>

<check if="tech_architecture_doc_path exists">
  <action>Load and study architecture documentation from {tech_architecture_doc_path}</action>
  <action>Extract key architectural principles, patterns, and constraints</action>
</check>

<check if="tech_architecture_doc_path not available">
  <action>Perform codebase analysis to infer architecture</action>
  <action>Identify project structure, key modules, and common patterns</action>
</check>

<action>Identify relevant code patterns and conventions for this task:

- Project structure and file organization
- Naming conventions
- Common libraries and frameworks used
- Error handling patterns
- Testing patterns
- API/interface patterns</action>

<action>Analyze dependencies and integration points relevant to this task</action>

<template-output>codebase_context</template-output>
</step>

<step n="4" goal="Determine task name and output path">
<ask>What is the task name for this tech spec?

This will be used in the filename: tech-spec-{{jira_proj}}-{{jira_number}}-[task-name].md

Provide a short, descriptive name in kebab-case (e.g., "fe-global-search-bar", "be-auth-service"):</ask>

<action>Store as {{task_name}}</action>
<action>Validate that task_name is kebab-case format</action>

<action>Determine the output file path: {output_folder}/tech-spec/tech-spec-{{jira_proj}}-{{jira_number}}-{{task_name}}.md</action>
<action>Create the output directory if it doesn't exist</action>

<template-output>output_path_setup</template-output>
</step>

<step n="5" goal="Generate technical solution approach">
<action>Based on the task details and codebase context, design the technical solution</action>

<action>Determine implementation approach considering:

- Project architecture and patterns
- Existing similar implementations
- Best practices for this type of task
- Performance and scalability considerations
- Security considerations
- Maintainability and code quality</action>

<action>Identify scope of impact:

- Which files will be created/modified?
- Which modules/services will be affected?
- What interfaces/APIs will change?
- What database changes are needed?
- What tests need to be written/updated?</action>

<template-output>technical_solution</template-output>
</step>

<step n="6" goal="Break down into implementation phases">
<action>Break the implementation into 3-6 logical phases</action>

<action>For each phase, define:

- Phase name (descriptive, action-oriented)
- What will be implemented in this phase
- Which files will be affected
- Key technical considerations
- Why this phase comes in this order (dependencies)</action>

<action>Ensure phases are:

- Logical and sequential (considering dependencies)
- Reasonably sized (each phase should be completable in 1-4 hours)
- Independently committable (each phase produces a working state)
- Testable (can write/run tests after each phase)</action>

<action>Consider Frontend/Backend separation where applicable</action>

<template-output>phase_breakdown</template-output>
</step>

<step n="7" goal="Document technical dependencies and considerations">
<action>Identify all technical dependencies:
  - External libraries or packages needed
  - Internal services or modules this task depends on
  - APIs or external services to integrate
  - Database or schema changes required
  - Other tasks that must complete first</action>

<action>Document implementation notes and considerations:

- Patterns to follow (from codebase analysis)
- Conventions to respect (naming, structure)
- Gotchas or pitfalls to avoid
- Performance optimization opportunities
- Security considerations
- Error handling approach
- Logging and monitoring needs</action>

<template-output>dependencies_and_notes</template-output>
</step>

<step n="8" goal="Estimate effort and complexity">
<action>Assess implementation complexity:
  - **Low**: Straightforward, well-understood patterns, minimal dependencies
  - **Medium**: Some unknowns, moderate complexity, multiple integration points
  - **High**: Significant unknowns, complex logic, many dependencies, architectural changes</action>

<action>Provide confidence level:

- **High**: Clear path forward, similar implementations exist
- **Medium**: General approach clear, some details to work out
- **Low**: Significant uncertainty, may need research or experimentation</action>

<action>Estimate rough effort (in hours or days) based on phase breakdown</action>

<template-output>effort_estimation</template-output>
</step>

<step n="9" goal="Generate complete tech spec document">
<action>Load tech spec template from {tech_spec_template_path}</action>

<action>Populate the tech spec with all gathered information:

**Metadata:**

- Jira: {{jira_proj}}-{{jira_number}}
- Date: {{date}}
- Engineer: {{user_name}}
- Task: {{task_name}}
- Status: "Planning"
- UI Spec: {{ui_spec_link}} (if available)

**Task Overview:**

- Original task description
- Task acceptance criteria

**Technical Solution:**

- High-level implementation approach
- Architecture considerations
- Key design decisions

**Scope of Impact:**

- Files to be created/modified
- Modules/services affected
- APIs/interfaces changed
- Database changes

**Implementation Phases:**

- Detailed phase breakdown (3-6 phases)
- Each phase with clear description and files affected

**Technical Dependencies:**

- External libraries/services
- Internal dependencies
- Prerequisite tasks

**Implementation Notes:**

- Patterns to follow
- Conventions to respect
- Gotchas to avoid
- Security considerations
- Testing approach

**Effort Estimation:**

- Complexity: Low/Medium/High
- Confidence: Low/Medium/High
- Estimated effort: X hours/days

**Status:** "Planning"</action>

<action>Ensure all variables in the template are replaced with actual content</action>
<action>Format the document with proper markdown structure</action>
<action>Apply consistent formatting (blank lines before/after lists, code blocks)</action>
<action>Save the complete tech spec to the output file</action>

<template-output>complete_tech_spec</template-output>
</step>

<step n="10" goal="Review and finalize">
<action>Present a summary of the completed tech spec to {user_name}:
  - File location
  - Complexity level
  - Number of phases
  - Estimated effort
  - Key technical considerations</action>

<action>Display key sections or provide a preview of the tech spec</action>

<ask>Would you like to:

1. **Complete** - Tech spec is ready, save and exit
2. **Edit** - Make adjustments to specific sections
3. **Regenerate** - Regenerate specific sections with different approach
4. **Implement now** - Start implementation using implement-task workflow

Select [1/2/3/4]:</ask>

<check if="user selected 1 (complete)">
  <action>Confirm the tech spec is saved to: {output_folder}/tech-spec/tech-spec-{{jira_proj}}-{{jira_number}}-{{task_name}}.md</action>
  <action>Provide next steps:
    - Review tech spec with team lead or architect
    - Use implement-task workflow when ready to code
    - Reference this spec in commit messages and PR
    - Update spec status as implementation progresses</action>
  <action>Thank {user_name} for using the Create Tech Spec workflow</action>
</check>

<check if="user selected 2 (edit)">
  <ask>Which section would you like to edit?
    - Metadata
    - Technical Solution
    - Scope of Impact
    - Phase Breakdown
    - Dependencies
    - Implementation Notes
    - Effort Estimation
    - Other</ask>

<action>Make the requested edits</action>
<action>Save the updated tech spec</action>
<goto step="10">Return to review checkpoint</goto>
</check>

<check if="user selected 3 (regenerate)">
  <ask>Which section would you like to regenerate? Provide details on what you'd like different.</ask>

<action>Regenerate the specified section with the new guidance</action>
<action>Save the updated tech spec</action>
<goto step="10">Return to review checkpoint</goto>
</check>

<check if="user selected 4 (implement now)">
  <action>Save and finalize the tech spec</action>
  <action>Inform user that they should now use the implement-task workflow</action>
  <action>Provide command: workflow implement-task</action>
  <action>Note: You'll need to provide the tech spec path when prompted</action>
</check>

<template-output>completion_confirmation</template-output>
</step>

<step n="11" goal="Update agent memory with learnings">
<action>Write to Dev Agent's memory file at {project-root}/bmad/sdd/agents/dev-agent-sidecar/memories.md

Append the following structured entry:

---

## Session: {{date}} - {{jira_task_number}} (Tech Spec Only)

**Task:** {{task_name}}

**Technical Context:**

- Frameworks/Technologies identified: [Extract from codebase analysis]
- Architecture patterns planned: [Extract from tech spec]
- Key files to be modified: [List from scope of impact]

**Tech Spec Planning:**

- Phases planned: [List phase titles]
- Complexity assessed: {{complexity_level}}
- Confidence level: {{confidence_level}}
- Estimated effort: {{estimated_effort}}

**Codebase Insights:**
[Any new patterns or architectural insights discovered during codebase analysis that should be remembered]

**Design Decisions:**
[Key design decisions made in the tech spec - why certain approaches were chosen over alternatives]

**User Preferences Learned:**
[Any preferences the user expressed during this session - planning depth, phase granularity, documentation style]

**Scope Analysis Quality:**

- Files identification: [Complete vs needs more discovery]
- Dependencies identified: [Comprehensive vs missed some]
- Phase breakdown clarity: [Clear vs needs refinement]

**Implementation Readiness:**
[Assessment of how ready this task is for implementation - are there unknowns that need research first?]

**Notes for Future:**
[Any insights that would be helpful for similar tech spec planning in the future]

---

</action>

<action>Confirm to user in {communication_language}:

✅ Session learnings saved to agent memory

This helps Dev Agent provide better assistance in future sessions by:

- Remembering your planning preferences
- Understanding project patterns
- Improving tech spec quality
- Recognizing complexity patterns

Memory file: bmad/sdd/agents/dev-agent-sidecar/memories.md
</action>
</step>

</workflow>
