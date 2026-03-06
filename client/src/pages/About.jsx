import "./About.css";
import { FaPaintBrush, FaTools, FaClock, FaDollarSign, FaLayerGroup } from "react-icons/fa";

function About() {
  const features = [
    { text: "Skilled and experienced painting professionals.", icon: <FaPaintBrush /> },
    { text: "Use of premium quality paints and materials.", icon: <FaTools /> },
    { text: "Modern techniques for interior and exterior finishes.", icon: <FaLayerGroup /> },
    { text: "Timely project completion with attention to detail.", icon: <FaClock /> },
    { text: "Affordable and transparent pricing with free estimates.", icon: <FaDollarSign /> }
  ];

  return (
    <section className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">Welcome to Decent Paint Service</span>
          <h1>Transforming Spaces With <span className="highlight">Color</span> & <span className="highlight">Precision</span></h1>
          <p>We are a trusted name in professional painting solutions, transforming your walls and interiors into vibrant, elegant, and long-lasting finishes.</p>
          <div className="about-hero-buttons">
            <a href="/contact" className="primary-btn">Get Free Quote</a>
            <a href="/gallery" className="secondary-btn">View Our Work</a>
          </div>
        </div>
        <div className="about-hero-visual">
          <div className="paint-brush-icon">
            <FaPaintBrush />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <div className="mission-content">
          <span className="section-badge">Our Mission</span>
          <h2>To Provide Excellence In Every Stroke</h2>
          <p>We are dedicated to delivering high-quality painting and finishing services that enhance the beauty and value of your property while ensuring complete customer satisfaction. Our team of experts combines skill, creativity, and attention to detail to bring your vision to life.</p>
          <div className="mission-image">
            <div className="mission-img-placeholder">
              <FaTools />
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="features-section">
        <div className="features-header">
          <span className="section-badge">Why Choose Us</span>
          <h2>What Sets Us Apart</h2>
          <p>We take pride in delivering exceptional painting services that exceed expectations</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services Overview */}
      <div className="services-overview">
        <div className="services-overview-content">
          <span className="section-badge">Our Services</span>
          <h2>Complete Painting Solutions</h2>
          <p>From interior & exterior painting to wall texture designs and waterproofing solutions, we offer comprehensive services tailored to your needs.</p>
          <ul className="services-list">
            <li>Interior & Exterior Painting</li>
            <li>Wall Texture Designs</li>
            <li>Waterproofing Solutions</li>
            <li>Commercial Painting Projects</li>
          </ul>
        </div>
        <div className="services-overview-visual">
          <div className="paint-drops">
            <div className="drop drop-1"></div>
            <div className="drop drop-2"></div>
            <div className="drop drop-3"></div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <h2>Ready To Transform Your Space?</h2>
        <p>Let's discuss your painting project and bring your vision to life.</p>
        <a href="/contact" className="cta-btn">Contact Us Today</a>
      </div>
    </section>
  );
}

export default About;