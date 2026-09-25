#!/bin/bash

# Wrapper script to test MCP server using the test client
# Usage:
#   ./packages/tools/test-mcp.sh list_components --limit 3
#   ./packages/tools/test-mcp.sh get_component_contract --componentName HvAvatar

if [ $# -eq 0 ]; then
  echo "Usage: $0 <tool> [options]"
  echo "  list_components --limit <n> [--offset <n>]"
  echo "  get_component_contract --componentName <name>"
  exit 1
fi

node packages/tools/dist/test-mcp-client.js "$@"
