# Dev Flow - Context Window Management Guide

## Problem

Dev-flow is a long workflow with multiple stages:

1. Fetch Jira (small)
2. Analyze codebase context (LARGE - can use many tokens)
3. Generate tech spec (medium)
4. Implementation (LARGE - many phases)
5. Tests (medium)
6. PR creation (small)

If codebase analysis uses too many tokens, there may not be enough context window left for implementation.

## Solutions

### Solution 1: Use Standalone Workflows (Recommended) ✅

**Already exists in SDD module!**

Instead of using `dev-flow` end-to-end, split into two sessions:

**Session 1 - Planning:**

```bash
workflow create-tech-spec
```

- Fetches Jira
- Analyzes codebase
- Generates tech spec
- Saves document
- **Ends here** (preserves context for later)

**Session 2 - Implementation:**

```bash
workflow implement-task
```

- Loads existing tech spec
- Fresh context window
- Implements all phases
- Creates PR

**Advantages:**

- Natural breakpoint at tech spec
- Tech spec document serves as state transfer
- Each session has full context window
- Already implemented, no changes needed

---

### Solution 2: Add Resume Capability to Dev Flow

Modify `dev-flow/instructions.md` to add a resume option at the start.

**Add to Step 1:**

```xml
<step n="1" goal="Choose workflow mode">
<ask>How would you like to proceed?

1. **Full flow** - Complete workflow from Jira to PR
2. **Planning only** - Stop after tech spec generation
3. **Resume from tech spec** - Start implementation with existing tech spec

Select [1/2/3]:</ask>

<check if="user selected 3">
  <ask>Please provide path to existing tech spec document:</ask>
  <action>Load tech spec from provided path</action>
  <action>Skip to Step 4 (implementation)</action>
  <goto step="4">Jump to implementation</goto>
</check>

<check if="user selected 2">
  <action>Set {{stop_after_tech_spec}} = true</action>
  <action>Continue with normal flow</action>
</check>
</step>

<!-- Later in Step 3 (after tech spec) -->
<step n="3" goal="Review and approve tech spec">
  <!-- existing content -->

  <check if="stop_after_tech_spec == true">
    <action>Display message:

    ✅ Tech spec created and saved!

    Tech spec: {{tech_spec_path}}

    To continue implementation in a new session:
    1. Start a new Claude Code session
    2. Run: workflow dev-flow
    3. Select: "Resume from tech spec"
    4. Provide path: {{tech_spec_path}}
    </action>
    <goto step="end">Exit workflow</goto>
  </check>
</step>
```

**Advantages:**

- Single workflow with flexibility
- Clear exit/resume points
- State preserved in tech spec document

---

### Solution 3: Implement Workflow State Persistence

Add a state file that tracks progress through dev-flow.

**Create:** `docs/sdd/.workflow-state/dev-flow-{jira-ticket}.json`

```json
{
  "jira_ticket": "FIS-123",
  "current_step": 3,
  "completed_steps": [1, 2, 3],
  "tech_spec_path": "docs/sdd/tech-spec/tech-spec-FIS-123-auth.md",
  "codebase_analysis_summary": "...",
  "commit_strategy": "auto",
  "phases_completed": [1, 2],
  "phases_total": 5,
  "last_updated": "2025-11-04T12:00:00Z"
}
```

**Modify dev-flow to:**

1. Check for existing state file on start
2. Offer to resume from last checkpoint
3. Update state file after each major step
4. Delete state file when workflow completes

**Advantages:**

- Fine-grained resume capability
- Can resume at any step
- Preserves all context

**Disadvantages:**

- More complex to implement
- Requires state file management
- May still have context issues if resuming mid-implementation

---

### Solution 4: Lightweight Context Mode

Add a "lite" mode that skips heavy analysis:

```xml
<step n="2" goal="Load codebase context">
<ask>Codebase analysis mode:

1. **Full analysis** - Comprehensive (uses more tokens)
2. **Focused analysis** - Only analyze files mentioned in task
3. **Minimal** - Skip analysis, rely on tech architecture doc

Select [1/2/3]:</ask>

<check if="user selected 2">
  <action>Analyze only files directly related to task based on Jira description</action>
  <action>Skip broad codebase scanning</action>
</check>

<check if="user selected 3">
  <check if="tech_architecture_doc_path exists">
    <action>Load architecture doc only</action>
    <action>Skip codebase scanning entirely</action>
  </check>
  <check if="tech_architecture_doc_path not available">
    <action>Warn: Minimal mode requires architecture doc</action>
    <action>Fallback to focused analysis</action>
  </check>
</check>
</step>
```

**Advantages:**

- Reduces token usage in analysis phase
- User controls depth of analysis
- Still single workflow

**Disadvantages:**

- May miss important context
- Relies on good architecture docs

---

## Recommendation

### Immediate Solution (No Code Changes)

**Use the existing standalone workflows:**

1. When context is limited → Use `create-tech-spec` + `implement-task`
2. When context is abundant → Use `dev-flow` end-to-end

**Document this in README:**

````markdown
## Context Window Management

If you're working with a large codebase and concerned about context limits:

**Option A: Split workflow (Recommended for large codebases)**

```bash
# Session 1: Planning
workflow create-tech-spec
# Creates and saves tech spec, then exits

# Session 2: Implementation
workflow implement-task
# Loads tech spec, fresh context for implementation
```
````

**Option B: Full workflow (Best for smaller tasks)**

```bash
workflow dev-flow
# Complete end-to-end in one session
```

````

---

### Medium-term Enhancement

Implement **Solution 2** (Resume capability in dev-flow):
- Add mode selection at start
- Add "planning only" mode
- Add "resume from tech spec" mode
- Minimal code changes
- Backward compatible

---

### Long-term Enhancement

Implement **Solution 3** (State persistence):
- Full resume capability
- State file tracking
- Can pause/resume anywhere
- Most flexible but most complex

---

## Best Practices

### For Users:

1. **Estimate context needs:**
   - Small task (< 3 files) → Use dev-flow
   - Medium task (3-10 files) → Use dev-flow or split
   - Large task (10+ files) → Split into create-tech-spec + implement-task

2. **Monitor token usage:**
   - If analysis phase uses > 50% of context → Stop and split
   - Use "planning only" mode if available

3. **Leverage tech spec:**
   - Tech spec is your checkpoint
   - Can always resume from a saved tech spec
   - Share tech spec across sessions

### For Developers:

1. **Keep workflows modular:**
   - Each workflow should have clear input/output
   - Use documents for state transfer
   - Avoid deep dependencies

2. **Provide escape hatches:**
   - Allow users to exit early
   - Provide resume mechanisms
   - Save state frequently

---

## Implementation Priority

**Priority 1 (Immediate):**
- ✅ Document the split workflow pattern in README
- ✅ Update dev-flow docs with context management tips

**Priority 2 (Next sprint):**
- Add resume capability to dev-flow (Solution 2)
- Add lightweight context mode (Solution 4)

**Priority 3 (Future):**
- Full state persistence (Solution 3)
- Token usage estimation and warnings

---

## Example Scenarios

### Scenario 1: Large Codebase, Complex Task

**Problem:** Analyzing entire auth system would use 80% of context

**Solution:**
```bash
# Session 1
workflow create-tech-spec
> Jira: FIS-456
> Analysis complete, tech spec saved
# Exit

# Session 2 (new context)
workflow implement-task
> Tech spec: docs/sdd/tech-spec/tech-spec-FIS-456-oauth.md
> Implement Phase 1, 2, 3...
> PR created
````

### Scenario 2: Medium Task, Uncertain Complexity

**Problem:** Not sure if context will be enough

**Solution (if enhanced dev-flow available):**

```bash
workflow dev-flow
> Select: Planning only
> ... analysis and tech spec generation ...
> Tech spec saved

# Check token usage
# If comfortable, continue in same session:
workflow dev-flow
> Select: Resume from tech spec
> ... implementation ...
```

### Scenario 3: Very Large Multi-Phase Implementation

**Problem:** Implementation has 8 phases, might not fit

**Solution:**

```bash
# Session 1: Planning
workflow create-tech-spec

# Session 2: Phases 1-4
workflow implement-task
> Stop after Phase 4
> Manual commit

# Session 3: Phases 5-8
# Continue implementation
> Complete remaining phases
> Create PR
```

---

## Conclusion

The **best immediate solution** is to document and encourage the use of:

- `create-tech-spec` for planning
- `implement-task` for implementation

This pattern:

- ✅ Already works today
- ✅ Natural checkpoint at tech spec
- ✅ Fresh context for each phase
- ✅ No code changes needed

For enhanced UX, add resume capability to dev-flow as described in Solution 2.
