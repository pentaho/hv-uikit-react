---
component: HvQueryBuilder
status: stable
related:
  [
    HvFilterGroup,
    HvSearchInput,
    HvDialog,
    HvMultiButton,
    HvDropdown,
    HvEmptyState,
  ]
---

# HvQueryBuilder

Builds structured conditions (attribute, operator, value) grouped with AND / OR, for advanced search or rules.

## When to use

- Power users composing queries or rules over known attributes: alert conditions, advanced asset search, data quality rules.
- Picking values per category: HvFilterGroup. Plain text search: HvSearchInput.

## What the consumer provides

- `attributes`, defined once (outside render, or memoized): a new object identity resets the whole query.
- `value` + `onChange(query)`, or `defaultValue`.
- A custom attribute `type` needs its own `operators` entry (otherwise only the value input shows; `hvQueryBuilderDefaultOperators` holds the built-in ones) and gets a text input unless `renderers` supplies one.
- `emptyRenderer` operators clear the value and show no input, and win over `renderers`.

## Spec

- Removing a rule or group asks for confirmation in an HvDialog; repeating an attribute under AND shows an error.
- A bordered (`border`) box with `space.sm` padding; nested groups indented with `border` connector lines; spacing `space.sm` to `space.lg`; remove buttons on `bgPage`.
- The AND / OR combinator is an HvMultiButton at the group's top left; attribute and operator are HvDropdowns (searchable for long lists); value inputs are HvInput, number and date and time pickers.
- An empty group shows an HvEmptyState with links to create a condition or group.

## Don't

- Don't make it the everyday filter of a list page: it is heavy; offer it behind "Advanced".
- Don't let people free-type attribute names: define `attributes` from the data model.
