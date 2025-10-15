import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Tab, Box, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import './ComprehensiveContentManagement.css';
import HomepageContent from '../components/Content/HomepageContent';
import AboutUsContent from '../components/Content/AboutUsContent';
import CompanyStats from '../components/Content/CompanyStats';
import ContactInfo from '../components/Content/ContactInfo';
import LanguageToggle from '../components/UI/LanguageToggle';

const ComprehensiveContentManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Fetch all content on mount
  useEffect(() => {
    fetchContent();
  }, []);

  // Auto-save every 2 minutes
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      handleSave(true);
    }, 120000); // 2 minutes

    return () => clearInterval(autoSaveInterval);
  }, [autoSaveEnabled, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/content-management', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Organize content by section and key
          const organized = {};
          data.data.content.forEach(item => {
            if (!organized[item.section]) {
              organized[item.section] = {};
            }
            organized[item.section][item.contentKey] = item.contentValue;
          });
          setContent(organized);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showSnackbar('Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (isAutoSave = false) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare bulk update payload
      const updates = [];
      Object.keys(content).forEach(section => {
        Object.keys(content[section]).forEach(key => {
          updates.push({
            section,
            key,
            contentValue: content[section][key],
            contentType: typeof content[section][key] === 'number' ? 'number' : 'text'
          });
        });
      });

      const response = await fetch('http://localhost:5001/api/admin/content-management/bulk-update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
      });

      if (response.ok) {
        const data = await response.json();
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        showSnackbar(
          isAutoSave ? 'Auto-saved successfully' : 'Content saved successfully',
          'success'
        );
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      showSnackbar('Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = useCallback((section, key, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/content-management/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        showSnackbar('Content exported successfully', 'success');
      }
    } catch (error) {
      console.error('Error exporting content:', error);
      showSnackbar('Failed to export content', 'error');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/content-management/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: importedData.data || importedData })
      });

      if (response.ok) {
        await fetchContent();
        showSnackbar('Content imported successfully', 'success');
      }
    } catch (error) {
      console.error('Error importing content:', error);
      showSnackbar('Failed to import content', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <div className="content-loading">
        <CircularProgress />
        <p>Loading content management...</p>
      </div>
    );
  }

  return (
    <div className="comprehensive-content-management">
      {/* Header */}
      <div className="content-header">
        <div className="header-left">
          <h2>Website Content Management</h2>
          <p className="header-subtitle">
            Manage all website content in English and Arabic
          </p>
        </div>
        
        <div className="header-right">
          <LanguageToggle 
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          
          <div className="header-actions">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="small"
              >
                Import
              </Button>
            </label>
            
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => handleSave(false)}
              disabled={saving || !hasUnsavedChanges}
              size="small"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className={`status-indicator ${hasUnsavedChanges ? 'unsaved' : 'saved'}`} />
          <span className="status-text">
            {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
          </span>
        </div>
        
        {lastSaved && (
          <div className="status-item">
            <span className="status-text">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          </div>
        )}
        
        <div className="status-item">
          <label className="auto-save-toggle">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
            />
            <span>Auto-save (every 2 min)</span>
          </label>
        </div>
      </div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Homepage Content" />
          <Tab label="About Us Page" />
          <Tab label="Company Statistics" />
          <Tab label="Contact Information" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <div className="tab-content">
        {activeTab === 0 && (
          <HomepageContent
            content={content.homepage || {}}
            currentLanguage={currentLanguage}
            onChange={(key, value) => handleContentChange('homepage', key, value)}
          />
        )}
        
        {activeTab === 1 && (
          <AboutUsContent
            content={content.about || {}}
            currentLanguage={currentLanguage}
            onChange={(key, value) => handleContentChange('about', key, value)}
          />
        )}
        
        {activeTab === 2 && (
          <CompanyStats
            content={content.stats || {}}
            onChange={(key, value) => handleContentChange('stats', key, value)}
          />
        )}
        
        {activeTab === 3 && (
          <ContactInfo
            content={content.contact || {}}
            currentLanguage={currentLanguage}
            onChange={(key, value) => handleContentChange('contact', key, value)}
          />
        )}
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ComprehensiveContentManagement;
