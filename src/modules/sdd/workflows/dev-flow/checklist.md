# Dev Flow Implementation Validation Checklist

## Tech Spec Quality

- [ ] Tech spec document created and saved
- [ ] All metadata fields populated
- [ ] Technical solution clearly described
- [ ] UI/UX specifications included (if Figma link present in Jira)
- [ ] Figma design specs properly integrated (if Figma MCP available)
- [ ] Complete scope of impact documented
- [ ] Logical task breakdown into phases
- [ ] All dependencies identified (including design system if UI task)
- [ ] Implementation notes provided
- [ ] Effort estimation completed
- [ ] Status field maintained throughout

## Implementation Quality

- [ ] All phases from tech spec implemented
- [ ] Code follows project patterns and conventions
- [ ] Naming is consistent with codebase
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled
- [ ] Complex logic is documented with comments
- [ ] No debug code or console.logs left behind
- [ ] Code is properly formatted (linting passes)

## Test Coverage

- [ ] Unit tests written for all new code
- [ ] Test coverage >80% achieved
- [ ] Happy path tests included
- [ ] Edge case tests included
- [ ] Error handling tests included
- [ ] All tests pass successfully
- [ ] Tests follow project test patterns
- [ ] Tests are maintainable and clear

## Git Workflow

- [ ] Phased commits created (one per implementation phase)
- [ ] Commit messages follow template
- [ ] Jira ticket referenced in all commits
- [ ] Commits are atomic and focused
- [ ] No broken code committed
- [ ] Branch naming follows conventions
- [ ] All commits pushed to remote

## Pull Request

- [ ] PR created using gh command
- [ ] PR title includes Jira ticket number
- [ ] PR description follows template
- [ ] Tech spec linked in PR
- [ ] Testing approach described
- [ ] Breaking changes documented (if any)
- [ ] Screenshots included (if UI changes)
- [ ] Deployment notes provided (if needed)

## Code Review Readiness

- [ ] Code is self-documenting where possible
- [ ] Complex decisions are explained in comments or PR
- [ ] No obvious bugs or issues
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Accessibility considered (if UI)

## Documentation

- [ ] Tech spec accurately reflects implementation
- [ ] README updated if needed
- [ ] API documentation updated if needed
- [ ] Architecture docs updated if new patterns added

## SDD Compliance

- [ ] Spec-first approach followed
- [ ] Tech spec created before implementation
- [ ] Implementation matches spec
- [ ] All deviations from spec documented
- [ ] Knowledge captured in tech spec
- [ ] Only SDD module agents/tools used (no BMM or other module agents)
- [ ] Codebase analysis performed using dev-agent or SDD's analyze-architecture workflow

## Final Validation

- [ ] Human review completed and approved
- [ ] All adjustments made and committed
- [ ] Tests pass in CI/CD (if applicable)
- [ ] Ready for team code review
- [ ] Ready for merge

---

**Completed by:** {{user_name}}
**Date:** {{date}}
**Jira Task:** {{jira_task_number}}
**PR URL:** {{pr_url}}
