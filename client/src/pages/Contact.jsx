import "./Contact.css";
import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from "react-icons/fa";
import { API_BASE_URL } from "../config";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Thank you! Your inquiry has been saved.");
        setFormData({ name: "", phone: "", email: "", service: "", message: "" });
      } else {
        alert("Error: " + (data.error || "Failed to send message"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Server not responding. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content fade-in">
          <span className="contact-badge">Get In Touch</span>
          <h1>Let's Paint Your <span className="highlight">Dream Space</span></h1>
          <p>Have a project in mind? Reach out for a free consultation and quote.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="contact-main">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info fade-in fade-in-delay-1">
            <h2>Contact Information</h2>
            <p className="contact-info-desc">Reach out to us via the details below. We're here to help!</p>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon"><FaMapMarkerAlt /></div>
                <div className="info-content">
                  <h4>Our Location</h4>
                  <p>Andheri East<br />Mumbai, Maharashtra</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon"><FaPhone /></div>
                <div className="info-content">
                  <h4>Phone Number</h4>
                  <p>+91 85911 56719<br />+91 70834 50065</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon"><FaEnvelope /></div>
                <div className="info-content">
                  <h4>Email Address</h4>
                  <p>Sanahanfionline@gmail.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon"><FaClock /></div>
                <div className="info-content">
                  <h4>Working Hours</h4>
                  <p>Mon - Sat: 8:00 AM - 6:00 PM<br />Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section fade-in fade-in-delay-2">
            <div className="form-header">
              <h2>Send Us a Message</h2>
              <p>We'll get back to you within 24 hours.</p>
            </div>
            
            <form className="contact-form-new" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" placeholder="+91 XXXXX XXXXX" required value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Interested In</label>
                <select id="service" required value={formData.service} onChange={handleChange}>
                  <option value="">Select a service</option>
                  <option value="Interior Painting">Interior Painting</option>
                  <option value="Exterior Painting">Exterior Painting</option>
                  <option value="Wall Texture Design">Wall Texture Design</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Tell us about your project..." rows="5" required value={formData.message} onChange={handleChange}></textarea>
              </div>

              <button type="submit" className="submit-btn-new" disabled={isSubmitting}>
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;