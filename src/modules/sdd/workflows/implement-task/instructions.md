# Implement Task - Implementation-Only Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/implement-task/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Load tech spec and extract implementation plan">
<action>Welcome {user_name} to the Implement Task workflow</action>

<action>Explain the workflow purpose: This workflow executes the implementation plan from an existing tech spec. It handles coding, testing, and PR creation.</action>

<check if="tech_spec_path not provided">
  <ask>Please provide the path to the tech spec document:

Example: docs/sdd/tech-spec/tech-spec-FIS-00002-fe-global-search-bar.md</ask>
<action>Store as {{tech_spec_path}}</action>
</check>

<action>Load and parse the tech spec document from {{tech_spec_path}}</action>
<action>Extract key information:

- Jira task number
- Task name
- Technical solution approach
- Implementation phases
- Files to be affected
- Dependencies
- Implementation notes
- Testing approach</action>

<action>Present brief summary to {user_name}:

- Task: {{jira_task_number}} - {{task_name}}
- Phases: {{phase_count}} phases planned
- Estimated complexity: {{complexity_level}}</action>

<template-output>tech_spec_loaded</template-output>
</step>

<step n="2" goal="Choose commit strategy">
<action>Update tech spec status to "In Progress" with start timestamp</action>

<check if="commit_strategy not provided">
  <ask>Choose commit strategy for implementation:

1. **Auto-commit per phase** - AI automatically creates commits after each phase (recommended for streamlined workflow)
2. **Manual commit control** - You decide when to commit (provides more flexibility)

Select [1/2]:</ask>

<action if="user selected 1">Set {{commit_strategy}} = "auto"</action>
<action if="user selected 2">Set {{commit_strategy}} = "manual"</action>
</check>

<action>Inform user: "Commit strategy set to {{commit_strategy}}. Starting implementation..."</action>

<template-output>commit_strategy_selected</template-output>
</step>

<step n="3" goal="Implement solution phase-by-phase" repeat="for-each-phase">
<action>For each phase in the tech spec task breakdown:</action>

<action>Inform user: "Starting Phase {{current_phase_number}}: {{phase_description}}"</action>

<action>Implement the phase following:

- Technical solution from tech spec
- Project coding patterns and conventions
- Architecture guidelines from tech spec
- Implementation notes from tech spec
- Error handling standards
- Code quality best practices</action>

<action>Record this phase as implemented in {{implementation_summary}}:

- Phase {{phase_number}}: {{phase_description}}
- Files: {{files_modified_in_phase}}</action>

<check if="write_unit_test_along_with_task == true">
  <action>Write unit tests for this phase</action>
  <action>Run tests to ensure they pass</action>

  <check if="tests fail">
    <action>Analyze failures and fix implementation or tests</action>
    <action>Repeat until tests pass</action>
  </check>
  <action>Add test info to {{implementation_summary}}</action>
</check>

<check if="commit_strategy == auto">
  <action>Load commit message template:

Check if custom template exists at {commit_msg_template_path}:

- If exists: Read and use custom template format
- If not: Use default streamlined format</action>

  <action>Generate concise commit message following the loaded template:

- Keep subject line under 50 characters
- Use imperative mood (e.g., "add", "fix", "update")
- Follow template structure and guidelines
- Always include: Jira: {{jira_task_number}}</action>

  <action>Create git commit for this phase</action>
  <action>Inform user: "Phase {{phase_number}} committed."</action>
  </check>

<check if="commit_strategy == manual">
  <action>Inform user: "✅ Phase {{phase_number}} implementation complete. Files ready for commit (manual strategy selected)."</action>

<ask>📝 Manual Commit Strategy Active

You selected manual commit control. Please review the changes and create a commit before proceeding.

**Suggested workflow:**

1. Review the files changed in this phase
2. Use `/generate-commit` to create a commit for this phase
3. Return here to continue

Have you committed the changes for this phase? [yes/not-yet/skip]</ask>

  <check if="user says not-yet">
    <action>Wait for user to commit. When ready, select 'yes' above.</action>
    <goto step="3">Return to commit check</goto>
  </check>

  <check if="user says skip">
    <action>Note: Skipping commit for this phase. You can commit manually later before creating PR.</action>
  </check>
</check>

<check if="commit_strategy == auto">
  <action>Phase {{phase_number}} committed automatically.</action>
</check>

<action>Update tech spec with phase completion status</action>

<ask>Phase completed. Would you like to:

