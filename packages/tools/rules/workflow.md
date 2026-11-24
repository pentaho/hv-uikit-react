# Workflow Rules

## Introduction

Consult component contracts before implementation and validate usage afterward. Automated validation complements, but does not replace, reviewing the interface in context.

## Component contracts

Before using a component, look it up: `npx --no-install uikit-tools info <Component>` (MCP: `get_component`); `components` (MCP: `list_components`) lists them all. Check its props, variants, states, accessibility and don'ts rather than guessing; don't assume every component supports the same props. `uikit-tools mcp` is a stdio server: don't pass MCP tool calls to it as terminal arguments.

## Validation

After implementation and before committing, run `npx --no-install uikit-tools lint <paths>` (MCP: `lint`) and the project's checks (for example `npm run check`), fix what they report, and rerun them.

Type checks catch invalid props and variants. Lint flags hard-coded colors and sizes, native controls that have a UI Kit component, missing names and deprecated APIs, and each finding names its rule. Neither checks token roles, layout, component choice, date formatting, destructive-action flow, or data states: verify those yourself against the actual product flow. A clean result is not proof of compliance.

## Dates

Take "today" from the app's own notion of now, never a bare `new Date()`, and fix it in tests and demos so their results and screenshots don't change from day to day.
