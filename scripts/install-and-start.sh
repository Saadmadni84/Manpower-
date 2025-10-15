#!/bin/bash

echo "🚀 Complete Setup - Manpower Company Backend"
echo "============================================="

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Navigate to backend
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
fi

# Kill any existing processes on ports 5000 and 5001
echo "🔧 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Start the server
echo "🌟 Starting backend server..."
echo "   Server will run on: http://localhost:5001"
echo "   API endpoints: http://localhost:5001/api"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
