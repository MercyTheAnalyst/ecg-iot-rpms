import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://server.mercyoyebode.me/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const getPatientDashboard = async (patientID) => {
  try {
    const response = await api.get(`/dashboard/${patientID}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
    throw error;
  }
};

export const getPatientRecords = async (patientID, limit = 50) => {
  try {
    const response = await api.get(`/patient/${patientID}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch records:', error);
    throw error;
  }
};

export const getRecord = async (recordID) => {
  try {
    const response = await api.get(`/record/${recordID}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch record:', error);
    throw error;
  }
};

export const getAlerts = async (limit = 20, patientID = null) => {
  try {
    const params = { limit };
    if (patientID) params.patientID = patientID;
    
    const response = await api.get('/alerts', { params });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    throw error;
  }
};

export default api;
