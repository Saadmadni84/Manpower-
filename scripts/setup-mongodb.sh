#!/bin/bash

echo "🍃 Setting up MongoDB for Manpower Company Backend..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "📦 Installing MongoDB Community Edition..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Add MongoDB tap and install
    brew tap mongodb/brew
    brew install mongodb-community
    
    echo "✅ MongoDB installed successfully!"
else
    echo "✅ MongoDB is already installed"
fi

# Start MongoDB service
echo "🚀 Starting MongoDB service..."
brew services start mongodb/brew/mongodb-community

# Wait a moment for MongoDB to start
sleep 3

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running on port 27017"
    echo "🎉 Setup complete! You can now run the backend server."
else
    echo "❌ MongoDB failed to start. Please check the logs:"
    echo "   brew services logs mongodb/brew/mongodb-community"
fi
