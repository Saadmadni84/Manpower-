# Dashboard Showing Zero - Troubleshooting & Fix

## 🐛 Issue
After adding the "Website Content" expandable section, all dashboard statistics are showing zero.

## 🔍 Diagnosis Steps

### Step 1: Check Browser Console
1. Open your browser
2. Press **F12** (or Cmd+Option+I on Mac) to open DevTools
3. Go to **Console** tab
4. Look for these messages:
   - `Dashboard Stats: {...}` (from AdminLayout)
   - `useDashboard - Received data: {...}` (from useDashboard hook)
   - `useDashboard - Stats: {...}` (actual stats data)

### Step 2: Check Network Tab
1. In DevTools, go to **Network** tab
2. Refresh the page
3. Look for: `/dashboard/stats` request
4. Click on it and check:
   - **Status**: Should be `200 OK`
   - **Response**: Should have JSON data with stats
   - **Preview**: Check the actual numbers

### Step 3: Verify Backend is Running
```bash
# Check if backend is running
curl http://localhost:5001/api/admin-new/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Quick Fixes

### Fix 1: Restart Everything
```bash
# Terminal 1 - Stop and restart backend
cd backend
# Press Ctrl+C to stop
npm start

# Terminal 2 - Stop and restart frontend
cd frontend
# Press Ctrl+C to stop
npm start
```

### Fix 2: Clear Browser Cache
1. Hard refresh: **Ctrl+Shift+R** (or Cmd+Shift+R on Mac)
2. Or clear cache:
   - Chrome: DevTools → Network → Check "Disable cache"
   - Firefox: DevTools → Network → Check "Disable Cache"

### Fix 3: Check Token
```javascript
// In browser console, run:
localStorage.getItem('adminToken')

// If null or undefined, login again:
// 1. Logout
// 2. Clear storage: localStorage.clear()
// 3. Login again
```

### Fix 4: Verify Database Has Data
```bash
# Connect to MongoDB
mongosh

# Use the database
use manpower_db

# Check counts
db.admin_services.count({is_active: true})
db.admin_clients.count({is_active: true})
db.job_openings.count({status: 'active'})
db.cv_submissions.count({status: 'new'})
db.galleries.count({is_active: true})
db.contact_enquiries.count({status: 'new'})
```

If all return 0, seed the database:
```bash
cd backend
npm run seed
```

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Console shows CORS error
**Solution**: 
```bash
# Check backend is running on correct port
cd backend
npm start
# Should show: Server running on port 5001
```

### Issue 2: 401 Unauthorized
**Symptom**: Network shows 401 error
**Solution**:
1. Logout and login again
2. Check token expiry
3. Clear localStorage and re-authenticate

### Issue 3: Network Error
**Symptom**: Failed to fetch / Network request failed
**Solution**:
1. Check backend is running
2. Check firewall settings
3. Verify port 5001 is not blocked

### Issue 4: Data Structure Mismatch
**Symptom**: Console shows data but dashboard shows 0
**Solution**: Check the response structure matches expected format

## 🔬 Detailed Debugging

### Add More Logging to Dashboard
Edit `frontend/src/pages/Dashboard/Dashboard.jsx`:

```javascript
// Add this after line 40
useEffect(() => {
  console.log('Dashboard - Stats received:', stats);
}, [stats]);
```

### Test API Directly
Create a test file `backend/test-dashboard.js`:

```javascript
const fetch = require('node-fetch');

const testDashboard = async () => {
  try {
    // Replace with your actual token
    const token = 'YOUR_TOKEN_HERE';
    
    const response = await fetch('http://localhost:5001/api/admin-new/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    console.log('Dashboard Stats:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testDashboard();
```

Run it:
```bash
cd backend
node test-dashboard.js
```

## 📊 Expected vs Actual

### Expected Console Output:
```javascript
// From AdminLayout
Dashboard Stats: {
  totalServices: 8,
  totalClients: 15,
  activeJobs: 12,
  pendingCVs: 5,
  galleryImages: 45,
  contactEnquiries: 3,
  activeContracts: 12
}

// From useDashboard
useDashboard - Received data: {
  success: true,
  data: {
    stats: { totalServices: 8, ... },
    activities: [...],
    ...
  }
}

useDashboard - Stats: {
  totalServices: 8,
  totalClients: 15,
  activeJobs: 12,
  ...
}
```

### If You See This (Problem):
```javascript
Dashboard Stats: {
  totalServices: 0,
  totalClients: 0,
  activeJobs: 0,
  ...
}
```

## ✅ Step-by-Step Fix

### 1. Verify Backend Response
```bash
# In backend directory
cd backend

# Check if database is seeded
npm run seed

# Start backend with logging
npm start
```

### 2. Check Frontend Data Flow
1. Open browser console (F12)
2. Refresh page
3. Check for these logs in order:
   - AdminLayout: "Dashboard Stats: ..."
   - useDashboard: "useDashboard - Received data: ..."
   - useDashboard: "useDashboard - Stats: ..."

### 3. Verify Data Reaches Components
Add this to `Dashboard.jsx` after line 40:
```javascript
console.log('Dashboard Component - stats:', stats);
```

### 4. Check StatCard Props
Add this to `StatCard.jsx` at the start:
```javascript
console.log('StatCard - value:', value, 'title:', title);
```

## 🚨 If Still Not Working

### Nuclear Option (Reset Everything)
```bash
# 1. Stop all servers (Ctrl+C in all terminals)

# 2. Backend reset
cd backend
rm -rf node_modules
npm install
npm run seed
npm start

# 3. Frontend reset (in new terminal)
cd frontend
rm -rf node_modules
npm install
npm start

# 4. Clear browser
# - Clear all cache and cookies for localhost
# - Or use Incognito/Private mode

# 5. Login fresh
# - Go to http://localhost:3000/admin-login
# - Login with: admin / Admin123!
```

## 📝 Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 3000
- [ ] MongoDB running and accessible
- [ ] Database has seeded data (npm run seed)
- [ ] No CORS errors in console
- [ ] No 401/403 errors in network tab
- [ ] Token exists in localStorage
- [ ] Console shows "Dashboard Stats" with numbers
- [ ] Console shows "useDashboard - Stats" with numbers
- [ ] Network tab shows successful /dashboard/stats request
- [ ] Response preview shows actual numbers

## 🎯 Root Cause Analysis

The issue is likely one of these:

1. **Backend not returning data** - Check MongoDB connection
2. **Frontend not receiving data** - Check network errors
3. **Data not propagating to components** - Check React state updates
4. **Token expired** - Re-login
5. **API endpoint changed** - Verify URL is correct

## 📞 Get Help

If none of this works, provide these details:

1. **Browser Console Output** (copy all logs)
2. **Network Tab Screenshot** (showing /dashboard/stats request)
3. **Backend Terminal Output** (any errors?)
4. **MongoDB Query Results** (db counts)
5. **Package versions** (node --version, npm --version)

## 🔄 Temporary Workaround

If you need dashboard working NOW while debugging:

Edit `frontend/src/hooks/useDashboard.js`:

```javascript
// Replace the initial state with test data
const [stats, setStats] = useState({
  totalServices: 8,
  totalClients: 15,
  activeJobs: 12,
  pendingCVs: 5,
  galleryImages: 45,
  contactEnquiries: 3
});
```

This will show fake data while you debug the real issue.

---

**Status**: Debugging Tools Added ✅  
**Next Steps**: Follow diagnosis steps above  
**Last Updated**: October 8, 2024

