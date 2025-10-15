# ⚡ SETTINGS SYSTEM - QUICK START GUIDE

## 🚀 Setup in 3 Easy Steps

### Step 1: Install Dependencies (if needed)

```bash
cd /Users/saadmadni/Downloads/Python/company/backend
npm install nodemailer
```

### Step 2: Initialize Default Settings

```bash
cd /Users/saadmadni/Downloads/Python/company/backend/admin
node scripts/initializeSettings.js
```

Expected output:
```
🔌 Connecting to database...
✅ Connected to database
📝 Initializing default settings...
✨ Settings Initialization Complete!
📊 Total settings created: 75
```

### Step 3: Access Settings

1. **Start your servers** (if not already running):
```bash
# Terminal 1 - Backend
cd /Users/saadmadni/Downloads/Python/company/backend
npm start

# Terminal 2 - Frontend
cd /Users/saadmadni/Downloads/Python/company/frontend
npm start
```

2. **Login to Admin Panel**:
   - Visit: `http://localhost:3000/admin`
   - Login with your admin credentials

3. **Click Settings in Sidebar**:
   - Look for the ⚙️ Settings menu item (last item)
   - Click to open settings

---

## 📋 What You Can Configure

### 1. **General Settings** 🏢
- Company name (English & Arabic)
- Registration & tax numbers
- Contact information
- Social media links
- System defaults

### 2. **Admin Users** 👥
- Add/edit/delete admin users
- Set roles (Super Admin, Admin, Editor)
- Toggle user status
- Generate secure passwords

### 3. **Email & Notifications** 📧
- Configure SMTP settings
- Test email configuration
- Enable/disable notifications
- Email templates

### 4. **Security** 🔒
- Password policies
- Account lockout settings
- Session management
- Security monitoring

### 5. **System Configuration** ⚙️
- Performance settings
- File upload limits
- Image compression
- Maintenance mode
- View system information

### 6. **Backup & Maintenance** 💾
- Automated backups
- Create manual backups
- View backup history
- Retention settings

### 7. **Language & Localization** 🌐
- Default language
- RTL support for Arabic
- Auto-detect user language

### 8. **API Configuration** 🔌
- Google Analytics
- Facebook Pixel
- reCAPTCHA keys
- API key management

### 9. **Website Settings** 🌐
- SEO meta tags
- Search console verification
- Social media (Open Graph)
- Contact form settings

---

## 🎯 Common Tasks

### Configure Email (SMTP)
1. Go to: Settings → Email & Notifications
2. Fill in:
   - SMTP Host: `smtp.gmail.com`
   - SMTP Port: `587`
   - Username: Your email
   - Password: Your app password
   - Encryption: `TLS`
3. Click "Send Test Email" to verify
4. Save settings

### Add New Admin User
1. Go to: Settings → Admin Users
2. Click "Add New Admin"
3. Fill in details:
   - Username (min 3 chars)
   - Email
   - Click "Generate" for password
   - Select role
4. Click "Create Admin User"

### Configure SEO
1. Go to: Settings → Website Settings
2. Fill in:
   - Meta title (EN & AR)
   - Meta description (EN & AR)
   - Keywords
3. Save settings

### Create Backup
1. Go to: Settings → Backup & Maintenance
2. Click "Create Backup Now"
3. Wait for completion
4. View in backup history table

### View System Info
1. Go to: Settings → System Configuration
2. Scroll to "System Information"
3. View server stats, memory, database status
4. Click "Refresh System Info" to update

---

## 🔐 Important Security Notes

1. **Change Default Passwords**: Update all admin passwords immediately
2. **Email Encryption**: SMTP passwords are encrypted in database
3. **API Keys**: Secret keys are encrypted automatically
4. **Role Permissions**:
   - Super Admin: Full access
   - Admin: Cannot edit security, backup, API
   - Editor: No settings access

---

## 📝 Default Values

The system comes pre-configured with sensible defaults:

- **Company Name**: "Manpower Supply Company"
- **Founded Year**: 2000
- **Currency**: SAR
- **Language**: English (with Arabic support)
- **Password Length**: Minimum 8 characters
- **Session Timeout**: 60 minutes
- **File Upload Limit**: 10 MB
- **Backup Frequency**: Daily
- **Image Compression**: Enabled (80% quality)

You can change any of these in the settings!

---

## ❓ Troubleshooting

### Settings not showing?
```bash
# Re-initialize settings
cd backend/admin
node scripts/initializeSettings.js
```

### Can't save settings?
- Check you're logged in as admin/super_admin
- Check browser console for errors
- Verify backend is running

### Email test failing?
- For Gmail: Enable "App Passwords" in Google Account
- Check SMTP credentials
- Try port 587 (TLS) or 465 (SSL)
- Check firewall settings

---

## 🎉 You're All Set!

Your comprehensive settings system is ready to use. All settings are automatically saved to MongoDB and will persist across server restarts.

**Pro Tip**: Always test your changes (especially email settings) before relying on them in production!

---

## 📞 Need Help?

1. Check the full documentation: `SETTINGS_SYSTEM_COMPLETE.md`
2. Review browser console logs
3. Check backend server logs
4. Test API endpoints: `http://localhost:5000/api/admin/settings`

---

**Ready to configure your admin panel? Click Settings in the sidebar!** ⚙️✨
