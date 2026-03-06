import { useState, useEffect } from "react";
import "./Services.css";
import { FaCheckCircle } from "react-icons/fa";
import { API_BASE_URL } from "../config"; 

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Fetching data from the MongoDB backend
        const response = await fetch(`${API_BASE_URL}/api/services/all`); 
        const data = await response.json();
        
        // Console log to check if 'price' actually exists in the incoming data
        console.log("Fetched Services:", data); 
        
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="services">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Connecting to database...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services" id="services-section">
      <div className="services-overlay">
        <div className="services-header">
          <span className="services-badge">Our Expertise</span>
          <h2 className="fade-in">Complete Painting Solutions</h2>
          <p className="subtitle fade-in">
            Professional finishing services tailored to bring your vision to life.
          </p>
        </div>

        <div className="cards">
          {services.map((item, i) => {
            const accentColor = item.color || "#004aad";
            
            return (
              <div 
                key={item._id} 
                className="card fade-in" 
                style={{ 
                  animationDelay: `${0.1 * (i + 1)}s`,
                  '--accent-color': accentColor 
                }}
              >
                {/* 1. TOP IMAGE SECTION */}
                <div className="card-image-wrapper">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="card-image" 
                  />
                  
                  {/* Category Badge */}
                  <div className="category-badge">
                    {item.category || "General"}
                  </div>
                  
                  {/* LINE-BY-LINE FIX: 
                    We use a logical OR (||) check in case your database field 
                    is named 'cost' or 'price'. We also ensure it's not undefined.
                  */}
                  {(item.price || item.cost) && (
                    <div className="price-badge">
                      {item.price || item.cost}
                    </div>
                  )}
                </div>

                {/* 2. CARD CONTENT */}
                <div className="card-body">
                  <h3>{item.title}</h3>
                  <p className="description">{item.description}</p>
                  
                  <ul className="card-features">
                    {(item.features || ["Premium Quality", "Expert Team", "Clean Finish"]).map((feature, idx) => (
                      <li key={idx}>
                        <FaCheckCircle style={{ color: accentColor }} /> {feature}
                      </li>
                    ))}
                  </ul>

                  <a 
                    href="/contact" 
                    className="card-cta" 
                    style={{ background: accentColor }}
                  >
                    Get Free Quote
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;