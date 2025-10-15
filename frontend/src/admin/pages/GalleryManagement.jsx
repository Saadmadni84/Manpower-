import React, { useState, useEffect } from 'react';
import useGallery from '../../hooks/useGallery';
import ImageGrid from '../../components/Gallery/ImageGrid';
import ImageUpload from '../../components/Gallery/ImageUpload';
import BulkUpload from '../../components/Gallery/BulkUpload';
import ImageViewer from '../../components/ui/ImageViewer';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const {
    images,
    categories,
    stats,
    loading,
    error,
    pagination,
    filters,
    uploadImage,
    bulkUploadImages,
    updateImage,
    deleteImage,
    bulkDeleteImages,
    toggleImageStatus,
    toggleFeaturedStatus,
    updateFilters,
    changePage,
    changePageSize,
    resetFilters,
    fetchStats
  } = useGallery();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [gridSize, setGridSize] = useState('medium');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(undefined);
  const [isActiveFilter, setIsActiveFilter] = useState(true);

  // Lock background scroll when any modal is open
  useEffect(() => {
    const anyModalOpen = showUploadModal || showBulkUploadModal || showImageViewer;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    if (anyModalOpen) {
      const hasScrollbar = window.innerWidth > document.documentElement.clientWidth;
      if (hasScrollbar) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
      document.body.style.paddingRight = originalPaddingRight || '';
    };
  }, [showUploadModal, showBulkUploadModal, showImageViewer]);

  // Apply filters when they change
  useEffect(() => {
    const filterObj = {
      search: searchQuery,
      category: selectedCategory,
      sortBy,
      sortOrder,
      isFeatured: isFeaturedFilter,
      isActive: isActiveFilter,
      startDate: dateRange.start || null,
      endDate: dateRange.end || null
    };
    updateFilters(filterObj);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, isFeaturedFilter, isActiveFilter, dateRange]);

  const handleViewImage = (image) => {
    setSelectedImage(image);
    setShowImageViewer(true);
  };

  const handleEditImage = (image) => {
    // TODO: Open edit modal
    console.log('Edit image:', image);
  };

  const handleDeleteImage = async (image) => {
    if (window.confirm(`Are you sure you want to delete "${image.title?.en || 'this image'}"?`)) {
      try {
        await deleteImage(image._id);
        alert('Image deleted successfully');
      } catch (error) {
        alert('Failed to delete image');
      }
    }
  };

  const handleToggleFeatured = async (imageId) => {
    try {
      await toggleFeaturedStatus(imageId);
    } catch (error) {
      alert('Failed to toggle featured status');
    }
  };

  const handleToggleStatus = async (imageId) => {
    try {
      await toggleImageStatus(imageId);
    } catch (error) {
      alert('Failed to toggle status');
    }
  };

  const handleBulkAction = async (action, imageIds) => {
    try {
      if (action === 'delete') {
        await bulkDeleteImages(imageIds);
        alert(`Successfully deleted ${imageIds.length} images`);
      } else if (action === 'feature') {
        for (const id of imageIds) {
          await toggleFeaturedStatus(id);
        }
        alert(`Updated ${imageIds.length} images`);
      } else if (action === 'activate') {
        for (const id of imageIds) {
          await toggleImageStatus(id);
        }
        alert(`Updated ${imageIds.length} images`);
      }
    } catch (error) {
      alert('Bulk operation failed');
    }
  };

  const handleUpload = async (imageData) => {
    try {
      await uploadImage(imageData);
      setShowUploadModal(false);
      alert('Image uploaded successfully');
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  const handleBulkUpload = async (files, metadata) => {
    try {
      await bulkUploadImages(files, metadata);
      setShowBulkUploadModal(false);
      alert(`Successfully uploaded ${files.length} images`);
    } catch (error) {
      alert('Failed to upload images');
    }
  };

  const handlePreviousImage = () => {
    const currentIndex = images.findIndex(img => img._id === selectedImage._id);
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  };

  const handleNextImage = () => {
    const currentIndex = images.findIndex(img => img._id === selectedImage._id);
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  const handleDownloadImage = async (image) => {
    // Download image logic
    const link = document.createElement('a');
    link.href = image.image;
    link.download = image.originalFilename || 'image.jpg';
    link.click();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setDateRange({ start: '', end: '' });
    setIsFeaturedFilter(undefined);
    setIsActiveFilter(true);
    resetFilters();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="gallery-management">
      {/* Header */}
      <div className="gallery-header">
        <div className="header-content">
          <h1>Gallery Management</h1>
          <p className="header-subtitle">Manage and organize your image gallery</p>
        </div>
        <div className="header-actions">
          <button 
            className="action-btn primary-btn"
            onClick={() => setShowUploadModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2"/>
              <polyline points="17 8 12 3 7 8" strokeWidth="2"/>
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2"/>
            </svg>
            Upload Image
          </button>
          <button 
            className="action-btn secondary-btn"
            onClick={() => setShowBulkUploadModal(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2"/>
              <polyline points="14 2 14 8 20 8" strokeWidth="2"/>
              <line x1="12" y1="18" x2="12" y2="12" strokeWidth="2"/>
              <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2"/>
            </svg>
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <polyline points="21 15 16 10 5 21" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Images</h3>
              <p className="stat-value">{stats.totalImages || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Categories</h3>
              <p className="stat-value">{categories.length || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Featured</h3>
              <p className="stat-value">{stats.featuredCount || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Storage Used</h3>
              <p className="stat-value">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="gallery-toolbar">
        <div className="toolbar-left">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            className={`toolbar-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="2"/>
            </svg>
            Filters
          </button>
        </div>

        <div className="toolbar-right">
          <select 
            className="toolbar-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date Created</option>
            <option value="displayOrder">Display Order</option>
            <option value="title.en">Title</option>
            <option value="fileSize">File Size</option>
          </select>

          <button 
            className="toolbar-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="19" x2="12" y2="5" strokeWidth="2"/>
                <polyline points="5 12 12 5 19 12" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/>
                <polyline points="19 12 12 19 5 12" strokeWidth="2"/>
              </svg>
            )}
          </button>

          <div className="grid-size-controls">
            <button 
              className={`size-btn ${gridSize === 'small' ? 'active' : ''}`}
              onClick={() => setGridSize('small')}
              title="Small"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              className={`size-btn ${gridSize === 'medium' ? 'active' : ''}`}
              onClick={() => setGridSize('medium')}
              title="Medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="8" height="8" strokeWidth="2"/>
                <rect x="13" y="3" width="8" height="8" strokeWidth="2"/>
                <rect x="3" y="13" width="8" height="8" strokeWidth="2"/>
              </svg>
            </button>
            <button 
              className={`size-btn ${gridSize === 'large' ? 'active' : ''}`}
              onClick={() => setGridSize('large')}
              title="Large"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="8" strokeWidth="2"/>
                <rect x="3" y="13" width="18" height="8" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <h4>Category</h4>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count || 0})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h4>Date Range</h4>
            <div className="date-inputs">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                placeholder="Start date"
              />
              <span>to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                placeholder="End date"
              />
            </div>
          </div>

          <div className="filter-group">
            <h4>Status</h4>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={isFeaturedFilter === true}
                onChange={(e) => setIsFeaturedFilter(e.target.checked ? true : undefined)}
              />
              <span>Featured only</span>
            </label>
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={isActiveFilter === true}
                onChange={(e) => setIsActiveFilter(e.target.checked)}
              />
              <span>Active only</span>
            </label>
          </div>

          <button className="reset-filters-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
        </div>
      )}

      {/* Image Grid */}
      <div className="gallery-content">
        <ImageGrid
          images={images}
          onView={handleViewImage}
          onEdit={handleEditImage}
          onDelete={handleDeleteImage}
          onToggleFeatured={handleToggleFeatured}
          onToggleStatus={handleToggleStatus}
          onBulkAction={handleBulkAction}
          gridSize={gridSize}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="gallery-pagination">
          <div className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} images
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${pagination.page === pageNum ? 'active' : ''}`}
                  onClick={() => changePage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <ImageUpload
              onUpload={handleUpload}
              onCancel={() => setShowUploadModal(false)}
              categories={categories}
            />
          </div>
        </div>
      )}

      {showBulkUploadModal && (
        <div className="modal-overlay" onClick={() => setShowBulkUploadModal(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <BulkUpload
              onUpload={handleBulkUpload}
              onCancel={() => setShowBulkUploadModal(false)}
              categories={categories}
            />
          </div>
        </div>
      )}

      {showImageViewer && selectedImage && (
        <ImageViewer
          image={selectedImage}
          images={images}
          onClose={() => setShowImageViewer(false)}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
          onDownload={handleDownloadImage}
        />
      )}
    </div>
  );
};

export default GalleryManagement;
