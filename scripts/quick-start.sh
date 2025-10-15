#!/bin/bash

echo "🚀 Quick Start - Manpower Company Backend"
echo "=========================================="

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🍃 MongoDB not running. Setting up..."
    
    # Check if MongoDB is installed
    if ! command -v mongod &> /dev/null; then
        echo "📦 Installing MongoDB..."
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
            brew services start mongodb/brew/mongodb-community
        else
            echo "❌ Homebrew not found. Please install MongoDB manually or use MongoDB Atlas"
            echo "   Visit: https://www.mongodb.com/try/download/community"
            exit 1
        fi
    else
        echo "🚀 Starting MongoDB..."
        if command -v brew &> /dev/null; then
            brew services start mongodb/brew/mongodb-community
        else
            mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
        fi
    fi
    
    # Wait for MongoDB to start
    echo "⏳ Waiting for MongoDB to start..."
    sleep 5
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Navigate to backend
cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting backend server on port 5001..."
echo "   API will be available at: http://localhost:5001/api"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
