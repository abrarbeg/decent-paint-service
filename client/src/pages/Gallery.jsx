import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { API_BASE_URL } from "../config"; 

function Gallery() {
  const [openSection, setOpenSection] = useState('interior');
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // State for database images
  const [dbImages, setDbImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from MongoDB on mount
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/gallery/all`);
        const data = await response.json();
        
        // Ensure data is an array
        setDbImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter images based on active tab
  const currentImages = dbImages.filter(img => 
    img.category?.toLowerCase() === openSection.toLowerCase()
  );

  const categories = [
    { id: 'interior', label: 'Interior Painting', color: '#667eea' },
    { id: 'exterior', label: 'Exterior Painting', color: '#764ba2' },
    { id: 'textures', label: 'Wall Texture Design', color: '#f093fb' }
  ];

  return (
    <div className="gallery-container">
      {/* Inner wrapper to center content with max-width */}
      <div className="gallery-content">
        <div className="gallery-header">
          <span className="gallery-badge">Our Portfolio</span>
          <h1>Transforming Spaces Into Masterpieces</h1>
          <p>Explore our diverse collection of premium painting projects across interiors, exteriors, and textures</p>
        </div>

        {/* Category Tabs */}
        <div className="gallery-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`tab-btn ${openSection === cat.id ? 'active' : ''}`}
              onClick={() => setOpenSection(cat.id)}
              style={{ '--tab-color': cat.color }}
            >
              <span className="tab-label">{cat.label}</span>
              <span className="tab-count">
                {dbImages.filter(img => img.category?.toLowerCase() === cat.id).length} Projects
              </span>
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="gallery-loading">
            <div className="spinner"></div>
            <p>Loading Masterpieces...</p>
          </div>
        ) : (
          <div className={`gallery-grid ${openSection}`}>
            {currentImages.length > 0 ? (
              currentImages.map((img, index) => (
                <div 
                  key={img._id || index} 
                  className="gallery-item fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setLightboxImage(img.src)}
                >
                  <img src={img.src} alt={img.title || "Painting Project"} loading="lazy" />
                  
                  <div className="gallery-overlay">
                    <span className="project-title">{img.title || 'Premium Finish'}</span>
                    <span className="view-project">View Project</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-gallery">
                <p>No projects found in this category yet.</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="gallery-cta">
          <h3>Like What You See?</h3>
          <p>Let's discuss your project and bring your vision to life</p>
          <a href="/contact" className="cta-button">Get Free Quote</a>
        </div>
      </div> {/* End gallery-content */}

      {/* Lightbox (outside content because it's fixed) */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt="Full view" />
            <button className="close-btn" onClick={() => setLightboxImage(null)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;