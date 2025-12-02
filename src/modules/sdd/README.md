# Spec-Driven Development (SDD) Module

AI-assisted development workflows that transform Jira tasks into production-ready code through structured specifications and phased implementation.

## Overview

The SDD module provides a **spec-first approach** to software development:

- **Structured Planning**: Generate technical specifications before coding
- **Phased Implementation**: Break down work into reviewable phases
- **AI-Human Collaboration**: AI handles execution, humans provide oversight
- **Jira Integration**: Seamlessly fetch task details and context

## Quick Start

### 1. Install the Module

```bash
npm run install:bmad
```

Select the **SDD** module during installation. The installer will prompt for configuration options including Jira credentials path and output locations.

### 2. Configure Jira Connection

Create a credentials file at the path you specified during installation (default: `.env`):

```env
JIRA_API_URL=https://your-domain.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_USER_EMAIL=your_email@domain.com
```

### 3. Generate Architecture Documentation (Recommended)

Before starting development, generate architecture docs to help AI understand your codebase:

```
/sdd:dev-agent:analyze-architecture
```

This creates structured documentation about your project's patterns, conventions, and architecture. See [analyze-architecture](#analyze-architecture) for details.

### 4. Start Development

Use your installed AI tool (Claude Code, Cursor, etc.) to invoke the dev-flow:

```
/sdd:dev-agent:dev-flow
```

When prompted, enter your Jira task number (e.g., `FIS-123`). The workflow will:

1. Fetch task details from Jira
2. Analyze your codebase (referencing architecture docs if available)
3. Generate a technical specification
4. Implement the solution phase-by-phase
5. Run tests and create a pull request

## Configuration

The module is configured via `bmad/sdd/config.yaml` (generated during installation).

### Key Settings

| Setting                      | Description                                    | Default                   |
| ---------------------------- | ---------------------------------------------- | ------------------------- |
| `jira_info_path`             | Path to `.env` file with Jira credentials      | `{project-root}/.env`     |
| `output_document_path`       | Where to save PRDs and tech specs              | `{project-root}/docs/sdd` |
| `tech_architecture_doc_path` | Architecture documentation location (optional) | -                         |
| `unit_testing_strategy`      | Testing approach during implementation         | `per-phase`               |

### Unit Testing Strategies

| Strategy                | Description                                 | Best For                                     |
| ----------------------- | ------------------------------------------- | -------------------------------------------- |
| `per-phase`             | Write tests after each implementation phase | Continuous validation, catching issues early |
| `end-of-implementation` | Write all tests in final phase              | Faster initial implementation, batch testing |
| `tdd-first-phase`       | Write all tests first, then implement       | Test-driven development, stable requirements |

## Core Workflows

### dev-flow ⭐

**Complete development cycle from Jira task to pull request.**

This is the primary workflow for implementing tasks. It combines planning and execution into a single guided process.

#### Usage

```
/sdd:dev-agent:dev-flow
```

#### Process

1. **Fetch Jira Task** - Retrieves task details and requirements
2. **Analyze Codebase** - Scans project patterns and architecture
3. **Generate Tech Spec** - Creates detailed implementation plan with phases
4. **Review Tech Spec** - You approve the plan before implementation
5. **Implement Phases** - Executes each phase with your oversight
6. **Run Tests** - Generates and executes unit tests (based on strategy)
7. **Create Pull Request** - Generates PR with summary and changes

#### Commit Strategy

After reviewing the tech spec, you can choose:

- **Auto-commit**: Commits after each phase automatically (concise messages)
- **Manual commit**: Pause after each phase for manual control

#### Context Window Management

Dev-flow automatically monitors context usage and will recommend the best path:

- **Sufficient context (>60%)**: Proceeds automatically
- **Warning level (40-60%)**: Offers choice to continue or start fresh session
- **Critical level (<40%)**: Recommends resuming in new session

#### Resuming in a New Session

If context is low after tech spec generation, or if you want to implement later:

```
/sdd:dev-agent:implement-task
```

When prompted, provide the tech spec path:

```
docs/sdd/tech-spec/tech-spec-FIS-123-feature-name.md
```

This loads your existing tech spec and continues with implementation phases.

#### Output

- **Tech Spec**: `docs/sdd/tech-spec/tech-spec-{PROJ}-{NUM}-{task}.md`
- **Pull Request**: Created via GitHub CLI with summary

#### Example Session

```
> /sdd:dev-agent:dev-flow
? Enter Jira task number: FIS-456

Fetching task details...
✓ Task: Implement user authentication endpoint

Analyzing codebase...
✓ Detected: TypeScript, Express, Jest

Generating tech spec...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 Tech Spec Generated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Implementation Phases

Phase 1: Create auth service with JWT handling
Phase 2: Implement login/logout endpoints
Phase 3: Add middleware for route protection
Phase 4: Write unit tests

? Choose commit strategy: Auto-commit
? Proceed with implementation? Yes

Implementing Phase 1...
✓ Created: src/services/auth.service.ts
✓ Committed: feat: add JWT auth service

Implementing Phase 2...
...

✓ All phases complete
✓ Tests passing (12/12)
✓ PR created: https://github.com/org/repo/pull/789
```

