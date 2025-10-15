import React from 'react';

const TestWebsiteContent = () => {
  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#4CAF50', marginBottom: '20px' }}>✅ Website Content Page Works!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          This is a test version of the Website Content Management page.
        </p>
        <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
          <h2 style={{ color: '#2e7d32', marginTop: 0 }}>🎉 Success!</h2>
          <p style={{ color: '#1b5e20' }}>
            The page is loading correctly without authentication issues.
          </p>
          <p style={{ color: '#1b5e20' }}>
            <strong>Next step:</strong> The full CMS with all 5 page editors (Home, About, Contact, Career, Clients) 
            will load once we fix the authentication.
          </p>
        </div>
        
        <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px' }}>
          <h3 style={{ color: '#856404', marginTop: 0 }}>⚠️ Current Issue</h3>
          <p style={{ color: '#856404' }}>
            The AdminLayout authentication check is still causing redirects. 
            I've disabled it temporarily, but if you're still being redirected, it means the change hasn't taken effect yet.
          </p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>📋 What Should Be Here:</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>5 Page Tabs: Home, About, Contact, Career, Clients</li>
            <li>Language Toggle: English/Arabic</li>
            <li>Action Buttons: Save Draft, Preview, Publish</li>
            <li>Content Editor with form fields</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestWebsiteContent;
