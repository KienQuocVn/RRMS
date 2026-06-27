#!/usr/bin/env bash
# Chuẩn bị file phụ thuộc trước khi chạy Docker Compose (Linux/macOS)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIB_DIR="$ROOT/server/logstash/lib"
JAR_NAME="mysql-connector-j-8.3.0.jar"
TARGET="$LIB_DIR/$JAR_NAME"
MAVEN_JAR="$ROOT/server/.m2/repository/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar"
URI="https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.3.0/mysql-connector-j-8.3.0.jar"

mkdir -p "$LIB_DIR"

if [ -f "$TARGET" ]; then
  echo "OK: $JAR_NAME da ton tai."
  exit 0
fi

if [ -f "$MAVEN_JAR" ]; then
  cp "$MAVEN_JAR" "$TARGET"
  echo "OK: Da copy tu Maven cache."
  exit 0
fi

echo "Dang tai MySQL Connector/J..."
curl -fsSL "$URI" -o "$TARGET"
echo "OK: Da tai $JAR_NAME"
