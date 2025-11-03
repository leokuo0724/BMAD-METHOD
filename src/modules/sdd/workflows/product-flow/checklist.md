# Product Flow PRD Validation Checklist

## Document Structure

- [ ] File named correctly: `prd-{JIRA_PROJ}-{JIRA_NUMBER}-{scope-name}.md`
- [ ] All metadata fields populated (Date, Author, Jira, Scope, Status)
- [ ] Markdown formatting correct (headings, lists, code blocks)
- [ ] No placeholder text remaining (no `{{variables}}` unfilled)
- [ ] Table of contents or section links if document is long (>500 lines)

## Requirement Quality

- [ ] Original requirement clearly stated
- [ ] Clarified requirement addresses all ambiguities from original
- [ ] Key assumptions explicitly documented
- [ ] Business value and impact clearly articulated
- [ ] Scope boundaries defined (what's included AND excluded)
- [ ] All technical terminology defined or referenced

## Epic Structure (if applicable)

- [ ] Epic name is clear and descriptive
- [ ] Epic description includes overall goal and business value
- [ ] Epic scope explicitly defines boundaries
- [ ] Epic contains 3+ related Stories
- [ ] Epic success criteria defined

## Story Quality

- [ ] Each Story has a clear, user-focused name
- [ ] Each Story description includes "what" and "why"
- [ ] Each Story has explicit business impact statement
- [ ] Each Story delivers value independently
- [ ] Story points assigned using Fibonacci scale (0.5, 1, 2, 3, 5, 8)
- [ ] No Story exceeds 8 points (if so, needs breaking down)
- [ ] Stories are ordered logically with dependencies noted

## Acceptance Criteria

- [ ] All Stories have acceptance criteria defined
- [ ] AC uses "Given-When-Then" format OR checklist format consistently
- [ ] AC is specific and testable (not vague)
- [ ] AC covers happy path scenarios
- [ ] AC covers edge cases and error handling
- [ ] AC includes non-functional requirements (performance, security) where relevant

## Task Breakdown

- [ ] All Stories have task breakdowns
- [ ] Frontend tasks clearly separated from backend tasks
- [ ] Each task is granular enough to include unit tests
- [ ] Task descriptions are specific and actionable
- [ ] Technical notes provided for complex tasks
- [ ] Dependencies between tasks identified
- [ ] Estimated effort reasonable (tasks typically 0.5-2 points each)

## Technical Details

- [ ] All technical dependencies documented
- [ ] External systems and APIs identified
- [ ] Database/schema changes noted
- [ ] Performance requirements specified
- [ ] Security considerations addressed
- [ ] Testing requirements (unit, integration, E2E) outlined

## Risk Management

- [ ] Known risks identified
- [ ] Risk impact and likelihood assessed
- [ ] Mitigation strategies provided for each risk
- [ ] Technical challenges highlighted
- [ ] Out-of-scope items explicitly listed

## Completeness

- [ ] All questions from clarification phase addressed
- [ ] No ambiguous language ("should", "might", "probably")
- [ ] All user types and personas defined
- [ ] Data models or structures described
- [ ] Error handling requirements specified
- [ ] Integration points documented

## Story Point Validation

- [ ] Total story points reasonable for scope
- [ ] Story point distribution balanced (not all 8s or all 0.5s)
- [ ] Estimates consider complexity, uncertainty, and dependencies
- [ ] Frontend and backend estimates proportional to work

## Readability and Clarity

- [ ] Document flows logically from overview to details
- [ ] Technical and non-technical readers can understand their relevant sections
- [ ] Consistent terminology throughout
- [ ] Examples provided where helpful
- [ ] Diagrams or visuals included for complex flows (if applicable)

## SDD Compliance

- [ ] Follows Spec-Driven Development principles
- [ ] Specification-first approach evident
- [ ] Clear enough for Dev Agent to generate tech specs
- [ ] Testability built into all requirements
- [ ] Documentation serves as organizational knowledge

## Final Validation

### Critical Issues (Must fix before proceeding)

List any critical issues that would block development:

### Minor Issues (Should fix but not blocking)

List any minor issues that can be addressed later:

### Recommendations

List any recommendations for improvement:

---

## Sign-Off

- [ ] PM reviewed and approved
- [ ] Stakeholders reviewed and approved (if required)
- [ ] Ready for Jira ticket creation
- [ ] Ready for dev-flow workflow

**Validated by:** **\*\***\_**\*\***
**Date:** **\*\***\_**\*\***
