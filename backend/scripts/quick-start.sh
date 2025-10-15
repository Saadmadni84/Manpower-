#!/bin/bash

# Quick Start Script for Manpower Company Backend
# This script automates the initial setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Helper functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check Node.js
    if ! command_exists node; then
        error "Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        error "npm is not installed. Please install npm."
        exit 1
    fi
    
    log "✅ Node.js $(node --version) and npm $(npm --version) are installed"
}

# Check MongoDB
check_mongodb() {
    log "Checking MongoDB installation..."
    
    if command_exists mongod; then
        log "✅ MongoDB is installed"
        
        # Check if MongoDB is running
        if pgrep -x "mongod" > /dev/null; then
            log "✅ MongoDB is running"
        else
            warn "MongoDB is installed but not running. Starting MongoDB..."
            
            # Try to start MongoDB (different commands for different systems)
            if command_exists brew; then
                # macOS with Homebrew
                brew services start mongodb/brew/mongodb-community 2>/dev/null || true
            elif command_exists systemctl; then
                # Linux with systemd
                sudo systemctl start mongod 2>/dev/null || true
            elif command_exists service; then
                # Linux with service
                sudo service mongod start 2>/dev/null || true
            fi
            
            # Wait a moment for MongoDB to start
            sleep 3
            
            if pgrep -x "mongod" > /dev/null; then
                log "✅ MongoDB started successfully"
            else
                warn "Could not start MongoDB automatically. Please start it manually."
            fi
        fi
    else
        warn "MongoDB is not installed locally."
        info "You can:"
        info "1. Install MongoDB locally (see MONGODB_SETUP.md)"
        info "2. Use MongoDB Atlas (cloud database)"
        info "3. Continue with the setup (MongoDB Atlas recommended)"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing project dependencies..."
    
    if [ ! -f "package.json" ]; then
        error "package.json not found. Make sure you're in the backend directory."
        exit 1
    fi
    
    npm install
    log "✅ Dependencies installed successfully"
}

# Setup environment
setup_environment() {
    log "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            log "Creating .env file from env.example..."
            cp env.example .env
            log "✅ .env file created"
            warn "Please edit .env file with your configuration or run: node scripts/setup-environment.js"
        else
            warn "No env.example file found. Creating basic .env file..."
            cat > .env << EOF
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/manpower_db
JWT_SECRET=your-jwt-secret-key-change-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@manpowercompany.com
ADMIN_PASSWORD=admin123
EOF
            log "✅ Basic .env file created"
            warn "Please edit .env file with your configuration"
        fi
    else
        log "✅ .env file already exists"
    fi
}

# Seed database
seed_database() {
    log "Seeding database with initial data..."
    
    # Check if .env file exists and has database URI
    if [ ! -f ".env" ]; then
        error ".env file not found. Please run setup first."
        exit 1
    fi
    
    # Source the .env file to get MONGODB_URI
    export $(grep -v '^#' .env | xargs)
    
    if [ -z "$MONGODB_URI" ]; then
        error "MONGODB_URI not found in .env file"
        exit 1
    fi
    
    # Run the seed script
    npm run seed
    log "✅ Database seeded successfully"
}

# Test database connection
test_connection() {
    log "Testing database connection..."
    
    # Wait a moment for the server to be ready
    sleep 2
    
    # Test health endpoint
    if curl -s http://localhost:5000/health > /dev/null; then
        log "✅ Server is running and database connection is working"
        
        # Show health status
        info "Health check response:"
        curl -s http://localhost:5000/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:5000/health
    else
        warn "Could not connect to server. Make sure the server is running on port 5000"
    fi
}

# Start server in background
start_server() {
    log "Starting the server..."
    
    # Kill any existing server process
    pkill -f "node.*server.js" 2>/dev/null || true
    
    # Start server in background
    nohup npm start > server.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    if kill -0 $SERVER_PID 2>/dev/null; then
        log "✅ Server started successfully (PID: $SERVER_PID)"
        log "Server logs: tail -f server.log"
    else
        error "Failed to start server. Check server.log for details."
        exit 1
    fi
}

# Main setup function
main() {
    echo -e "${CYAN}"
    echo "🚀 Manpower Company Backend - Quick Start"
    echo "========================================="
    echo -e "${NC}"
    
    # Parse command line arguments
    SKIP_MONGODB_CHECK=false
    SKIP_ENV_SETUP=false
    SKIP_SEED=false
    START_SERVER=true
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-mongodb)
                SKIP_MONGODB_CHECK=true
                shift
                ;;
            --skip-env)
                SKIP_ENV_SETUP=true
                shift
                ;;
            --skip-seed)
                SKIP_SEED=true
                shift
                ;;
            --no-start)
                START_SERVER=false
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-mongodb    Skip MongoDB installation check"
                echo "  --skip-env        Skip environment setup"
                echo "  --skip-seed       Skip database seeding"
                echo "  --no-start        Don't start the server"
                echo "  --help            Show this help message"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run setup steps
    check_requirements
    
    if [ "$SKIP_MONGODB_CHECK" = false ]; then
        check_mongodb
    fi
    
    install_dependencies
    
    if [ "$SKIP_ENV_SETUP" = false ]; then
        setup_environment
    fi
    
    if [ "$SKIP_SEED" = false ]; then
        seed_database
    fi
    
    if [ "$START_SERVER" = true ]; then
        start_server
        test_connection
    fi
    
    echo -e "\n${GREEN}🎉 Setup completed successfully!${NC}"
    echo -e "\n${CYAN}📋 Summary:${NC}"
    echo -e "${YELLOW}•${NC} Dependencies: Installed"
    echo -e "${YELLOW}•${NC} Environment: Configured"
    echo -e "${YELLOW}•${NC} Database: Seeded with initial data"
    
    if [ "$START_SERVER" = true ]; then
        echo -e "${YELLOW}•${NC} Server: Running on http://localhost:5000"
        echo -e "${YELLOW}•${NC} Health Check: http://localhost:5000/health"
        echo -e "${YELLOW}•${NC} Admin Panel: http://localhost:5000/api/admin"
    fi
    
    echo -e "\n${CYAN}🔑 Default Admin Login:${NC}"
    echo -e "${YELLOW}Email:${NC} admin@manpowercompany.com"
    echo -e "${YELLOW}Password:${NC} admin123"
    
    echo -e "\n${CYAN}📖 Next Steps:${NC}"
    echo -e "${YELLOW}1.${NC} Review and update .env file with your settings"
    echo -e "${YELLOW}2.${NC} Configure email settings for notifications"
    echo -e "${YELLOW}3.${NC} Set up Cloudinary for image uploads"
    echo -e "${YELLOW}4.${NC} Read MONGODB_SETUP.md for detailed documentation"
    
    echo -e "\n${CYAN}🛠️  Useful Commands:${NC}"
    echo -e "${YELLOW}•${NC} View logs: tail -f server.log"
    echo -e "${YELLOW}•${NC} Stop server: pkill -f 'node.*server.js'"
    echo -e "${YELLOW}•${NC} Restart: npm start"
    echo -e "${YELLOW}•${NC} Test API: curl http://localhost:5000/health"
    
    echo -e "\n${GREEN}Happy coding! 🚀${NC}"
}

# Run main function
main "$@"
