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

### Workflows (3 - MVP)

#### Core Workflows

**1. product-flow**
Transform product requirements into structured PRD with Epic/Story/Task breakdown

**Usage:**
```
workflow product-flow
```

**Process:**
1. Accept input (Jira ticket or manual)
2. Create PRD template
3. Generate clarification questions
4. Interactive Q&A loop
5. Decompose into Epic/Story/Task
6. Generate complete PRD

**Output:** `docs/sdd/prd/prd-{PROJ}-{NUM}-{scope}.md`

**2. dev-flow**
Complete development cycle from Jira task to pull request

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

#### Utility Workflows

**3. sync-jira**
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
│   ├── product-flow/
│   ├── dev-flow/
│   └── sync-jira/
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

### Example 2: Implementing a Task

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

## Development Roadmap

### Phase 1: MVP (Current)
- [x] PM Agent with PRD generation
- [x] Dev Agent with full dev cycle
- [x] Product-flow workflow
- [x] Dev-flow workflow
- [x] Sync-jira utility
- [x] Basic templates

### Phase 2: Enhancement (Planned)
- [ ] create-prd standalone workflow
- [ ] create-tech-spec standalone workflow
- [ ] implement-task standalone workflow
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
