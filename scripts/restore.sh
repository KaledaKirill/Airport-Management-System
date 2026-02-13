#!/bin/bash

# Restore script for Airport Management System database

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    echo "Example: ./restore.sh backups/airport_backup_2024-02-12_15-30-00.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Get DATABASE_URL from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Error: .env file not found"
    exit 1
fi

# Parse DATABASE_URL
DB_URL="$DATABASE_URL"

# Extract connection details
USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
PASSWORD=$(echo $DB_URL | sed -n 's/.*:[^:]*:\([^@]*\)@.*/\1/p')
HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Set defaults if parsing failed
if [ -z "$HOST" ]; then HOST="localhost"; fi
if [ -z "$PORT" ]; then PORT="5432"; fi
if [ -z "$DB_NAME" ]; then DB_NAME="airport_db"; fi

echo "📥 Restoring database..."
echo "   Host: $HOST:$PORT"
echo "   Database: $DB_NAME"
echo "   From: $BACKUP_FILE"

# Set password for psql
export PGPASSWORD=$PASSWORD

# Decompress if needed
SQL_FILE="$BACKUP_FILE"
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📦 Decompressing backup file..."
    gunzip -k "$BACKUP_FILE"
    SQL_FILE="${BACKUP_FILE%.gz}"
fi

# Restore database
psql -U $USER -h $HOST -p $PORT -d $DB_NAME -f "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully"
else
    echo "❌ Restore failed"
    exit 1
fi

# Clean up decompressed file if it was compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    rm "$SQL_FILE"
fi

unset PGPASSWORD
