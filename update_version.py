#!/usr/bin/env python3
"""
Helper script to update VERSION.js with new deployment entry
"""
import sys
import re
from datetime import datetime

def update_version_js(version, description, machine, timestamp):
    """Update VERSION.js with new version entry"""
    
    with open('VERSION.js', 'r') as f:
        content = f.read()
    
    # Build the new entry (no leading },)
    new_entry = f""",
  {{
    version: {version},
    date: '{timestamp}',
    machine: '{machine}',
    changes: '{description}'
  }}"""
    
    # Find the last closing brace before the marker
    marker = "  // Add new entries above this line"
    marker_pos = content.find(marker)
    
    if marker_pos == -1:
        print("ERROR: Could not find marker comment in VERSION.js")
        sys.exit(1)
    
    # Insert before the marker
    content = content[:marker_pos] + new_entry + "\n  " + content[marker_pos:]
    
    with open('VERSION.js', 'w') as f:
        f.write(content)
    
    print(f"✓ VERSION.js updated with v{version}")

if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage: update_version.py <version> <description> <machine> <timestamp>")
        sys.exit(1)
    
    version = sys.argv[1]
    description = sys.argv[2]
    machine = sys.argv[3]
    timestamp = sys.argv[4]
    
    update_version_js(version, description, machine, timestamp)
