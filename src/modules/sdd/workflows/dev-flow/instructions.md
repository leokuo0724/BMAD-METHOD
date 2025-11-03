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

<template-output>jira_task_fetch</template-output>
</step>

<step n="2" goal="Load codebase context">
<action>Analyze the codebase to understand patterns, architecture, and conventions</action>

<check if="tech_architecture_doc_path exists">
  <action>Load and study architecture documentation</action>
</check>

<check if="tech_architecture_doc_path not available">
  <action>Perform codebase analysis to infer architecture</action>
</check>

<action>Identify relevant code patterns, dependencies, and conventions for this task</action>

<template-output>codebase_context</template-output>
</step>

<step n="3" goal="Generate technical specification">
<action>Create tech spec document using template at {tech_spec_template_path}</action>
<action>Determine task name in kebab-case for filename</action>

<action>Generate complete tech spec including:

- **Metadata**: Jira ticket, date, engineer, task name
- **Technical Solution**: Implementation approach at high level
- **Scope of Impact**: All files and modules that will be affected
- **Task Breakdown**: Break into 3-6 logical implementation phases
- **Technical Dependencies**: Libraries, services, APIs, other tasks
- **Implementation Notes**: Patterns to follow, conventions, gotchas
- **Effort Estimation**: Complexity (Low/Medium/High), Confidence level
- **Status**: Set to "Planning"</action>

<action>Save to: {tech_spec_output_file}</action>
<action>Display the tech spec to {user_name}</action>

<template-output>tech_spec_document</template-output>
</step>

<step n="4" goal="Review and approve tech spec">
<ask>Review the technical specification. Would you like to:

1. **Approve** - Proceed with implementation
2. **Edit** - Make adjustments to the spec
3. **Regenerate** - Regenerate with different approach

Select [1/2/3]:</ask>

<check if="user selected 2 or 3">
  <action>Make requested changes to tech spec</action>
  <action>Update tech spec document</action>
  <goto step="4">Return to review</goto>
</check>

<check if="user selected 1">
  <action>Update tech spec status to "In Progress"</action>
  <action>Proceed to implementation</action>
</check>

<template-output>tech_spec_approval</template-output>
</step>

<step n="5" goal="Implement solution phase-by-phase" repeat="for-each-phase">
<action>For each phase in the tech spec task breakdown:</action>

<action>Implement the phase following:

- Project coding patterns and conventions
- Architecture guidelines
- Error handling standards
- Code quality best practices</action>

<check if="write_unit_test_along_with_task == true">
  <action>Write unit tests for this phase</action>
  <action>Run tests to ensure they pass</action>
</check>

<action>Create git commit for this phase using template at {commit_msg_template_path}</action>
<action>Reference {{jira_task_number}} in commit message</action>
<action>Commit message should describe the phase completed</action>

<action>Update tech spec status field with progress</action>

<template-output>implementation_phase</template-output>
</step>

<step n="6" goal="Review implementation">
<action>Present summary of implementation to {user_name}:
- Phases completed
- Files modified/created
- Commits made
- Tests status (if written)</action>

<ask>Review the implementation. Would you like to:

1. **Continue** - Proceed to next step
2. **Adjust** - Make changes to implementation
3. **Add phase** - Implement additional phase not in spec

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>
  <action>Create adjustment commit if significant</action>
  <goto step="6">Return to review</goto>
</check>

<check if="user selected 3">
  <ask>Describe the additional phase to implement:</ask>
  <action>Implement the additional phase</action>
  <action>Update tech spec with new phase</action>
  <action>Create commit for new phase</action>
  <goto step="6">Return to review</goto>
</check>

<template-output>implementation_review</template-output>
</step>

<step n="7" goal="Generate unit tests" if="write_unit_test_along_with_task == false">
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
  <action>Create commit for fixes</action>
</check>

<action>Create commit for test suite using commit template</action>

<template-output>unit_tests</template-output>
</step>

<step n="8" goal="Final review">
<action>Present complete implementation summary:
- All phases implemented
- Test coverage achieved
- Total commits made
- Files changed count</action>

<ask>Final review. Is everything ready for PR? [yes/no/adjust]</ask>

<check if="user says adjust">
  <ask>What needs adjustment?</ask>
  <action>Make the adjustments</action>
  <goto step="8">Return to final review</goto>
</check>

<template-output>final_review</template-output>
</step>

<step n="9" goal="Generate pull request">
<action>Check that current branch is pushed to remote</action>
<action>Load PR template from {pr_template_path}</action>

<action>Generate PR description including:

- Summary of changes
- Jira ticket reference: {{jira_task_number}}
- Link to tech spec document
- Technical approach summary
- Testing performed
- Files affected</action>

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
