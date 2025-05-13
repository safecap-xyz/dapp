// API configuration
const config = {
  // API base URL - change this for different environments
  apiBaseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.safecap.xyz' // Production API URL
    : 'http://localhost:3000'   // Development API URL
};

export default config;
