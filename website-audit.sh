#!/usr/bin/env bash
#
# website-audit.sh — run the site technical audit.
#
#   ./website-audit.sh                          # audits the default domain
#   ./website-audit.sh https://www.nritousa.com # audit a specific URL
#   ./website-audit.sh example.com              # bare host is fine too
#
# Thin wrapper around audit.js (zero-dependency Node crawler): seeds from
# sitemap.xml, checks every internal page + every unique link/image, validates
# fragment anchors, extracts per-page SEO, and checks MX records. Writes a
# Markdown report and exits non-zero if hard errors are found.

set -euo pipefail

DEFAULT_URL="https://www.nritousa.com"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Resolve target: first arg, else default. Add https:// if the user passed a
# bare host.
TARGET="${1:-$DEFAULT_URL}"
case "$TARGET" in
  http://*|https://*) ;;
  *) TARGET="https://$TARGET" ;;
esac

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is not installed or not on PATH (need Node 18+ for built-in fetch)." >&2
  exit 127
fi

if [ ! -f "$SCRIPT_DIR/audit.js" ]; then
  echo "Error: audit.js not found next to website-audit.sh ($SCRIPT_DIR)." >&2
  exit 1
fi

exec node "$SCRIPT_DIR/audit.js" "$TARGET"
