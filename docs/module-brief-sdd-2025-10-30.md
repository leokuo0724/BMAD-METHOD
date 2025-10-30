# Module Brief: Spec-Driven Development

**Date:** 2025-10-30
**Author:** BMad
**Module Code:** sdd
**Status:** Ready for Development

---

## Executive Summary

The Spec-Driven Development (SDD) module enables AI-assisted product development workflows that reduce human labor costs while maintaining high-level human oversight. It provides structured processes for transforming product requirements into deliverable code through AI-driven planning and execution, with humans serving as architects, supervisors, and reviewers.

**Module Category:** Technical (Development Process, DevOps)
**Complexity Level:** Complex
**Target Users:** Product Managers (PM), Scrum Masters (SM), Engineers (ENG)

---

## Module Identity

### Core Concept

SDD implements a three-phase development workflow:

1. **Product Flow** - PM transforms requirements into structured PRDs with Epic/Story/Task breakdowns
2. **Jira Ticket Flow** - SM creates and manages Jira tickets (manual process, not automated in MVP)
3. **Dev Flow** - Engineers execute tasks with AI assistance from tech spec through implementation to PR

The module enforces specification-driven development where every implementation is preceded by proper planning documents, ensuring clarity and reducing rework.

### Unique Value Proposition

What makes this module special:

- **Structured AI-Human Collaboration**: AI handles detailed planning and execution, humans provide strategic direction
- **End-to-End Process Coverage**: From product requirements to pull requests
- **Specification-First Approach**: Every task begins with a technical specification
- **Flexible Test Strategy**: Configurable unit test generation (inline or post-review)
- **Integration-Ready**: Works with existing Jira and GitHub workflows

### Personality Theme

Professional and neutral. Agents communicate clearly and efficiently, focusing on delivering value without unnecessary personality layers. Emphasis on precision, clarity, and actionable outputs.

---

## Agent Architecture

### Agent Roster

#### 1. Product Manager Agent (`pm-agent`)

**Type:** Expert Agent

**Role:** Requirements analysis and product specification generation

**Expertise:**
- Product requirement clarification
- Epic and Story decomposition
- Acceptance criteria definition
- Story point estimation (Fibonacci scale, 1 point = 8 hours)

**Key Capabilities:**
- Parse Jira tickets or manual requirement inputs
- Interactive requirement clarification
- Generate structured PRD documents
- Separate frontend and backend tasks
- Define deliverable business impacts per Story

**Signature Commands:**
- `analyze-requirement` - Analyze and clarify product requirements
- `create-prd` - Generate complete PRD document
- `clarify-scope` - Interactive requirement clarification session

#### 2. Development Agent (`dev-agent`)

**Type:** Expert Agent

**Role:** Technical planning and implementation execution

**Expertise:**
- Technical specification creation
- Codebase analysis and pattern recognition
- Implementation with best practices
- Unit test generation
- Git workflow management

**Key Capabilities:**
- Generate detailed tech specs from Jira tasks
- Analyze existing codebase and architecture docs
- Implement features following project patterns
- Write comprehensive unit tests
- Create commits following templates
- Generate pull requests with proper documentation

**Signature Commands:**
- `create-tech-spec` - Generate technical specification
- `implement-task` - Execute implementation
- `run-tests` - Generate and run unit tests
- `create-pr` - Generate pull request

### Agent Interaction Model

How agents work together:

- **Sequential Handoff**: PM Agent completes PRD → Human reviews → Dev Agent receives tasks
- **Independent Operation**: Each agent operates autonomously within their domain
- **Human-in-the-Loop**: All major transitions require human approval
- **Context Sharing**: Agents reference shared documents (PRD, tech specs, architecture docs)

---

## Workflow Ecosystem

### Core Workflows

Essential functionality that delivers primary value:

#### 1. `product-flow`

**Type:** Document Workflow (Interactive)

**Purpose:** Transform product requirements into structured PRD with Epic/Story/Task breakdown

