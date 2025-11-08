# Spec-Driven Development (SDD) Module

AI-assisted product development workflows that reduce human labor costs while maintaining high-level human oversight through structured processes.

## Overview

The SDD module provides structured processes for transforming product requirements into deliverable code through AI-driven planning and execution, with humans serving as architects, supervisors, and reviewers.

**Key Features:**

- Structured AI-Human Collaboration
- End-to-End Process Coverage (requirements → PRs)
- Specification-First Approach
- Flexible Test Strategy
- Jira and GitHub Integration

## Installation

```bash
bmad install sdd
```

## Components

### Agents (2)

#### PM Agent (`pm-agent`)

Product Manager & Requirements Expert

**Commands:**

- `*create-prd` - Generate complete PRD from Jira ticket or manual input
- `*analyze-requirement` - Analyze requirements and generate clarifying questions
- `*clarify-scope` - Interactive requirement clarification session
- `*estimate` - Story point estimation using Fibonacci scale
- `*decompose` - Break down Epic/Story into deliverable units
- `*validate-prd` - Validate existing PRD against best practices

#### Dev Agent (`dev-agent`)

Development Agent & Implementation Expert

**Commands:**

- `*dev-flow` - Complete development cycle (tech spec → implementation → tests → PR)
- `*create-tech-spec` - Generate technical specification
- `*implement-task` - Execute implementation with existing tech spec
- `*analyze-architecture` - Deep brownfield project analysis, generate architecture docs
- `*run-tests` - Generate and execute unit tests
- `*analyze-codebase` - Analyze codebase patterns and architecture
- `*create-pr` - Generate and create pull request
- `*commit` - Create phased git commit
- `*review` - Review implementation against tech spec

### Workflows (7)

#### End-to-End Workflows

**1. product-flow**
Transform product requirements into structured PRD with Epic/Story/Task breakdown (includes extensive clarification loop)

**Usage:**

```
# Recommended: Through PM Agent
Load pm-agent
*create-prd

# Alternative: Direct execution (auto-loads PM Agent)
workflow product-flow
```

**Note:** Direct execution will automatically invoke PM Agent, which performs configuration validation and provides professional PM guidance throughout the workflow.

**Process:**

1. Accept input (Jira ticket or manual)
2. Auto-generate scope name from requirement analysis
3. Generate PM-level clarification questions
4. Interactive Q&A loop (documented in final PRD)
5. Decompose into Epic/Story/Task with Task-level estimation
6. Generate complete PRD

**Key Features:**

- AI auto-generates task short names (scope names)
- Automatic progression after Jira fetch (no manual continue)
- Clarification Q&A preserved in final document
- PM-appropriate questions (avoids deep technical details)
- Task-level story point estimates (FE/BE separated for different developers)
- Story points calculated as sum of task estimates

**Output:** `docs/sdd/prd/prd-{PROJ}-{NUM}-{scope}.md`

**2. dev-flow**
Complete development cycle from Jira task to pull request (planning + implementation)

**Usage:**

```
# Recommended: Through Dev Agent
Load dev-agent
*dev-flow

# Alternative: Direct execution (auto-loads Dev Agent)
workflow dev-flow
```

**Note:** Direct execution will automatically invoke Dev Agent, which performs comprehensive configuration validation (6 configs) and provides professional engineering guidance throughout the workflow.

**Process:**

1. Fetch Jira task details (auto-proceeds to next step)
2. Analyze codebase context and generate tech spec (context included in document)
3. Review tech spec and choose commit strategy
4. Implement solution phase-by-phase (with AI tracking)
5. Human review implementation (with AI summary)
6. Generate unit tests (if configured)
7. Final review
8. Handle commits (if manual strategy selected)
9. Create pull request (streamlined format)

**Key Features:**

- Auto-proceed after Jira fetch (no manual confirmation)
- Codebase context analysis saved in tech spec document
- **Flexible commit strategy**: Choose between auto-commit per phase or manual control
- **AI implementation tracking**: Tech spec shows which phases were AI-implemented
- **Streamlined commits**: Concise commit messages (under 50 chars) with Jira reference
- **Streamlined PRs**: Focused PR descriptions without verbose details
- Task name auto-generated from Jira ticket

**Output:**

- Tech spec: `docs/sdd/tech-spec/tech-spec-{PROJ}-{NUM}-{task}.md` (includes codebase context and AI implementation summary)
- Pull request on GitHub (concise format)

#### Standalone Workflows (Phase 2)

**3. create-prd**
Standalone PRD generation - simpler version for when requirements are already clear

**Usage:**

```
workflow create-prd
```

**Process:**

1. Accept input (Jira ticket or manual)
2. Optional quick clarification
3. Decompose into Epic/Story/Task
4. Generate complete PRD

**Output:** `docs/sdd/prd/prd-{PROJ}-{NUM}-{scope}.md`

**Best for:** When requirements are well-defined and you need quick PRD generation without extensive Q&A

**4. create-tech-spec**
Standalone tech spec generation - planning phase only, can implement later

**Usage:**

```
workflow create-tech-spec
```

**Process:**

1. Accept task (Jira or manual)
2. Load codebase context
3. Design technical solution
4. Break down into phases
5. Generate complete tech spec

**Output:** `docs/sdd/tech-spec/tech-spec-{PROJ}-{NUM}-{task}.md`

**Best for:** When you want to plan implementation separately from execution. Use with implement-task workflow.

**5. implement-task**
Implementation-only workflow - assumes tech spec already exists

**Usage:**

```
workflow implement-task
```

**Process:**

1. Load existing tech spec
2. Review implementation plan
3. Execute phase-by-phase implementation
4. Generate tests
5. Create pull request

**Output:** Pull request on GitHub

**Best for:** When tech spec is already created and you want to focus purely on execution.

#### Architecture Workflows

**6. analyze-architecture**
Deep analysis of brownfield project architecture, generating structured technical documentation across multiple topic-specific files

**Usage:**

```
workflow analyze-architecture
```

**Process:**

1. Select analysis scope (full project, specific directory, frontend/backend only)
2. Perform initial scan to detect tech stack and architecture
3. Present recommended documents to generate
4. User selects which documents to create
5. Generate each document with deep analysis:
   - Core: overview.md, structure.md
   - Backend: API design, services, data access, auth, error handling
   - Frontend: components, state, routing, API integration, styling
   - Supporting: database, testing, deployment, conventions
6. Create index.md for easy navigation
7. Save all documents to {tech_architecture_doc_path}

**Key Features:**

- **Multi-document output** - Organized by topic for quick AI reference
- **Deep analysis** - Code patterns, design decisions, best practices
- **Interactive generation** - Review and refine each document
- **Smart detection** - Recommends documents based on detected technologies
- **Update management** - Handles existing files (overwrite/merge/skip/compare)

**Output:** Multiple markdown files in {tech_architecture_doc_path}/

- index.md (navigation hub)
- overview.md, structure.md (core)
- backend-_.md, frontend-_.md (layer-specific)
- database.md, testing.md, deployment.md, conventions.md (supporting)

**Best for:**

- Onboarding to brownfield projects
- Creating architecture documentation for AI-assisted development
- Understanding existing codebase patterns before implementation
- Documenting architecture for team knowledge sharing

**Integration:**
Other SDD workflows (dev-flow, create-tech-spec) automatically reference these docs when they exist, improving implementation quality by following established patterns.

#### Utility Workflows

**7. sync-jira**
Fetch and sync Jira ticket data (used internally by other workflows)

## Quick Start

### For Product Managers

1. **Load PM Agent:**

   ```
   Load pm-agent
   ```

2. **Create a PRD:**

   ```
   *create-prd
   ```

3. **Follow prompts:**
   - Choose Jira ticket or manual input
   - Answer clarification questions
   - Review generated PRD

### For Engineers

1. **Load Dev Agent:**

   ```
   Load dev-agent
   ```

2. **Start development flow:**

   ```
   *dev-flow
   ```

3. **Follow prompts:**
   - Provide Jira task number
   - Review tech spec
   - Review implementation phases
   - Approve final PR

## Standalone Tasks

SDD provides reusable tasks that can be invoked independently in Claude Code or other environments.

### generate-commit

Create a streamlined git commit following SDD conventions.

**Usage in Claude Code:**

```
/generate-commit
```

**Features:**

- Interactive file selection (staged/specific/all)
- Auto-detects commit type from changes
- Streamlined commit message format (< 50 chars)
- Optional Jira ticket reference
- Option to push after commit

**Example Workflow:**

```
/generate-commit
> Select: Specific files
> Files: src/auth/controller.ts src/auth/service.ts
> Jira: FIS-123
> Description: add user authentication endpoint
> Type detected: feat
> Commit created: feat: add user authentication endpoint
```

### create-pr

Create a streamlined pull request following SDD conventions.

**Usage in Claude Code:**

```
/create-pr
```

**Features:**

- Checks GitHub CLI (gh) availability and auth
- Auto-pushes branch if needed
- Analyzes commits to generate concise PR summary
- Streamlined PR format (no verbose details)
- Optional tech spec linking
- Optional Jira ticket reference
- Option to add reviewers

**Example Workflow:**

```
/create-pr
> Jira ticket: FIS-123
> Tech spec: docs/sdd/tech-spec/tech-spec-FIS-123-auth-endpoint.md
> Generated summary: "Implements user authentication endpoint with JWT support"
> Key changes detected (3-5 bullet points)
> Test coverage: 85%
> PR created: https://github.com/org/repo/pull/456
```

**When to Use Tasks:**

- **generate-commit**: When you want to create commits manually outside of dev-flow
- **create-pr**: When you have commits ready but didn't use dev-flow
- **Quick commits**: During exploratory coding or bug fixes
- **Flexibility**: When you need more control than workflow automation provides

## Module Structure

```
sdd/
├── agents/
│   ├── pm-agent.agent.yaml
│   ├── pm-agent-sidecar/
│   ├── dev-agent.agent.yaml
│   └── dev-agent-sidecar/
├── workflows/
│   ├── product-flow/          # End-to-end PRD with clarification
│   ├── dev-flow/              # End-to-end dev cycle
│   ├── create-prd/            # Standalone PRD generation
│   ├── create-tech-spec/      # Standalone tech spec
│   ├── implement-task/        # Implementation-only
│   ├── analyze-architecture/  # Brownfield project analysis
│   └── sync-jira/             # Jira utility
├── tasks/                     # ⭐ NEW: Reusable standalone tasks
│   ├── generate-commit.xml    # Create streamlined git commits
│   └── create-pr.xml          # Create streamlined pull requests
├── templates/
│   ├── commit/
│   ├── pr/
│   ├── prd/
│   └── tech-spec/
├── data/
├── _module-installer/
│   └── install-config.yaml
└── README.md
```

## Configuration

The module can be configured in `bmad/sdd/config.yaml` (generated during installation).

### Key Settings

- **jira_info_path**: Path to .env file with Jira credentials
- **output_document_path**: Where to save PRDs and tech specs
- **commit_msg_template_path**: Commit message template
- **pr_template_path**: Pull request template
- **tech_architecture_doc_path**: Architecture documentation (optional)
- **write_unit_test_along_with_task**: Test generation timing (true/false)

### Jira Setup

Create `.env` file with:

```
JIRA_API_URL=https://your-domain.atlassian.net
JIRA_API_TOKEN=your_api_token
JIRA_USER_EMAIL=your_email@domain.com
```

## Workflow Selection Guide

### When to Use Each Workflow

**Use product-flow when:**

- Requirements are vague or need extensive clarification
- You need comprehensive Q&A with stakeholders
- Complex feature requiring Epic/Story breakdown
- First time working with this type of requirement

**Use create-prd when:**

- Requirements are already clear and well-defined
- You need quick PRD generation
- Time-sensitive documentation needed
- Simple feature or enhancement

**Use dev-flow when:**

- You want complete end-to-end development (planning + implementation)
- You're working on a straightforward task
- You prefer guided step-by-step process
- One-shot approach preferred
- **Small to medium codebase** with sufficient context window

**Use create-tech-spec + implement-task when:**

- You want to separate planning from execution
- Need to review tech spec before starting implementation
- Team lead needs to approve plan first
- Want flexibility to pause between planning and coding
- Multiple developers may implement from same spec
- **Large codebase** where analysis might consume too much context

---

## Context Window Management ⚡

**Dev-flow automatically manages context for you!**

### How It Works

When you use `dev-flow`, after generating the tech spec, the AI will:

1. ✅ **Assess remaining context window**
2. 🎯 **Recommend the best path forward**
3. 📋 **Provide exact commands if a new session is needed**

You don't need to guess or monitor - the workflow handles it automatically.

### Automatic Context Detection

**Sufficient context (>60% remaining):**

- ✅ Proceeds automatically to implementation
- No user action needed

**Warning level (40-60% remaining):**

- ℹ️ Shows a notice with recommendation
- Offers to continue or resume in fresh session
- You decide based on your preference

**Critical level (<40% remaining):**

- ⚠️ Strong recommendation to resume in fresh session
- Displays exact resume commands
- You can still override if needed

### What You'll See

If context is low, dev-flow will display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  Context Window Alert
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Tech spec complete and saved
📄 Location: docs/sdd/tech-spec/tech-spec-FIS-123-feature.md

Recommended Next Steps:

1. Clear this session (or start new chat)

2. Resume implementation:
   workflow implement-task

3. When prompted, provide tech spec path:
   docs/sdd/tech-spec/tech-spec-FIS-123-feature.md

This will load your tech spec and give you full context for implementation.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like to:
1. Stop here - Resume in fresh session (recommended ⭐)
2. Continue anyway - Proceed with current context
```

### Manual Workflow Split (Alternative)

You can also manually split workflows if preferred:

**Planning:**

```bash
workflow create-tech-spec
```

**Implementation:**

```bash
workflow implement-task
```

### Benefits of Automatic Context Management

- ✅ **Zero guesswork** - AI estimates and recommends for you
- ✅ **Simple** - Just follow the provided commands
- ✅ **Flexible** - Can override recommendations if needed
- ✅ **Seamless** - Tech spec serves as natural checkpoint
- ✅ **Quality** - Ensures full context for implementation

## Examples

### Example 1: Creating a PRD from Jira Ticket

```
Load pm-agent
*create-prd
> Select: Jira ticket
> Enter: FIS-00001
> Answer clarification questions
> Review generated PRD
```

**Result:** `docs/sdd/prd/prd-FIS-00001-global-search.md`

### Example 2: Implementing a Task (End-to-End)

```
Load dev-agent
*dev-flow
> Enter task number: FIS-00002
> Review tech spec → Approve
> Review implementation → Approve
> Review tests → Approve
> PR created
```

**Result:**

- Tech spec: `docs/sdd/tech-spec/tech-spec-FIS-00002-fe-global-search-bar.md`
- Pull request with all changes

### Example 3: Quick PRD Generation

```
workflow create-prd
> Select: Jira ticket
> Enter: FIS-00003
> Scope name: notification-system
> Quick clarification? Skip
> PRD generated
```

**Result:** `docs/sdd/prd/prd-FIS-00003-notification-system.md` (faster than product-flow)

### Example 4: Planning Then Implementing Separately

**Step 1 - Create Tech Spec:**

```
workflow create-tech-spec
> Select: Jira task
> Enter: FIS-00004
> Task name: be-notification-api
> Review plan → Complete
```

**Result:** `docs/sdd/tech-spec/tech-spec-FIS-00004-be-notification-api.md`

**Step 2 - Implement Later:**

```
workflow implement-task
> Tech spec path: docs/sdd/tech-spec/tech-spec-FIS-00004-be-notification-api.md
> Review plan → Proceed
> All phases implemented
> PR created
```

**Result:** Pull request with implementation following the tech spec

## Development Roadmap

### Phase 1: MVP ✅ (Completed)

- [x] PM Agent with PRD generation
- [x] Dev Agent with full dev cycle
- [x] Product-flow workflow
- [x] Dev-flow workflow
- [x] Sync-jira utility
- [x] Basic templates

### Phase 2: Enhancement ✅ (Completed)

- [x] create-prd standalone workflow
- [x] create-tech-spec standalone workflow
- [x] implement-task standalone workflow
- [ ] Enhanced codebase pattern recognition
- [ ] Template customization options
- [ ] Progress resumption for interrupted workflows

### Phase 3: Polish (Future)

- [ ] Automated Jira ticket creation
- [ ] Multi-task batch processing
- [ ] Architecture doc auto-generation
- [ ] Code review quality scoring
- [ ] Integration with Linear, Asana
- [ ] Metrics dashboard

## Contributing

To extend this module:

1. Add new agents using `/bmad:bmb:workflows:create-agent target_module=sdd`
2. Add new workflows using `/bmad:bmb:workflows:create-workflow target_module=sdd`
3. Update configuration in `_module-installer/install-config.yaml`

## Troubleshooting

**Jira connection fails:**

- Check `.env` file has correct credentials
- Verify API token is valid
- Test API access manually

**Workflow errors:**

- Run BMAD installer to recompile agents
- Check configuration in `bmad/sdd/config.yaml`
- Verify all template paths exist

**Tests not generated:**

- Check `write_unit_test_along_with_task` setting
- Verify test framework detection
- Ensure project has test infrastructure

## Author

Created on 2025-10-30 using the BMAD Method Module Builder

## Version

1.0.0-alpha (MVP)

---

_Part of the BMAD Method v6 ecosystem_
