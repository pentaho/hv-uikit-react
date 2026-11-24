#!/usr/bin/env bash
# Runs trials after setup.sh: every task named (default: all three) in both arms, RUNS times each (default 1), two
# at a time, into .evals/<task>-<arm>-<n>; then grades them and prints the report. RUNS=1 is a smoke test: a claim
# about the tooling wants RUNS=3 to 5. Needs CLAUDE_CODE_OAUTH_TOKEN (a token made for the evals: `claude
# setup-token`), which the grader uses too. MODEL and MAX_TURNS (the agent's turns per trial) override the defaults.
#   packages/cli/evals/batch.sh users            # one task, one run per arm
#   RUNS=3 packages/cli/evals/batch.sh           # the full set
set -euo pipefail
cd "$(dirname "$0")/../../.."
: "${CLAUDE_CODE_OAUTH_TOKEN:?set CLAUDE_CODE_OAUTH_TOKEN}"
MODEL=${MODEL:-claude-sonnet-5-5}
RUNS=${RUNS:-1}
MAX_TURNS=${MAX_TURNS:-150}
HARNESS_SHA=$(git rev-parse --short HEAD)
export HARNESS_SHA
TASKS=${*:-users data-connection report-usage}

trial() {
  local dir=".evals/$1-$2-$3"
  rm -rf "$dir" && mkdir -p "$dir"
  docker run --rm --ulimit core=0 --cpus 2 --memory 2800m -e CLAUDE_CODE_OAUTH_TOKEN -e HARNESS_SHA \
    -v "$PWD/$dir:/trial" -v uikit-evals-npm:/tmp/npm-cache uikit-evals \
    "$1" --model "$MODEL" --condition "$2" --dir /trial --max-turns "$MAX_TURNS" \
    >"$dir.log" 2>&1 || true
  echo "$dir: $(tail -1 "$dir.log")"
}

dirs=()
for n in $(seq "$RUNS"); do
  for task in $TASKS; do
    # the two arms of a task side by side: more at once can bring a laptop's Docker VM down
    trial "$task" full "$n" &
    trial "$task" bare "$n" &
    wait
    dirs+=(".evals/$task-full-$n" ".evals/$task-bare-$n")
  done
done
node packages/cli/evals/grade.ts "${dirs[@]}"
node packages/cli/evals/report.ts "${dirs[@]}"
