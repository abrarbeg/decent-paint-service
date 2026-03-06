import { FaWhatsapp, FaInstagram, FaFacebook, FaPaintRoller } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Footer(){
  const location = useLocation();
  const isSpecialPage = ["/", "/gallery", "/contact", "/about"].includes(location.pathname);
  
  return (
    <footer className={`footer ${isSpecialPage ? 'footer-with-margin' : ''}`}>
      <div className="footer-container">
        {/* Brand Section - Full Width */}
        <div className="footer-brand-section footer-brand-centered">
          <div className="footer-logo">
            <span className="logo-icon"><FaPaintRoller /></span>
            <h3>Decent Paint Service</h3>
          </div>
          <p className="footer-tagline">Transforming spaces with quality painting solutions. Your trusted partner for interior and exterior painting services.</p>
          
          <div className="footer-social">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/918591156719" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} <strong>Decent Paint Service</strong>. All rights reserved.</p>
          <p className="footer-credit">Crafted with passion for beautiful spaces</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer

