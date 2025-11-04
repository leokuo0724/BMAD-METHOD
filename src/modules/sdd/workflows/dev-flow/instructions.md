# Dev Flow - Complete Development Cycle Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/dev-flow/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Fetch Jira task details">
<ask>Please provide the Jira task number (e.g., FIS-00002):</ask>

<action>Store as {{jira_task_number}} and parse to get {{jira_proj}} and {{jira_number}}</action>
<action>Invoke sync-jira workflow to fetch task details from Jira</action>
<action>Extract task title, description, acceptance criteria, and labels</action>
<action>Store as {{task_details}}</action>
<action>Inform user: "Successfully fetched Jira task {{jira_task_number}}. Proceeding to analyze codebase context..."</action>
<action>Automatically proceed to next step without waiting for user confirmation</action>

<template-output>jira_task_fetch</template-output>
</step>

<step n="2" goal="Load codebase context and generate initial tech spec">
<action>Analyze the codebase to understand patterns, architecture, and conventions</action>

<check if="tech_architecture_doc_path exists">
  <action>Load and study architecture documentation</action>
</check>

<check if="tech_architecture_doc_path not available">
  <action>Perform codebase analysis to infer architecture</action>
</check>

<action>Identify relevant code patterns, dependencies, and conventions for this task</action>
<action>Store codebase analysis as {{codebase_analysis}}</action>

<action>Create tech spec document using template at {tech_spec_template_path}</action>
<action>Analyze {{task_details}} and generate a concise task name automatically in kebab-case format (similar to product-flow scope name generation)</action>
<action>Store generated task name as {{task_name}}</action>

<action>Generate complete tech spec including:

- **Metadata**: Jira ticket, date, engineer, task name
- **Technical Solution**: Implementation approach at high level
- **Codebase Context Analysis**: Include the {{codebase_analysis}} findings
- **Scope of Impact**: All files and modules that will be affected
- **Task Breakdown**: Break into 3-6 logical implementation phases
- **Technical Dependencies**: Libraries, services, APIs, other tasks
- **Implementation Notes**: Patterns to follow, conventions, gotchas
- **Effort Estimation**: Complexity (Low/Medium/High), Confidence level
- **Status**: Set to "Planning"</action>

<action>Save to: {tech_spec_output_file}</action>
<action>Display the tech spec to {user_name}</action>
<action>Inform user: "Tech spec generated and saved. Codebase context analysis is included in the document."</action>

<template-output>tech_spec_with_context</template-output>
</step>

<step n="3" goal="Review and approve tech spec">
<ask>Review the technical specification. Would you like to:

1. **Approve** - Proceed with implementation
2. **Edit** - Make adjustments to the spec
3. **Regenerate** - Regenerate with different approach

Select [1/2/3]:</ask>

<check if="user selected 2 or 3">
  <action>Make requested changes to tech spec</action>
  <action>Update tech spec document</action>
  <goto step="3">Return to review</goto>
</check>

<check if="user selected 1">
  <action>Update tech spec status to "In Progress"</action>

<ask>Choose commit strategy for implementation:

1. **Auto-commit per phase** - AI automatically creates commits after each phase (recommended for streamlined workflow)
2. **Manual commit control** - You decide when to commit (provides more flexibility)

Select [1/2]:</ask>

<action if="user selected 1">Set {{commit_strategy}} = "auto"</action>
<action if="user selected 2">Set {{commit_strategy}} = "manual"</action>

<action>Inform user: "Commit strategy set to {{commit_strategy}}. Proceeding to implementation..."</action>
<action>Proceed to implementation</action>
</check>

<template-output>tech_spec_approval</template-output>
</step>

<step n="4" goal="Implement solution phase-by-phase" repeat="for-each-phase">
<action>For each phase in the tech spec task breakdown:</action>

<action>Inform user: "Starting Phase {{current_phase_number}}: {{phase_description}}"</action>

<action>Implement the phase following:

- Project coding patterns and conventions
- Architecture guidelines
- Error handling standards
- Code quality best practices</action>

<action>Record this phase as AI-implemented by marking it in {{ai_implementation_summary}} list:

- Phase {{phase_number}}: {{phase_description}} - Implemented by AI
- Files: {{files_modified_in_phase}}
  </action>

<check if="write_unit_test_along_with_task == true">
  <action>Write unit tests for this phase</action>
  <action>Run tests to ensure they pass</action>
  <action>Add test info to {{ai_implementation_summary}}</action>
</check>

<check if="commit_strategy == auto">
  <action>Generate concise commit message using streamlined format:

Format: <type>: <brief description>

- Keep subject line under 50 characters
- Use imperative mood (e.g., "add", "fix", "update")
- Skip detailed body unless complex changes
- Always include: Jira: {{jira_task_number}}

Example:

```
feat: add user authentication endpoint

Jira: {{jira_task_number}}
```

  </action>
  <action>Create git commit for this phase</action>
  <action>Inform user: "Phase {{phase_number}} committed."</action>
