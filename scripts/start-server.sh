#!/bin/bash

echo "🚀 Starting Manpower Company Backend Server..."

# Navigate to backend directory
cd "$(dirname "$0")/../backend"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 5000..."
npm run dev