**Process:**
1. Accept input (Jira ticket number OR manual requirement)
2. Create PRD template document
3. AI generates clarification questions
4. Human answers questions (iterative until clear)
5. AI fills complete PRD with:
   - Metadata (timestamp, Jira info)
   - Epic structure (if multiple stories)
   - Stories with AC and story points
   - Tasks (frontend/backend separated, test-ready granularity)
6. Save to `{output_folder}/prd/prd-{JIRA_PROJ}-{JIRA_NUMBER}-{scope-name}.md`

**Complexity:** Standard (5-8 steps, iterative clarification)

#### 2. `dev-flow`

**Type:** Action Workflow (Interactive)

**Purpose:** Complete development cycle from Jira task to pull request

**Process:**
1. Input Jira task number
2. Fetch task details from Jira
3. Generate tech spec document:
   - Metadata
   - Technical Solution
   - Scope of Impact
   - Task Breakdown
   - Technical Dependencies
   - Implementation Notes
   - Effort Estimation (Complexity, Confidence)
   - Status tracking
4. Human reviews and approves/adjusts tech spec
5. AI implements solution
6. Git commit per phase (using commit template)
7. Human reviews implementation
8. AI adjusts if needed
9. (If `write_unit_test_along_with_task: false`) AI writes unit tests
10. Human final review
11. AI generates pull request (using PR template)

**Complexity:** Complex (10+ steps, conditional logic, multiple review points)

### Feature Workflows

Specialized capabilities that enhance the module:

#### 3. `create-prd`

**Type:** Document Workflow

**Purpose:** Standalone PRD generation without full interactive flow

**Use Case:** When requirements are already clear and just need documentation

**Complexity:** Simple (3-5 steps)

#### 4. `create-tech-spec`

**Type:** Document Workflow

**Purpose:** Generate technical specification from Jira task

**Use Case:** Planning phase only, implementation happens separately

**Complexity:** Simple (3-5 steps)

#### 5. `implement-task`

**Type:** Action Workflow

**Purpose:** Execute implementation when tech spec already exists

**Use Case:** Resume interrupted work or implement pre-approved specs

**Complexity:** Standard (5-8 steps)

### Utility Workflows

Supporting operations and maintenance:

#### 6. `sync-jira`

**Type:** Utility Workflow

**Purpose:** Fetch and sync Jira ticket data

**Use Case:** Data retrieval for product-flow and dev-flow

**Complexity:** Simple (API call and parsing)

---

## User Scenarios

### Primary Use Case

**As a Product Manager**, I want to transform a Jira epic into a detailed PRD with properly scoped stories and tasks, so that my engineering team has clear, actionable work items.

**User Journey:**
1. PM loads `pm-agent`
2. PM runs `product-flow` workflow
3. PM provides Jira ticket number (e.g., FIS-00001)
4. AI analyzes requirement and asks clarifying questions
5. PM answers questions iteratively until all ambiguities resolved
6. AI generates complete PRD with Epic/Story/Task breakdown
7. PM reviews PRD document at `docs/sdd/prd/prd-FIS-00001-global-search.md`
8. PRD is ready for SM to create Jira tickets

**Outcome:** Structured, unambiguous requirements ready for development

### Secondary Use Cases

**As an Engineer**, I want to implement a Jira task with AI assistance that generates the tech spec, writes the code, creates tests, and prepares the PR, so that I can focus on architecture decisions and code review rather than mechanical implementation.

**User Journey:**
1. Engineer loads `dev-agent`
2. Engineer runs `dev-flow` workflow
3. Engineer provides Jira task number (e.g., FIS-00002)
4. AI generates tech spec based on codebase analysis
5. Engineer reviews and approves tech spec
6. AI implements solution with commits per phase
7. Engineer reviews implementation, requests adjustments if needed
8. AI writes unit tests (if not done earlier)
9. AI creates pull request with proper description
10. Engineer reviews final PR before merging

**Outcome:** Complete feature implementation with documentation, tests, and PR ready for team review

---

**As a Team Lead**, I want to ensure consistent development practices across my team by having all implementations follow the spec-first approach, so that code quality remains high and onboarding new team members is easier.

