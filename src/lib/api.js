import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://server.mercyoyebode.me/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Existing API functions
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
      params: { limit },
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

// ========================================
// 🆕 BLOCKCHAIN API FUNCTIONS
// ========================================

/**
 * Verify record integrity between MongoDB and Blockchain
 * @param {string} recordID - The record ID to verify
 * @returns {Promise<Object>} Verification result with dataMatch and integrity status
 */
export const verifyRecord = async (recordID) => {
  try {
    const response = await api.get(`/verify/${recordID}`);
    return response.data;
  } catch (error) {
    console.error('Failed to verify record:', error);
    throw error;
  }
};

/**
 * Get blockchain audit trail for a record
 * @param {string} recordID - The record ID to get audit trail for
 * @returns {Promise<Object>} Complete transaction history from blockchain
 */
export const getAuditTrail = async (recordID) => {
  try {
    const response = await api.get(`/audit/${recordID}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get audit trail:', error);
    throw error;
  }
};

/**
 * Query records directly from blockchain
 * @param {string} patientID - The patient ID to query
 * @returns {Promise<Object>} Records stored on blockchain
 */
export const getBlockchainRecords = async (patientID) => {
  try {
    const response = await api.get(`/blockchain/patient/${patientID}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get blockchain records:', error);
    throw error;
  }
};

/**
 * Get system health status (includes blockchain connection status)
 * Note: This is an alias for healthCheck() for consistency
 * @returns {Promise<Object>} System health including MongoDB, Blockchain, WebSocket
 */
export const getSystemHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Failed to get system health:', error);
    throw error;
  }
};

export default api;
