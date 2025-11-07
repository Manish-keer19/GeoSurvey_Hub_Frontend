import axios from "axios";

// const API_BASE_URL = "http://localhost:3000";

const API_BASE_URL = "https://nine-geosurvey-hub-backend.onrender.com";
// const API_BASE_URL = "https://spring-chat-application.onrender.com";


// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`, // Set the base URL once here
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
  },
});

export default axiosInstance;        