**User Journey:**
1. Team adopts SDD module as standard workflow
2. All features start with PRD from `product-flow`
3. All tasks start with tech spec from `dev-flow`
4. Repository accumulates design documents in `docs/sdd/`
5. New team members can review past specs to understand patterns
6. Architecture decisions are documented and searchable

**Outcome:** Organizational knowledge base and consistent development methodology

---

## Technical Planning

### Data Requirements

**Configuration Files:**
- `.env` file containing Jira credentials and API endpoints
- Commit message template (provided by module)
- Pull request template (provided by module)
- Technical architecture documentation (optional, codebase analysis fallback)

**Document Storage:**
- PRD documents: `{project-root}/docs/sdd/prd/`
- Tech spec documents: `{project-root}/docs/sdd/tech-spec/`

**External Data Sources:**
- Jira API for ticket retrieval
- GitHub API for PR creation
- Git repository for codebase analysis

### Integration Points

**Jira Integration:**
- API authentication via `.env` configuration
- Ticket retrieval by ticket number
- Support for custom required fields (manual ticket creation in MVP)

**GitHub Integration:**
- `gh` command for PR creation
- PR template population
- Branch and commit management

**Git Integration:**
- Commit message templating
- Phased commits during implementation
- Branch naming conventions

**Codebase Analysis:**
- Read existing architecture documentation
- Pattern recognition from codebase
- Dependency analysis

### Dependencies

**External Tools:**
- Jira API access
- GitHub CLI (`gh` command)
- Git command-line tools

**BMAD Core Dependencies:**
- Core workflow engine
- Template system
- File I/O operations

**Optional Dependencies:**
- Architecture documentation (enhances tech spec quality)
- Existing coding standards documents

### Technical Complexity Assessment

**Complexity Level:** Complex

**Complexity Drivers:**
1. **Multi-Phase Workflows**: Both product-flow and dev-flow have 8+ steps with conditional logic
2. **External Integrations**: Jira API, GitHub API, Git operations
3. **Stateful Processes**: Must track progress through long workflows
4. **Interactive Decision Points**: Multiple human review and approval gates
5. **Template Management**: Commit templates, PR templates, document templates
6. **Codebase Analysis**: Dynamic pattern recognition and architecture understanding

**Technical Challenges:**
- Parsing Jira custom fields (workaround: manual ticket creation)
- Maintaining context across long workflows
- Handling implementation errors gracefully
- Ensuring consistent code style matching existing patterns
- Managing test execution and validation

---

## Success Metrics

### Module Success Criteria

How we'll know the module is successful:

1. **Time Savings**: Reduce PRD creation time from hours to minutes
2. **Implementation Speed**: Complete tasks 2-3x faster than manual coding
3. **Specification Compliance**: 100% of tasks have tech specs before implementation
4. **Document Quality**: All PRDs and tech specs are clear enough to require minimal clarification
5. **Code Quality**: AI-generated code passes review without major revisions
6. **Test Coverage**: All implementations include comprehensive unit tests
7. **Adoption Rate**: Team members consistently use the module for all new features

### Quality Standards

**PRD Quality:**
- All requirements unambiguous and testable
- Stories have clear business impact
- Tasks properly scoped (0.5-8 story points)
- Acceptance criteria complete

**Tech Spec Quality:**
- Implementation approach clearly documented
- Dependencies identified
- Impact scope defined
- Effort estimates accurate within 20%

**Code Quality:**
- Follows existing project patterns
- Passes linting and formatting checks
- Unit tests achieve >80% coverage
- PR descriptions complete and clear

**Process Quality:**
- All steps completed in order
- No skipped documentation
- Human review points respected
- Status tracking maintained

### Performance Targets

- **PRD Generation**: <30 minutes including clarification
- **Tech Spec Generation**: <15 minutes
- **Implementation**: Time varies by complexity, but commit frequency should be every 30-60 minutes per phase
- **Test Generation**: <20 minutes for comprehensive suite
- **PR Creation**: <5 minutes

