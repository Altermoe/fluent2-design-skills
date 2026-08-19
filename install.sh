#!/usr/bin/env bash
# Install Fluent 2 design skills into a DSH or Anthropic .agents skills directory.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/skills"

usage() {
  echo "Usage: $0 {--dsh | --agents} [--user]"
  echo "  --dsh      install into .dsh/skills (project-local, default) or --user -> ~/.dsh/skills"
  echo "  --agents   install into ~/.agents/skills"
}

TARGET=""
MODE=""
for a in "$@"; do
  case "$a" in
    --dsh) MODE=dsh ;;
    --agents) MODE=agents ;;
    --user) USER_MODE=1 ;;
    *) usage; exit 1 ;;
  esac
done

if [[ "$MODE" == "dsh" ]]; then
  if [[ "${USER_MODE:-}" == "1" ]]; then
    TARGET="$HOME/.dsh/skills"
  else
    TARGET="$(pwd)/.dsh/skills"
  fi
elif [[ "$MODE" == "agents" ]]; then
  TARGET="$HOME/.agents/skills"
else
  usage; exit 1
fi

mkdir -p "$TARGET"
echo "Installing skills -> $TARGET"
for dir in "$SRC"/*/; do
  name="$(basename "$dir")"
  ln -sfn "$dir" "$TARGET/$name"
  echo "  linked $name"
done
echo "Done. DSH will discover these from '$TARGET'."