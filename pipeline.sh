#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="$(pwd)/pipeline.log"

{
  echo "=============================="
  date -Is
  echo "Pipeline start"

  git pull origin main

  if [ -f package-lock.json ]; then
    npm ci
  fi

  if npm run | grep -q " test"; then
    npm test
  fi

  docker build -t demo-app:latest .

  echo "Pipeline finished successfully"
} >> "$LOG_FILE" 2>&1
