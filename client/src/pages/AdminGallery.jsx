import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlus, FaTools, FaImage, FaEnvelope, FaPalette, 
  FaTrash, FaEye, FaBuilding, FaHome, FaBrush, 
  FaUpload, FaTimes, FaVideo   // ✅ FaVideo imported
} from "react-icons/fa";
import "./AdminGallery.css";
import { API_BASE_URL } from "../config"; // Ensure this points to your backend URL

const AdminGallery = () => {
    const [gallery, setGallery] = useState({ exterior: [], interior: [], textures: [] });
    const [activeTab, setActiveTab] = useState("exterior");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadMode, setUploadMode] = useState("url");
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // 1. Fetch live data from MongoDB
    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/gallery/all`);
            const data = await response.json();
            
            // Organize flat array from DB into categories for the UI
            const organized = {
                exterior: data.filter(img => img.category === "exterior"),
                interior: data.filter(img => img.category === "interior"),
                textures: data.filter(img => img.category === "textures"),
            };
            setGallery(organized);
        } catch (error) {
            console.error("Error fetching gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // 2. Add Image to Database
    const handleAddImage = async () => {
        const src = uploadMode === "url" ? newImageUrl : imagePreview;
        if (!src) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/gallery/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    src: src,
                    category: activeTab
                })
            });

            if (response.ok) {
                fetchGallery(); // Refresh list
                resetForm();
                alert("✅ Image added to database!");
            }
        } catch (error) {
            alert("❌ Failed to save to database");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setNewImageUrl("");
        setImagePreview(null);
        setShowAddForm(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 3. Delete Image from Database
    const handleDeleteImage = async (id) => {
        if (window.confirm("Permanently delete this image from database?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    fetchGallery();
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    if (loading) return <div className="loading-screen"><div className="loading-spinner"></div><p>Loading Portfolio...</p></div>;

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
                    <Link to="/admin/services">
                        <span className="nav-icon"><FaPlus /></span>
                        <span>Services</span>
                    </Link>
                    <Link to="/admin/gallery" className="active">
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
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-left">
                        <h1>Gallery Manager</h1>
                        <span className="admin-date">Storing permanently in MongoDB</span>
                    </div>
                    <button onClick={() => setShowAddForm(true)} className="add-btn">
                        <FaPlus /> Add Image
                    </button>
                </header>

                <div className="gallery-tabs">
                    {["exterior", "interior", "textures"].map((tab) => (
                        <button 
                            key={tab} 
                            className={`tab-btn ${activeTab === tab ? "active" : ""}`} 
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "exterior" ? <FaBuilding /> : tab === "interior" ? <FaHome /> : <FaBrush />}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({gallery[tab].length})
                        </button>
                    ))}
                </div>

                {showAddForm && (
                    <div className="form-modal">
                        <div className="form-modal-content">
                            <h2 className="modal-header-title"><FaPlus /> Add to {activeTab}</h2>
                            <div className="form-modal-body">
                                <div className="upload-mode-toggle">
                                    <button 
                                        className={`mode-btn ${uploadMode === 'url' ? 'active' : ''}`} 
                                        onClick={() => setUploadMode('url')}
                                    >
                                        URL
                                    </button>
                                    <button 
                                        className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`} 
                                        onClick={() => setUploadMode('file')}
                                    >
                                        Upload
                                    </button>
                                </div>

                                {uploadMode === 'url' ? (
                                    <div className="form-group">
                                        <label>Image Link</label>
                                        <input 
                                            type="text" 
                                            value={newImageUrl} 
                                            onChange={(e) => setNewImageUrl(e.target.value)} 
                                            placeholder="https://example.com/image.jpg" 
                                        />
                                    </div>
                                ) : (
                                    <div className="form-group">
                                        <label>Upload File</label>
                                        {!imagePreview ? (
                                            <label className="file-upload-label">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange} 
                                                    accept="image/*" 
                                                    className="file-input" 
                                                />
                                                <FaUpload size={24} />
                                                <span>Select Project Image</span>
                                            </label>
                                        ) : (
                                            <div className="image-preview-container">
                                                <img src={imagePreview} alt="Preview" className="image-preview" />
                                                <button 
                                                    type="button" 
                                                    className="clear-preview-btn" 
                                                    onClick={() => setImagePreview(null)}
                                                >
                                                    <FaTimes /> Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="form-actions">
                                <button 
                                    onClick={handleAddImage} 
                                    className="save-btn" 
                                    disabled={uploadMode === 'url' ? !newImageUrl : !imagePreview}
                                >
                                    Save to DB
                                </button>
                                <button onClick={resetForm} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="gallery-grid">
                    {gallery[activeTab].map((image) => (
                        <div key={image._id} className="gallery-item">
                            <img src={image.src} alt="Work" onClick={() => setSelectedImage(image)} />
                            <div className="gallery-item-overlay">
                                <button onClick={() => setSelectedImage(image)} className="view-btn">
                                    <FaEye /> View
                                </button>
                                <button onClick={() => handleDeleteImage(image._id)} className="delete-btn">
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedImage && (
                    <div className="form-modal" onClick={() => setSelectedImage(null)}>
                        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <img src={selectedImage.src} alt="Full view" />
                            <button className="close-lightbox" onClick={() => setSelectedImage(null)}>×</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminGallery;