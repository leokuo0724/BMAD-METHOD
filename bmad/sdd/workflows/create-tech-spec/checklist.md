# Create Tech Spec Validation Checklist

## Document Structure

- [ ] File named correctly: `tech-spec-{JIRA_PROJ}-{JIRA_NUMBER}-{task-name}.md`
- [ ] All metadata fields populated (Date, Engineer, Jira, Complexity, Confidence)
- [ ] Markdown formatting correct (headings, lists, code blocks)
- [ ] No placeholder text remaining (no `{{variables}}` unfilled)

## Task Understanding

- [ ] Original task description clearly captured
- [ ] Acceptance criteria documented
- [ ] Business context understood
- [ ] Technical constraints identified

## Technical Solution

- [ ] High-level approach clearly described
- [ ] Architecture considerations documented
- [ ] Key design decisions explained with rationale
- [ ] Aligns with existing project architecture and patterns
- [ ] Security implications considered
- [ ] Performance implications considered

## Scope of Impact

- [ ] All files to be created/modified listed
- [ ] All affected modules/services identified
- [ ] API/interface changes documented
- [ ] Database changes specified (if applicable)
- [ ] Tests that need to be written/updated identified

## Implementation Phases

- [ ] Broken down into 3-6 logical phases
- [ ] Each phase has clear description
- [ ] Each phase lists affected files
- [ ] Phases are ordered logically considering dependencies
- [ ] Each phase is independently committable
- [ ] Each phase is testable
- [ ] Phase sizes are reasonable (1-4 hours each)

## Technical Dependencies

- [ ] External libraries/packages identified
- [ ] Internal service dependencies documented
- [ ] APIs or external services listed
- [ ] Prerequisite tasks identified
- [ ] Version requirements specified where applicable

## Implementation Notes

- [ ] Project patterns to follow documented
- [ ] Naming conventions specified
- [ ] Error handling approach described
- [ ] Logging/monitoring requirements noted
- [ ] Code quality considerations addressed
- [ ] Gotchas and pitfalls documented
- [ ] Security considerations addressed
- [ ] Testing strategy outlined

## Effort Estimation

- [ ] Complexity level assessed (Low/Medium/High)
- [ ] Confidence level provided (Low/Medium/High)
- [ ] Estimated time/effort reasonable
- [ ] Estimation considers all phases
- [ ] Uncertainty factors identified

## Completeness

- [ ] All questions answered (no "TBD" without plan to resolve)
- [ ] Sufficient detail for another engineer to implement
- [ ] No ambiguous language
- [ ] All technical terms defined or referenced
- [ ] All integration points specified

## Quality

- [ ] Spec is clear and unambiguous
- [ ] Technical approach is sound
- [ ] Follows best practices
- [ ] Aligns with team standards
- [ ] Testability built into design
- [ ] Maintainability considered

## Ready for Implementation

- [ ] Engineer can start coding from this spec
- [ ] All unknowns identified and addressed
- [ ] Risk factors documented
- [ ] Clear success criteria
- [ ] Spec reviewed by lead/architect (if required)

## Sign-Off

- [ ] Engineer reviewed and ready to implement
- [ ] Lead/Architect approved (if required)
- [ ] Ready for implement-task workflow

**Validated by:** _____________
**Date:** _____________
