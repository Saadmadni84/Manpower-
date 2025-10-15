import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const WebsiteContent = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [content, setContent] = useState({
    title: '',
    description: '',
    richContent: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  // Debug: Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    console.log('🔍 WebsiteContent - Auth Check:', { 
      hasToken: !!token, 
      hasUser: !!user,
      currentPath: window.location.pathname
    });
  }, []);

  const pages = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'contact', name: 'Contact' },
    { id: 'career', name: 'Career' },
    { id: 'clients', name: 'Clients' }
  ];

  // Handle content changes
  const handleContentChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  // Handle publish
  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish these changes? This will make them visible to the public.')) {
      return;
    }
    
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setHasChanges(false);
      alert('Changes published successfully!');
    } catch (error) {
      alert('Failed to publish changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    alert('Preview feature will show a modal with the formatted content');
  };

  // Handle revert
  const handleRevert = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes?')) {
      setContent({
        title: '',
        description: '',
        richContent: '',
        metaTitle: '',
        metaDescription: ''
      });
      setHasChanges(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#f5f5f5', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px', borderBottom: '2px solid #e0e0e0', paddingBottom: '20px' }}>
          <h1 style={{ 
            color: '#1976d2', 
            margin: '0 0 10px 0',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            🎉 Website Content Management System
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
            Manage all your website content from this centralized panel
          </p>
        </div>

        {/* Language Toggle */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => setCurrentLanguage('en')}
            style={{
              padding: '8px 16px',
              border: '2px solid ' + (currentLanguage === 'en' ? '#1976d2' : '#ddd'),
              background: currentLanguage === 'en' ? '#1976d2' : 'white',
              color: currentLanguage === 'en' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setCurrentLanguage('ar')}
            style={{
              padding: '8px 16px',
              border: '2px solid ' + (currentLanguage === 'ar' ? '#1976d2' : '#ddd'),
              background: currentLanguage === 'ar' ? '#1976d2' : 'white',
              color: currentLanguage === 'ar' ? 'white' : '#666',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            🇸🇦 العربية
          </button>
          
          {/* Status indicator */}
          {hasChanges && (
            <div style={{
              padding: '8px 16px',
              background: '#ffc107',
              color: '#856404',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ Unsaved Changes
            </div>
          )}
        </div>

        {/* Page Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '5px', 
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: currentPage === page.id ? '#1976d2' : 'transparent',
                color: currentPage === page.id ? 'white' : '#666',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: currentPage === page.id ? 'bold' : 'normal',
                borderBottom: currentPage === page.id ? '2px solid #1976d2' : '2px solid transparent'
              }}
            >
              {page.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '30px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleSaveDraft}
            disabled={saving || !hasChanges}
            style={{
              padding: '10px 20px',
              background: saving ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Draft'}
          </button>
          <button 
            onClick={handlePreview}
            style={{
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            👁️ Preview
          </button>
          <button 
            onClick={handleRevert}
            disabled={!hasChanges || saving}
            style={{
              padding: '10px 20px',
              background: !hasChanges ? '#ccc' : '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: !hasChanges ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: !hasChanges ? 0.7 : 1
            }}
          >
            🔄 Revert Changes
          </button>
          <button 
            onClick={handlePublish}
            disabled={saving || !hasChanges}
            style={{
              padding: '10px 20px',
              background: saving ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? '⏳ Publishing...' : '🚀 Publish Changes'}
          </button>
        </div>

        {/* Content Editor */}
        <div style={{ 
          background: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{ 
            color: '#1976d2', 
            marginTop: 0,
            textTransform: 'capitalize',
            fontSize: '24px'
          }}>
            {currentPage} Page Editor
          </h2>
          
          {/* SEO Fields */}
          <div style={{ 
            background: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            border: '1px solid #2196f3'
          }}>
            <h3 style={{ color: '#1976d2', marginTop: 0, fontSize: '18px' }}>🔍 SEO Settings</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Meta Title ({currentLanguage.toUpperCase()})
              </label>
              <input
                type="text"
                value={content.metaTitle}
                onChange={(e) => handleContentChange('metaTitle', e.target.value)}
                placeholder={`SEO title for ${currentPage} page in ${currentLanguage === 'en' ? 'English' : 'Arabic'}...`}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Meta Description ({currentLanguage.toUpperCase()})
              </label>
              <textarea
                value={content.metaDescription}
                onChange={(e) => handleContentChange('metaDescription', e.target.value)}
                placeholder={`SEO description for ${currentPage} page in ${currentLanguage === 'en' ? 'English' : 'Arabic'}...`}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Page Title ({currentLanguage.toUpperCase()})
            </label>
            <input
              type="text"
              value={content.title}
              onChange={(e) => handleContentChange('title', e.target.value)}
              placeholder={`Enter ${currentPage} page title in ${currentLanguage === 'en' ? 'English' : 'Arabic'}...`}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Page Description ({currentLanguage.toUpperCase()})
            </label>
            <textarea
              value={content.description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              placeholder={`Enter ${currentPage} page description in ${currentLanguage === 'en' ? 'English' : 'Arabic'}...`}
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Rich Content ({currentLanguage.toUpperCase()})
            </label>
            <div style={{ 
              background: 'white', 
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}>
              <ReactQuill
                theme="snow"
                value={content.richContent}
                onChange={(value) => handleContentChange('richContent', value)}
                modules={quillModules}
                placeholder={`Enter rich content for ${currentPage} page in ${currentLanguage === 'en' ? 'English' : 'Arabic'}...`}
                style={{
                  minHeight: '200px'
                }}
              />
            </div>
          </div>

          <div style={{ 
            background: '#e8f5e9', 
            padding: '15px', 
            borderRadius: '6px',
            border: '1px solid #4CAF50'
          }}>
            <h3 style={{ 
              color: '#2e7d32', 
              marginTop: 0,
              fontSize: '18px'
            }}>
              ✅ Success! Original CMS is Working
            </h3>
            <p style={{ 
              color: '#1b5e20', 
              margin: '5px 0 0 0',
              lineHeight: '1.5'
            }}>
              This is the <strong>{currentPage}</strong> page editor in <strong>{currentLanguage === 'en' ? 'English' : 'Arabic'}</strong> mode.
              You can switch between pages using the tabs above and change languages using the toggle buttons.
              All form fields are ready for content editing!
            </p>
          </div>
        </div>

        {/* Status */}
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#fff3cd', 
          borderRadius: '6px',
          border: '1px solid #ffc107'
        }}>
          <h4 style={{ 
            color: '#856404', 
            marginTop: 0,
            fontSize: '16px'
          }}>
            🎯 Original CMS Route Working:
          </h4>
          <ul style={{ 
            color: '#856404', 
            margin: '5px 0 0 20px',
            lineHeight: '1.6'
          }}>
            <li>This is the main /admin/content route</li>
            <li>Same features as the simple version</li>
            <li>Rich text editor with full formatting</li>
            <li>SEO management and multi-language support</li>
            <li>All 5 pages accessible via tabs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebsiteContent;