import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaPlus, FaTools, FaImage, FaEnvelope, FaPalette, 
  FaTrash, FaCheck, FaBell, FaPhone, FaCalendar, FaVideo   // ✅ FaVideo imported
} from "react-icons/fa";
import "./AdminContacts.css";
import { API_BASE_URL } from "../config"; // ✅ Imported centralized config

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("all"); // all, read, unread
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from MongoDB
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/bookings/all`);
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 2. ✅ FIXED: Mark as Read in Database
  const handleMarkAsRead = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }), // Sending the status update in the body
      });

      if (response.ok) {
        // Update local state immediately for a smooth UI
        setContacts((prevContacts) =>
          prevContacts.map((c) => (c._id === id ? { ...c, read: true } : c))
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to connect to the server.");
    }
  };

  // 3. Delete from Database
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setContacts(contacts.filter((c) => c._id !== id));
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  const filteredContacts = contacts
    .filter((contact) => {
      if (filter === "read") return contact.read;
      if (filter === "unread") return !contact.read;
      return true;
    })
    .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)); // Proper date sorting

  if (loading) return <div className="loading-screen">Connecting to Decent Paint Database...</div>;

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
          <Link to="/admin/gallery">
            <span className="nav-icon"><FaImage /></span>
            <span>Gallery</span>
          </Link>
          {/* ✅ VIDEOS LINK ADDED */}
          <Link to="/admin/videos">
            <span className="nav-icon"><FaVideo /></span>
            <span>Videos</span>
          </Link>
          <Link to="/admin/contacts" className="active">
            <span className="nav-icon"><FaEnvelope /></span>
            <span>Contacts</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <Link to="/admin/login" className="logout-btn"><span>🚪</span><span>Logout</span></Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Contact Inquiries</h1>
            <span className="admin-date">
              {unreadCount > 0 ? `${unreadCount} unread messages` : "All messages read"}
            </span>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="contact-filters">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All ({contacts.length})
          </button>
          <button className={`filter-btn ${filter === "unread" ? "active" : ""}`} onClick={() => setFilter("unread")}>
            <FaBell /> Unread ({unreadCount})
          </button>
          <button className={`filter-btn ${filter === "read" ? "active" : ""}`} onClick={() => setFilter("read")}>
            <FaCheck /> Read ({contacts.length - unreadCount})
          </button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="no-messages">
            <div className="empty-icon">📭</div>
            <h3>{filter === "unread" ? "No Unread Messages" : "No Messages Yet"}</h3>
            <p>Customer inquiries from MongoDB will appear here.</p>
          </div>
        ) : (
          <div className="contacts-list">
            {filteredContacts.map((contact) => (
              <div key={contact._id} className={`contact-card ${!contact.read ? "unread" : ""}`}>
                <div className="contact-header">
                  <div className="contact-avatar">
                    {contact.name.charAt(0).toUpperCase()}
                    {!contact.read && <span className="unread-dot"></span>}
                  </div>
                  <div className="contact-info">
                    <h3>{contact.name}</h3>
                    <div className="contact-meta">
                      <span><FaEnvelope /> {contact.email}</span>
                      {contact.phone && <span><FaPhone /> {contact.phone}</span>}
                      {contact.service && <span className="service-tag">{contact.service}</span>}
                    </div>
                  </div>
                  <div className="contact-right">
                    <span className="contact-date">
                      <FaCalendar /> {formatDate(contact.date || contact.createdAt)}
                    </span>
                    {!contact.read && <span className="unread-badge">New</span>}
                  </div>
                </div>
                <div className="contact-message">
                  <p>{contact.message}</p>
                </div>
                <div className="contact-actions">
                  {!contact.read && (
                    <button onClick={() => handleMarkAsRead(contact._id)} className="read-btn">
                      <FaCheck /> Mark as Read
                    </button>
                  )}
                  <button onClick={() => handleDelete(contact._id)} className="delete-btn">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminContacts;