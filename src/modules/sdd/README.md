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
- **Smart auto-commit behavior**:
  - ✅ Auto-commits during phase-by-phase implementation (concise messages under 50 chars)
  - ⚠️ Auto-commit **disabled** after implementation review - manual control for post-implementation adjustments
  - Use `/generate-commit` for manual commits when needed
- **Manual commit strategy**:
  - 📝 Pauses after each phase completion for review
  - Prompts user to commit before continuing to next phase
  - Can skip commits and commit later before PR
  - Integrates with `/generate-commit` standalone task
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

## Agent Sidecar System

Both PM Agent and Dev Agent use a **sidecar architecture** for persistent learning and knowledge management. The sidecar consists of three components:

### Sidecar Components

**1. instructions.md** (Private Operational Guidelines)

- Agent-specific directives and behavioral rules
- Workflow invocation instructions
- Quality standards and best practices
- Special instructions for specific scenarios

**2. memories.md** (Persistent Learning Storage)

- Automatically written after each workflow completion
- Captures session learnings, patterns, and insights
- Records user preferences and project context
- Stores calibration data for estimation improvements

**3. knowledge/** (Domain-Specific Reference Materials)

- Optional reference documentation
- Team-specific conventions
- Domain patterns and terminology
- Performance considerations

### Automatic Memory Writing

After workflow completion, agents automatically append structured learnings to their `memories.md` files:

**PM Agent** (from product-flow):

- Requirement analysis context
- Clarification questions and answers
- Decomposition patterns
- Estimation data and confidence
- User preferences (story granularity, estimation style)
- Domain knowledge gained
- Calibration notes for future improvements

**Dev Agent** (from dev-flow, create-tech-spec, implement-task):

- Technical context and architecture patterns
- Implementation approach and challenges
- Code patterns and conventions observed
- User preferences (code style, commit frequency)
- Tech spec accuracy vs actual implementation
- Test coverage and quality metrics
- Calibration data for better planning

### Benefits

- **Continuous Learning**: Agents improve over time by learning from each session
- **Personalization**: Remembers your preferences and adapts to your workflow
- **Pattern Recognition**: Identifies recurring patterns in requirements and implementations
- **Estimation Accuracy**: Calibrates story points based on historical data
- **Context Awareness**: Provides increasingly relevant suggestions and guidance

### Memory File Locations

```
src/modules/sdd/agents/
├── pm-agent-sidecar/
│   ├── instructions.md
│   ├── memories.md
│   └── knowledge/
└── dev-agent-sidecar/
    ├── instructions.md
    ├── memories.md
    └── knowledge/
```

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

SDD provides **truly standalone** reusable tasks that can be invoked independently in Claude Code or other environments - **no SDD module installation required**!

These tasks automatically detect if the SDD module is installed and will use your custom templates if available, otherwise they fall back to built-in defaults.

### generate-commit

Create a streamlined git commit following SDD conventions.

**Usage in Claude Code:**

```
/generate-commit
```

**Standalone Feature:**

✅ Works WITHOUT SDD module installation
✅ Auto-detects SDD module config if available
✅ Falls back to built-in format if not installed
✅ Uses custom commit template from `bmad/sdd/config.yaml` when available

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

**Standalone Feature:**

✅ Works WITHOUT SDD module installation
✅ Auto-detects SDD module config if available
✅ Falls back to built-in format if not installed
✅ Uses custom PR template from `bmad/sdd/config.yaml` when available

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

### Installation Options

**Option 1: Use Without Installation (Standalone)**

These tasks work immediately after SDD module installation registers them. They use built-in defaults and don't require any configuration.

**Option 2: Install SDD Module for Custom Templates**

```bash
bmad install sdd
```

When the full module is installed, these tasks will automatically use your custom templates from `bmad/sdd/config.yaml`:

- Custom commit message format
- Custom PR template
- Jira integration settings

**When to Use Tasks:**

- **generate-commit**: When you want to create commits manually outside of dev-flow
- **create-pr**: When you have commits ready but didn't use dev-flow
- **Quick commits**: During exploratory coding or bug fixes
- **Flexibility**: When you need more control than workflow automation provides
- **Standalone usage**: When you only need commit/PR formatting without full SDD workflows

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
├── tasks/                     # ⭐ Reusable STANDALONE tasks
│   ├── generate-commit.xml    # Create streamlined git commits (standalone="true")
│   └── create-pr.xml          # Create streamlined pull requests (standalone="true")
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
- **unit_testing_strategy**: Unit test strategy (per-phase/end-of-implementation/tdd-first-phase)

### Unit Test Strategy

SDD supports three different testing approaches to match your development workflow:

#### 1. Per-Phase Testing (Default)

**Strategy:** `per-phase`

Write and run tests after implementing each phase. This is incremental testing that validates each phase before moving to the next.

**When to use:**

- You want continuous validation during development
- You prefer catching issues early
- You like seeing green tests after each phase
- Your phases are well-isolated and independently testable

**How it works:**

- Phase 1: Implement feature A → Write tests for A → Run tests
- Phase 2: Implement feature B → Write tests for B → Run tests
- Phase 3: Implement feature C → Write tests for C → Run tests

**Tech spec structure:**

```markdown
Phase 1: Implement core authentication logic

- Files: auth.service.ts
- Tests: auth.service.test.ts (written after implementation)

Phase 2: Add JWT token generation

- Files: token.service.ts
- Tests: token.service.test.ts (written after implementation)
```

#### 2. End-of-Implementation Testing

**Strategy:** `end-of-implementation`

Focus on implementation first, write all tests in a final comprehensive testing phase.

**When to use:**

- You want to see the full implementation before writing tests
- You prefer batch testing after understanding the complete solution
- Your implementation phases are tightly coupled
- You want faster initial implementation without test overhead

**How it works:**

- Phase 1: Implement feature A
- Phase 2: Implement feature B
- Phase 3: Implement feature C
- Phase 4: Write comprehensive tests for A, B, and C

**Tech spec structure:**

```markdown
Phase 1: Implement core authentication logic

- Files: auth.service.ts

Phase 2: Add JWT token generation

- Files: token.service.ts

Phase 3: Integrate with user database

- Files: user.repository.ts

Phase 4: Write comprehensive unit tests

- Files: auth.service.test.ts, token.service.test.ts, user.repository.test.ts
- Tests: Complete test coverage for all authentication features
```

#### 3. TDD First-Phase (Test-Driven Development)

**Strategy:** `tdd-first-phase`

Write all test specifications upfront in Phase 1, then implement to make tests pass. This is true Test-Driven Development.

**When to use:**

- You practice Test-Driven Development (TDD)
- Requirements are well-defined and stable
- You want tests to drive your implementation design
- You prefer the Red-Green-Refactor cycle
- You want maximum test coverage from the start

**How it works:**

- Phase 1: Write all test specifications (tests fail - RED phase)
- Phase 2: Implement feature A to pass tests (tests pass - GREEN phase)
- Phase 3: Implement feature B to pass tests (tests pass - GREEN phase)
- Phase 4: Refactor and optimize (tests still pass)

**Tech spec structure:**

```markdown
Phase 1: Write test specifications (TDD)

- Files: auth.service.test.ts, token.service.test.ts, user.repository.test.ts
- Tests: Define all test cases for authentication flow (failing tests expected)
- Coverage: Specify expected behavior for all features

Phase 2: Implement core authentication logic to pass tests

- Files: auth.service.ts
- Tests: auth.service.test.ts should pass

Phase 3: Implement JWT token generation to pass tests

- Files: token.service.ts
- Tests: token.service.test.ts should pass

Phase 4: Implement user database integration to pass tests

- Files: user.repository.ts
- Tests: user.repository.test.ts should pass
```

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

- Check `unit_testing_strategy` setting
- Verify test framework detection
- Ensure project has test infrastructure

## Author

Created on 2025-10-30 using the BMAD Method Module Builder

## Version

1.0.0-alpha (MVP)

---

_Part of the BMAD Method v6 ecosystem_
