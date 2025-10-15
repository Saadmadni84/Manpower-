# Website Content Management System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Backend dependencies are already included
```

### Step 2: Seed the Database

```bash
cd backend
node scripts/seedWebsiteContent.js
```

You should see:
```
✅ Website content seeding completed successfully!
📊 Summary:
   - Total content items: 95
   - Total pages: 5
```

### Step 3: Add to Admin Navigation

Open your admin sidebar component and add:

```jsx
// frontend/src/components/Layout/Sidebar.jsx (or similar)
import { FiEdit } from 'react-icons/fi';

// Add to your menu items array:
{
  title: 'Website Content',
  icon: FiEdit,
  path: '/admin/website-content'
}
```

### Step 4: Add Route

Open your admin routes file and add:

```jsx
// frontend/src/routes/AdminRoutes.jsx (or similar)
import WebsiteContent from '../pages/WebsiteContent';

// Add to your routes:
<Route path="/admin/website-content" element={<WebsiteContent />} />
```

### Step 5: Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 6: Access the CMS

1. Navigate to `http://localhost:3000/admin`
2. Login to admin panel
3. Click on "Website Content" in the sidebar
4. Start editing! 🎉

## 📝 Basic Usage

### To Edit Content:

1. **Select a page** from the tabs (Home, About, Contact, Career, Clients)
2. **Choose language** (EN/AR) using the language toggle
3. **Edit the content** in the form fields
4. **Save Draft** to save without publishing
5. **Preview** to see how it looks
6. **Publish** when ready to go live

### Content Types Available:

- ✍️ **Text Input**: Simple text fields (titles, labels)
- 📝 **Rich Text Editor**: Formatted content (descriptions, paragraphs)
- 🖼️ **Media Upload**: Images and videos (backgrounds, logos)
- 🔢 **Numbers**: Statistics and counts
- 🔗 **URLs**: Links and social media
- 📧 **Emails**: Contact information

## 🎯 Quick Tips

1. **Auto-Save is ON**: Content saves automatically every 2 minutes
2. **Always Preview**: Use the preview button before publishing
3. **Draft First**: Save as draft before publishing changes
4. **Check Both Languages**: Edit and review both EN and AR versions
5. **Respect Character Limits**: Yellow = warning, Red = over limit

## 📄 Pages Overview

### Home Page
- Hero section with title, subtitle, CTA
- Company statistics (6 metrics)
- Services preview section
- Testimonials display
- Call-to-action section

### About Page
- Company overview and history
- Mission and vision statements
- Core values
- Leadership team section
- Why choose us
- Certifications

### Contact Page
- Page header
- Head office details (address, phone, email, hours)
- Regional offices
- Contact form settings
- Social media links

### Career Page
- Career page header with video support
- Why work with us
- 6 employee benefits
- Career opportunities settings
- 5-step application process
- Career CTA

### Clients Page
- Clients page header
- Display settings (layout, size, format)
- Featured clients section
- All clients section
- Client testimonials (optional)
- Client statistics (optional)
- CTA section

## 🔧 Common Tasks

### Adding a New Image
1. Click on image upload area
2. Drag & drop or browse for file
3. Wait for upload to complete
4. Image URL is automatically saved

### Changing Hero Title
1. Go to Home page
2. Find "Hero Section"
3. Edit "Hero Title" field
4. Save draft or publish

### Updating Statistics
1. Go to Home page
2. Find "Company Statistics"
3. Update the numbers
4. Save and publish

### Editing Contact Information
1. Go to Contact page
2. Find "Head Office" section
3. Update phone, email, address
4. Save and publish

### Managing Social Media Links
1. Go to Contact page
2. Scroll to "Social Media" section
3. Update URLs
4. Save and publish

## ⚠️ Important Notes

- **Published = Live**: Publishing makes content visible to the public immediately
- **Drafts are Private**: Saved drafts are not visible on the live site
- **Unsaved Changes**: Yellow warning appears if you have unsaved changes
- **Version Control**: System keeps last 10 versions of each content item
- **Authentication Required**: You must be logged in as admin to access

## 🆘 Troubleshooting

### "Content not saving"
- Check your internet connection
- Verify you're logged in
- Try refreshing the page

### "Images not uploading"
- Check file size (max 10MB)
- Verify file format (JPG, PNG, GIF, WebP, SVG)
- Check Cloudinary configuration in backend

### "Preview not showing"
- Make sure you saved the content first
- Try refreshing the preview
- Check browser console for errors

### "Language toggle not working"
- Each language has separate content
- You may need to add content for both languages
- Save after switching languages

## 📞 Need Help?

Refer to the complete documentation: `CONTENT_MANAGEMENT_SYSTEM.md`

## ✅ Success Checklist

- [ ] Dependencies installed
- [ ] Database seeded with initial content
- [ ] Route added to admin navigation
- [ ] Can access `/admin/website-content`
- [ ] Can switch between pages
- [ ] Can edit content
- [ ] Can save drafts
- [ ] Can preview changes
- [ ] Can publish content
- [ ] Both languages working

## 🎉 You're Ready!

Your Website Content Management System is now fully operational. Your content team can start managing all website content through the intuitive admin interface.

**Next Steps:**
1. Customize the seeded content with your actual content
2. Upload your company images and branding
3. Review and publish each page
4. Train your content team on usage

Happy content managing! 🚀
