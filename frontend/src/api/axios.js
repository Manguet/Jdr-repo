// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    config => {
        // Important : permet de gérer correctement les requêtes OPTIONS
        if (config.method === 'options') {
            config.headers['Access-Control-Request-Method'] = 'POST';
            config.headers['Access-Control-Request-Headers'] = 'content-type';
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            response: error.response?.data,
            status: error.response?.status
        });
    }
);

export default axiosInstance;
