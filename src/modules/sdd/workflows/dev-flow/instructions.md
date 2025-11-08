# Dev Flow - Complete Development Cycle Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/dev-flow/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="0" goal="Ensure Dev Agent is loaded">
<invoke-agent>{project-root}/bmad/sdd/agents/dev-agent.md</invoke-agent>
</step>

<step n="1" goal="Fetch Jira task details">
<ask>Please provide the Jira task number (e.g., FIS-00002):</ask>

<action>Store as {{jira_task_number}} and parse to get {{jira_proj}} and {{jira_number}}</action>
<action>Invoke sync-jira workflow to fetch task details from Jira</action>
<action>Extract task title, description, acceptance criteria, and labels</action>
<action>Check for UI spec links in the Jira ticket (in description, comments, or attachments)</action>
<action>If UI spec link found, store as {{ui_spec_link}}</action>
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

<action>Assess available context window:

**Context Check:**
Estimate remaining context capacity based on tokens used so far for Jira fetch, codebase analysis, and tech spec generation.

**Thresholds:**

- Sufficient (>60% remaining): Proceed normally
- Warning (40-60% remaining): Warn but allow continuation
- Critical (<40% remaining): Strong recommendation to resume in fresh session
</action>

  <check if="estimated remaining context < 40%">
    <action>Display context alert:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ **Context Window Alert**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The codebase analysis has used significant context. To ensure quality implementation with full context available, we recommend resuming in a fresh session.

**Current Status:**
✅ Tech spec complete and saved
📄 Location: {{tech_spec_path}}

**Recommended Next Steps:**

1. **Clear this session** (or start new chat)

2. **Resume implementation:**

   ```
   workflow implement-task
   ```

3. **When prompted, provide tech spec path:**
   ```
   {{tech_spec_path}}
   ```

This will:

- Load your tech spec (no re-analysis needed)
- Give you full context window for implementation
- Ensure high-quality code generation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

    <ask>Would you like to:

1. **Stop here** - Resume in fresh session (recommended ⭐)
2. **Continue anyway** - Proceed with current context (may hit limits)

Select [1/2]:</ask>

    <check if="user selected 1">
      <action>Display completion message:

✅ **Tech Spec Ready**

Your tech spec is saved and ready for implementation.

**Tech Spec:** {{tech_spec_path}}

**To resume:**

1. Start a new session
2. Run: `workflow implement-task`
3. Provide: {{tech_spec_path}}

Thank you for using dev-flow! 🚀
</action>
<goto step="end">Exit workflow</goto>
</check>

    <check if="user selected 2">
      <action>Warn user: "Proceeding with limited context. If you encounter issues, you can always resume later using `workflow implement-task`."</action>
    </check>

  </check>

  <check if="estimated remaining context between 40-60%">
    <action>Display context notice:

ℹ️ **Context Window Notice**

Moderate context has been used. Implementation should complete, but for optimal results, you can resume in a fresh session.

**Current:** Tech spec saved to {{tech_spec_path}}
**Resume:** `workflow implement-task` (in new session)

Continue with current session? [yes/no]</action>

    <check if="user says no">
      <action>Display resume instructions and exit</action>
      <goto step="end">Exit workflow</goto>
    </check>

  </check>

<ask>Choose commit strategy for implementation:

1. **Auto-commit per phase** - AI automatically creates commits after each phase (recommended for streamlined workflow)
2. **Manual commit control** - You decide when to commit (provides more flexibility)

Select [1/2]:</ask>

<action if="user selected 1">Set {{commit_strategy}} = "auto"</action>
<action if="user selected 2">Set {{commit_strategy}} = "manual"</action>

<action>Inform user: "Commit strategy set to {{commit_strategy}}. Proceeding to implementation..."</action>

<action>Invoke implement-task workflow with parameters:

- tech_spec_path: {{tech_spec_path}}
- commit_strategy: {{commit_strategy}}
- jira_task_number: {{jira_task_number}}</action>

<action>Note: The implement-task workflow will handle all implementation, testing, and PR creation steps. When it completes, return here for final summary.</action>
</check>

<template-output>tech_spec_approval</template-output>
</step>

<step n="4" goal="Implementation via implement-task workflow">
<action>The implement-task workflow is now handling:
- Phase-by-phase implementation
- Unit test generation (if configured)
- Commits (based on selected strategy)
- Final validation
- Pull request creation
- Tech spec updates</action>

<action>Wait for implement-task workflow to complete...</action>

<template-output>implementation_delegated</template-output>
</step>

<step n="5" goal="Complete dev-flow and provide summary">
<action>Implement-task workflow has completed successfully</action>

<action>Provide dev-flow completion summary to {user_name}:

✅ **Dev-Flow Complete**

**Journey:**

1. ✅ Fetched Jira task: {{jira_task_number}}
2. ✅ Generated tech spec with codebase analysis
3. ✅ Selected commit strategy: {{commit_strategy}}
4. ✅ Implemented all phases via implement-task workflow
5. ✅ Created pull request

**Results:**

- Tech spec: {{tech_spec_path}}
- Pull request: {{pr_url}}
- Commit strategy used: {{commit_strategy}}

**Next steps:**

- Review the PR on GitHub
- Request code reviewers
- Monitor CI/CD checks
- Address review feedback
- Merge when approved
- Update Jira task status to "Done"

Thank you for using Dev-Flow! 🚀
</action>

<template-output>workflow_completion</template-output>
</step>

<step n="11" goal="Update agent memory with learnings">
<action>Write to Dev Agent's memory file at {project-root}/bmad/sdd/agents/dev-agent-sidecar/memories.md

Append the following structured entry:

---

## Session: {{date}} - {{jira_task_number}}

**Task:** {{task_name}}

**Technical Context:**

- Frameworks/Technologies used: [Extract from codebase analysis]
- Architecture patterns applied: [Extract from tech spec]
- Key files modified: [List from implementation]

**Implementation Approach:**

- Phases completed: [List phase titles]
- Commit strategy: {{commit_strategy}}
- Test strategy: {{write_unit_test_along_with_task}}

**Challenges & Solutions:**
[If any significant challenges were encountered during implementation, note them here with solutions applied]

**Code Patterns Observed:**
[Any new patterns discovered in the codebase that should be remembered for future implementations]

**Performance Considerations:**
[Any performance-related decisions or optimizations made]

**User Preferences Learned:**
[Any preferences the user expressed during this session - code style, naming, architecture choices]

**Tech Spec Quality:**

- Accuracy: [How well the tech spec matched actual implementation]
- Completeness: [Were all phases necessary? Any missing?]

**PR Summary:**

- PR URL: {{pr_url}}
- Files changed: [Count]
- Test coverage: [If available]

**Notes for Future:**
[Any insights that would be helpful for similar tasks in the future]

---

</action>

<action>Confirm to user in {communication_language}:

✅ Session learnings saved to agent memory

This helps Dev Agent provide better assistance in future sessions by:

- Remembering your coding preferences
- Understanding project patterns
- Improving tech spec accuracy
- Recognizing common challenges

Memory file: bmad/sdd/agents/dev-agent-sidecar/memories.md
</action>
</step>

</workflow>
