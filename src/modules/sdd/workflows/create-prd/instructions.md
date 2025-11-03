# Create PRD - Standalone PRD Generation Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/create-prd/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Welcome and collect requirement input">
<action>Welcome {user_name} to the Create PRD workflow</action>

<action>Explain the workflow purpose: This is a streamlined PRD generation workflow for when requirements are already clear. It focuses on rapid PRD creation without extensive clarification loops.</action>

<ask>How would you like to provide the requirement?

1. **Jira ticket** - Provide Jira ticket number (e.g., FIS-00001)
2. **Manual input** - Paste or describe the requirement directly

Select [1/2]:</ask>

<action>Store the input method selection as {{input_method}}</action>

<template-output>input_method</template-output>
</step>

<step n="2" goal="Fetch or collect requirement">
<check if="input_method == jira">
  <ask>Please provide the Jira ticket number (e.g., FIS-00001):</ask>

<action>Store as {{jira_ticket_number}}</action>
<action>Parse the ticket number to extract {{jira_proj}} and {{jira_number}}</action>

<action>Attempt to fetch the Jira ticket using the sync-jira utility workflow</action>
<action>Load Jira connection information from {jira_info_path}</action>

  <check if="jira fetch successful">
    <action>Extract requirement details from Jira ticket</action>
    <action>Store as {{requirement_text}}</action>
    <action>Store ticket metadata: title, description, labels, priority, etc.</action>
  </check>

  <check if="jira fetch failed">
    <action>Inform user that Jira connection failed</action>
    <ask>Would you like to:
    1. Provide Jira credentials and retry
    2. Paste the requirement manually instead

    Select [1/2]:</ask>

    <action if="user selected 1">Guide user through Jira setup and retry fetch</action>
    <action if="user selected 2">Switch to manual input mode</action>

  </check>
</check>

<check if="input_method == manual">
  <ask>Please paste or describe the product requirement:

You can include:

- Feature description
- User stories
- Business goals
- Technical constraints
- Any other relevant context</ask>

<action>Store as {{requirement_text}}</action>
<action>Set default values for {{jira_proj}} and {{jira_number}} if needed (e.g., "MANUAL-001")</action>
</check>

<template-output>requirement_input</template-output>
</step>

<step n="3" goal="Initialize PRD template and determine scope">
<ask>What is the scope name for this PRD?

This will be used in the filename: prd-{{jira_proj}}-{{jira_number}}-[scope-name].md

Provide a short, descriptive name in kebab-case (e.g., "global-search", "user-authentication"):</ask>

<action>Store as {{scope_name}}</action>
<action>Validate that scope_name is kebab-case format</action>

<action>Determine the output file path: {output_folder}/prd/prd-{{jira_proj}}-{{jira_number}}-{{scope_name}}.md</action>
<action>Create the output directory if it doesn't exist</action>

<action>Load the PRD template from {prd_template_path}</action>

<template-output>prd_initialization</template-output>
</step>

<step n="4" goal="Quick clarification check" optional="true">
<action>Analyze the {{requirement_text}} for any critical ambiguities or missing information</action>

<action>If any HIGH-PRIORITY gaps are found (scope boundaries, critical acceptance criteria, major technical constraints):</action>

<ask>I've identified a few critical questions that would help ensure PRD accuracy:

{{critical_questions}}

Would you like to:

1. **Answer now** - Address these questions before PRD generation
2. **Skip for now** - Generate PRD with current information (you can edit later)

Select [1/2]:</ask>

<check if="user selected 1">
  <action>Present the critical questions one by one</action>
  <action>Collect and incorporate answers into understanding</action>
</check>

<check if="user selected 2">
  <action>Note the gaps in the PRD as "TO BE CLARIFIED" sections</action>
</check>

<template-output>quick_clarification</template-output>
</step>

<step n="5" goal="Decompose requirements into Epic/Story/Task structure">
<action>Based on the requirements, decompose into a structured breakdown</action>

<action>Determine if this needs an Epic structure:

- If multiple Stories (3+): Create Epic
- If single Story or 2 Stories: Skip Epic level</action>

