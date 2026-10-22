# Workflow Rules

## Introduction

Consult component contracts before implementation and validate usage afterward. Automated validation complements, but does not replace, reviewing the interface in context.

## Component contracts

Before implementing a component, retrieve its contract using the registered MCP tool `get_component_contract`. Use `list_components` to discover the inventory. Check supported props, required boolean flags, variants, state semantics, token constraints, accessibility requirements, and anti-patterns rather than guessing.

Examples:

```diff
- // Invent a variant or assume every component supports the same props.
- // Pass MCP tool calls as terminal arguments to uikit-tools mcp (a stdio server).
+ // Call the agent's registered MCP tools before implementing a form:
+ list_components({ limit: 10, offset: 0 })
+ get_component_contract({ component: "HvInput" })
+ // Consult component stories for usage examples.
```

## Validation

After implementation and before committing, run `npx uikit-tools validate 'src/**/*.tsx'`, resolve reported violations, and review the guidance manually against the actual product flow.

The current CLI only checks a subset of `HvButton` and `HvAvatar` usage, including variants, some raw colors, selected/toggle semantics, image alternatives, and icon-only labels. It does not validate all spacing, date formatting, destructive control flow, or data states. A clean result is not proof of compliance with every rule.

Examples:

```diff
- // Treat "All validations passed" as proof that every rule or component was checked.
- // Claim the CLI validates all spacing and accessibility requirements.
+ // Query the relevant contract, correct reported violations, and rerun validation.
+ // Separately verify destructive confirmation, date formatting, layout, tokens, and component choice.
```
