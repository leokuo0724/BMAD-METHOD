# Implement Task - Implementation-Only Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/implement-task/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Load tech spec">
<action>Welcome {user_name} to the Implement Task workflow</action>

<action>Explain the workflow purpose: This workflow executes the implementation plan from an existing tech spec. It handles coding, testing, and PR creation.</action>

<ask>Please provide the path to the tech spec document:

Example: docs/sdd/tech-spec/tech-spec-FIS-00002-fe-global-search-bar.md</ask>

<action>Store as {{tech_spec_path}}</action>

<action>Load and parse the tech spec document</action>
<action>Extract key information:

- Jira task number
- Task name
- Technical solution approach
- Implementation phases
- Files to be affected
- Dependencies
- Implementation notes
- Testing approach</action>

<action>Validate that tech spec is complete and ready for implementation</action>

<check if="tech spec missing critical information">
  <action>Report what is missing</action>
  <ask>The tech spec appears incomplete. Would you like to:
  1. Update tech spec using create-tech-spec workflow
  2. Proceed anyway and fill gaps during implementation

Select [1/2]:</ask>

<action if="user selected 1">Exit workflow and suggest using create-tech-spec workflow</action>
<action if="user selected 2">Note the gaps and proceed with caution</action>
</check>

<template-output>tech_spec_loaded</template-output>
</step>

<step n="2" goal="Review implementation plan">
<action>Present the implementation plan to {user_name}:
  - Task overview
  - Number of phases
  - Files to be affected
  - Key dependencies
  - Technical approach
  - Estimated complexity and effort</action>

<action>Display each phase briefly:

- Phase name
- What will be implemented
- Files affected</action>

<ask>Review the implementation plan. Would you like to:

1. **Proceed** - Start implementation as planned
2. **Adjust plan** - Modify phases or approach
3. **Update spec** - Return to tech spec and make updates

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments would you like to make to the plan?</ask>
  <action>Make the requested adjustments</action>
  <action>Update tech spec document with changes</action>
  <goto step="2">Return to review</goto>
</check>

<check if="user selected 3">
  <action>Save current state</action>
  <action>Exit workflow and suggest using create-tech-spec workflow to update</action>
</check>

<template-output>plan_review</template-output>
</step>

<step n="3" goal="Setup implementation context">
<action>Verify current working directory and git status</action>

<ask>What branch should we work on?

1. **Current branch** - Continue on {{current_branch}}
2. **New branch** - Create a new feature branch
3. **Specify branch** - Provide specific branch name

Select [1/2/3]:</ask>

<check if="user selected 2">
  <action>Generate branch name from task: feature/{{jira_proj}}-{{jira_number}}-{{task_name}}</action>
  <action>Create and checkout new branch</action>
</check>

