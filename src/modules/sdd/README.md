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
- `*run-tests` - Generate and execute unit tests
- `*analyze-codebase` - Analyze codebase patterns and architecture
- `*create-pr` - Generate and create pull request
- `*commit` - Create phased git commit
- `*review` - Review implementation against tech spec

### Workflows (6)

#### End-to-End Workflows

**1. product-flow**
Transform product requirements into structured PRD with Epic/Story/Task breakdown (includes extensive clarification loop)

**Usage:**

```
workflow product-flow
```

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
workflow dev-flow
```

**Process:**

1. Fetch Jira task details
2. Analyze codebase context
3. Generate technical specification
4. Review and approve tech spec
5. Implement solution phase-by-phase
6. Human review implementation
7. Generate unit tests (if configured)
8. Final review
9. Create pull request

**Output:**

- Tech spec: `docs/sdd/tech-spec/tech-spec-{PROJ}-{NUM}-{task}.md`
- Pull request on GitHub

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

#### Utility Workflows

**6. sync-jira**
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
│   └── sync-jira/             # Jira utility
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

**Use create-tech-spec + implement-task when:**

- You want to separate planning from execution
- Need to review tech spec before starting implementation
- Team lead needs to approve plan first
- Want flexibility to pause between planning and coding
- Multiple developers may implement from same spec

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
