import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaPlus, FaTools, FaImage, FaEnvelope, FaPalette, 
  FaEdit, FaTrash, FaUpload, FaVideo   // ✅ FaVideo added
} from "react-icons/fa";
import "./AdminServices.css";
import { API_BASE_URL } from "../config"; 

const AdminServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    price: "", 
    description: "", 
    category: "Interior" 
  });
  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/services/all`);
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Please fill in the title and price.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (imageFile) data.append("image", imageFile); 

    try {
      const url = editingId 
        ? `${API_BASE_URL}/api/services/${editingId}` 
        : `${API_BASE_URL}/api/services/add`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, { method, body: data });

      if (response.ok) {
        alert("✅ Service saved successfully!");
        fetchServices(); 
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to connect to server.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/services/${id}`, { method: "DELETE" });
        if (response.ok) fetchServices();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (service) => {
    setFormData({
      title: service.title,
      price: service.price,
      description: service.description,
      category: service.category || "Interior"
    });
    setEditingId(service._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: "", price: "", description: "", category: "Interior" });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Syncing Services...</p>
    </div>
  );

  return (
    <div className="admin-layout">
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
          <Link to="/admin/services" className="active">
            <span className="nav-icon"><FaPlus /></span>
            <span>Services</span>
          </Link>
          <Link to="/admin/gallery">
            <span className="nav-icon"><FaImage /></span>
            <span>Gallery</span>
          </Link>
          {/* ✅ VIDEOS LINK ADDED */}
          <Link to="/admin/videos">
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

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Manage Services</h1>
            <span className="admin-date">{services.length} services active</span>
          </div>
          <button onClick={() => setShowForm(true)} className="add-btn">
            <FaPlus /> Add Service
          </button>
        </header>

        {showForm && (
          <div className="form-modal">
            <div className="form-modal-content">
              <h2 className="modal-header-title">
                {editingId ? "Edit Service" : "Add New Service"}
              </h2>
              
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Service Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="e.g., Luxury Emulsion" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input 
                    type="text" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder="e.g., ₹25/sq ft" 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Interior">Interior Painting</option>
                    <option value="Exterior">Exterior Painting</option>
                    <option value="Texture">Wall Texture Design</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Describe the service details..." 
                    rows="4" 
                  />
                </div>

                <div className="form-group">
                  <label>Project Image</label>
                  <div className="file-upload-area">
                    <input 
                      type="file" 
                      id="image-upload" 
                      className="file-input" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files[0])} 
                    />
                    <label htmlFor="image-upload" className="file-upload-label">
                       <FaUpload size={20} style={{marginBottom: '8px'}} />
                       <span>{imageFile ? `✅ ${imageFile.name}` : "Click to Upload Image"}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleSave} className="save-btn">
                  {editingId ? "Update Service" : "Save Service"}
                </button>
                <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <div className="card-image">
                <img src={service.imageUrl} alt={service.title} />
                <span className="category-badge">{service.category}</span>
              </div>
              <div className="card-content">
                <span className="service-price">{service.price}</span>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <div className="service-actions">
                  <button onClick={() => handleEdit(service)} className="edit-btn">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(service._id)} className="delete-btn">
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

export default AdminServices;