---

## Development Roadmap

### Phase 1: MVP (Minimum Viable Module)

**Timeline:** 2-3 weeks

**Components:**

**Agents (2):**
- `pm-agent` - Product Manager Agent
- `dev-agent` - Development Agent

**Workflows (2 core + 1 utility):**
- `product-flow` - Complete PRD generation workflow
- `dev-flow` - Complete development workflow
- `sync-jira` - Jira data retrieval

**Templates:**
- PRD document template
- Tech spec document template
- Commit message template (provided)
- Pull request template (provided)

**Configuration:**
- Module config with all installation parameters
- `.env` template for Jira credentials
- Document output path configuration

**Deliverables:**
- Functional product-flow (Jira input + manual input)
- Functional dev-flow (tech spec → implementation → tests → PR)
- Complete module documentation
- Installation and setup guide
- Example workflows and outputs

### Phase 2: Enhancement

**Timeline:** 1-2 weeks (post-MVP)

**Components:**

**Workflows (3 feature workflows):**
- `create-prd` - Standalone PRD generation
- `create-tech-spec` - Standalone tech spec generation
- `implement-task` - Implementation-only workflow

**Enhanced Features:**
- Improved codebase pattern recognition
- Better story point estimation algorithms
- Template customization options
- Progress resumption for interrupted workflows

**Documentation:**
- Best practices guide
- Troubleshooting documentation
- Video tutorials or walkthroughs

**Deliverables:**
- Feature workflow suite
- Enhanced pattern matching
- Comprehensive troubleshooting guide

### Phase 3: Polish and Optimization

**Timeline:** 1 week (future)

**Components:**

**Advanced Features:**
- Jira ticket auto-creation (solving custom field challenges)
- Multi-task batch processing
- Architecture document auto-generation from implementations
- Code review quality scoring

**Optimizations:**
- Faster codebase analysis
- Improved context management
- Better error recovery
- Workflow progress persistence

**Nice-to-Haves:**
- Integration with other project management tools (Linear, Asana)
- Slack/Discord notifications
- Metrics dashboard
- Team analytics

**Deliverables:**
- Automated Jira ticket creation
- Performance optimizations
- Extended integrations

---

## Creative Features

### Special Touches

**Smart Defaults:**
- Auto-detect project naming conventions
- Learn from past PRDs for consistency
- Remember user preferences across sessions

**Context Awareness:**
- Reference related past tickets
- Suggest similar implementations from history
- Warn about potential conflicts with in-flight work

**Progressive Disclosure:**
- Start simple, reveal complexity only when needed
- Adaptive questioning based on requirement clarity
- Skip obvious questions for experienced users

### Easter Eggs and Delighters

**Efficiency Celebrations:**
- Acknowledge when tech specs are approved without changes
- Celebrate successful first-time PR approvals
- Track and display time saved vs manual process

**Smart Suggestions:**
- "I notice this is similar to FIS-00042, would you like to review that approach?"
- "Based on your codebase, I recommend using the existing SearchService pattern"
- "This task might benefit from splitting into two smaller tasks"

### Module Lore and Theming

While maintaining professional neutrality, the module embodies the philosophy of **"Specification as Foundation"** - the idea that clear thinking (specs) leads to clear code. Agents occasionally reference this principle:

- "Let's build a solid spec foundation first"
- "Clear specifications eliminate implementation ambiguity"
- "Good specs make great code inevitable"

---

## Risk Assessment

### Technical Risks

**Risk:** Jira API custom field handling
- **Impact:** Cannot auto-create tickets with custom required fields
- **Mitigation:** Phase 1 uses manual ticket creation; Phase 3 addresses automation

**Risk:** Codebase pattern recognition accuracy
- **Impact:** Generated code might not match project style
- **Mitigation:** Human review gate before committing; optional architecture doc input

**Risk:** Long workflow context loss
- **Impact:** AI might lose track of decisions in 10+ step workflows
- **Mitigation:** Status tracking in tech spec; workflow resumption capability

