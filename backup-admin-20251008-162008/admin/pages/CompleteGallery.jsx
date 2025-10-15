import React, { useState } from 'react';

const CompleteGallery = () => {
  const [images, setImages] = useState([
    { id: 1, title: 'Company Event 2024', category: 'Events', url: 'https://via.placeholder.com/300x200/2563eb/ffffff?text=Event+Photo', uploadDate: '2024-01-15' },
    { id: 2, title: 'Construction Site', category: 'Projects', url: 'https://via.placeholder.com/300x200/10b981/ffffff?text=Construction', uploadDate: '2024-01-10' },
    { id: 3, title: 'Team Meeting', category: 'Workforce', url: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Team+Photo', uploadDate: '2024-01-08' },
    { id: 4, title: 'Airport Operations', category: 'Projects', url: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Airport', uploadDate: '2024-01-05' },
    { id: 5, title: 'Office Environment', category: 'Workforce', url: 'https://via.placeholder.com/300x200/ef4444/ffffff?text=Office', uploadDate: '2024-01-03' },
    { id: 6, title: 'Award Ceremony', category: 'Events', url: 'https://via.placeholder.com/300x200/06b6d4/ffffff?text=Awards', uploadDate: '2023-12-28' }
  ]);

  const [categories] = useState(['Events', 'Projects', 'Workforce', 'All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    category: 'Events',
    file: null
  });

  const handleDeleteImage = (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (uploadFormData.file) {
      const newImage = {
        id: Date.now(),
        title: uploadFormData.title,
        category: uploadFormData.category,
        url: URL.createObjectURL(uploadFormData.file),
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setImages([...images, newImage]);
      setShowUploadModal(false);
      setUploadFormData({ title: '', category: 'Events', file: null });
    }
  };

  const filteredImages = selectedCategory === 'All' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' }}>Gallery Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage your company's image gallery</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}
        >
          📸 Upload Image
        </button>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '10px 20px',
              background: selectedCategory === category ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 'white',
              color: selectedCategory === category ? 'white' : '#64748b',
              border: selectedCategory === category ? 'none' : '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {category} ({category === 'All' ? images.length : images.filter(img => img.category === category).length})
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {filteredImages.map(image => (
          <div
            key={image.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '2px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={image.url}
                alt={image.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {image.category}
              </div>
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
                {image.title}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px 0' }}>
                Uploaded: {image.uploadDate}
              </p>
              <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}>
                <button
                  style={{
                    padding: '8px',
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  👁️ View
                </button>
                <button
                  style={{
                    padding: '8px',
                    background: '#dbeafe',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  style={{
                    padding: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          border: '2px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
            No images found
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            {selectedCategory === 'All' ? 'Upload your first image to get started.' : `No images in the ${selectedCategory} category.`}
          </p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Upload New Image
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  borderRadius: '8px',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpload} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Image Title
                </label>
                <input
                  type="text"
                  value={uploadFormData.title}
                  onChange={e => setUploadFormData({...uploadFormData, title: e.target.value})}
                  required
                  placeholder="e.g., Company Event 2024"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Category
                </label>
                <select
                  value={uploadFormData.category}
                  onChange={e => setUploadFormData({...uploadFormData, category: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b'
                  }}
                >
                  <option value="Events">Events</option>
                  <option value="Projects">Projects</option>
                  <option value="Workforce">Workforce</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Select Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setUploadFormData({...uploadFormData, file: e.target.files[0]})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1e293b',
                    background: '#f8fafc'
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  📸 Upload Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteGallery;
