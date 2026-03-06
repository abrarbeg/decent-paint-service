// config.js
// The API base URL for backend requests.
// In development, it defaults to http://localhost:5000.
// In production, set VITE_API_URL in your .env file (frontend).

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";