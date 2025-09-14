import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Intercept requests to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password, role) => {
  const response = await api.post('/auth/register', { name, email, password, role });
  return response.data;
};

// New function to fetch the current user's data from the backend using the token
export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 🟢 MENTOR ADVICE: New function to send a message to the backend
export const sendMessage = async (groupName, text) => {
  const response = await api.post('/chat/messages', { groupName, text });
  return response.data;
};

export default api;