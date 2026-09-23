# @pentaho/uikit-tools

CLI tools for consuming HV UI Kit components: generate instructions, validate code, and retrieve component contracts.

## Installation

```bash
npm install @pentaho/uikit-tools
```

## Commands

### init

Generate `AGENTS.md` in your project directory:

```bash
npx @pentaho/uikit-tools init [targetDir]
```

This creates a short, routed instruction file that tells agents:

- What components are available
- Correct patterns with examples
- Token rules
- How to validate code
- Where to query for detailed contracts

The file regenerates on version upgrades, so guidance always matches the installed version.

### validate

Validate your code against HV UI Kit contracts:

```bash
npx @pentaho/uikit-tools validate src/**/*.tsx
```

Checks for:

- Invalid component variants
- Raw color/spacing values instead of tokens
- Anti-pattern usage
- Missing accessibility conditions

_Planned for Phase 4._

### mcp

Start an MCP server that serves component metadata:

```bash
npx @pentaho/uikit-tools mcp
```

Tools:

- `list_components` — component inventory
- `get_component_contract` — full contract (variants, anti-patterns, a11y)
- `get_component_examples` — canonical examples
- `get_token_rules` — allowed token values
- `search` — free-text search
- `validate_usage` — pre-flight validation

_Planned for Phase 5._

## Architecture

Tools read from `@pentaho/uikit-react-core`'s `dist/component-metadata.json`, which is generated during the core package's build. This ensures:

- One source of truth (JSDoc in Button.tsx)
- No version skew (all tools use the same metadata)
- Automatic regeneration (no hand-maintained files)
- Version awareness (tools always serve the installed version)

## Development

```bash
npm run build       # Compile TypeScript
npm run dev         # Watch mode
npm run test        # Run tests
npm run clean       # Remove dist/
```

## Dependencies

- `@pentaho/uikit-react-core` — Component library with metadata
- `commander` — CLI parsing
- `chalk` — Terminal colors
- `ts-morph` — Code analysis (for validation and MCP)
