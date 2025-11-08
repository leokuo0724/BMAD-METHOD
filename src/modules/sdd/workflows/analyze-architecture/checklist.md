# Analyze Architecture Workflow Validation Checklist

## Pre-Execution Validation

- [ ] Configuration file `bmad/sdd/config.yaml` exists
- [ ] `tech_architecture_doc_path` is configured in config.yaml
- [ ] Target project/directory for analysis is accessible
- [ ] User has specified analysis scope clearly

## Scan Phase Validation

- [ ] Initial directory scan completed successfully
- [ ] Technology stack accurately detected
- [ ] Framework and tool versions identified
- [ ] Architectural patterns recognized
- [ ] Document recommendations match detected technologies
- [ ] User selected documents to generate

## Core Documentation Quality

### overview.md

- [ ] Technology stack section lists all major dependencies with versions
- [ ] System architecture clearly described with diagrams where applicable
- [ ] Project organization philosophy explained
- [ ] Key design decisions documented with rationale
- [ ] Architectural patterns identified accurately
- [ ] Areas for improvement noted constructively
- [ ] No placeholder text or TODO markers remain
- [ ] Document saved to correct path

### structure.md

- [ ] Directory tree accurately represents project
- [ ] Each major directory has purpose documented
- [ ] Module organization patterns explained
- [ ] File naming conventions documented with examples
- [ ] Code organization patterns identified
- [ ] Navigation guide is clear and helpful
- [ ] No placeholder text remains
- [ ] Document saved to correct path

## Backend Documentation Quality

### backend-overview.md (if generated)

- [ ] Backend framework and version identified correctly
- [ ] Layer architecture (controller/service/repository) documented
- [ ] Request/response flow explained clearly
- [ ] Middleware and interceptors documented
- [ ] Dependency injection patterns identified
- [ ] Security implementations noted
- [ ] No generic or placeholder content

### backend-api.md (if generated)

- [ ] All major API endpoints cataloged
- [ ] Routing structure and organization documented
- [ ] RESTful conventions or deviations noted
- [ ] API versioning strategy documented
- [ ] Request/response formats specified
- [ ] Validation patterns identified
- [ ] Middleware chain documented
- [ ] Security headers and CORS configuration noted

### backend-services.md (if generated)

- [ ] Service organization patterns documented
- [ ] Business logic structure explained
- [ ] Service dependencies mapped
- [ ] Transaction handling patterns identified
- [ ] Error handling in services documented
- [ ] Caching strategies noted

### backend-data-access.md (if generated)

- [ ] ORM/query builder usage patterns documented
- [ ] Repository patterns identified
- [ ] Query optimization techniques noted
- [ ] Transaction management explained
- [ ] Migration patterns documented
- [ ] Database connection patterns identified

### backend-auth.md (if generated)

- [ ] Authentication mechanisms identified (JWT, sessions, OAuth, etc.)
- [ ] Token generation and validation documented
- [ ] Authorization patterns explained (RBAC, ABAC, etc.)
- [ ] Permission checking approaches documented
- [ ] Security best practices noted

### backend-error-handling.md (if generated)

- [ ] Error handling middleware documented
- [ ] Error types and hierarchy explained
- [ ] Error response formats specified
- [ ] Logging strategies documented
- [ ] Retry and fallback patterns identified

## Frontend Documentation Quality

### frontend-overview.md (if generated)

- [ ] Frontend framework and version identified correctly
- [ ] Application structure documented
- [ ] Component hierarchy mapped
- [ ] Build and bundling setup explained
- [ ] Performance optimizations noted
- [ ] Browser support strategy documented

### frontend-components.md (if generated)

- [ ] Component types cataloged (presentational, container, etc.)
- [ ] Component organization patterns documented
- [ ] Composition patterns identified
- [ ] Prop patterns and conventions explained
- [ ] Reusable component patterns noted
- [ ] Component testing patterns documented

### frontend-state.md (if generated)

- [ ] State management solution identified correctly
- [ ] State structure and organization documented
- [ ] State update patterns explained
- [ ] Selector patterns identified
- [ ] Side effect handling documented
- [ ] State persistence strategies noted

### frontend-routing.md (if generated)

- [ ] Routing library identified
- [ ] Route structure documented
- [ ] Route protection patterns explained
- [ ] Navigation patterns identified
- [ ] Lazy loading strategies noted
- [ ] Code splitting patterns documented

### frontend-api-integration.md (if generated)

- [ ] API client library identified
- [ ] API calling patterns documented
- [ ] Request/response handling explained
- [ ] Error handling for API calls documented
- [ ] Loading state management identified
- [ ] Caching strategies noted

### frontend-styling.md (if generated)

- [ ] Styling solution identified (CSS Modules, Styled Components, etc.)
- [ ] Styling organization documented
- [ ] Theming implementation explained
- [ ] Design system patterns identified
- [ ] Responsive design approach documented
- [ ] CSS architecture patterns noted

## Supporting Documentation Quality

### database.md (if generated)

- [ ] Database system and version identified
- [ ] Schema design patterns documented
- [ ] Table relationships analyzed
- [ ] Indexing strategies noted
- [ ] Migration patterns documented
- [ ] Query optimization patterns identified

### testing.md (if generated)

- [ ] Testing frameworks identified correctly
- [ ] Test organization structure documented
- [ ] Unit testing patterns explained
- [ ] Integration testing approaches noted
- [ ] E2E testing strategy documented
- [ ] Mocking patterns identified
- [ ] Coverage expectations specified

### deployment.md (if generated)

- [ ] CI/CD platform identified
- [ ] Build pipeline stages documented
- [ ] Deployment strategies explained
- [ ] Environment configurations noted
- [ ] Infrastructure as code documented
- [ ] Monitoring and logging identified

### conventions.md (if generated)

- [ ] Linting rules documented
- [ ] Formatting standards specified
- [ ] Naming conventions explained with examples
- [ ] Code organization principles identified
- [ ] Documentation standards noted
- [ ] Best practices enforced documented

## Index and Navigation

### index.md

- [ ] Index includes all generated documents
- [ ] Navigation links work correctly (relative paths)
- [ ] Quick navigation section is clear
- [ ] Usage instructions are helpful
- [ ] Update guidance provided
- [ ] No broken links or references

## Overall Quality Standards

### Technical Accuracy

- [ ] All technology names and versions are correct
- [ ] Patterns described match actual codebase implementation
- [ ] No speculative or assumed information without qualification
- [ ] Code examples (if included) are accurate
- [ ] Terminology is consistent throughout all documents

### Completeness

- [ ] All selected documents were generated
- [ ] No sections contain placeholder text
- [ ] Each document addresses its topic comprehensively
- [ ] Cross-references between documents are accurate
- [ ] All documents saved to correct location

### Clarity and Usefulness

- [ ] Documents are well-structured and organized
- [ ] Language is clear and professional
- [ ] Examples are provided where helpful
- [ ] Patterns are explained, not just listed
- [ ] Documents will be useful for AI implementation
- [ ] Documents are helpful for human developers

### File Management

- [ ] All files saved to {tech_architecture_doc_path}
- [ ] Existing files handled according to user preference
- [ ] Backup files created when overwriting (.backup extension)
- [ ] File permissions are appropriate
- [ ] Directory structure created if it didn't exist

## Post-Generation Validation

- [ ] User reviewed and approved all generated documents
- [ ] Completion summary displayed with all file locations
- [ ] Next steps guidance provided to user
- [ ] Documentation is ready for use in dev workflows
- [ ] No error messages or warnings during generation

## Critical Issues

**If any of these are found, workflow execution should be corrected:**

- ❌ Generic or placeholder content in documents
- ❌ Incorrect technology stack identification
- ❌ Missing major architectural patterns
- ❌ Broken references between documents
- ❌ Files not saved to configured path
- ❌ User-selected documents not generated
- ❌ Incomplete document sections
