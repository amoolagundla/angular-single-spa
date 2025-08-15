@echo off
echo ========================================
echo Pushing Angular Single-SPA to GitHub
echo ========================================
echo.

echo Current branch:
git branch --show-current
echo.

echo Commits to push:
git log --oneline origin/main..HEAD
echo.

echo ========================================
echo Pushing to GitHub...
echo ========================================
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Push failed. Trying with authentication...
    echo ========================================
    echo Please enter your GitHub username and personal access token
    echo To create a token: GitHub.com → Settings → Developer settings → Personal access tokens
    echo.
    git push origin main
)

echo.
echo ========================================
echo Push complete!
echo ========================================
pause