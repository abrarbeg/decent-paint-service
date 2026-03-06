import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaTools, FaImage, FaEnvelope, FaPalette, FaEdit, FaTrash, FaUpload, FaVideo } from "react-icons/fa";
import "./AdminServices.css"; // Reuse the same styles
import { API_BASE_URL } from "../config"; 

const AdminVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "Interior"
  });
  const [thumbnailFile, setThumbnailFile] = useState(null); // optional, for file upload
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/videos/all`);
      const data = await response.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      alert("Please fill in the title and video URL.");
      return;
    }

    // For simplicity, we send JSON (no file upload for thumbnail in this example)
    // If you want to support image file upload for thumbnail, you'd use FormData like in AdminServices.
    // Here we'll send JSON, assuming thumbnailUrl is a string.
    const payload = {
      title: formData.title,
      description: formData.description,
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl,
      category: formData.category
    };

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/videos/${editingId}` 
        : `${API_BASE_URL}/api/videos/add`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`✅ Video ${editingId ? "updated" : "added"} successfully!`);
        fetchVideos();
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to connect to server.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/${id}`, { method: "DELETE" });
        if (response.ok) fetchVideos();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "Interior"
    });
    setEditingId(video._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "Interior"
    });
    setThumbnailFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Syncing Videos...</p>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* SIDEBAR - identical to AdminServices, but with Videos link active */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><FaPalette /></div>
            <h2>Admin</h2>
          </div>
          <p>Decent Paint Service</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard">
            <span className="nav-icon"><FaTools /></span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/services">
            <span className="nav-icon"><FaPlus /></span>
            <span>Services</span>
          </Link>
          <Link to="/admin/gallery">
            <span className="nav-icon"><FaImage /></span>
            <span>Gallery</span>
          </Link>
          <Link to="/admin/videos" className="active">
            <span className="nav-icon"><FaVideo /></span>
            <span>Videos</span>
          </Link>
          <Link to="/admin/contacts">
            <span className="nav-icon"><FaEnvelope /></span>
            <span>Contacts</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate("/admin/login")} className="logout-btn">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Manage Video Showcase</h1>
            <span className="admin-date">{videos.length} videos active</span>
          </div>
          <button onClick={() => setShowForm(true)} className="add-btn">
            <FaPlus /> Add Video
          </button>
        </header>

        {/* MODAL FORM - styled exactly like AdminServices */}
        {showForm && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h2 className="modal-header-title">
                {editingId ? "Edit Video" : "Add New Video"}
              </h2>
              
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Video Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="e.g., Luxury Interior Painting" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Texture">Texture</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Video URL</label>
                  <input 
                    type="text" 
                    value={formData.videoUrl} 
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} 
                    placeholder="https://youtube.com/..." 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Thumbnail Image URL</label>
                  <input 
                    type="text" 
                    value={formData.thumbnailUrl} 
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })} 
                    placeholder="https://example.com/thumbnail.jpg" 
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Describe the video content..." 
                    rows="4"
                  />
                </div>

                {/* Optional file upload for thumbnail (if you prefer uploading images) 
                    You can uncomment and adapt if your backend supports file upload */}
                {/* <div className="form-group">
                  <label>Thumbnail Image</label>
                  <div className="file-upload-area">
                    <input type="file" id="thumbnail-upload" className="file-input" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files[0])} />
                    <label htmlFor="thumbnail-upload" className="file-upload-label">
                       <FaUpload size={20} style={{marginBottom: '8px'}} />
                       <span>{thumbnailFile ? `✅ ${thumbnailFile.name}` : "Click to Upload Thumbnail"}</span>
                    </label>
                  </div>
                </div> */}
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleSave} className="save-btn">
                  {editingId ? "Update Video" : "Save Video"}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* VIDEO GRID */}
        <div className="services-grid"> {/* Reuse same grid class */}
          {videos.map((video) => (
            <div key={video._id} className="service-card"> {/* Reuse card class */}
              <div className="card-image">
                {/* If thumbnail exists, show it; else a placeholder */}
                <img 
                  src={video.thumbnailUrl || "https://via.placeholder.com/320x180?text=No+Thumbnail"} 
                  alt={video.title} 
                />
                <span className="category-badge">{video.category}</span>
              </div>
              <div className="card-content">
                <h3>{video.title}</h3>
                <p className="service-description">{video.description}</p>
                
                <div className="service-actions">
                  <button onClick={() => handleEdit(video)} className="edit-btn">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(video._id)} className="delete-btn">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminVideos;