# HV UI Kit Workflow and Validation

## Getting Full Component Contracts

These rule files cover universal rules only. For detailed information about a specific component, **ALWAYS call the registered MCP tool before implementing**:

```text
info({ component: "HvButton" })
```

The init command registers the server in `.vscode/mcp.json`. Use the MCP tools exposed by your agent; `uikit-tools mcp` starts the stdio server and does not accept tool calls as terminal arguments.

**Returns:**

- Props with their types, whether they are required, and descriptions
- All available variants and their semantic meaning
- State rules (when to use `checked`, `disabled`, `selected`, etc.)
- Token constraints (allowed color/size values)
- Anti-patterns specific to this component
- Accessibility requirements (ARIA attributes)
- Validation rules (what inputs are valid)

**CRITICAL: Query MCP Server for:**

- Required vs optional props
- Boolean flags that enable features (like `showCount` for HvBadge)
- Valid prop values and enums
- Component state rules
- Accessibility requirements
- Anti-patterns specific to the component

## Listing All Components

To see the full inventory programmatically, call:

```text
components({ limit: 10, offset: 0 })
```

## Validation

Before committing code, validate against the component contracts:

```bash
npx uikit-tools validate src/**/*.tsx
```

Checks:

- Invalid component variant values
- Raw color/spacing values instead of tokens
- Known anti-pattern usage
- Missing required props (esp. accessibility)

## Workflow

1. **Understand the task**: What are you building?
2. **Check the rule files**: What components exist? What are the universal rules?
3. **Query the MCP server for each component**: Call `info` before writing code
   ```text
   info({ component: "HvInput" })
   ```
   This is **CRITICAL** to find:
   - Required props
   - Boolean feature flags (e.g., `showCount` for HvBadge)
   - Valid prop values
   - Component-specific anti-patterns
4. **Generate or write code**: Follow the contract and universal rules
5. **Validate before committing**
   ```bash
   npx uikit-tools validate src/**/*.tsx
   ```
6. **Fix violations**: Review errors and correct (usually tokens or a11y)

## Questions?

- **Need variants or props for a component?** → **QUERY MCP FIRST**
  ```text
  info({ component: "HvComponentName" })
  ```
- **Component display is wrong or empty?** → Check MCP for required boolean flags (showCount, etc.)
- **Want examples?** → See component Storybook stories
- **Validation failing?** → Check the error message, query MCP for full rules
- **Token values?** → Check design tokens documentation
