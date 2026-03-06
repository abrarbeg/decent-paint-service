import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import VideoShowcase from "./components/VideoShowcase";
import Footer from "./components/Footer";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminGallery from "./pages/AdminGallery";
import AdminContacts from "./pages/AdminContacts";
import AdminVideos from "./pages/AdminVideos";
import AddService from "./pages/AddService"; 
import NotFound from "./pages/NotFound"; 
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from './pages/AdminForgotPassword';
import ResetPassword from './pages/AdminResetPassword';
import "./styles.css";

function App() {
  const location = useLocation();
  
  // Hide navbar/footer on admin pages
  const isAdminPage = location.pathname.startsWith("/admin");
  
  return (
    <>
      {!isAdminPage && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Services />
              <VideoShowcase />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateRoute>
              <AdminServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services/add" 
          element={
            <PrivateRoute>
              <AddService />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <PrivateRoute>
              <AdminGallery />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/videos"
          element={
            <PrivateRoute>
              <AdminVideos />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <PrivateRoute>
              <AdminContacts />
            </PrivateRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAdminPage && <Footer />} 
    </>
  );
}

export default App;