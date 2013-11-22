#!/bin/sh
set -e

HASH="$(git log -1 --pretty=format:"%H")"

cd gh-pages
cp ../web/* .
git add .
git commit -m "output for $HASH"
git push
cd ..
