#!/bin/bash

echo "📤 Pushing changes to GitHub..."
echo ""

cd "$(dirname "$0")"

# Check git status
echo "📋 Git Status:"
git status --short
echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Uncommitted changes detected. Staging all files..."
    git add -A
    git commit -m "Fix: Live chat widget local development fixes

- Widget API URL detection for localhost vs production
- req.io middleware moved before routes for WebSocket access
- Database configuration and initialization
- Test page for widget verification
- Message persistence and retrieval working
- WebSocket broadcasting functional"
    echo ""
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Push complete!"
echo ""

# Show latest commits
echo "📊 Latest commits:"
git log --oneline -3

