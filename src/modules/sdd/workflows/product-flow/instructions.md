# Product Flow - PRD Generation Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/product-flow/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow</critical>

<workflow>

<step n="1" goal="Welcome and determine input method">
<action>Welcome {user_name} to the Product Flow workflow</action>

<action>Explain the workflow purpose: Transform product requirements into a structured PRD with Epic/Story/Task breakdown following Spec-Driven Development methodology</action>

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
    <action>Inform user: "Successfully fetched Jira ticket {{jira_ticket_number}}. Proceeding to analyze requirement..."</action>
    <action>Automatically proceed to next step without waiting for user input</action>
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

<step n="3" goal="Initialize PRD template">
<action>Create the PRD document structure using the template at {prd_template_path}</action>

<action>Analyze the {{requirement_text}} and generate a concise scope name automatically:

Guidelines for scope name generation:

- Extract the core feature or capability from the requirement
- Use kebab-case format (lowercase with hyphens)
- Keep it short and descriptive (2-4 words maximum)
- Focus on the "what" not the "how"
- Examples: "global-search", "user-authentication", "payment-gateway", "notification-system"

Generate the scope name based on requirement analysis.</action>

<action>Store the generated name as {{scope_name}}</action>
<action>Inform user: "Generated scope name: {{scope_name}}"</action>

<action>Determine the output file path: {output_folder}/prd/prd-{{jira_proj}}-{{jira_number}}-{{scope_name}}.md</action>
<action>Create the output directory if it doesn't exist</action>

<action>Write the initial template to the output file with metadata populated:

- Jira ticket number
- Date: {{date}}
- Author: {{user_name}}
- Scope: {{scope_name}}</action>

<template-output>prd_initialization</template-output>
</step>

<step n="4" goal="Analyze requirement and generate clarifying questions">
<action>Analyze the {{requirement_text}} systematically to identify gaps, ambiguities, and areas needing clarification</action>

<action>Apply the PM Agent's requirement_analysis framework with PM-level focus (avoid deep technical details):

1. **Clarity**: Are all terms and features clearly defined from user/business perspective?
2. **Completeness**: Are all user scenarios and use cases covered?
3. **Testability**: Can we verify completion from business/product perspective?
4. **Scope**: Are boundaries well-defined? What's in and out of scope?
5. **Dependencies**: What other features or systems does this depend on?
6. **Impact**: What business value is delivered? Who are the users?</action>

<action>Generate targeted clarifying questions at PM-appropriate level organized by category:

**Product-level questions (focus here):**

- Scope and Boundaries - What's included/excluded?
- User Experience and Behavior - How will users interact with this?
- Business Value - What problem does this solve?
- Success Criteria - How do we measure success?
- User Personas - Who are the target users?

**Avoid overly technical questions such as:**

- Implementation details (database schema, API design, etc.)
- Code architecture decisions
- Low-level technical constraints
- Infrastructure concerns

Keep questions at product/feature level, not implementation level.</action>

<action>Initialize clarification record to be saved in the PRD document later:

Store all Q&A pairs in {{clarification_qa}} for inclusion in final document</action>

<action>Inform user: "I've identified several product-level areas that need clarification before I can create a complete PRD. Let's work through these questions together. All Q&A will be documented in the final PRD."</action>

<template-output>clarification_questions</template-output>
</step>

<step n="5" goal="Interactive clarification loop" repeat="until-approved">
<action>Present the clarification questions to the user, focusing on the highest-priority categories first</action>

<action>For each question:

- Ask the question clearly
- Wait for user response
- Record both question AND answer in {{clarification_qa}} list
- Probe deeper if the answer is vague or incomplete (but stay at PM level)
- Confirm understanding by restating the answer</action>

<action>As answers are collected:

- Update your understanding of the requirement
- Append to {{clarification_qa}} in structured format:

  **Q:** [Question text]
  **A:** [Answer from user]</action>

<action>After each round of questions, assess whether:

- All critical product/business ambiguities are resolved
- The requirement is now clear enough to decompose into Epic/Story/Task
- Any new product-level questions have emerged from the answers</action>

<check if="new questions emerged">
  <action>Present the new questions and continue the clarification loop</action>
  <action>Continue recording all Q&A in {{clarification_qa}}</action>
</check>

<check if="user indicates clarity or all questions answered">
  <action>Summarize the complete understanding of the requirement</action>
  <action>Prepare the complete {{clarification_qa}} section for inclusion in PRD</action>
  <ask>Does this summary accurately capture the requirement? Is there anything else we need to clarify? [yes - proceed / no - continue clarifying]</ask>

<action if="user confirms yes">Break the loop and proceed to step 6</action>
<action if="user says no">Ask what needs further clarification and continue the loop</action>
</check>

<template-output>clarified_requirements</template-output>
</step>