1. **Continue** - Proceed to next phase
2. **Adjust** - Make changes to current phase
3. **Pause** - Save progress and exit (can resume later)

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>

  <check if="commit_strategy == auto">
    <action>Load commit template from {commit_msg_template_path} if available, otherwise use default</action>
    <action>Create adjustment commit or amend previous commit</action>
  </check>

<goto step="3">Return to phase completion checkpoint</goto>
</check>

<check if="user selected 3">
  <action>Update tech spec with "Paused" status and last completed phase</action>
  <action>Provide resume instructions:

To resume this workflow later:

1. Run: workflow implement-task
2. Provide tech spec path: {{tech_spec_path}}
3. Select same commit strategy: {{commit_strategy}}
4. Implementation will continue from Phase {{next_phase_number}}</action>
   <action>Exit workflow gracefully</action>
   <goto step="end">Exit workflow</goto>
   </check>

<template-output>implementation_phase</template-output>
</step>

<step n="4" goal="Review complete implementation">
<action>Present summary of complete implementation to {user_name}:
- All phases completed
- Total files modified/created
- Total commits made (if auto strategy)
- Tests status (if written)
- Implementation summary: {{implementation_summary}}</action>

<action>Update tech spec document with "## Implementation Summary" section:

- Include {{implementation_summary}}
- Mark each phase as complete
- List files modified per phase
- Include test coverage info if available</action>

<ask>Review the implementation. Would you like to:

1. **Continue** - Proceed to testing/PR
2. **Adjust** - Make changes to implementation
3. **Add phase** - Implement additional phase

Select [1/2/3]:</ask>

<check if="user selected 2">
  <ask>What adjustments are needed?</ask>
  <action>Make the requested changes</action>

<action>Inform user: "⚠️ Post-implementation adjustments detected. Auto-commit is disabled for manual control. Please use /generate-commit when ready to commit your changes."</action>

  <check if="commit_strategy == auto">
    <action>Note: Auto-commit is intentionally disabled after step 4 implementation review to give you full control over post-implementation changes. You can commit manually when satisfied.</action>
  </check>

<goto step="4">Return to review</goto>
</check>

<check if="user selected 3">
  <ask>Describe the additional phase to implement:</ask>
  <action>Implement the additional phase</action>
  <action>Update tech spec with new phase</action>
  <action>Add to {{implementation_summary}}</action>

<action>Inform user: "⚠️ Additional phase added after implementation review. Auto-commit is disabled for manual control. Please use /generate-commit when ready to commit your changes."</action>

  <check if="commit_strategy == auto">
    <action>Note: Auto-commit is intentionally disabled for post-implementation phases to give you full control. You can commit manually when satisfied.</action>
  </check>

<goto step="4">Return to review</goto>
</check>

<template-output>implementation_review</template-output>
</step>

<step n="5" goal="Generate unit tests" if="write_unit_test_along_with_task == false">
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

  <check if="commit_strategy == auto">
    <action>Load commit template from {commit_msg_template_path} if available, otherwise use default</action>
    <action>Create commit for fixes following the loaded template format</action>
  </check>

<action>Re-run tests until all pass</action>
</check>

<action>Report test coverage achieved</action>
<action>Add test info to {{implementation_summary}}</action>

<check if="commit_strategy == auto">
  <action>Load commit template from {commit_msg_template_path} if available, otherwise use default</action>
  <action>Create commit for test suite following the loaded template format</action>
</check>

<template-output>unit_tests</template-output>
</step>

<step n="6" goal="Final review and validation">
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

    <action>Inform user: "⚠️  Validation fixes applied. Auto-commit is disabled - please use /generate-commit when ready."</action>

    <check if="commit_strategy == auto">
      <action>Note: Auto-commit is intentionally disabled for validation fixes to give you full control. You can commit manually when satisfied.</action>
    </check>

  </check>
</check>

<action>Present complete implementation summary:

- All phases implemented
- Test coverage achieved
- Total commits made (if auto strategy)
- Files changed count
- Validation status
- Implementation summary available in tech spec</action>

<ask>Final review. Is everything ready for PR? [yes/no/adjust]</ask>

<check if="user says adjust">
  <ask>What needs adjustment?</ask>
  <action>Make the adjustments</action>

<action>Inform user: "⚠️ Final adjustments applied. Auto-commit is disabled - please use /generate-commit when ready."</action>

  <check if="commit_strategy == auto">
    <action>Note: Auto-commit is intentionally disabled for final adjustments to give you full control. You can commit manually when satisfied.</action>
  </check>

