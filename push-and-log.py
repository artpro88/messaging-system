#!/usr/bin/env python3

import subprocess
import sys
from pathlib import Path

# Change to script directory
script_dir = Path(__file__).parent
import os
os.chdir(script_dir)

# Open log file for writing
log_file = script_dir / "push.log"

try:
    with open(log_file, 'w') as log:
        log.write("=== Git Push Log ===\n\n")
        
        # Get current status
        log.write("--- Git Status ---\n")
        result = subprocess.run(['git', 'status', '--short'], 
                              capture_output=True, text=True)
        log.write(f"Return code: {result.returncode}\n")
        log.write(f"STDOUT:\n{result.stdout}\n")
        if result.stderr:
            log.write(f"STDERR:\n{result.stderr}\n")
        log.write("\n")
        
        # Get current HEAD
        log.write("--- Current HEAD ---\n")
        result = subprocess.run(['git', 'log', '-1', '--oneline'], 
                              capture_output=True, text=True)
        log.write(f"Return code: {result.returncode}\n")
        log.write(f"STDOUT:\n{result.stdout}\n")
        if result.stderr:
            log.write(f"STDERR:\n{result.stderr}\n")
        log.write("\n")
        
        # Get remote
        log.write("--- Git Remote ---\n")
        result = subprocess.run(['git', 'remote', '-v'], 
                              capture_output=True, text=True)
        log.write(f"Return code: {result.returncode}\n")
        log.write(f"STDOUT:\n{result.stdout}\n")
        if result.stderr:
            log.write(f"STDERR:\n{result.stderr}\n")
        log.write("\n")
        
        # Push to GitHub
        log.write("--- Pushing to GitHub ---\n")
        result = subprocess.run(['git', 'push', '-u', 'origin', 'main'], 
                              capture_output=True, text=True, timeout=30)
        log.write(f"Return code: {result.returncode}\n")
        log.write(f"STDOUT:\n{result.stdout}\n")
        if result.stderr:
            log.write(f"STDERR:\n{result.stderr}\n")
        log.write("\n")
        
        if result.returncode == 0:
            log.write("✅ Push successful!\n")
        else:
            log.write(f"❌ Push failed with code {result.returncode}\n")
            
        log.flush()

except Exception as e:
    with open(log_file, 'a') as log:
        log.write(f"\n❌ Error: {e}\n")

print(f"Log written to: {log_file}")