<step n="6" goal="Decompose requirements into Epic/Story/Task structure">
<action>Based on the clarified requirements, decompose into a structured breakdown</action>

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
2. Stories should be completable within 1-2 sprints
3. Stories must have clear acceptance criteria
4. Frontend and backend tasks should be separated (different developers)
5. Dependencies should be identified and ordered
6. Each task should include unit test considerations</action>

<action>For each Story, create:

- Story name (user-focused, value-driven)
- Story description (what and why)
- Business impact statement (what value does this deliver?)
- Acceptance criteria (Given-When-Then format or checklist)
- Tasks breakdown (FE and BE separated)

**CRITICAL:** Story-level points are NOT estimated. Story points = sum of all Task points.</action>

<action>For each Task, define and estimate:

- Task description (clear, specific implementation step)
- Task type (Frontend or Backend)
- **Story point estimate using Fibonacci scale (0.5, 1, 2, 3, 5, 8)**
  - 0.5 points (4 hours) - Trivial changes, minimal risk
  - 1 point (8 hours) - Simple, well-understood tasks
  - 2 points (16 hours) - Moderate complexity
  - 3 points (24 hours) - Complex but clear approach
  - 5 points (40 hours) - Significant complexity or uncertainty
  - 8 points (64 hours) - Maximum task size, consider breaking down
- Technical notes (patterns, libraries, approaches - high-level only)
- Test considerations (unit tests needed)

**Estimation considerations:**

- Frontend and Backend are estimated separately since different developers will work on them
- Consider complexity, uncertainty, dependencies, and testing requirements
- Each task represents atomic work that one developer completes</action>

<action>Calculate Story-level points:

For each Story:

- Sum all Task points to get Story total
- Story points = SUM(all frontend task points + all backend task points)</action>

<action>Review the complete breakdown for:

- Logical flow and dependencies
- Balanced Task sizes (prefer 1-3 points, avoid many 5-8 point tasks)
- Clear separation of concerns (FE/BE)
- Testability of all tasks
- Realistic estimates per task</action>

<template-output>epic_story_task_breakdown</template-output>
</step>

<step n="7" goal="Fill complete PRD document">
<action>Populate the PRD template with all gathered information:

**Metadata Section:**

- Jira: {{jira_proj}}-{{jira_number}}
- Date: {{date}}
- Author: {{user_name}}
- Scope: {{scope_name}}

**Requirement Overview:**

- Original requirement text
- Clarified and refined requirement description
- Key assumptions and decisions

**Clarification Q&A Section (NEW):**

- Include the complete {{clarification_qa}} record
- Format as a clear Q&A list showing the collaborative clarification process
- This provides context for future readers on how requirements were refined
- Title: "## Clarification History"

**Epic Section (if applicable):**

- Epic name and description
- Epic goals and scope
- Epic success criteria

**Story Sections:**
For each Story:

- Story name and description
- Business impact statement
- **Story points (calculated as sum of all task points)**
- Acceptance criteria
- Task breakdown with the following for each task:
  - Task description
  - Task type (Frontend/Backend)
  - **Task story points** (individual estimate)
  - Technical notes (high-level)
  - Test considerations
- Dependencies

**Additional Sections:**

- Technical Dependencies
- Risks and Mitigation
- Out of Scope (explicitly state what's NOT included)</action>

<action>Ensure all variables in the template are replaced with actual content</action>
<action>Format the document with proper markdown structure, headings, and lists</action>
<action>Ensure Task-level story points are clearly displayed for each task</action>
<action>Ensure Story-level points show as sum of task points</action>
<action>Save the complete PRD to the output file</action>

<template-output>complete_prd_document</template-output>
</step>

<step n="8" goal="Review and confirm">
<action>Present a summary of the completed PRD to {user_name}:
  - File location
  - Number of Epics (if any)
  - Number of Stories
  - Total number of Tasks
  - Total estimated Story Points</action>

<action>Display key sections or provide a preview of the PRD</action>

<ask>Would you like to:

1. **Complete** - PRD is ready, save and exit
2. **Edit** - Make adjustments to specific sections
3. **Regenerate** - Regenerate specific sections with different approach

Select [1/2/3]:</ask>

<check if="user selected 1 (complete)">
  <action>Confirm the PRD is saved to: {output_folder}/prd/prd-{{jira_proj}}-{{jira_number}}-{{scope_name}}.md</action>
  <action>Provide next steps:
    - Share PRD with stakeholders for review
    - SM creates Jira tickets from Stories/Tasks
    - Dev team uses this as input for dev-flow workflow</action>
  <action>Thank {user_name} for using the Product Flow workflow</action>
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
<goto step="8">Return to review checkpoint</goto>
</check>

<check if="user selected 3 (regenerate)">
  <ask>Which section would you like to regenerate? Provide details on what you'd like different.</ask>

<action>Regenerate the specified section with the new guidance</action>
<action>Save the updated PRD</action>
<goto step="8">Return to review checkpoint</goto>
</check>

<template-output>completion_confirmation</template-output>
</step>

</workflow>
