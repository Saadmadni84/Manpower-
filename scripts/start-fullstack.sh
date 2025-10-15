#!/bin/bash

echo "🚀 Starting Full Stack Manpower Company Application"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -n "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e " ${GREEN}✅ Ready${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}❌ Timeout${NC}"
    return 1
}

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
if check_port 3000; then
    echo "Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

if check_port 5001; then
    echo "Killing process on port 5001..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    echo -e "${GREEN}✅ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB is not running. Starting MongoDB...${NC}"
    if command -v brew &> /dev/null && brew services list | grep -q "mongodb-community"; then
        brew services start mongodb/brew/mongodb-community
        sleep 3
        if pgrep -x "mongod" > /dev/null; then
            echo -e "${GREEN}✅ MongoDB started successfully${NC}"
        else
            echo -e "${RED}❌ Failed to start MongoDB${NC}"
            echo "Please start MongoDB manually or use MongoDB Atlas"
        fi
    else
        echo -e "${RED}❌ MongoDB not found. Please install MongoDB or use MongoDB Atlas${NC}"
    fi
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."

# Backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
wait_for_service "http://localhost:5001/api/health" "Backend API"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend failed to start. Check logs/backend.log for details${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend server
echo "🎨 Starting frontend server..."
cd frontend
npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to be ready
wait_for_service "http://localhost:3000" "Frontend App"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend failed to start. Check logs/frontend.log for details${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs for cleanup
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo -e "${GREEN}🎉 Full Stack Application Started Successfully!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5001/api"
echo -e "${BLUE}📊 API Health:${NC} http://localhost:5001/api/health"
echo -e "${BLUE}🔑 Admin Login:${NC} admin@manpowercompany.com / admin123"
echo ""
echo -e "${YELLOW}📋 Useful Commands:${NC}"
echo "  View backend logs: tail -f logs/backend.log"
echo "  View frontend logs: tail -f logs/frontend.log"
echo "  Stop servers: ./scripts/stop-fullstack.sh"
echo "  Restart: ./scripts/restart-fullstack.sh"
echo ""
echo -e "${GREEN}✨ Application is ready to use!${NC}"

# Keep the script running and show logs
echo ""
echo "📝 Live Backend Logs (Press Ctrl+C to stop all servers):"
echo "========================================================"
tail -f logs/backend.log &
TAIL_PID=$!

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    kill $TAIL_PID 2>/dev/null || true
    rm -f logs/backend.pid logs/frontend.pid
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
