'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import api from './api';

const PatientContext = createContext(null);

const FALLBACK_PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001';
const LOCAL_STORAGE_KEY = 'activePatientID';

export function PatientProvider({ children }) {
  const [patientID, setPatientID] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get('/session/current');
      const id = res.data?.patientID || FALLBACK_PATIENT_ID;
      setPatientID(id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, id);
      }
    } catch (err) {
      // Backend unreachable — fall back to whatever was last known locally,
      // so the dashboard doesn't break if the API blips.
      console.error('Failed to fetch active patient session:', err);
      const cached =
        typeof window !== 'undefined'
          ? localStorage.getItem(LOCAL_STORAGE_KEY)
          : null;
      setPatientID(cached || FALLBACK_PATIENT_ID);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Re-check periodically in case the session was changed from another tab/device.
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Call this to start tracking a new patient. Updates the backend's active
  // session (which the ESP32 polls) AND this app's state immediately.
  const startNewPatient = useCallback(async (newID) => {
    const res = await api.post('/session/start', { patientID: newID });
    const id = res.data?.patientID || newID;
    setPatientID(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, id);
    }
    return res.data;
  }, []);

  return (
    <PatientContext.Provider
      value={{ patientID, loading, startNewPatient, refresh }}
    >
      {children}
    </PatientContext.Provider>
  );
}

// Use this in any page/component instead of the old hardcoded
// `const PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001'`.
export function usePatient() {
  const ctx = useContext(PatientContext);
  if (!ctx) {
    throw new Error('usePatient() must be used inside <PatientProvider>');
  }
  return ctx;
}
