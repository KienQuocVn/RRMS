#!/bin/bash
# /var/www/rrms/rollback.sh
set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <release_folder_name>"
  echo "Available releases in /var/www/rrms/releases/:"
  ls -1 /var/www/rrms/releases/
  exit 1
fi

RELEASE_NAME=$1
RELEASE_DIR="/var/www/rrms/releases/$RELEASE_NAME"

if [ ! -d "$RELEASE_DIR" ]; then
  echo "Error: Release directory $RELEASE_DIR does not exist."
  exit 1
fi

echo "Rolling back to release: $RELEASE_NAME"

# Restore jar
if [ -f "$RELEASE_DIR/rrms-0.0.1-SNAPSHOT.jar" ]; then
  cp "$RELEASE_DIR/rrms-0.0.1-SNAPSHOT.jar" /var/www/rrms/server/target/rrms-0.0.1-SNAPSHOT.jar
  echo "Restored backend jar."
else
  echo "Warning: No jar found in $RELEASE_DIR."
fi

# Restore dist
if [ -d "$RELEASE_DIR/dist" ]; then
  rm -rf /var/www/rrms/client/dist
  cp -r "$RELEASE_DIR/dist" /var/www/rrms/client/dist
  echo "Restored frontend dist."
else
  echo "Warning: No dist folder found in $RELEASE_DIR."
fi

# Restart backend
echo "Restarting rrms-backend..."
sudo systemctl restart rrms-backend

# Check health
echo "Checking backend health..."
for i in $(seq 1 12); do
  sleep 5
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 http://127.0.0.1:7000/actuator/health 2>/dev/null || echo "000")
  # Accept 200 as healthy
  if [ "$HTTP_CODE" = "200" ]; then
    echo "Backend is UP and HEALTHY (HTTP $HTTP_CODE) after $((i*5))s"
    exit 0
  fi
  echo "Attempt $i/12: backend not healthy yet (HTTP $HTTP_CODE)..."
done

echo "ERROR: Backend did not become healthy within 60 seconds after rollback."
sudo systemctl status rrms-backend --no-pager || true
exit 1
