# Dev Flow - Complete Development Cycle Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/dev-flow/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="0" goal="Ensure Dev Agent is loaded">
<invoke-agent>{project-root}/bmad/sdd/agents/dev-agent.md</invoke-agent>
</step>

<step n="1" goal="Fetch Jira task details and UI specifications">
<ask>Please provide the Jira task number (e.g., FIS-00002):</ask>

<action>Store as {{jira_task_number}} and parse to get {{jira_proj}} and {{jira_number}}</action>
<action>Invoke sync-jira workflow to fetch task details from Jira</action>
<action>Extract task title, description, acceptance criteria, and labels</action>
<action>Check for UI spec links in the Jira ticket (in description, comments, or attachments)</action>
<action>If UI spec link found, store as {{ui_spec_link}}</action>
<action>Analyze {{ui_spec_link}} to determine if it's a Figma link (contains 'figma.com')</action>

<check if="ui_spec_link is Figma link">
  <action>Check if Figma MCP server is available by testing MCP connection</action>

  <check if="Figma MCP available">
    <action>Inform user: "📐 Figma design spec detected. Reading design specifications from Figma..."</action>
    <action>Use Figma MCP to fetch design specifications:
    - Extract Figma file ID from {{ui_spec_link}}
    - Read design components, layout, styling specifications
    - Capture design tokens (colors, spacing, typography)
    - Extract component hierarchy and interactions
    - Note any design annotations or developer notes</action>
    <action>Store Figma design data as {{figma_spec}}</action>
    <action>Inform user: "✅ Figma specifications loaded successfully. This will be included in tech spec generation."</action>
  </check>

  <check if="Figma MCP not available">
    <action>Inform user: "ℹ️ Figma link detected but Figma MCP not configured. Tech spec will reference the Figma link but won't include detailed design specifications. Consider setting up Figma MCP for automatic design spec extraction."</action>
    <action>Set {{figma_spec}} = "Figma link: {{ui_spec_link}} (MCP not available - manual review required)"</action>
  </check>
</check>

<action if="ui_spec_link is not Figma link">Set {{figma_spec}} = null</action>

<action>Store all task information as {{task_details}}</action>
<action>Inform user: "✅ Successfully fetched Jira task {{jira_task_number}}.

Task details loaded. Proceeding to analyze codebase context..."</action>
<action>Automatically continue to Step 2 for codebase analysis</action>
</step>

<step n="2" goal="Load codebase context and generate initial tech spec">
<critical>⚠️ AGENT SCOPE RESTRICTION - Use ONLY dev-agent capabilities for analysis. DO NOT invoke agents from other modules (BMM, BMB, etc.). All analysis must be performed by dev-agent using its own analyze-codebase capabilities or analyze-architecture workflow from SDD module.</critical>

<check if="tech_architecture_doc_path exists">
  <action>Load and study architecture documentation</action>
</check>

<check if="tech_architecture_doc_path not available">
  <action>Perform codebase analysis using SDD's analyze-architecture workflow at {project-root}/bmad/sdd/workflows/analyze-architecture/workflow.yaml to infer architecture</action>
  <action>Note: This ensures we use SDD module's own analysis tools, not external module agents</action>
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
- **UI/UX Specifications** (if {{figma_spec}} exists): Include Figma design specifications with:
  - Design components and their properties
  - Layout and responsive behavior requirements
  - Design tokens (colors, spacing, typography)
  - Component interactions and states
  - Accessibility considerations from design
  - Link to original Figma file: {{ui_spec_link}}
- **Scope of Impact**: All files and modules that will be affected
- **Task Breakdown**: Break into 3-6 logical implementation phases based on {unit_testing_strategy} strategy:
  - If strategy is "tdd-first-phase": Phase 1 must be "Write test specifications (TDD)" with all test files, remaining phases are implementation
  - If strategy is "per-phase": Each implementation phase includes tests written after implementation
  - If strategy is "end-of-implementation": Implementation phases come first, final phase is "Write comprehensive unit tests"
  - Include UI implementation phase if Figma spec exists
- **Test Strategy**: Document the selected testing approach ({unit_testing_strategy})
- **Technical Dependencies**: Libraries, services, APIs, other tasks (include design system dependencies if applicable)
- **Implementation Notes**: Patterns to follow, conventions, gotchas (include design-to-code translation notes if Figma spec exists)
- **Effort Estimation**: Complexity (Low/Medium/High), Confidence level
- **Status**: Set to "Planning"</action>

