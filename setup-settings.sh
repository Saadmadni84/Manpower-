#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║         ADMIN PANEL SETTINGS SYSTEM SETUP                  ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Change to backend/admin directory
cd "$(dirname "$0")/backend/admin" || exit

echo -e "${YELLOW}📦 Step 1: Checking dependencies...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi
echo -e "${GREEN}✅ Node.js is installed${NC}"

if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not in PATH. Make sure it's running.${NC}"
else
    echo -e "${GREEN}✅ MongoDB is available${NC}"
fi

echo ""
echo -e "${YELLOW}📝 Step 2: Initializing default settings...${NC}"
echo ""

# Run the initialization script
node scripts/initializeSettings.js

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║              ✨ SETUP COMPLETE! ✨                         ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}🎉 Your settings system is ready to use!${NC}"
    echo ""
    echo -e "${YELLOW}📍 Next Steps:${NC}"
    echo -e "   1. Start your backend: ${GREEN}cd backend && npm start${NC}"
    echo -e "   2. Start your frontend: ${GREEN}cd frontend && npm start${NC}"
    echo -e "   3. Login to admin panel: ${GREEN}http://localhost:3000/admin${NC}"
    echo -e "   4. Click ${GREEN}Settings${NC} in the sidebar (⚙️)"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo -e "   - Full docs: ${GREEN}SETTINGS_SYSTEM_COMPLETE.md${NC}"
    echo -e "   - Quick start: ${GREEN}SETTINGS_QUICK_START.md${NC}"
    echo -e "   - Summary: ${GREEN}SETTINGS_SYSTEM_SUMMARY.md${NC}"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠️  Setup encountered an issue.${NC}"
    echo -e "   Check if MongoDB is running and try again."
    echo ""
    exit 1
fi