</check>

<check if="commit_strategy == manual">
  <action>Inform user: "Phase {{phase_number}} implementation complete. Files ready for commit (manual strategy selected)."</action>
</check>

<action>Update tech spec with implementation progress:

- Mark phase as complete
- Update status field</action>

<template-output>implementation_phase</template-output>
</step>

<step n="5" goal="Review implementation">
<action>Present summary of implementation to {user_name}:
- Phases completed
- Files modified/created
- Commits made (if auto-commit strategy)
- Tests status (if written)
- {{ai_implementation_summary}} - detailed list of AI-implemented phases</action>

<action>Update tech spec document with "## Implementation Summary" section:

- Include {{ai_implementation_summary}}
- Mark each phase with "[AI Implemented]" tag
- List files modified per phase
- Include test coverage info</action>

<ask>Review the implementation. Would you like to:

1. **Continue** - Proceed to next step
2. **Adjust** - Make changes to implementation
3. **Add phase** - Implement additional phase not in spec

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>
  <check if="commit_strategy == auto">
    <action>Create concise adjustment commit using streamlined format</action>
  </check>
  <goto step="5">Return to review</goto>
</check>

<check if="user selected 3">
  <ask>Describe the additional phase to implement:</ask>
  <action>Implement the additional phase</action>
  <action>Update tech spec with new phase</action>
  <action>Add to {{ai_implementation_summary}}</action>
  <check if="commit_strategy == auto">
    <action>Create concise commit for new phase</action>
  </check>
  <goto step="5">Return to review</goto>
</check>

<template-output>implementation_review</template-output>
</step>

<step n="6" goal="Generate unit tests" if="write_unit_test_along_with_task == false">
<action>Generate comprehensive unit test suite covering:
- Happy path scenarios
- Edge cases
- Error handling
- Integration points</action>

<action>Follow project test framework and patterns</action>
<action>Target >80% code coverage</action>

<action>Run tests and report results</action>

<check if="tests fail">
  <action>Analyze failures and adjust implementation or tests</action>
  <check if="commit_strategy == auto">
    <action>Create concise commit for fixes</action>
  </check>
</check>

<check if="commit_strategy == auto">
  <action>Create concise commit for test suite using streamlined format</action>
</check>

<action>Add test info to {{ai_implementation_summary}}</action>

<template-output>unit_tests</template-output>
</step>

<step n="7" goal="Final review">
<action>Present complete implementation summary:
- All phases implemented
- Test coverage achieved
- Total commits made
- Files changed count
- AI implementation summary available in tech spec</action>

<ask>Final review. Is everything ready for PR? [yes/no/adjust]</ask>

<check if="user says adjust">
  <ask>What needs adjustment?</ask>
  <action>Make the adjustments</action>
  <goto step="7">Return to final review</goto>
</check>

<template-output>final_review</template-output>
</step>

<step n="8" goal="Handle manual commits if needed">
<check if="commit_strategy == manual">
  <action>Inform user: "You selected manual commit strategy. Please commit your changes now before creating PR."</action>
  <ask>Have you committed all changes and pushed to remote? [yes/no]</ask>

  <check if="user says no">
    <action>Wait for user to complete commits</action>
    <goto step="8">Return to check again</goto>
  </check>
</check>

<action>Check that current branch is pushed to remote</action>

<template-output>commit_verification</template-output>
</step>

<step n="9" goal="Generate pull request">
<action>Generate concise PR description using streamlined format:

**Format Guidelines:**

- Title: [{{jira_proj}}-{{jira_number}}] <brief description in 50 chars>
- Body: Keep concise and focused on essentials

**Body Structure:**

```
## Summary
<1-2 sentence description of what this PR does>

## Jira
{{jira_task_number}}

## Tech Spec
<link to tech spec document>

## Changes
<3-5 bullet points of key changes - NO exhaustive file lists>

## Testing
<Brief test summary - just coverage % and test type>
```

**What to AVOID:**

- Detailed file lists (reviewers can see diffs)
- Verbose technical explanations (link to tech spec instead)
- Redundant checklists (use minimal checklist)
- Screenshots section if no UI changes
- Deployment notes unless critical
  </action>

<action>Execute: gh pr create --title "[{{jira_proj}}-{{jira_number}}] {{pr_title}}" --body "{{pr_description}}"</action>

<action>Capture PR URL from gh command output</action>

<template-output>pull_request</template-output>
</step>

<step n="10" goal="Complete and provide next steps">
<action>Update tech spec status to "Complete"</action>

<action>Provide completion summary to {user_name}:

- Tech spec location: {{tech_spec_path}}
- Pull request URL: {{pr_url}}
- Total implementation time/effort
- Test coverage achieved
- Next steps: Code review, merge, deployment</action>

<action>Thank {user_name} for using Dev Flow workflow</action>

<template-output>workflow_completion</template-output>
</step>

</workflow>
