#!/bin/bash

# EventsWebPage Deployment Script
# Usage: ./deploy.sh <version_number> "Description of changes"

if [ $# -lt 2 ]; then
    echo "Usage: ./deploy.sh <version_number> \"Description of changes\""
    echo "Example: ./deploy.sh 23 \"Fixed bug in event registration\""
    exit 1
fi

VERSION=$1
DESCRIPTION=$2
MACHINE=$(hostname)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

echo "==================================="
echo "EventsWebPage Deployment"
echo "==================================="
echo "Version:     $VERSION"
echo "Machine:     $MACHINE"
echo "Time:        $TIMESTAMP"
echo "Changes:     $DESCRIPTION"
echo "==================================="
echo ""

# Update VERSION.js using Python script
echo "Updating VERSION.js..."
python3 update_version.py "$VERSION" "$DESCRIPTION" "$MACHINE" "$TIMESTAMP"

if [ $? -eq 0 ]; then
    echo "✓ VERSION.js updated with v$VERSION"
    echo ""
    echo "Done! Next steps:"
    echo "1. Review VERSION.js changes"
    echo "2. Run: clasp push"
    echo "3. Deploy v$VERSION in Google Apps Script IDE"
    echo "4. Verify deployed version matches v$VERSION"
    echo "5. Run: git add -A && git commit -m 'v$VERSION: $DESCRIPTION (deployed from $MACHINE)'"
    echo "6. Run: git tag v$VERSION && git push origin main --tags"
else
    echo "✗ Error updating VERSION.js"
    exit 1
fi
