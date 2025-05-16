// API configuration
const config = {
  // API base URL - change this for different environments
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.safecap.xyz' // Production API URL
    : 'http://localhost:3000',   // Development API URL

  // Default headers for API requests
  defaultHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },

  // Utility function to make API requests
  async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${config.apiBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = {
      ...config.defaultHeaders,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};

export default config;
