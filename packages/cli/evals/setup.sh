#!/usr/bin/env bash
# Sets up the evals from a checkout: builds the packages and packs this branch's into packages/cli/evals/packs, which
# the trials install from until they're released, then builds the trial image. Needs Node, npm and Docker.
#   --no-build     skip `npm run build`
#   --published    the released packages from npm: no packs, only the image
set -euo pipefail
cd "$(dirname "$0")/../../.."
EVALS=packages/cli/evals
PACKAGES="styles utils shared core viz widgets uno-preset config tools cli app-shell-services app-shell-shared
  app-shell-events app-shell-i18next app-shell-navigation app-shell-ui app-shell-vite-plugin"

rm -rf "$EVALS/packs"
if [ "${1:-}" != --published ]; then
  [ "${1:-}" = --no-build ] || npm run build
  mkdir -p "$EVALS/packs"
  for p in $PACKAGES; do npm pack -q -w "packages/$p" --pack-destination "$EVALS/packs" >/dev/null; done
fi

docker build -q -f "$EVALS/Dockerfile" -t uikit-evals packages/cli >/dev/null
# oxlint's JS plugins abort unless the Docker VM allows overcommit (Colima resets it on restart)
if [ "$(docker run --rm --entrypoint cat uikit-evals /proc/sys/vm/overcommit_memory)" != 1 ]; then
  echo "warning: set vm.overcommit_memory=1 in the Docker VM (Colima: colima ssh -- sudo sysctl -w vm.overcommit_memory=1)"
fi
echo "Ready: image uikit-evals ($([ -d "$EVALS/packs" ] && echo "this branch's packages" || echo "released packages")). Next: $EVALS/batch.sh"
