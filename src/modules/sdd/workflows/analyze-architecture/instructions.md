# Analyze Architecture Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/sdd/workflows/analyze-architecture/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<step n="1" goal="Determine analysis scope">
<ask>What scope would you like to analyze?

1. **Full Project** - Analyze the entire codebase
2. **Specific Directory** - Analyze a particular directory or module
3. **Frontend Only** - Focus only on frontend architecture
4. **Backend Only** - Focus only on backend architecture

Select option (1-4):</ask>

<action>Store the user's choice as {{analysis_scope}}</action>

<check if="analysis_scope == 'specific_directory'">
<ask>Please provide the path to the directory you want to analyze:</ask>
<action>Store as {{target_directory}}</action>
</check>

<check if="analysis_scope != 'specific_directory'">
<action>Set {{target_directory}} to project root</action>
</check>
</step>

<step n="2" goal="Perform initial project scan">
<action>Conduct comprehensive initial scan of the codebase:

**Directory Structure Analysis:**

- Scan directory tree to understand project organization
- Identify main directories (src, lib, app, components, services, etc.)
- Note depth and organization patterns
- Identify monorepo vs single-repo structure

**Technology Stack Detection:**

- Scan package.json, requirements.txt, go.mod, Gemfile, etc.
- Identify frameworks (React, Vue, Angular, Express, NestJS, Django, Rails, etc.)
- Detect build tools (Webpack, Vite, Rollup, etc.)
- Identify testing frameworks (Jest, Vitest, Pytest, RSpec, etc.)
- Find database clients/ORMs (Prisma, TypeORM, Sequelize, SQLAlchemy, etc.)
- Detect state management (Redux, Zustand, MobX, Pinia, etc.)
- Find CI/CD configurations (.github/workflows, .gitlab-ci.yml, etc.)

**Architecture Pattern Detection:**

- Identify architectural style (MVC, microservices, monolith, serverless, etc.)
- Detect API style (REST, GraphQL, gRPC, etc.)
- Find authentication patterns (JWT, sessions, OAuth, etc.)
- Identify deployment patterns (containers, serverless, traditional, etc.)

**Code Organization Patterns:**

- Identify file naming conventions
- Detect module organization strategy (feature-based, layer-based, domain-driven)
- Find code style configurations (.eslintrc, .prettierrc, etc.)
- Identify testing patterns and coverage tools
  </action>

<action>Based on the scan results and {{analysis_scope}}, determine which document categories are relevant:

**Always Generate (Core):**

- overview.md
- structure.md

**Generate if Backend Detected:**

- backend-overview.md
- backend-api.md (if API endpoints found)
- backend-services.md (if service layer detected)
- backend-data-access.md (if ORM/database client found)
- backend-auth.md (if auth mechanisms detected)
- backend-error-handling.md

**Generate if Frontend Detected:**

- frontend-overview.md
- frontend-components.md (if component framework found)
- frontend-state.md (if state management detected)
- frontend-routing.md (if routing library found)
- frontend-api-integration.md (if API client code found)
- frontend-styling.md (if styling system detected)

**Generate if Applicable:**

- database.md (if database schemas/migrations found)
- testing.md (if test files found)
- deployment.md (if CI/CD or deployment configs found)
- conventions.md (if style guides or linting configs found)

Create a recommended document list based on what was detected.
</action>

<action>Display scan summary to user in {communication_language}:

Present a clear summary including:

- Detected tech stack
- Identified frameworks and tools
- Architectural patterns found
- Recommended documents to generate (with checkboxes)

Example format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Initial Scan Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Technology Stack Detected:
✓ Frontend: React 18 + TypeScript + Vite
✓ Backend: Node.js + Express + TypeScript
✓ Database: PostgreSQL + Prisma ORM
✓ Testing: Jest + React Testing Library
✓ State: Zustand
✓ CI/CD: GitHub Actions

