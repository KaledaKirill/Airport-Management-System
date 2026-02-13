#!/bin/bash

# Backup script for Airport Management System database

# Get DATABASE_URL from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Error: .env file not found"
    exit 1
fi

# Parse DATABASE_URL
# Format: postgresql://user:password@host:port/database
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

# Create backups directory if it doesn't exist
mkdir -p ./backups

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="./backups/airport_backup_${TIMESTAMP}.sql"

echo "📦 Creating backup..."
echo "   Host: $HOST:$PORT"
echo "   Database: $DB_NAME"
echo "   File: $BACKUP_FILE"

# Set password for pg_dump
export PGPASSWORD=$PASSWORD

# Create backup
pg_dump -U $USER -h $HOST -p $PORT -d $DB_NAME -F p -f $BACKUP_FILE

if [ $? -eq 0 ]; then
    # Compress backup
    gzip $BACKUP_FILE
    echo "✅ Backup created successfully: ${BACKUP_FILE}.gz"
else
    echo "❌ Backup failed"
    exit 1
fi

unset PGPASSWORD