**Risk:** Test execution environment issues
- **Impact:** Unit tests might fail due to environment problems
- **Mitigation:** Clear error messages; option to skip test execution and generate only

### Usability Risks

**Risk:** Learning curve for new users
- **Impact:** Team might resist adoption
- **Mitigation:** Comprehensive documentation; example walkthroughs; progressive complexity

**Risk:** Over-reliance on AI decisions
- **Impact:** Engineers might not critically review generated specs/code
- **Mitigation:** Mandatory review gates; emphasize human-as-architect role in docs

**Risk:** Workflow interruption handling
- **Impact:** Users might need to restart if session breaks
- **Mitigation:** Status field in tech spec allows resumption; save progress frequently

### Scope Risks

**Risk:** Feature creep into Phase 1
- **Impact:** Delayed MVP delivery
- **Mitigation:** Strict MVP scope definition; track enhancement requests for Phase 2

**Risk:** Underestimating Jira integration complexity
- **Impact:** Sync-jira workflow might take longer than expected
- **Mitigation:** Simple API wrapper approach; defer complex parsing to Phase 2

**Risk:** Template customization demands
- **Impact:** Every team wants different PRD/tech spec formats
- **Mitigation:** Phase 1 provides good defaults; Phase 2 adds customization

### Mitigation Strategies

1. **Incremental Delivery**: Release Phase 1 quickly for feedback
2. **Strong Documentation**: Reduce support burden through clear guides
3. **Human Review Gates**: Prevent AI mistakes from propagating
4. **Status Tracking**: Enable workflow resumption
5. **Template Flexibility**: Plan for customization in Phase 2
6. **Error Handling**: Graceful degradation when external services fail

---

## Implementation Notes

### Priority Order

1. **`product-flow` workflow** - Core value delivery for PMs
2. **`dev-flow` workflow** - Core value delivery for Engineers
3. **`sync-jira` utility** - Required by both core workflows
4. **Templates and configuration** - Enable proper document generation
5. **Feature workflows** - Nice-to-haves for Phase 2

### Key Design Decisions

**Decision:** Separate pm-agent and dev-agent rather than single orchestrator
- **Rationale:** Clear role separation; users load appropriate agent for their role; simpler mental model

**Decision:** Tech spec is a document, not just in-memory state
- **Rationale:** Creates knowledge base; enables resumption; facilitates team communication

**Decision:** Mandatory human review gates
- **Rationale:** Maintains human oversight; prevents AI errors; builds trust

**Decision:** Configurable unit test timing
- **Rationale:** Some teams prefer review before tests; flexibility increases adoption

**Decision:** Phased commits during implementation
- **Rationale:** Creates logical history; enables partial rollback; shows progress

**Decision:** Module-provided templates with override option
- **Rationale:** Good defaults lower barrier to entry; customization available for mature users

### Open Questions

1. **Jira custom fields**: Which approach for Phase 3 automation? (API discovery, configuration file, manual mapping)
2. **Test framework detection**: How to auto-detect Jest vs Mocha vs other frameworks?
3. **Architecture doc format**: Freeform markdown vs structured YAML?
4. **Multi-repository support**: How to handle tasks spanning multiple repos?
5. **Rollback strategy**: If PR is rejected, how to handle spec/code updates?

---

## Resources and References

### Inspiration Sources

- **Specification by Example** - Book on behavior-driven development
- **Shape Up** - Basecamp's approach to structured development
- **TDD (Test-Driven Development)** - Test-first methodology
- **Linear's approach** - Modern issue tracking UX
- **GitHub Copilot Workspace** - AI-assisted development environments

### Similar Modules

- None in current BMAD ecosystem (this is novel)
- Related: BMB module (builds BMAD modules, meta-development)
- Related: Core workflow engine (execution framework)

### Technical References

- Jira REST API Documentation
- GitHub CLI Documentation
- Git Commit Message Conventions
- Story Point Estimation (Fibonacci scale)
- Acceptance Criteria Best Practices

---

## Appendices

### A. Detailed Agent Specifications

**PM Agent Commands:**

