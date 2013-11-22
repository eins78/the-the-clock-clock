#!/bin/sh
set -e

DIR="gh-pages"

# abort if eists already
if [ -d "$DIR" ]; then
  exit 0
fi

git clone $(git config --get remote.origin.url) "$DIR"
cd "$DIR"
git checkout -b gh-pages --track origin/gh-pages