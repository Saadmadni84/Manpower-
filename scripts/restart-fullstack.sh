#!/bin/bash

echo "🔄 Restarting Full Stack Manpower Company Application"
echo "====================================================="

# Stop all servers first
./scripts/stop-fullstack.sh

echo ""
echo "⏳ Waiting 3 seconds before restarting..."
sleep 3

# Start all servers
./scripts/start-fullstack.sh
