#!/bin/bash

echo "🚀 Starting Manpower Company Backend Server"
echo "============================================"

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

# Function to kill process on port
kill_port() {
    local port=$1
    echo "🔍 Checking for processes on port $port..."
    
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  Port $port is in use. Killing existing process..."
        lsof -ti:$port | xargs kill -9
        sleep 2
    else
        echo "✅ Port $port is available"
    fi
}

# Check and kill processes on common ports
kill_port 5000
kill_port 5001

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 5001..."
echo "   API will be available at: http://localhost:5001/api"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
