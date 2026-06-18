#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"

if [[ ! -d "$ANDROID_HOME" ]]; then
  echo "Android SDK not found at: $ANDROID_HOME"
  echo "Install Android Studio, then set ANDROID_HOME or use the default Mac path."
  exit 1
fi

mkdir -p dist

eas build --profile preview --platform android --local --output ./dist/ghoomai-preview.apk "$@"
