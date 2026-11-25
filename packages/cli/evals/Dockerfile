# One trial, isolated: the agent's commands run in this container, not on your machine (build and run: the README).
# The harness (packages/cli's src and evals) is copied in at build time; while the agent runs, only this run's folder
# and npm's cache (a named volume of public packages) are mounted. No secret is baked in.

# Node as the CLI's engines want it (^24.15.0)
FROM node:24-bookworm

# Claude Code, pinned (2.1.323: npm's stable when the harness was last checked; pass another on purpose, never
# `latest`); Chromium's system libraries, and the Chromium of the Playwright the templates pin, for `npm run shots`.
# The browsers' folder stays root's: an agent's `playwright install` would otherwise prune the revision the harness's
# own review shots need.
ARG CLAUDE_CODE_VERSION=2.1.323
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN test "${CLAUDE_CODE_VERSION}" != latest \
  && npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION} \
  && npx --yes playwright@1.61.0 install --with-deps chromium \
  && mkdir /trial /work /tmp/npm-cache \
  && chown -R node:node /trial /work /tmp/npm-cache

# The harness: its pure-JS dependencies (the versions in the repo's lock), then its files
WORKDIR /harness
RUN npm init -y > /dev/null \
  && npm install --no-audit --no-fund commander@15.1.0 playwright@1.61.0
COPY package.json packages/cli/package.json
COPY src packages/cli/src
COPY evals packages/cli/evals

# Claude Code refuses --permission-mode bypassPermissions as root
USER node
ENTRYPOINT ["node", "/harness/packages/cli/evals/run.ts"]
