import { useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../services/api/galleryAPI';

const useGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isFeatured: undefined,
    isActive: true,
    startDate: null,
    endDate: null
  });

  // Fetch images with current filters and pagination
  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getAllImages({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      if (response.success) {
        setImages(response.data.images);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch images');
      console.error('Fetch images error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await galleryAPI.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  }, []);

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await galleryAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  }, []);

  // Fetch single image by ID
  const fetchImageById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getImageById(id);
      if (response.success) {
        setSelectedImage(response.data.image);
        return response.data.image;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch image');
      console.error('Fetch image error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload single image
  const uploadImage = useCallback(async (imageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.uploadImage(imageData);
      if (response.success) {
        // Refresh images after upload
        await fetchImages();
        await fetchStats();
        return response.data.image;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
      console.error('Upload image error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages, fetchStats]);

  // Bulk upload images
  const bulkUploadImages = useCallback(async (files, metadata) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.bulkUpload(files, metadata);
      if (response.success) {
        // Refresh images after upload
        await fetchImages();
        await fetchStats();
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload images');
      console.error('Bulk upload error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages, fetchStats]);

  // Update image
  const updateImage = useCallback(async (id, imageData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.updateImage(id, imageData);
      if (response.success) {
        // Update local state
        setImages(prev => prev.map(img => 
          img._id === id ? response.data.image : img
        ));
        if (selectedImage?._id === id) {
          setSelectedImage(response.data.image);
        }
        return response.data.image;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update image');
      console.error('Update image error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedImage]);

  // Delete image
  const deleteImage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.deleteImage(id);
      if (response.success) {
        // Remove from local state
        setImages(prev => prev.filter(img => img._id !== id));
        if (selectedImage?._id === id) {
          setSelectedImage(null);
        }
        await fetchStats();
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete image');
      console.error('Delete image error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedImage, fetchStats]);

  // Bulk delete images
  const bulkDeleteImages = useCallback(async (ids) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.bulkDelete(ids);
      if (response.success) {
        // Remove from local state
        setImages(prev => prev.filter(img => !ids.includes(img._id)));
        await fetchStats();
        return response.data.deletedCount;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete images');
      console.error('Bulk delete error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  // Reorder images
  const reorderImages = useCallback(async (updates) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.reorderImages(updates);
      if (response.success) {
        await fetchImages();
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reorder images');
      console.error('Reorder images error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchImages]);

  // Toggle image status
  const toggleImageStatus = useCallback(async (id) => {
    try {
      const response = await galleryAPI.toggleStatus(id);
      if (response.success) {
        // Update local state
        setImages(prev => prev.map(img => 
          img._id === id ? response.data.image : img
        ));
        if (selectedImage?._id === id) {
          setSelectedImage(response.data.image);
        }
        return response.data.image;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle status');
      console.error('Toggle status error:', err);
      throw err;
    }
  }, [selectedImage]);

  // Toggle featured status
  const toggleFeaturedStatus = useCallback(async (id) => {
    try {
      const response = await galleryAPI.toggleFeatured(id);
      if (response.success) {
        // Update local state
        setImages(prev => prev.map(img => 
          img._id === id ? response.data.image : img
        ));
        if (selectedImage?._id === id) {
          setSelectedImage(response.data.image);
        }
        return response.data.image;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle featured');
      console.error('Toggle featured error:', err);
      throw err;
    }
  }, [selectedImage]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Change page size
  const changePageSize = useCallback((newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      category: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      isFeatured: undefined,
      isActive: true,
      startDate: null,
      endDate: null
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Increment view count
  const incrementView = useCallback(async (id) => {
    try {
      await galleryAPI.incrementView(id);
    } catch (err) {
      console.error('Increment view error:', err);
    }
  }, []);

  // Increment download count
  const incrementDownload = useCallback(async (id) => {
    try {
      await galleryAPI.incrementDownload(id);
    } catch (err) {
      console.error('Increment download error:', err);
    }
  }, []);

  // Initialize
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, [fetchCategories, fetchStats]);

  // Fetch images when filters or pagination change
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    // State
    images,
    selectedImage,
    categories,
    stats,
    loading,
    error,
    pagination,
    filters,

    // Actions
    setSelectedImage,
    fetchImages,
    fetchImageById,
    uploadImage,
    bulkUploadImages,
    updateImage,
    deleteImage,
    bulkDeleteImages,
    reorderImages,
    toggleImageStatus,
    toggleFeaturedStatus,
    updateFilters,
    changePage,
    changePageSize,
    resetFilters,
    incrementView,
    incrementDownload,
    fetchStats
  };
};

export default useGallery;

