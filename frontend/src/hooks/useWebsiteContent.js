import { useState, useEffect, useCallback, useRef } from 'react';
import contentService from '../services/contentService';
import { toast } from 'react-toastify';

const useWebsiteContent = (page) => {
  const [content, setContent] = useState({});
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [drafts, setDrafts] = useState([]);
  
  const autoSaveTimeoutRef = useRef(null);
  const originalContentRef = useRef({});

  // Load page content
  const loadContent = useCallback(async (includeDrafts = true) => {
    setLoading(true);
    try {
      const result = await contentService.getPageContent(page, includeDrafts);
      setContent(result.data.content);
      setPageInfo(result.data.pageInfo);
      originalContentRef.current = JSON.parse(JSON.stringify(result.data.content));
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Load drafts
  const loadDrafts = useCallback(async () => {
    try {
      const result = await contentService.getDrafts(page);
      setDrafts(result.data);
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  }, [page]);

  // Update content
  const updateContent = useCallback((section, contentKey, value, language = 'both') => {
    setContent(prev => {
      const newContent = { ...prev };
      if (!newContent[section]) {
        newContent[section] = [];
      }
      
      // Find existing content item
      const itemIndex = newContent[section].findIndex(
        item => item.contentKey === contentKey
      );
      
      if (itemIndex >= 0) {
        newContent[section][itemIndex] = {
          ...newContent[section][itemIndex],
          content: language === 'both' ? value : {
            ...newContent[section][itemIndex].content,
            [language]: value
          }
        };
      } else {
        newContent[section].push({
          contentKey,
          content: language === 'both' ? value : { [language]: value },
          section
        });
      }
      
      return newContent;
    });
    
    setHasChanges(true);
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new auto-save timeout (2 minutes)
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 120000); // 2 minutes
  }, []);

  // Save draft
  const saveDraft = useCallback(async () => {
    setSaving(true);
    try {
      const updates = [];
      
      // Convert content object to update array
      Object.entries(content).forEach(([section, items]) => {
        items.forEach(item => {
          updates.push({
            page,
            section,
            contentKey: item.contentKey,
            content: item.content,
            contentType: item.contentType || 'text'
          });
        });
      });
      
      if (updates.length > 0) {
        await contentService.bulkUpdateContent(updates);
        setLastSaved(new Date());
        setHasChanges(false);
        toast.success('Draft saved successfully');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  }, [content, page]);

  // Publish content
  const publishContent = useCallback(async () => {
    setSaving(true);
    try {
      await contentService.publishContent(null, page);
      setLastSaved(new Date());
      setHasChanges(false);
      originalContentRef.current = JSON.parse(JSON.stringify(content));
      toast.success('Content published successfully');
      await loadContent(false);
    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error(error.message || 'Failed to publish content');
    } finally {
      setSaving(false);
    }
  }, [page, content, loadContent]);

  // Revert changes
  const revertChanges = useCallback(() => {
    setContent(JSON.parse(JSON.stringify(originalContentRef.current)));
    setHasChanges(false);
    toast.info('Changes reverted');
  }, []);

  // Upload media
  const uploadMedia = useCallback(async (file, folder) => {
    try {
      const result = await contentService.uploadMedia(file, folder);
      return result.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error(error.message || 'Failed to upload media');
      throw error;
    }
  }, []);

  // Get content value
  const getContentValue = useCallback((section, contentKey, language = 'en') => {
    if (!content[section]) return null;
    const item = content[section].find(i => i.contentKey === contentKey);
    if (!item) return null;
    return item.content?.[language] || item.content?.en || item.value;
  }, [content]);

  // Get all section content
  const getSectionContent = useCallback((section) => {
    return content[section] || [];
  }, [content]);

  // Preview page
  const previewPage = useCallback(async (language = 'en') => {
    try {
      const result = await contentService.previewPage(page, language);
      return result.data;
    } catch (error) {
      console.error('Error previewing page:', error);
      toast.error(error.message || 'Failed to preview page');
      throw error;
    }
  }, [page]);

  // Load content on mount
  useEffect(() => {
    if (page) {
      loadContent();
      loadDrafts();
    }
  }, [page, loadContent, loadDrafts]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return {
    content,
    pageInfo,
    loading,
    saving,
    hasChanges,
    lastSaved,
    drafts,
    updateContent,
    saveDraft,
    publishContent,
    revertChanges,
    uploadMedia,
    getContentValue,
    getSectionContent,
    loadContent,
    previewPage
  };
};

export default useWebsiteContent;
