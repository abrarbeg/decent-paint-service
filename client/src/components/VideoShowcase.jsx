import React, { useState, useEffect } from 'react';
import { FaPlay, FaVideo, FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from "../config";
import './VideoShowcase.css';

function VideoShowcase() {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/videos/all`);
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const openVideo = (video) => setActiveVideo(video);
  const closeVideo = () => setActiveVideo(null);

  // Helper to detect video platform and return embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // YouTube Shorts
    if (url.includes('youtube.com/shorts')) {
      const videoId = url.split('/shorts/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    // For direct video files, return the URL itself (used in <video> tag)
    return url;
  };

  // Determine if it's an embed (YouTube/Vimeo) or direct file
  const isEmbed = (url) => {
    return url?.includes('youtube') || url?.includes('youtu.be') || url?.includes('vimeo');
  };

  if (loading) return <div className="loader">Loading Showcase...</div>;

  return (
    <section className="video-showcase">
      <div className="video-showcase-overlay">
        <div className="video-header">
          <span className="video-badge"><FaVideo /> Our Work in Motion</span>
          <h2>See Our Painting Magic</h2>
        </div>

        <div className="video-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card" onClick={() => openVideo(video)}>
              <div className="video-thumbnail">
                <img
                  src={video.thumbnailUrl || "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600"}
                  alt={video.title}
                />
                <div className="video-overlay">
                  <div className="play-button"><FaPlay /></div>
                </div>
                {video.duration && <span className="video-duration">{video.duration}</span>}
              </div>
              <div className="video-info">
                <span className="video-category">{video.category}</span>
                <h4>{video.title}</h4>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Player */}
      {activeVideo && (
        <div className="video-lightbox" onClick={closeVideo}>
          <div className="video-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-video" onClick={closeVideo}><FaTimes /></button>
            <div className="video-player">
              {isEmbed(activeVideo.videoUrl) ? (
                <iframe
                  src={getEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="main-video"
                ></iframe>
              ) : (
                <video controls autoPlay className="main-video">
                  <source src={activeVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="video-details">
              <h3>{activeVideo.title}</h3>
              <p>{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VideoShowcase;