#!/bin/bash

echo "========================================"
echo "Pushing Angular Single-SPA to GitHub"
echo "========================================"
echo

echo "Current branch:"
git branch --show-current
echo

echo "Commits to push:"
git log --oneline origin/main..HEAD
echo

echo "========================================"
echo "Pushing to GitHub..."
echo "========================================"

if git push origin main; then
    echo
    echo "========================================"
    echo "Push complete!"
    echo "========================================"
else
    echo
    echo "========================================"
    echo "Push failed. Please authenticate:"
    echo "========================================"
    echo "Option 1: Use GitHub CLI"
    echo "  gh auth login"
    echo "  git push origin main"
    echo
    echo "Option 2: Use Personal Access Token"
    echo "  1. Go to GitHub.com → Settings → Developer settings → Personal access tokens"
    echo "  2. Create a token with 'repo' permissions"
    echo "  3. Use the token as password when prompted"
    echo
    echo "Option 3: Use SSH"
    echo "  git remote set-url origin git@github.com:amoolagundla/angular-single-spa.git"
    echo "  git push origin main"
    echo "========================================"
fi