```
*help - Show available commands
*analyze-requirement - Interactive requirement analysis
*create-prd - Generate PRD from Jira or manual input
*clarify-scope - Deep-dive requirement clarification
*estimate - Story point estimation helper
```

**Dev Agent Commands:**

```
*help - Show available commands
*create-tech-spec - Generate technical specification
*implement-task - Execute implementation
*run-tests - Generate and execute unit tests
*create-pr - Generate pull request
*review - Review implementation against spec
*commit - Create phased commit
```

### B. Workflow Detailed Designs

**product-flow Steps:**

1. Welcome and input method selection
2. Jira fetch OR manual input
3. Create PRD template
4. Generate clarification questions
5. Interactive Q&A loop
6. Fill PRD sections
7. Review checkpoint
8. Save and confirm

**dev-flow Steps:**

1. Input Jira task number
2. Fetch task details
3. Load codebase context
4. Generate tech spec
5. Review checkpoint
6. Implementation phase 1 + commit
7. Implementation phase N + commit
8. Review checkpoint
9. Unit test generation (if applicable)
10. Final review checkpoint
11. PR generation
12. Confirmation and next steps

### C. Data Structures and Schemas

**PRD Structure:**
```markdown
# PRD: {Title}

## Metadata
- Jira: {PROJ-NUM}
- Date: {date}
- Author: {user}

## Epic: {Epic Name} (if applicable)

### Story: {Story Name}
**Story Points:** {points}
**Acceptance Criteria:**
- [ ] AC 1
- [ ] AC 2

#### Tasks:
- [ ] FE: {Task description}
- [ ] BE: {Task description}
```

**Tech Spec Structure:**
```markdown
# Tech Spec: {Task Name}

## Metadata
- Jira: {TASK-NUM}
- Date: {date}
- Engineer: {user}

## Technical Solution
{Implementation approach}

## Scope of Impact
{Files and modules affected}

## Task Breakdown
1. Phase 1: {description}
2. Phase 2: {description}

## Technical Dependencies
{Libraries, services, other tasks}

## Implementation Notes
{Patterns, conventions, gotchas}

## Effort Estimation
- Complexity: {Low/Medium/High}
- Confidence: {Low/Medium/High}

## Status
{Planning/In Progress/Review/Complete}
```

### D. Integration Specifications

**Jira API Integration:**
- Endpoint: Configured in `.env` as `JIRA_API_URL`
- Authentication: API token in `.env` as `JIRA_API_TOKEN`
- Methods: GET issue by key
- Error handling: Graceful fallback to manual input

**GitHub Integration:**
- Tool: `gh` CLI command
- PR template: `{project-root}/.github/pull_request_template.md` or module-provided
- Branch naming: Auto-detect from git config or use `feature/{JIRA-NUM}-{slug}`

**Git Integration:**
- Commit template: Module-provided template with placeholders
- Commit frequency: Per implementation phase
- Message format: Conventional Commits or custom template

---

## Next Steps

1. **Review this brief** - Validate all assumptions and decisions
2. **Run create-module workflow** - Use this brief as input to scaffold module structure
3. **Create pm-agent** - Build Product Manager Agent first
4. **Create dev-agent** - Build Development Agent second
5. **Develop product-flow** - Implement core PM workflow
6. **Develop dev-flow** - Implement core Dev workflow
7. **Create sync-jira utility** - Build Jira integration
8. **Test MVP** - Run complete flow with real Jira tickets
9. **Documentation** - Write user guides and examples
10. **Team onboarding** - Train users and gather feedback

---

_This Module Brief is ready to be fed directly into the create-module workflow for scaffolding and implementation._

**Module Viability Score:** 9/10
**Estimated Development Effort:** 2-3 weeks for MVP
**Confidence Level:** High - Clear requirements, proven tools, well-defined scope

---

**Approval for Development:**

- [x] Concept Approved
- [x] Scope Defined
- [ ] Resources Available
- [ ] Ready to Build

---

_Generated on 2025-10-30 by BMad using the BMAD Method Module Brief workflow_
