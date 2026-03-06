import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaPaintRoller, FaHome, FaShieldAlt, FaBrush, FaBuilding } from 'react-icons/fa';
import "./Hero.css";

// Import your 5 background images
import slide1 from '../assets/hero-bg.jpg';
import slide2 from '../assets/interior-bg.jpg';
import slide3 from '../assets/exterior-bg.jpg';
import slide4 from '../assets/texture-bg.jpg';
import slide5 from '../assets/hero-bg-2.jpg';

const slideData = [
  {
    image: slide1,
    badge: "Expert Wall Finishers",
    title: "Professional Painting Solutions",
    quote: "Transforming Homes & Offices with Premium Interior & Exterior Services.",
    icon: <FaPaintRoller />
  },
  {
    image: slide2,
    badge: "Interior Excellence",
    title: "Vibrant Living Spaces",
    quote: "Bring color and life to your rooms with our expert interior finishes.",
    icon: <FaHome />
  },
  {
    image: slide3,
    badge: "Durable Protection",
    title: "Exterior Shield Coating",
    quote: "Weather-resistant painting that protects your property for years to come.",
    icon: <FaShieldAlt />
  },
  {
    image: slide4,
    badge: "Artistic Textures",
    title: "Modern Wall Designs",
    quote: "Add personality and elegance to your walls with custom texture designs.",
    icon: <FaBrush />
  },
  {
    image: slide5,
    badge: "Commercial Specialists",
    title: "Large Scale Projects",
    quote: "Reliable and efficient painting solutions for businesses and industries.",
    icon: <FaBuilding />
  }
];

function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const goToNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const goToPrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      {/* Background Images Layer */}
      {slideData.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="hero-overlay">
        <div className="hero-content">
          <div className={`hero-badge ${isAnimating ? 'animating' : ''}`} key={`badge-${current}`}>
            <span className="badge-icon">{slideData[current].icon}</span>
            {slideData[current].badge}
          </div>
          
          <h1 key={`title-${current}`}>
            {slideData[current].title}
          </h1>
          
          <p key={`quote-${current}`}>
            {slideData[current].quote}
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => scrollToSection("contact-section")}
            >
              Get Free Quote <span className="btn-icon"><FaArrowRight /></span>
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate('/gallery')}
            >
              View Our Work <span className="btn-icon"><FaPaintRoller /></span>
            </button>
          </div>
        </div>
      </div>  

      {/* Navigation Arrows */}
      <button className="nav-arrow prev" onClick={goToPrev}>
        <span>‹</span>
      </button>
      <button className="nav-arrow next" onClick={goToNext}>
        <span>›</span>
      </button>

      {/* Navigation Indicators */}
      <div className="slide-dots">
        {slideData.map((_, i) => (
          <span 
            key={i} 
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

export default Hero;