---

### analyze-architecture

**Deep analysis of brownfield project architecture.**

Use this workflow to generate comprehensive architecture documentation before starting development. The generated docs help AI understand your codebase patterns for better implementations.

#### Usage

```
/sdd:dev-agent:analyze-architecture
```

#### Process

1. **Select Scope** - Choose analysis scope:
   - Full project
   - Specific directory
   - Frontend/backend only

2. **Initial Scan** - Detects tech stack and architecture patterns

3. **Select Documents** - Choose which docs to generate:
   - Core: `overview.md`, `structure.md`
   - Backend: API design, services, data access, auth, error handling
   - Frontend: components, state, routing, API integration, styling
   - Supporting: database, testing, deployment, conventions

4. **Generate Documents** - Creates detailed analysis for each topic

5. **Create Index** - Generates `index.md` for navigation

#### Output

Documents are saved to `{tech_architecture_doc_path}/`:

```
architecture/
├── index.md              # Navigation hub
├── overview.md           # System overview
├── structure.md          # Directory structure
├── backend-api.md        # API design patterns
├── backend-services.md   # Service layer patterns
├── frontend-components.md
├── database.md
├── testing.md
└── conventions.md
```

#### Integration with dev-flow

When architecture docs exist, `dev-flow` and `create-tech-spec` automatically reference them, resulting in implementations that follow your established patterns.

#### When to Use

- Onboarding to a new brownfield project
- Before starting significant development work
- Creating documentation for team knowledge sharing
- Helping AI understand your codebase conventions

---

### product-flow 🚧 WIP

**PRD generation from requirements with clarification loop.**

> ⚠️ This workflow is currently under development.

Transforms product requirements into structured PRDs with Epic/Story/Task breakdown.

```
/sdd:pm-agent:create-prd
```

---

## Agents

### Dev Agent ⚙️

**Development & Implementation Expert**

The primary agent for technical work. Handles codebase analysis, tech spec generation, implementation, testing, and PR creation.

**Key Capabilities:**

- Technical specification creation from Jira tasks
- Codebase pattern recognition and analysis
- Phased implementation with best practices
- Unit test generation
- Git workflow management

**Main Commands:**
| Command | Description |
|---------|-------------|
| `*dev-flow` | Complete development cycle |
| `*analyze-architecture` | Generate architecture documentation |
| `*implement-task` | Resume implementation from existing tech spec |
| `*create-tech-spec` | Generate tech spec only (no implementation) |

### PM Agent 📋

**Product Manager & Requirements Expert**

Handles requirement analysis, PRD generation, and story estimation.

**Key Capabilities:**

- Requirement clarification and decomposition
- Epic/Story/Task structuring
- Story point estimation (Fibonacci scale)
- Acceptance criteria definition

**Main Commands:**
| Command | Description |
|---------|-------------|
| `*create-prd` | Generate PRD from Jira ticket or manual input |
| `*analyze-requirement` | Analyze requirements and generate clarifying questions |
| `*estimate` | Story point estimation helper |

---

## Module Structure

```
sdd/
├── agents/
│   ├── pm-agent.agent.yaml
│   ├── pm-agent-sidecar/        # Persistent learning storage
│   ├── dev-agent.agent.yaml
│   └── dev-agent-sidecar/       # Persistent learning storage
├── workflows/
│   ├── dev-flow/                # ⭐ Main development workflow
│   ├── implement-task/          # Resume implementation
│   ├── create-tech-spec/        # Tech spec only
│   ├── analyze-architecture/    # Architecture documentation
│   ├── product-flow/            # 🚧 WIP
│   ├── create-prd/              # Standalone PRD
│   └── sync-jira/               # Jira utility
├── templates/
│   ├── commit/                  # Commit message template
│   ├── pr/                      # Pull request template
│   ├── prd/                     # PRD template
│   └── tech-spec/               # Tech spec template
├── _module-installer/
│   └── install-config.yaml
└── README.md
```

---

## Troubleshooting

### Jira Connection Fails

- Verify `.env` file has correct credentials
- Check API token is valid and not expired
- Test API access: `curl -u email:token https://your-domain.atlassian.net/rest/api/3/myself`

### Workflow Errors

- Run BMAD installer to recompile agents
- Check configuration in `bmad/sdd/config.yaml`
- Verify all template paths exist

### Context Window Issues

If you encounter context limits during `dev-flow`:

1. Let the workflow complete tech spec generation
2. Start a new session
3. Use `/sdd:dev-agent:implement-task` to resume with fresh context

### Tests Not Generated

- Check `unit_testing_strategy` setting in config
- Verify project has test framework installed
- Ensure test directory structure exists

---

## Version

1.0.0-alpha

---

_Part of the BMAD Method v6 ecosystem_