<check if="epic needed">
  <action>Create Epic with:
    - Epic name (clear, concise)
    - Epic description (overall goal and business value)
    - Epic scope (what's included and excluded)</action>
</check>

<action>Break down into Stories using the PM Agent's story_decomposition principles:

1. Each Story must deliver business value independently
2. Stories should be completable within 1-2 sprints (max 8 points)
3. Stories must have clear acceptance criteria
4. Frontend and backend tasks should be separated
5. Dependencies should be identified and ordered
6. Each task should include unit test considerations</action>

<action>For each Story, create:

- Story name (user-focused, value-driven)
- Story description (what and why)
- Business impact statement (what value does this deliver?)
- Acceptance criteria (Given-When-Then format or checklist)
- Story point estimate using Fibonacci scale (0.5, 1, 2, 3, 5, 8)
- Tasks breakdown (FE and BE separated)</action>

<action>For each Task, define:

- Task description (clear, specific implementation step)
- Technical notes (patterns, libraries, approaches)
- Estimate (included in Story points)
- Test considerations (unit tests needed)</action>

<action>Review the complete breakdown for:

- Logical flow and dependencies
- Balanced Story sizes
- Clear separation of concerns
- Testability of all tasks</action>

<template-output>epic_story_task_breakdown</template-output>
</step>

<step n="6" goal="Generate complete PRD document">
<action>Populate the PRD template with all gathered information:

**Metadata Section:**

- Jira: {{jira_proj}}-{{jira_number}}
- Date: {{date}}
- Author: {{user_name}}
- Scope: {{scope_name}}

**Requirement Overview:**

- Original requirement text
- Refined requirement description
- Key assumptions and decisions

**Epic Section (if applicable):**

- Epic name and description
- Epic goals and scope
- Epic success criteria

**Story Sections:**
For each Story:

- Story name and description
- Business impact statement
- Story points
- Acceptance criteria
- Task breakdown (FE/BE separated)
- Dependencies

**Additional Sections:**

- Technical Dependencies
- Risks and Mitigation
- Out of Scope (explicitly state what's NOT included)</action>

<action>Ensure all variables in the template are replaced with actual content</action>
<action>Format the document with proper markdown structure, headings, and lists</action>
<action>Apply consistent formatting following markdown best practices (blank lines before/after lists, tables, code blocks)</action>
<action>Save the complete PRD to the output file</action>

<template-output>complete_prd_document</template-output>
</step>

<step n="7" goal="Review and finalize">
<action>Present a summary of the completed PRD to {user_name}:
  - File location
  - Number of Epics (if any)
  - Number of Stories
  - Total number of Tasks
  - Total estimated Story Points</action>

<ask>Would you like to:

1. **Complete** - PRD is ready, save and exit
2. **Edit** - Make adjustments to specific sections
3. **Add clarification** - Run deeper analysis on specific areas

Select [1/2/3]:</ask>

<check if="user selected 1 (complete)">
  <action>Confirm the PRD is saved to: {output_folder}/prd/prd-{{jira_proj}}-{{jira_number}}-{{scope_name}}.md</action>
  <action>Provide next steps:
    - Share PRD with stakeholders for review
    - SM creates Jira tickets from Stories/Tasks
    - Dev team uses this as input for dev-flow workflow
    - Use product-flow workflow if deeper requirement clarification is needed</action>
  <action>Thank {user_name} for using the Create PRD workflow</action>
</check>

<check if="user selected 2 (edit)">
  <ask>Which section would you like to edit?
    - Metadata
    - Epic
    - Specific Story (specify which one)
    - Task breakdown
    - Dependencies
    - Other</ask>

<action>Make the requested edits</action>
<action>Save the updated PRD</action>
<goto step="7">Return to review checkpoint</goto>
</check>

<check if="user selected 3 (add clarification)">
  <ask>Which area needs deeper analysis or clarification?</ask>

<action>Generate targeted clarification questions for that area</action>
<action>Collect answers and update the PRD</action>
<action>Save the updated PRD</action>
<goto step="7">Return to review checkpoint</goto>
</check>

<template-output>completion_confirmation</template-output>
</step>

</workflow>
