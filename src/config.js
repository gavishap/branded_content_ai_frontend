/**
 * Application configuration
 */

// Determine the correct API base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';

// Default to production Heroku URL if in production, localhost if in development
export const API_BASE_URL = isProduction
  ? process.env.REACT_APP_API_BASE_URL ||
    'https://branded-content-ai-a6ff96db0804.herokuapp.com'
  : 'http://localhost:5000';

// Log the API URL for debugging
console.log(
  `[Config] Using API base URL: ${API_BASE_URL} (${process.env.NODE_ENV} environment)`
);

// Create config object
const config = {
  API_BASE_URL
};

export default config;