<check if="user selected 3">
  <ask>Provide the branch name:</ask>
  <action>Checkout specified branch (create if doesn't exist)</action>
</check>

<action>Confirm git working directory is clean or show uncommitted changes</action>

<action>Update tech spec status to "In Progress" with start timestamp</action>

<template-output>implementation_setup</template-output>
</step>

<step n="4" goal="Implement solution phase-by-phase" repeat="for-each-phase">
<action>For each phase in the tech spec task breakdown:</action>

<action>Present the current phase to {user_name}:

- Phase number and name
- Phase description
- Files to be affected
- Key considerations from tech spec</action>

<action>Implement the phase following:

- Technical solution from tech spec
- Project coding patterns and conventions
- Architecture guidelines from tech spec
- Implementation notes from tech spec
- Error handling standards
- Code quality best practices</action>

<check if="write_unit_test_along_with_task == true">
  <action>Write unit tests for this phase</action>
  <action>Run tests to ensure they pass</action>

  <check if="tests fail">
    <action>Analyze failures and fix implementation or tests</action>
    <action>Repeat until tests pass</action>
  </check>
</check>

<action>Load commit message template from {commit_msg_template_path}</action>
<action>Create git commit for this phase:

- Use template structure
- Reference Jira task number
- Describe the phase completed
- List key changes</action>

<action>Update tech spec with phase completion status</action>

<action>Display phase completion summary:

- Phase name completed
- Files modified/created
- Commit hash
- Tests status</action>

<ask>Phase completed. Would you like to:

1. **Continue** - Proceed to next phase
2. **Adjust** - Make changes to current phase
3. **Pause** - Save progress and exit (can resume later)

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>
  <action>Amend or create new commit if significant</action>
  <goto step="4">Return to phase completion checkpoint</goto>
</check>

<check if="user selected 3">
  <action>Update tech spec with "Paused" status and last completed phase</action>
  <action>Provide resume instructions</action>
  <action>Exit workflow gracefully</action>
</check>

<template-output>implementation_phase</template-output>
</step>

<step n="5" goal="Review complete implementation">
<action>Present summary of complete implementation to {user_name}:
  - All phases completed
  - Total files modified/created
  - Total commits made
  - Tests status (if written)
  - Current branch status</action>

<action>Quick code review checklist:

- All acceptance criteria met?
- Code follows project conventions?
- Error handling implemented?
- Edge cases handled?
- Code is readable and maintainable?
- No debug code or commented-out blocks?</action>

<ask>Review the implementation. Would you like to:

1. **Continue** - Proceed to testing/PR
2. **Adjust** - Make changes to implementation
3. **Add phase** - Implement additional phase

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>
  <action>Create adjustment commit</action>
  <goto step="5">Return to review</goto>
</check>

<check if="user selected 3">
  <ask>Describe the additional phase to implement:</ask>
  <action>Implement the additional phase</action>
  <action>Update tech spec with new phase</action>
  <action>Create commit for new phase</action>
  <goto step="5">Return to review</goto>
</check>

<template-output>implementation_review</template-output>
</step>

<step n="6" goal="Generate unit tests" if="write_unit_test_along_with_task == false">
<action>Generate comprehensive unit test suite covering:
  - Happy path scenarios
  - Edge cases
  - Error handling
  - Integration points
  - All acceptance criteria</action>

<action>Follow project test framework and patterns</action>
<action>Target >80% code coverage for new code</action>

<action>Run tests and report results</action>

<check if="tests fail">
  <action>Analyze failures and determine cause</action>
  <action>Fix implementation or tests as needed</action>
  <action>Create commit for fixes</action>
  <action>Re-run tests until all pass</action>
</check>

<action>Report test coverage achieved</action>

<action>Create commit for test suite using commit template</action>

<template-output>unit_tests</template-output>
</step>

<step n="7" goal="Final review and validation">
<action>Run final validation checks:
  - All tests passing
  - No linting errors
  - No TypeScript/compilation errors (if applicable)
  - All files properly formatted
  - No console.log or debug statements</action>

<check if="validation errors found">
  <action>Report errors to user</action>
  <ask>Fix these issues? [yes/skip]</ask>

  <check if="user says yes">
    <action>Fix validation errors</action>
    <action>Create cleanup commit</action>
  </check>
</check>

<action>Present complete implementation summary:

- All phases implemented
- Test coverage achieved
- Total commits made
- Files changed count
- Validation status</action>

<ask>Final review. Is everything ready for PR? [yes/no/adjust]</ask>

<check if="user says adjust">
  <ask>What needs adjustment?</ask>
  <action>Make the adjustments</action>
  <goto step="7">Return to final review</goto>
</check>

<template-output>final_review</template-output>
</step>

<step n="8" goal="Generate pull request">
<action>Push current branch to remote if not already pushed</action>

<action>Load PR template from {pr_template_path}</action>

<action>Generate PR description including:

- Summary of changes (from tech spec)
- Jira ticket reference: {{jira_task_number}}
- Link to tech spec document
- Technical approach summary
- Implementation phases completed
- Testing performed and coverage
- Files affected summary
- Any special notes for reviewers</action>

<action>Suggest PR title: [{{jira_proj}}-{{jira_number}}] {{task_title}}</action>

<ask>Review the PR title and description. Approve? [yes/edit]</ask>

<check if="user says edit">
  <ask>Provide updated title or description:</ask>
  <action>Update PR content</action>
</check>

<action>Execute: gh pr create --title "{{pr_title}}" --body "{{pr_description}}"</action>

<action>Capture PR URL from gh command output</action>

<check if="PR creation failed">
  <action>Report error</action>
  <action>Provide manual PR creation instructions</action>
</check>

<template-output>pull_request</template-output>
</step>

<step n="9" goal="Complete and update documentation">
<action>Update tech spec status to "Complete" with completion timestamp</action>

<action>Add implementation summary to tech spec:

- Completion date
- PR link
- Test coverage achieved
- Any deviations from original plan
- Lessons learned</action>

<action>Provide completion summary to {user_name}:

- Tech spec location: {{tech_spec_path}}
- Pull request URL: {{pr_url}}
- Branch: {{branch_name}}
- Total commits: {{commit_count}}
- Test coverage: {{coverage_percentage}}
- Implementation time: {{elapsed_time}}</action>

<action>Provide next steps:

- Request code review on PR
- Monitor CI/CD pipeline
- Address review comments
- Merge when approved
- Update Jira task status</action>

<action>Thank {user_name} for using the Implement Task workflow</action>

<template-output>workflow_completion</template-output>
</step>

</workflow>
