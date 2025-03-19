// src/utils/api.js 

import axios from 'axios';

/**
 * Gets the base URL for the API based on the current environment.
 *
 * @returns {string} The base URL for the API.
 */
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // If running on localhost, use the localhost URL
    return 'http://localhost:3001/api'; 
  } else {
    // Otherwise, extract the IP address and port from the current URL
    const currentUrl = new URL(window.location.href); 
    return `http://${currentUrl.hostname}:3001/api`; 
  }
};

// Create an Axios instance with the dynamically determined base URL
const axiosInstance = axios.create({
  baseURL: getBaseUrl(), 
});

/**
 * Makes a GET request to the specified API endpoint.
 *
 * @param {string} endpoint - The API endpoint to make the request to.
 * @param {object} [params={}] - Optional parameters to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data.
 * @throws {Error} If there is an error making the request.
 */
export const axiosGet = async (endpoint, params = {}) => {
  try {
    const response = await axiosInstance.get(endpoint, { params });
    console.log("API Response:", response.data); // Debugging: Log API response
    return response.data;
  } catch (error) {
    console.error(`Error in axiosGet for endpoint ${endpoint}:`, error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

/**
 * Base URL for Quran.com API
 */
const QURAN_API_BASE_URL = 'https://api.quran.com/api/v4';

// Create an Axios instance for Quran.com API
const quranApiInstance = axios.create({
  baseURL: QURAN_API_BASE_URL,
});

/**
 * Makes a GET request to the Quran.com API endpoint.
 *
 * @param {string} endpoint - The Quran.com API endpoint to make the request to.
 * @param {object} [params={}] - Optional parameters to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data.
 * @throws {Error} If there is an error making the request.
 */
export const axiosGetQuranApi = async (endpoint, params = {}) => {
  try {
    const response = await quranApiInstance.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error(`Error in axiosGetQuranApi for endpoint ${endpoint}:`, error);
    throw error;
  }
};
