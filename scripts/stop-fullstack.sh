#!/bin/bash

echo "🛑 Stopping Full Stack Manpower Company Application"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill process by PID file
kill_by_pid_file() {
    local pid_file=$1
    local service_name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $service_name (PID: $pid)..."
            kill $pid 2>/dev/null || true
            sleep 2
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "Force killing $service_name..."
                kill -9 $pid 2>/dev/null || true
            fi
            
            echo -e "${GREEN}✅ $service_name stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  $service_name was not running${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  No PID file found for $service_name${NC}"
    fi
}

# Kill processes by PID files
kill_by_pid_file "logs/backend.pid" "Backend Server"
kill_by_pid_file "logs/frontend.pid" "Frontend Server"

# Kill any remaining processes on our ports
echo "🧹 Cleaning up remaining processes..."

# Kill processes on port 3000 (frontend)
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "Killing processes on port 3000 (frontend)..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
fi

# Kill processes on port 5001 (backend)
if lsof -ti:5001 > /dev/null 2>&1; then
    echo "Killing processes on port 5001 (backend)..."
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
fi

# Kill any tail processes
pkill -f "tail -f logs" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ All servers stopped successfully${NC}"
echo ""
echo "📋 Cleanup completed:"
echo "  - Backend server (port 5001)"
echo "  - Frontend server (port 3000)"
echo "  - Log monitoring processes"
echo "  - PID files removed"
