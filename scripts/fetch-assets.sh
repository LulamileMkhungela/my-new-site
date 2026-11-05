#!/usr/bin/env bash
# Pulls the project images from the original site into assets/img/projects/.
#
# The pages look for every image locally first and fall back to the live URL, so
# the site works before this runs. Running it makes the images local, fast and
# versioned — which is what a static deploy should serve.
#
#   scripts/fetch-assets.sh            # fetch everything that is missing
#   scripts/fetch-assets.sh --force    # re-fetch even if the file exists
#
set -uo pipefail

REMOTE="https://shubhamranjan-portfolio.vercel.app/projects"
DEST="$(cd "$(dirname "$0")/.." && pwd)/assets/img/projects"
FORCE="${1:-}"

mkdir -p "$DEST"

# Every image the site references, taken from the generated project data.
FILES=$(
  node -e '
    const fs = require("fs");
    global.window = {};
    eval(fs.readFileSync(process.argv[1], "utf8"));
    const names = new Set();
    const walk = (value) => {
      if (!value) return;
      if (typeof value === "string") {
        if (/\.(webp|png|jpe?g|svg)$/i.test(value)) names.add(value);
        return;
      }
      if (typeof value === "object") Object.values(value).forEach(walk);
    };
    walk(window.PROJECTS);
    console.log([...names].join("\n"));
  ' "$(dirname "$0")/../assets/js/projects.data.js"
)

# Plus the logos and the portrait used by the shell and the home page.
EXTRA=(
  Gojo-logo.svg savein-logo.svg scanbo-logo.svg maxima-logo.svg Sejaya-logo.svg asette-logo.svg
  swapabee-logo.svg rational-logo.svg ivypro-logo.svg havenise-logo.svg elvd-logo.svg tachus-logo.svg
  culinacraftique-logo.svg
)

ALL=$(printf '%s\n' "${FILES[@]}" "${EXTRA[@]}" | sort -u)
ok=0; skip=0; fail=0

while IFS= read -r name; do
  [ -z "$name" ] && continue
  out="$DEST/$name"
  if [ -f "$out" ] && [ "$FORCE" != "--force" ]; then
    skip=$((skip + 1)); continue
  fi
  if curl -fsSL --retry 2 --max-time 45 "$REMOTE/$name" -o "$out.part"; then
    mv "$out.part" "$out"; ok=$((ok + 1))
  else
    rm -f "$out.part"; fail=$((fail + 1)); echo "  missing upstream: $name"
  fi
done <<< "$ALL"

echo "fetched $ok · already present $skip · unavailable $fail"
echo "images in $DEST"
