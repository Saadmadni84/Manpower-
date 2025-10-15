#!/bin/bash

# Website Content Management System - Installation Script
# This script automates the installation and setup process

set -e  # Exit on any error

echo "=================================================="
echo "   Website Content Management System Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

# Check if Node.js is installed
print_info "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js $(node --version) detected"

# Check if npm is installed
print_info "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm $(npm --version) detected"

echo ""
echo "=================================================="
echo "   Step 1: Installing Frontend Dependencies"
echo "=================================================="
echo ""

cd frontend

print_info "Installing react-icons..."
npm install react-icons@^4.12.0 --save

print_info "Installing react-toastify..."
npm install react-toastify@^9.1.3 --save

print_success "Frontend dependencies installed"

cd ..

echo ""
echo "=================================================="
echo "   Step 2: Checking Backend Dependencies"
echo "=================================================="
echo ""

cd backend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

cd ..

echo ""
echo "=================================================="
echo "   Step 3: Database Setup"
echo "=================================================="
echo ""

# Check if MongoDB is running
print_info "Checking MongoDB connection..."

cd backend

# Try to seed the database
print_info "Seeding website content..."
if node scripts/seedWebsiteContent.js; then
    print_success "Database seeded successfully"
else
    print_error "Failed to seed database. Please check MongoDB connection."
    echo ""
    echo "Make sure MongoDB is running:"
    echo "  - Local: mongod"
    echo "  - Or check your MONGODB_URI in .env file"
    exit 1
fi

cd ..

echo ""
echo "=================================================="
echo "   Step 4: Configuration Summary"
echo "=================================================="
echo ""

print_success "Installation completed successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Add route to your admin navigation:"
echo "   Path: /admin/website-content"
echo "   Component: WebsiteContent"
echo ""
echo "2. Add menu item to sidebar:"
echo "   Title: 'Website Content'"
echo "   Icon: FiEdit from react-icons/fi"
echo ""
echo "3. Start the application:"
echo "   Backend:  cd backend && npm start"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "4. Access the CMS:"
echo "   URL: http://localhost:3000/admin/website-content"
echo ""
echo "=================================================="
echo "   📚 Documentation"
echo "=================================================="
echo ""
echo "Quick Start Guide:"
echo "  → CONTENT_CMS_QUICK_START.md"
echo ""
echo "Complete Documentation:"
echo "  → CONTENT_MANAGEMENT_SYSTEM.md"
echo ""
echo "=================================================="
echo "   🎉 Setup Complete!"
echo "=================================================="
echo ""
echo "Your Website Content Management System is ready!"
echo ""
