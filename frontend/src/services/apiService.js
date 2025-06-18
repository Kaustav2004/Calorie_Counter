import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeFood = async (formData) => {
  // Extract FormData into plain object
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Ensure imageUrl exists even if empty
  if (!data.imageUrl) {
    data.imageUrl = '';
  }

  console.log("Sending to backend as JSON:", data);

  const response = await api.post('/calorie/analyze', data); // Sends as JSON
  console.log("Response from backend:", response.data.data);
  return response.data;
};

export const getAnalysisHistory = async () => {
  const response = await api.get('/calorie/history');
  return response.data;
};
