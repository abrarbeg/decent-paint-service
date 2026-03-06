import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { API_BASE_URL } from "../config"; 

const ICONS = {
  tools: "🛠️",
  envelope: "📧",
  image: "🖼️",
  video: "🎥",
  plus: "➕",
  palette: "🎨",
  logout: "🚪",
  bell: "🔔",
  check: "✓",
  clock: "🕐",
  user: "👤",
  arrow: "→"
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [videos, setVideos] = useState([]);        // ✅ NEW
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem("adminAuth")) {
        navigate("/admin/login");
      }
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);

        const [bookingsRes, servicesRes, videosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/bookings/all`),
          fetch(`${API_BASE_URL}/api/services/all`),
          fetch(`${API_BASE_URL}/api/videos/all`)     // ✅ NEW
        ]);
        
        const bookingsData = await bookingsRes.json();
        const servicesData = await servicesRes.json();
        const videosData = await videosRes.json();

        setContacts(Array.isArray(bookingsData) ? bookingsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setVideos(Array.isArray(videosData) ? videosData : []);   // ✅ NEW
        setGalleryCount(Array.isArray(servicesData) ? servicesData.length : 0);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Connecting to Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">{ICONS.palette}</div>
            <h2>Admin</h2>
          </div>
          <p>Decent Paint Service</p>
        </div>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="active">
            <span className="nav-icon">{ICONS.tools}</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/services">
            <span className="nav-icon">{ICONS.plus}</span>
            <span>Services</span>
          </Link>
          <Link to="/admin/gallery">
            <span className="nav-icon">{ICONS.image}</span>
            <span>Gallery</span>
          </Link>
          <Link to="/admin/videos">
            <span className="nav-icon">{ICONS.video}</span>
            <span>Videos</span>
          </Link>
          <Link to="/admin/contacts">
            <span className="nav-icon">{ICONS.envelope}</span>
            <span>Contacts</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span>{ICONS.logout}</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1>Dashboard Overview</h1>
            <span className="admin-date">{new Date().toDateString()}</span>
          </div>
          <div className="admin-avatar">{ICONS.user}</div>
        </header>

        {/* STATS */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">{ICONS.tools}</div>
            <div className="stat-info">
              <span className="stat-number">{services.length}</span>
              <span className="stat-label">Services Live</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{ICONS.video}</div>
            <div className="stat-info">
              <span className="stat-number">{videos.length}</span>
              <span className="stat-label">Videos</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{ICONS.envelope}</div>
            <div className="stat-info">
              <span className="stat-number">{contacts.length}</span>
              <span className="stat-label">Inquiries</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{ICONS.bell}</div>
            <div className="stat-info">
              <span className="stat-number">{contacts.filter(c => !c.read).length}</span>
              <span className="stat-label">Pending Alerts</span>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="dashboard-grid">

          {/* QUICK ACTIONS */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>

            <div className="quick-actions-list">
              <Link to="/admin/services" className="action-card">
                <div className="action-icon-bg">{ICONS.plus}</div>
                <div className="action-details">
                  <h4>Add New Service</h4>
                  <p>Update your service database</p>
                </div>
                <span className="action-arrow">{ICONS.arrow}</span>
              </Link>

              <Link to="/admin/videos" className="action-card">
                <div className="action-icon-bg">{ICONS.video}</div>
                <div className="action-details">
                  <h4>Manage Videos</h4>
                  <p>Add YouTube / Vimeo links</p>
                </div>
                <span className="action-arrow">{ICONS.arrow}</span>
              </Link>

              <Link to="/admin/contacts" className="action-card">
                <div className="action-icon-bg">{ICONS.envelope}</div>
                <div className="action-details">
                  <h4>View Messages</h4>
                  <p>Respond to customer inquiries</p>
                </div>
                <span className="action-arrow">{ICONS.arrow}</span>
              </Link>
            </div>
          </section>

          {/* RECENT MESSAGES */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Recent Messages</h2>
              <Link to="/admin/contacts" className="view-all-btn">View All</Link>
            </div>

            <div className="recent-messages-list">
              {contacts.length === 0 ? (
                <p>No new messages found.</p>
              ) : (
                contacts.slice(0, 3).map(msg => (
                  <div key={msg._id} className={`message-card ${!msg.read ? "unread" : ""}`}>
                    <div className="message-header">
                      <strong>{msg.name}</strong>
                      <span className="msg-time">
                        {ICONS.clock} {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="msg-text">{msg.message?.substring(0, 60)}...</p>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;