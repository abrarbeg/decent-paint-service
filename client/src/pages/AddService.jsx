import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./AddService.css";

const AddService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Interior");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState(""); // ✅ Added price state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate all fields including price
    if (!title || !description || !imageUrl || !price) {
      alert("❌ Please fill all fields including price");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/services/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          category,
          imageUrl,
          price // ✅ Now sending price to the backend
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Project added successfully!");
        navigate("/admin/dashboard");
      } else {
        alert(data.error || "❌ Failed to add project");
      }
    } catch (err) {
      console.error("Add service error:", err);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-main">
        <div className="form-modal">
          <form onSubmit={handleSubmit} className="form-modal-content">

            {/* HEADER */}
            <h2>Add New Painting Project</h2>

            {/* BODY */}
            <div className="form-modal-body">

              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>

              {/* ✅ ADDED PRICE INPUT FIELD */}
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., ₹25/sq ft or Fixed Price"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the project..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Interior">Interior Painting</option>
                  <option value="Exterior">Exterior Painting</option>
                  <option value="Texture">Wall Texture Design</option>
                </select>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                  required
                />
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="image-preview-container">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "🚀 Save Project"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/admin/dashboard")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;