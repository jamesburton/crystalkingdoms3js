# Documentation Maintenance Guide

This document provides guidelines for maintaining documentation across the Crystal Kingdoms 3JS project.

## Documentation Structure

The project maintains documentation in multiple locations:

- **`README.md`** (root): Primary user-facing documentation
- **`docs/`**: Detailed technical documentation and planning
- **`.github/agents/`**: Agent instruction files for code maintenance

## When to Update Documentation

### README.md Updates Required

Update `README.md` when:

- ✅ Adding new features or capabilities
- ✅ Changing how to build, test, or run the project
- ✅ Modifying project architecture or core patterns
- ✅ Adding or removing dependencies
- ✅ Changing game mechanics or rules
- ✅ Adding new modules or restructuring code

### Design Decisions Updates Required

Update `.github/agents/design-decisions.md` when:

- ✅ Making architectural decisions
- ✅ Choosing between different implementation approaches
- ✅ Establishing new patterns or conventions
- ✅ Modifying existing design decisions
- ✅ Adding constraints or limits

### Code Patterns Updates Required

Update `.github/agents/code-patterns.md` when:

- ✅ Introducing new coding patterns
- ✅ Changing naming conventions
- ✅ Modifying testing approaches
- ✅ Updating TypeScript configuration
- ✅ Changing error handling patterns

## Documentation Style Guide

### Writing Style

- **Be Clear**: Use simple, direct language
- **Be Concise**: Get to the point quickly
- **Be Specific**: Provide concrete examples
- **Be Consistent**: Follow existing patterns and terminology

### Code Examples

Always include code examples for:
- New features
- Complex patterns
- Non-obvious usage

Format code examples with:
```typescript
// ✅ CORRECT - Show the right way
export function goodExample(): void {
  // Implementation
}

// ❌ INCORRECT - Show what to avoid
function badExample() {
  // Problematic implementation
}
```

### Section Structure

Use consistent heading levels:
- `#` for document title
- `##` for major sections
- `###` for subsections
- `####` for detailed breakdowns

## Documentation Checklist

When making code changes, ask:

- [ ] Does this change affect how users interact with the project?
  - → Update README.md usage section
- [ ] Does this change the build, test, or development workflow?
  - → Update README.md installation/development sections
- [ ] Is this a significant architectural or design decision?
  - → Add entry to design-decisions.md
- [ ] Does this introduce new patterns or conventions?
  - → Update code-patterns.md
- [ ] Does this change game mechanics or rules?
  - → Update README.md game mechanics section
- [ ] Are there new modules or significant refactoring?
  - → Update README.md architecture section

## Documentation Templates

### Adding a New Feature to README.md

When documenting a new feature:

1. Update the overview/features list
2. Add usage example if applicable
3. Update architecture section if new modules are added
4. Add to game mechanics if it affects gameplay
5. Update testing section if new test patterns are introduced

### Adding a Design Decision

Template for `.github/agents/design-decisions.md`:

```markdown
### Decision: [Short Title]

**Date**: [YYYY-MM-DD or "Per MVP plan"]  
**Status**: Active | Deprecated | Superseded

**Context**: [Why this decision was needed]

**Decision**: [What was decided]

**Consequences**:
- ✅ Positive outcome
- ✅ Another positive
- ⚠️ Trade-off or consideration
- ❌ Negative (if any)

**Implementation**: [Brief code example or reference]
```

### Adding a Code Pattern

Template for `.github/agents/code-patterns.md`:

```markdown
### Pattern Name

Description of the pattern and when to use it.

**Example:**
\`\`\`typescript
// ✅ CORRECT
// Good example

// ❌ INCORRECT
// Bad example
\`\`\`

**Guidelines**:
- Do this
- Don't do that
```

## Keeping Documentation Up to Date

### Regular Maintenance

Review documentation quarterly or when:
- Major features are added
- Architecture changes
- Dependencies are updated
- Testing practices evolve

### Documentation Debt

If documentation updates are skipped during development:
1. Add a TODO comment in the code
2. Create an issue to track the documentation debt
3. Update documentation before the next release

## Documentation Quality Standards

All documentation should be:

- **Accurate**: Reflect the current state of the code
- **Complete**: Cover all user-facing features
- **Tested**: Code examples should actually work
- **Accessible**: Written for developers of varying skill levels
- **Maintained**: Updated as code changes

## Examples and Patterns

### Good README Section

```markdown
## Feature Name

Brief description of what the feature does.

### Usage

\`\`\`typescript
import { featureFunction } from './module.js';

const result = featureFunction(input);
\`\`\`

### Options

- `option1`: Description
- `option2`: Description

### Behavior

Explanation of how it works, edge cases, etc.
```

### Good Design Decision Entry

See the template above and existing entries in `design-decisions.md`.

## Agent Instructions

When AI agents make code changes, they should:

1. **Check existing documentation** before making changes
2. **Update documentation** as part of the same PR/commit
3. **Follow established patterns** from code-patterns.md
4. **Respect design decisions** from design-decisions.md
5. **Add new decisions** when making significant choices
6. **Keep documentation in sync** with code changes

## Questions and Clarifications

If documentation is unclear or outdated:
1. Create an issue describing the problem
2. Propose specific improvements
3. Update the documentation once consensus is reached

## Version History

Document significant documentation updates:
- Initial documentation: 2026-02-14
- [Future updates will be listed here]
