# Create PRD Validation Checklist

## Document Structure

- [ ] File named correctly: `prd-{JIRA_PROJ}-{JIRA_NUMBER}-{scope-name}.md`
- [ ] All metadata fields populated (Date, Author, Jira, Scope, Status)
- [ ] Markdown formatting correct (headings, lists, code blocks)
- [ ] No placeholder text remaining (no `{{variables}}` unfilled)

## Requirement Quality

- [ ] Original requirement clearly stated
- [ ] Refined requirement addresses key aspects
- [ ] Key assumptions explicitly documented
- [ ] Business value and impact clearly articulated
- [ ] Scope boundaries defined (what's included AND excluded)

## Epic Structure (if applicable)

- [ ] Epic name is clear and descriptive
- [ ] Epic description includes overall goal and business value
- [ ] Epic scope explicitly defines boundaries
- [ ] Epic contains 3+ related Stories

## Story Quality

- [ ] Each Story has a clear, user-focused name
- [ ] Each Story description includes "what" and "why"
- [ ] Each Story has explicit business impact statement
- [ ] Story points assigned using Fibonacci scale (0.5, 1, 2, 3, 5, 8)
- [ ] No Story exceeds 8 points (if so, needs breaking down)

## Acceptance Criteria

- [ ] All Stories have acceptance criteria defined
- [ ] AC is specific and testable (not vague)
- [ ] AC covers happy path scenarios
- [ ] AC includes non-functional requirements where relevant

## Task Breakdown

- [ ] All Stories have task breakdowns
- [ ] Frontend tasks clearly separated from backend tasks
- [ ] Task descriptions are specific and actionable
- [ ] Dependencies between tasks identified

## Technical Details

- [ ] All technical dependencies documented
- [ ] Testing requirements outlined
- [ ] Security considerations addressed (if relevant)

## Risk Management

- [ ] Known risks identified
- [ ] Mitigation strategies provided for each risk
- [ ] Out-of-scope items explicitly listed

## Completeness

- [ ] No ambiguous language ("should", "might", "probably")
- [ ] All user types and personas defined
- [ ] Error handling requirements specified

## SDD Compliance

- [ ] Follows Spec-Driven Development principles
- [ ] Clear enough for Dev Agent to generate tech specs
- [ ] Testability built into all requirements

## Sign-Off

- [ ] PM reviewed and approved
- [ ] Ready for Jira ticket creation
- [ ] Ready for dev-flow workflow

**Validated by:** **\*\***\_**\*\***
**Date:** **\*\***\_**\*\***
