import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import "./NotFound.css"; // Reusing some admin styles for layout

const NotFound = () => {
  return (
    <div className="not-found-container" style={styles.container}>
      <div style={styles.content}>
        <div style={styles.icon}><FaExclamationTriangle /></div>
        <h1 style={styles.heading}>404</h1>
        <h2 style={styles.subheading}>Page Not Found</h2>
        <p style={styles.text}>
          Oops! The page you are looking for doesn't exist or has been moved. 
          Let's get you back to your painting project.
        </p>
        <Link to="/" style={styles.button}>
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "20px"
  },
  content: {
    maxWidth: "500px"
  },
  icon: {
    fontSize: "4rem",
    color: "#f093fb",
    marginBottom: "20px"
  },
  heading: {
    fontSize: "6rem",
    margin: "0",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  subheading: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "15px"
  },
  text: {
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.6"
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 30px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "30px",
    fontWeight: "600",
    transition: "transform 0.3s ease"
  }
};

export default NotFound;