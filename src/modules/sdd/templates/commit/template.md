# Commit Message Template for SDD Module

## Streamlined Format (Recommended)

```
<type>: <brief description>

Jira: <PROJ-NUM>
```

## Type

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Guidelines

- Keep subject line under 50 characters
- Use imperative mood (e.g., "add", "fix", "update")
- Skip detailed body unless complex changes require explanation
- Always include Jira reference
- Focus on WHAT changed, not HOW (code diff shows how)

## Examples

**Simple Feature:**

```
feat: add user authentication endpoint

Jira: PROJ-123
```

**Bug Fix:**

```
fix: resolve login session timeout issue

Jira: PROJ-124
```

**Complex Change (when body is needed):**

```
refactor: restructure authentication flow

Changed from session-based to JWT tokens to support
mobile apps and improve scalability.

Jira: PROJ-125
```

**Test Addition:**

```
test: add unit tests for auth service

Jira: PROJ-123
```