Recommended Documents:
□ overview.md - Project overview and tech stack
□ structure.md - Directory organization and conventions
□ backend-overview.md - Backend architecture overview
□ backend-api.md - REST API design patterns
□ backend-services.md - Service layer organization
□ backend-data-access.md - Prisma patterns and database access
□ backend-auth.md - JWT authentication implementation
□ backend-error-handling.md - Error handling strategies
□ frontend-overview.md - React application architecture
□ frontend-components.md - Component design patterns
□ frontend-state.md - Zustand state management
□ frontend-routing.md - React Router patterns
□ frontend-api-integration.md - API client patterns
□ frontend-styling.md - Tailwind CSS architecture
□ database.md - PostgreSQL schema and migrations
□ testing.md - Testing strategy and patterns
□ deployment.md - CI/CD and deployment process
□ conventions.md - Code style and best practices
```

</action>

<ask>Which documents would you like to generate?

Options:

1. **All Recommended** - Generate all documents listed above
2. **Custom Selection** - Let me choose specific documents
3. **Core Only** - Just overview.md and structure.md (fastest)

Select option (1-3):</ask>

<action>Store user selection as {{document_selection_mode}}</action>

<check if="document_selection_mode == 'custom'">
<ask>Please list the document names you want to generate (comma-separated or one per line):

Example: overview, structure, backend-api, frontend-components</ask>
<action>Parse the user's input and store as {{selected_documents}} array</action>
</check>

<check if="document_selection_mode == 'all'">
<action>Set {{selected_documents}} to include all recommended documents from scan</action>
</check>

<check if="document_selection_mode == 'core'">
<action>Set {{selected_documents}} to ['overview', 'structure']</action>
</check>

<action>Display final document generation plan to user for confirmation</action>

<template-output>scan_summary</template-output>
</step>

<step n="3" goal="Generate overview.md" if="'overview' in selected_documents">
<action>Perform deep analysis for project overview:

**Technology Stack Deep Dive:**

- List all major dependencies with versions
- Identify core frameworks and their roles
- Map technology choices to architectural decisions
- Note any deprecated or outdated dependencies

**High-Level Architecture:**

- Describe overall system architecture (monolith, microservices, etc.)
- Identify major system components and their relationships
- Document data flow patterns
- Describe deployment architecture

**Project Structure Philosophy:**

- Explain the organization strategy (feature-based, layer-based, etc.)
- Identify design patterns in use
- Document architectural principles evident in the code
- Note any architectural debt or inconsistencies

**Key Design Decisions:**

- Identify major technical decisions and their rationale (inferred from code)
- Document trade-offs made
- Note areas of technical excellence
- Identify areas for improvement
  </action>

<action>Generate overview.md with the following structure:

# Project Architecture Overview

**Last Updated:** {date}
**Analyzed By:** {user_name}

## Technology Stack

[Comprehensive tech stack listing with versions and purposes]

## System Architecture

[High-level architecture description with ASCII diagrams if helpful]

## Project Organization

[Organization philosophy and structure]

## Key Design Decisions

[Major architectural decisions and rationale]

## Architectural Patterns

[Patterns in use throughout the codebase]

## Areas for Improvement

[Identified technical debt or improvement opportunities]
</action>

<action>Save to {tech_architecture_doc_path}/overview.md</action>

<check if="file exists at {tech_architecture_doc_path}/overview.md">
<ask>The file overview.md already exists. How would you like to proceed?

1. **Overwrite** - Replace with new version (old saved as .backup)
2. **Merge** - Combine with existing content
3. **Skip** - Keep existing file
4. **Compare** - Show differences first

Select option (1-4):</ask>

<action>Handle according to user choice</action>
</check>

<action>Display generated overview.md content to user</action>

<ask>Does this overview accurately capture the project architecture?

Options:

- **Continue** [c] - Proceed to next document
- **Refine** [r] - Make adjustments to this document
- **Edit** [e] - I'll edit it manually

Your choice:</ask>

<check if="user_choice == 'refine'">
<action>Ask user what to refine and regenerate the document section</action>
<goto step="3">Return to generate overview again</goto>
</check>

<template-output>overview_document</template-output>
</step>

<step n="4" goal="Generate structure.md" if="'structure' in selected_documents">
<action>Perform deep directory structure analysis:

**Directory Tree Analysis:**

- Generate comprehensive directory tree
- Document purpose of each major directory
- Identify naming patterns and conventions
- Note any unusual or non-standard organization

**Module Organization:**

- Map how features/modules are organized
- Document shared vs feature-specific code
- Identify reusable components/utilities
- Note module dependencies and relationships

**File Naming Conventions:**

- Identify naming patterns for different file types
- Document file type conventions (.service.ts, .controller.ts, etc.)
- Note any inconsistencies
- Extract implicit naming rules

**Code Organization Patterns:**

- Identify how related files are grouped
- Document index file patterns
- Note barrel export patterns
- Identify code splitting strategies
  </action>

<action>Generate structure.md with the following structure:

# Project Structure and Organization

**Last Updated:** {date}
**Analyzed By:** {user_name}

## Directory Tree

[Annotated directory tree with explanations]

## Organization Strategy

[How the project is organized and why]

## Module Structure

[How modules/features are structured]

## File Naming Conventions

[Documented naming patterns with examples]

## Common Patterns

[Repeated structural patterns throughout the codebase]

## Navigation Guide

[How to find different types of code]
</action>

<action>Save to {tech_architecture_doc_path}/structure.md</action>

<action>Check for existing file and handle according to user preference (overwrite/merge/skip/compare)</action>

<action>Display generated structure.md content to user</action>

<ask>Is this structure documentation accurate and helpful?

Options:

- **Continue** [c] - Proceed to next document
- **Refine** [r] - Make adjustments
- **Edit** [e] - I'll edit manually

Your choice:</ask>

<check if="user_choice == 'refine'">
<action>Ask user what to refine and regenerate the document section</action>
<goto step="4">Return to generate structure again</goto>
</check>

<template-output>structure_document</template-output>
</step>

<step n="5" goal="Generate backend documentation" for-each="backend_doc in selected_backend_documents">
<action>For each backend document in {{selected_documents}} that starts with "backend-":

Determine which backend document to generate based on the name:

- backend-overview: Overall backend architecture
- backend-api: API design and routing patterns
- backend-services: Service layer organization
- backend-data-access: Database access patterns
- backend-auth: Authentication mechanisms
- backend-error-handling: Error handling patterns

Perform targeted deep analysis for the specific aspect.
</action>

<action if="backend_doc == 'backend-overview'">
**Backend Overview Analysis:**
- Identify backend framework and architecture style
- Document layers (controller, service, repository, etc.)
- Map request/response flow
- Identify middleware and interceptors
- Document dependency injection patterns
- Note security implementations
- Identify logging and monitoring approaches

Generate backend-overview.md with comprehensive backend architecture documentation.
</action>

<action if="backend_doc == 'backend-api'">
**API Design Analysis:**
- Catalog all API endpoints with patterns
- Document routing structure and organization
- Identify RESTful conventions or deviations
- Document API versioning strategy
- Analyze request/response formats
- Identify validation patterns
- Document middleware chain
- Note rate limiting or throttling
- Identify CORS and security headers

Generate backend-api.md with detailed API design patterns.
</action>

<action if="backend_doc == 'backend-services'">
**Service Layer Analysis:**
- Identify service organization patterns
- Document business logic structure
- Map service dependencies
- Identify transaction handling patterns
- Document service composition patterns
- Note error handling in services
- Identify caching strategies
- Document background job patterns

Generate backend-services.md with service layer patterns.
</action>

<action if="backend_doc == 'backend-data-access'">
**Data Access Analysis:**
- Identify ORM/query builder usage patterns
- Document repository patterns
- Analyze query optimization techniques
- Identify connection pooling strategies
- Document transaction management
- Note migration patterns
- Identify seed data approaches
- Document query building patterns

Generate backend-data-access.md with data access patterns.
</action>

<action if="backend_doc == 'backend-auth'">
**Authentication Analysis:**
- Identify authentication mechanisms (JWT, sessions, OAuth, etc.)
- Document token generation and validation
- Analyze authorization patterns (RBAC, ABAC, etc.)
- Identify permission checking approaches
- Document password hashing strategies
- Note refresh token mechanisms
- Identify session management patterns
- Document security best practices in use

Generate backend-auth.md with authentication patterns.
</action>

<action if="backend_doc == 'backend-error-handling'">
**Error Handling Analysis:**
- Identify error handling middleware
- Document error types and hierarchy
- Analyze error response formats
- Identify logging strategies for errors
- Document retry mechanisms
- Note fallback patterns
- Identify circuit breaker patterns
- Document error recovery approaches

Generate backend-error-handling.md with error handling patterns.
</action>

<action>Save the generated document to {tech_architecture_doc_path}/{backend_doc}.md</action>

<action>Check for existing file and handle according to user preference</action>

<action>Display generated document content to user</action>

<ask>Is this {{backend_doc}} documentation accurate?

Options:

- **Continue** [c] - Proceed to next document
- **Refine** [r] - Make adjustments
- **Edit** [e] - I'll edit manually

Your choice:</ask>

<check if="user_choice == 'refine'">
<action>Ask user what to refine and regenerate the document section</action>
<goto step="5">Return to generate this backend doc again</goto>
</check>

<template-output>{{backend_doc}}\_document</template-output>
</step>

<step n="6" goal="Generate frontend documentation" for-each="frontend_doc in selected_frontend_documents">
<action>For each frontend document in {{selected_documents}} that starts with "frontend-":

Determine which frontend document to generate based on the name:

- frontend-overview: Overall frontend architecture
- frontend-components: Component design patterns
- frontend-state: State management patterns
- frontend-routing: Routing architecture
- frontend-api-integration: API calling patterns
- frontend-styling: Styling architecture

Perform targeted deep analysis for the specific aspect.
</action>

<action if="frontend_doc == 'frontend-overview'">
**Frontend Overview Analysis:**
- Identify frontend framework and version
- Document application structure
- Map component hierarchy
- Identify build and bundling setup
- Document development workflow
- Note performance optimization techniques
- Identify accessibility implementations
- Document browser support strategy

Generate frontend-overview.md with comprehensive frontend architecture documentation.
</action>

<action if="frontend_doc == 'frontend-components'">
**Component Design Analysis:**
- Catalog component types (presentational, container, HOC, etc.)
- Document component organization patterns
- Identify component composition patterns
- Analyze prop patterns and conventions
- Document component lifecycle usage
- Identify reusable component patterns
- Note component library integration
- Document component testing patterns

Generate frontend-components.md with component design patterns.
</action>

<action if="frontend_doc == 'frontend-state'">
**State Management Analysis:**
- Identify state management solution (Redux, Zustand, Context, MobX, etc.)
- Document state structure and organization
- Analyze state update patterns
- Identify selector patterns
- Document side effect handling
- Note state persistence strategies
- Identify state normalization approaches
- Document state testing patterns

Generate frontend-state.md with state management patterns.
</action>

<action if="frontend_doc == 'frontend-routing'">
**Routing Architecture Analysis:**
- Identify routing library and patterns
- Document route structure and organization
- Analyze route protection patterns
- Identify navigation patterns
- Document route parameter handling
- Note lazy loading strategies
- Identify nested routing patterns
- Document route-based code splitting

Generate frontend-routing.md with routing patterns.
</action>

<action if="frontend_doc == 'frontend-api-integration'">
**API Integration Analysis:**
- Identify API client library (axios, fetch, etc.)
- Document API calling patterns
- Analyze request/response handling
- Identify error handling for API calls
- Document loading state management
- Note caching strategies
- Identify retry mechanisms
- Document API client configuration

Generate frontend-api-integration.md with API integration patterns.
</action>

<action if="frontend_doc == 'frontend-styling'">
**Styling Architecture Analysis:**
- Identify styling solution (CSS Modules, Styled Components, Tailwind, etc.)
- Document styling organization
- Analyze theming implementation
- Identify design system patterns
- Document responsive design approach
- Note animation patterns
- Identify CSS architecture patterns
- Document styling best practices

Generate frontend-styling.md with styling patterns.
</action>

<action>Save the generated document to {tech_architecture_doc_path}/{frontend_doc}.md</action>

<action>Check for existing file and handle according to user preference</action>

<action>Display generated document content to user</action>

<ask>Is this {{frontend_doc}} documentation accurate?

Options:

- **Continue** [c] - Proceed to next document
- **Refine** [r] - Make adjustments
- **Edit** [e] - I'll edit manually

Your choice:</ask>

<check if="user_choice == 'refine'">
<action>Ask user what to refine and regenerate the document section</action>
<goto step="6">Return to generate this frontend doc again</goto>
</check>

<template-output>{{frontend_doc}}\_document</template-output>
</step>

<step n="7" goal="Generate supporting documentation" for-each="support_doc in selected_supporting_documents">
<action>For each supporting document in {{selected_documents}} that is one of: database, testing, deployment, conventions:

Perform targeted analysis for the specific aspect.
</action>

<action if="support_doc == 'database'">
**Database Architecture Analysis:**
- Identify database system and version
- Document schema design patterns
- Analyze table relationships
- Identify indexing strategies
- Document migration patterns
- Note seed data organization
- Identify query optimization patterns
- Document database access patterns

Generate database.md with database architecture documentation.
</action>

<action if="support_doc == 'testing'">
**Testing Strategy Analysis:**
- Identify testing frameworks and tools
- Document test organization structure
- Analyze unit testing patterns
- Identify integration testing approaches
- Document E2E testing strategy
- Note mocking and stubbing patterns
- Identify test data management
- Document coverage expectations and tools

Generate testing.md with testing strategy documentation.
</action>

<action if="support_doc == 'deployment'">
**Deployment Process Analysis:**
- Identify CI/CD platform and configuration
- Document build pipeline stages
- Analyze deployment strategies
- Identify environment configurations
- Document infrastructure as code
- Note containerization patterns
- Identify secrets management
- Document monitoring and logging

Generate deployment.md with deployment process documentation.
</action>

<action if="support_doc == 'conventions'">
**Code Conventions Analysis:**
- Identify linting rules and configurations
- Document formatting standards
- Analyze naming conventions across codebase
- Identify code organization principles
- Document comment and documentation standards
- Note commit message conventions
- Identify PR and code review processes
- Document best practices enforced

Generate conventions.md with code conventions documentation.
</action>

<action>Save the generated document to {tech_architecture_doc_path}/{support_doc}.md</action>

<action>Check for existing file and handle according to user preference</action>

<action>Display generated document content to user</action>

<ask>Is this {{support_doc}} documentation accurate?

Options:

- **Continue** [c] - Proceed to next document
- **Refine** [r] - Make adjustments
- **Edit** [e] - I'll edit manually

Your choice:</ask>

<check if="user_choice == 'refine'">
<action>Ask user what to refine and regenerate the document section</action>
<goto step="7">Return to generate this supporting doc again</goto>
</check>

<template-output>{{support_doc}}\_document</template-output>
</step>

<step n="8" goal="Generate documentation index">
<action>Create a comprehensive index.md that serves as the navigation hub for all generated documentation:

# Architecture Documentation Index

**Last Updated:** {date}
**Project:** [Project Name]
**Analyzed By:** {user_name}

## Quick Navigation

This documentation is organized by topic for easy reference during implementation.

### Core Documentation

- [Project Overview](./overview.md) - Tech stack, architecture, key decisions
- [Project Structure](./structure.md) - Directory organization, naming conventions

### Backend Documentation

[List only the backend documents that were generated]

- [Backend Overview](./backend-overview.md) - Backend architecture overview
- [API Design](./backend-api.md) - REST API patterns and conventions
- [Service Layer](./backend-services.md) - Business logic organization
- [Data Access](./backend-data-access.md) - Database access patterns
- [Authentication](./backend-auth.md) - Auth mechanisms and security
- [Error Handling](./backend-error-handling.md) - Error handling strategies

### Frontend Documentation

[List only the frontend documents that were generated]

- [Frontend Overview](./frontend-overview.md) - Frontend architecture overview
- [Components](./frontend-components.md) - Component design patterns
- [State Management](./frontend-state.md) - State management patterns
- [Routing](./frontend-routing.md) - Navigation and routing
- [API Integration](./frontend-api-integration.md) - API calling patterns
- [Styling](./frontend-styling.md) - Styling architecture

### Supporting Documentation

[List only the supporting documents that were generated]

- [Database](./database.md) - Database schema and patterns
- [Testing](./testing.md) - Testing strategy and patterns
- [Deployment](./deployment.md) - CI/CD and deployment
- [Conventions](./conventions.md) - Code style and best practices

## How to Use This Documentation

**For AI Implementation:**

- Reference relevant documents when implementing features
- Follow patterns documented in architecture files
- Consult conventions.md for code style decisions

**For Human Developers:**

- Start with overview.md for project understanding
- Reference specific docs when working in those areas
- Use structure.md to navigate the codebase

**For Code Reviews:**

- Verify implementations follow documented patterns
- Check against conventions.md standards
- Ensure consistency with architectural decisions

## Updating This Documentation

This documentation should be updated when:

- Major architectural changes occur
- New patterns are adopted
- Technology stack changes
- Significant refactoring happens

To regenerate or update: Run `workflow analyze-architecture`
</action>

<action>Save to {tech_architecture_doc_path}/index.md</action>

<action>Display the generated index to user</action>

<template-output>index_document</template-output>
</step>

<step n="9" goal="Completion summary">
<action>Provide comprehensive completion summary to {user_name} in {communication_language}:

Display:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Architecture Analysis Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Documentation Generated:**
[List all generated documents with file paths]

**Location:** {tech_architecture_doc_path}

**Documents Created:**

- index.md (navigation hub)
- overview.md (project overview)
- structure.md (directory structure)
  [... list all other generated docs ...]

**Total Documents:** [count]

**Next Steps:**

1. **Review Documentation:**
   - Open {tech_architecture_doc_path}/index.md for navigation
   - Verify accuracy of technical details
   - Add any project-specific notes

2. **Use in Development:**
   - Reference these docs when implementing features
   - AI workflows (dev-flow, create-tech-spec) will automatically use these docs
   - Share with team members for onboarding

3. **Keep Updated:**
   - Re-run `workflow analyze-architecture` after major changes
   - Update manually for architectural decisions
   - Version control these docs with your code

**Configuration:**
The path {tech_architecture_doc_path} is configured in:
`bmad/sdd/config.yaml`

You can change this path if needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>Suggest next actions:

- Run dev-flow workflow (will now reference architecture docs)
- Add project-specific notes to the generated docs
- Share documentation with team
- Set up automated regeneration on major changes
  </action>

<template-output>completion_summary</template-output>
</step>

</workflow>
