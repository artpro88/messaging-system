#!/usr/bin/env python3

import subprocess
import sys
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

print("📤 Pushing changes to GitHub...")
print()

try:
    # Check git status
    status_result = subprocess.run(['git', 'status', '--porcelain'], 
                                 capture_output=True, text=True, check=True)
    if status_result.stdout.strip():
        print("⚠️  Uncommitted changes detected:")
        print(status_result.stdout)
        print()
        
        # Stage and commit
        print("Staging all files...")
        subprocess.run(['git', 'add', '-A'], check=True)
        
        print("Creating commit...")
        subprocess.run(['git', 'commit', '-m', '''Fix: Live chat widget local development fixes

- Widget API URL detection for localhost vs production
- req.io middleware moved before routes for WebSocket access
- Database configuration and initialization
- Test page for widget verification
- Message persistence and retrieval working
- WebSocket broadcasting functional'''], check=True)
        print()
    
    # Push to GitHub
    print("🚀 Pushing to GitHub...")
    push_result = subprocess.run(['git', 'push', 'origin', 'main'], 
                                capture_output=True, text=True)
    
    if push_result.returncode == 0:
        print("✅ Push successful!")
        print(push_result.stdout)
    else:
        print("❌ Push failed!")
        print("STDOUT:", push_result.stdout)
        print("STDERR:", push_result.stderr)
        sys.exit(1)
    
    # Show latest commits
    print()
    print("📊 Latest commits:")
    log_result = subprocess.run(['git', 'log', '--oneline', '-3'], 
                               capture_output=True, text=True, check=True)
    print(log_result.stdout)
    
except subprocess.CalledProcessError as e:
    print(f"❌ Error: {e}")
    sys.exit(1)

