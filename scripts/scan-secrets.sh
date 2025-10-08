#!/usr/bin/env bash
# Simple, portable secret scan for CHT Studio
# - Scans working tree (default) and optionally full git history
# - Exits non‑zero if potential secrets are found (good for CI)
# - Writes a timestamped report to ./secrets-report-<ts>.txt

set -Eeuo pipefail

usage() {
  cat <<'USAGE'
Usage: scripts/scan-secrets.sh [--history] [--strict=false]

Options:
  --history        Also scan full git history (slower)
  --strict=false   Exit 0 even if findings are present

Examples:
  scripts/scan-secrets.sh
  scripts/scan-secrets.sh --history
USAGE
}

# --- args ---
HISTORY=false
STRICT=true
for arg in "$@"; do
  case "$arg" in
    --history) HISTORY=true ;;
    --strict=false) STRICT=false ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $arg" >&2; usage; exit 2 ;;
  esac
done

TS=$(date +%Y%m%d-%H%M%S)
REPORT="secrets-report-$TS.txt"

# Common directories/files to ignore (build artifacts, deps, caches, vendor bundles)
EXCLUDES=(
  .git
  node_modules
  dist
  build
  coverage
  .next
  .turbo
  .cache
  .parcel-cache
  target
  '**/*.min.js'
  '**/*.map'
  '**/*.lock'
  '**/vendor/**'
  '**/bundles/**'
)

# ripgrep exclude args
RG_EXCLUDE=( -g '!.git' )
for p in "${EXCLUDES[@]}"; do RG_EXCLUDE+=( -g "!$p" ); done

# Patterns for common secrets (kept simple; each is its own -e)
PATTERNS=(
  'AKIA[0-9A-Z]{16}'                                 # AWS Access Key
  '(A3T[A-Z0-9]|ASIA|AGPA|AIDA|AROA|AIPA|ANPA)[A-Z0-9]{16}'
  'SECRET(_KEY)?\s*[:=]\s*[^[:space:]]+'
  'API[_-]?KEY\s*[:=]\s*[^[:space:]]+'
  'BEARER\s+[A-Za-z0-9\-_.=:+/]{20,}'
  'gh[pousr]_[A-Za-z0-9]{36,}'                        # GitHub tokens
  'sk_(live|test)_[A-Za-z0-9]{16,}'                   # Stripe
  'xox[baprs]-[A-Za-z0-9-]{10,}'                      # Slack
  '-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----'
  'AIza[0-9A-Za-z_-]{35}'                             # Google API key
)

build_rg_args() {
  local out=( -n --hidden -i )
  for ex in "${RG_EXCLUDE[@]}"; do out+=( "$ex" ); done
  for pat in "${PATTERNS[@]}"; do out+=( -e "$pat" ); done
  printf '%q ' "${out[@]}"
}

# --- Working tree scan ---
echo "# Secret scan (working tree) — $TS" | tee "$REPORT"

if command -v rg >/dev/null 2>&1; then
  echo $'\n[Working tree: content scan]\n' | tee -a "$REPORT"
  # shellcheck disable=SC2046
  eval rg $(build_rg_args) . | tee -a "$REPORT" || true
else
  echo "ripgrep (rg) not found. Please install rg for faster scans." | tee -a "$REPORT"
  echo "Falling back to grep (may be noisy)" | tee -a "$REPORT"
  GREP_ARGS=( -RIn )
  for pat in "${PATTERNS[@]}"; do GREP_ARGS+=( -e "$pat" ); done
  grep --exclude-dir={.git,node_modules,dist,build,coverage,target,.turbo,.cache} "${GREP_ARGS[@]}" . | tee -a "$REPORT" || true
fi

# Suspicious filenames
echo $'\n[Working tree: suspicious filenames]\n' | tee -a "$REPORT"
if command -v rg >/dev/null 2>&1; then
  rg --files --hidden "${RG_EXCLUDE[@]}" | rg -n -i \
    '(^|/)\.env(\..*)?$|(^|/)id_rsa(\.pub)?$|\.pem$|\.p12$|\.jks$|\.keystore$|service[-_ ]?account.*\.json$|credentials\.json$' \
    | tee -a "$REPORT" || true
else
  find . -type f \
    \( -name '*.env*' -o -name 'id_rsa' -o -name '*.pem' -o -name '*.p12' -o -name '*.jks' -o -name '*.keystore' -o -name '*service*account*.json' -o -name 'credentials.json' \) \
    | grep -vE '/\.git/|/node_modules/|/dist/|/build/|/coverage/|/target/' | tee -a "$REPORT" || true
fi

# --- Git history scan (optional) ---
if [ "$HISTORY" = true ]; then
  echo $'\n[Git history: content scan]\n' | tee -a "$REPORT"
  git rev-list --all | xargs -I{} git grep -nI -E "$(IFS='|'; echo "${PATTERNS[*]}")" {} | tee -a "$REPORT" || true
fi

# --- Summary / exit code ---
# If any non-header line appears in the report, consider it a finding (rough heuristic)
if grep -q -E '^[^#\[]' "$REPORT"; then
  echo -e "\nPotential secrets detected. Review the report above." >&2
  [ "$STRICT" = true ] && exit 1
fi

echo -e "\nReport written to: $REPORT"
echo "Scan completed."
