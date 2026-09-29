# @pentaho/uikit-tools

CLI tools for consuming HV UI Kit components: generate instructions, validate code, and retrieve component contracts.

# Generate contracts - check the component-metadata.json in the core/dist folder

npm run extract:contracts

# create instructions.md file at the dev repo

node packages/tools/dist/cli.js init .

# Validate code

node packages/tools/dist/cli.js validate "packages/tools/test-fixtures/validation-violations.tsx"

# List components

packages/tools/test-mcp.sh list_components --limit 3

# Get component contract (via proper protocol)

packages/tools/test-mcp.sh get_component_contract --component HvAvatar