<goto step="6">Return to final review</goto>
</check>

<template-output>final_review</template-output>
</step>

<step n="7" goal="Handle manual commits if needed">
<check if="commit_strategy == manual">
  <action>Inform user: "You selected manual commit strategy. Please commit your changes now before creating PR."</action>
  <ask>Have you committed all changes and pushed to remote? [yes/no]</ask>

  <check if="user says no">
    <action>Wait for user to complete commits</action>
    <goto step="7">Return to check again</goto>
  </check>
</check>

<action>Check that current branch is pushed to remote</action>

<template-output>commit_verification</template-output>
</step>

<step n="8" goal="Generate pull request">
<action>Push current branch to remote if not already pushed</action>

<action>Load PR template:

Check if custom template exists at {pr_template_path}:

- If exists: Read and use custom template format and structure
- If not: Use default streamlined format</action>

<action>Generate concise PR description following the loaded template:

**Format Guidelines:**

- Title: [{{jira_proj}}-{{jira_number}}] <brief description in 50 chars>
- Body: Follow the structure from loaded template
- Keep concise and focused on essentials

**Content:**

- Summary of changes (1-2 sentences)
- Jira ticket reference: {{jira_task_number}}
- Link to tech spec document
- Key changes (3-5 bullet points)
- Testing performed and coverage

**What to AVOID:**

- Detailed file lists (reviewers can see diffs)
- Verbose technical explanations (link to tech spec instead)
- Redundant checklists</action>

<action>Display PR preview to user</action>

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

<action>Add final implementation summary to tech spec:

- Completion date
- PR link: {{pr_url}}
- Test coverage achieved: {{coverage_percentage}}
- Any deviations from original plan
- Lessons learned (optional)</action>

<action>Provide completion summary to {user_name}:

✅ **Implementation Complete**

- Tech spec: {{tech_spec_path}}
- Pull request: {{pr_url}}
- Commit strategy used: {{commit_strategy}}
- Total commits: {{commit_count}} (if auto strategy)
- Test coverage: {{coverage_percentage}}
- All phases completed

**Next steps:**

- Request code review on PR
- Monitor CI/CD pipeline
- Address review comments
- Merge when approved
- Update Jira task status</action>

<action>Thank {user_name} for using the Implement Task workflow</action>

<template-output>workflow_completion</template-output>
</step>

<step n="10" goal="Update agent memory with learnings">
<action>Write to Dev Agent's memory file at {project-root}/bmad/sdd/agents/dev-agent-sidecar/memories.md

Append the following structured entry:

---

## Session: {{date}} - {{jira_task_number}} (Implementation Only)

**Task:** {{task_name}}

**Technical Context:**

- Frameworks/Technologies used: [Extract from tech spec and implementation]
- Architecture patterns applied: [Extract from tech spec]
- Key files modified: [List from implementation summary]

**Implementation Approach:**

- Phases completed: [List phase titles from {{implementation_summary}}]
- Commit strategy: {{commit_strategy}}
- Test strategy: {{write_unit_test_along_with_task}}

**Challenges & Solutions:**
[If any significant challenges were encountered during implementation, note them here with solutions applied]

**Code Patterns Observed:**
[Any new patterns discovered during implementation that should be remembered for future work]

**Performance Considerations:**
[Any performance-related decisions or optimizations made during implementation]

**User Preferences Learned:**
[Any preferences the user expressed during this session - commit frequency, code style, testing preferences]

**Tech Spec Accuracy:**

- How well the tech spec predicted actual implementation: [Accurate vs needed adjustments]
- Phases that were added/modified: [List if any]
- Unexpected challenges: [List if any]

**PR Summary:**

- PR URL: {{pr_url}}
- Files changed: [Count from implementation summary]
- Test coverage: {{coverage_percentage}}

**Implementation Quality:**

- Validation status: [All checks passed vs issues found]
- Refactoring done: [Any significant refactoring during implementation]

**Notes for Future:**
[Any insights that would be helpful for similar implementations in the future]

**Calibration for Future Tech Specs:**
[Lessons learned that would help create better tech specs in the future - what was missed, what was over-specified]

---

</action>

<action>Confirm to user in {communication_language}:

✅ Session learnings saved to agent memory

This helps Dev Agent provide better assistance in future sessions by:

- Remembering your coding preferences
- Understanding project patterns
- Improving implementation quality
- Calibrating future tech spec estimates

Memory file: bmad/sdd/agents/dev-agent-sidecar/memories.md
</action>
</step>

</workflow>
