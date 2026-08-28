import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchStudent = async (registrationNumber: string) => {
  const response = await api.get(`/students/${registrationNumber}`);
  return response.data;
};

export const getScoreLevels = async () => {
  const response = await api.get('/reports/score-levels');
  return response.data;
};

export const getTopGroupA = async () => {
  const response = await api.get('/reports/top-group-a');
  return response.data;
};

export default api;