<action>Initialize Phase Status Tracking table:

Parse the "Task Breakdown" section and create a status tracking table:

- Extract each phase number and description
- Create table row for each phase with initial status "⏸️ Pending"
- Set initial Commit column to "⏳ TBD" (will be updated when workflow strategy is selected)
- Format: | Phase# | Phase Description | ⏸️ Pending | ⏳ TBD | - |
- Replace {{phase_status_table}} placeholder in template with actual table rows

This enables real-time phase tracking during implementation.</action>

<action>Set initial workflow configuration values in tech spec:

- **Test Strategy**: Set to {unit_testing_strategy} value from config
- **Commit Strategy**: Set to "Not selected yet (will be set during implementation)"

These will be displayed in the "Workflow Configuration" section of the tech spec.</action>

<action>Save to: {tech_spec_output_file}</action>
<action>Store tech spec path as {{tech_spec_path}}</action>
<action>Display the tech spec to {user_name}</action>
<action>Inform user: "✅ Tech spec generated and saved to: {{tech_spec_path}}

Codebase context analysis is included in the document. Proceeding to review..."</action>
<action>Automatically continue to Step 3 for formal review and approval</action>
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

<ask>Choose implementation strategy:

1. 🚀 **Full Auto with PR** - Fastest (auto commit, auto continue, auto PR)
2. ⚡ **Full Auto without PR** - Fast with PR control (auto commit, auto continue, ask PR)
3. 🎯 **Semi-Auto with Commit** - Review between phases (auto commit, ask continue, ask PR)
4. 👤 **Manual Control** - Full control (manual commit, ask continue, ask PR)

Select [1/2/3/4]:</ask>

<action if="user selected 1">Set {{workflow_strategy}} = "full-auto-with-pr"</action>
<action if="user selected 2">Set {{workflow_strategy}} = "full-auto-without-pr"</action>
<action if="user selected 3">Set {{workflow_strategy}} = "semi-auto-with-commit"</action>
<action if="user selected 4">Set {{workflow_strategy}} = "manual"</action>

<action>Update tech spec with selected workflow strategy:

Find the "Workflow Configuration" section in {{tech_spec_path}} and update:

**Commit Strategy:** {{workflow_strategy}}

This ensures the commit behavior is documented in the tech spec.</action>

<action>Update Phase Status Tracking table with commit expectations:

Parse {{workflow_strategy}} to determine commit behavior for each phase:

- If strategy is "full-auto-with-pr", "full-auto-without-pr", or "semi-auto-with-commit":
  - Update Commit column for ALL phases to "✅ Auto" (auto-commit after each phase)

- If strategy is "manual":
  - Update Commit column for ALL phases to "👤 Manual" (user commits manually)

Update each row in the Phase Status Tracking table accordingly.

This provides clear visibility of which phases will auto-commit.</action>

<action>Inform user: "✅ Implementation strategy set to {{workflow_strategy}}.

Tech spec updated with commit strategy. Starting implementation workflow..."</action>

<action>Invoke implement-task workflow with parameters:

- tech_spec_path: {{tech_spec_path}}
- workflow_strategy: {{workflow_strategy}}
- jira_task_number: {{jira_task_number}}</action>

<action>Note: The implement-task workflow will handle all implementation, testing, and PR creation steps. When it completes, return here for final summary.</action>
</check>

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
</step>

<step n="5" goal="Complete dev-flow and provide summary">
<action>Implement-task workflow has completed successfully</action>

<action>Provide dev-flow completion summary to {user_name}:

✅ **Dev-Flow Complete**

**Journey:**

1. ✅ Fetched Jira task: {{jira_task_number}}
2. ✅ Generated tech spec with codebase analysis
3. ✅ Selected implementation strategy: {{workflow_strategy}}
4. ✅ Implemented all phases via implement-task workflow
5. ✅ Created pull request

**Results:**

- Tech spec: {{tech_spec_path}}
- Pull request: {{pr_url}}
- Implementation strategy used: {{workflow_strategy}}

**Next steps:**

- Review the PR on GitHub
- Request code reviewers
- Monitor CI/CD checks
- Address review feedback
- Merge when approved
- Update Jira task status to "Done"

Thank you for using Dev-Flow! 🚀
</action>
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
- Test strategy: {{unit_testing_strategy}}

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
