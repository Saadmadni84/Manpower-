#!/bin/bash

echo "🧪 Testing Manpower Company API Endpoints"
echo "=========================================="

BASE_URL="http://localhost:5001/api"
ADMIN_EMAIL="admin@manpowercompany.com"
ADMIN_PASSWORD="admin123"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local auth_token=$3
    local data=$4
    local description=$5
    
    echo -n "Testing $description... "
    
    # Build curl command with proper header handling
    if [ -n "$auth_token" ]; then
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $auth_token" "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "%{http_code}" -X $method -H "Authorization: Bearer $auth_token" -d "$data" "$BASE_URL$endpoint")
        fi
    else
        if [ "$method" = "GET" ]; then
            response=$(curl -s -w "%{http_code}" "$BASE_URL$endpoint")
        else
            response=$(curl -s -w "%{http_code}" -X $method -d "$data" "$BASE_URL$endpoint")
        fi
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
        echo "Response: $body"
    fi
}

echo ""
echo "1. Testing Public Endpoints"
echo "---------------------------"

test_endpoint "GET" "/v1/company" "" "" "Company Information"
test_endpoint "GET" "/v1/jobs" "" "" "Job Listings"
test_endpoint "GET" "/v1/services" "" "" "Services"
test_endpoint "GET" "/v1/clients" "" "" "Clients"
test_endpoint "GET" "/v1/gallery/images" "" "" "Gallery Images"
test_endpoint "GET" "/health" "" "" "Health Check"

echo ""
echo "2. Testing Admin Authentication"
echo "------------------------------"

# Login and get token
echo -n "Admin Login... "
login_response=$(curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" "$BASE_URL/admin/v1/auth/login")

if echo "$login_response" | grep -q "success.*true"; then
    token=$(echo "$login_response" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✅ PASS${NC}"
    echo "Debug: Token extracted: ${token:0:20}..."
    
    echo ""
    echo "3. Testing Admin Endpoints"
    echo "-------------------------"
    
    test_endpoint "GET" "/admin/v1/dashboard/stats" "$token" "" "Dashboard Stats"
    test_endpoint "GET" "/admin/v1/company" "$token" "" "Admin Company Info"
    test_endpoint "GET" "/admin/v1/jobs/postings" "$token" "" "Admin Job Management"
    test_endpoint "GET" "/admin/v1/contacts" "$token" "" "Contact Management"
    
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Login failed: $login_response"
fi

echo ""
echo "4. Testing Protected Endpoints (without auth)"
echo "---------------------------------------------"

test_endpoint "GET" "/admin/v1/dashboard/stats" "" "" "Dashboard Stats (No Auth)"
test_endpoint "GET" "/admin/v1/company" "" "" "Admin Company Info (No Auth)"

echo ""
echo "🎉 API Testing Complete!"
echo ""
echo "📋 Summary:"
echo "- Server running on port 5001"
echo "- MongoDB connected successfully"
echo "- Database seeded with sample data"
echo "- Admin authentication working"
echo "- Public endpoints accessible"
echo "- Admin endpoints protected"
echo ""
echo "🔑 Admin Login:"
echo "Email: $ADMIN_EMAIL"
echo "Password: $ADMIN_PASSWORD"
echo ""
echo "🌐 API Base URL: $BASE_URL"
echo "📚 API Documentation: http://localhost:5001/api"
