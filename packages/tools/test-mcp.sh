#!/bin/bash

# Wrapper script to test MCP server using the test client
# Usage:
#   ./packages/tools/test-mcp.sh components --limit 3
#   ./packages/tools/test-mcp.sh info --component HvAvatar

if [ $# -eq 0 ]; then
  echo "Usage: $0 <tool> [options]"
  echo "  components --limit <n> [--offset <n>]"
  echo "  info --component <name>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/dist/test-mcp-client.js" "$@"
