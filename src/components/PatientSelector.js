'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { usePatient } from '@/lib/PatientContext';

export default function PatientSelector() {
  const { patientID, loading, startNewPatient } = usePatient();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setSaving(true);
    setErrorMsg('');
    try {
      await startNewPatient(trimmed);
      setEditing(false);
      setInput('');
    } catch (err) {
      console.error('Failed to start new patient session:', err);
      setErrorMsg('Failed to start session');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className='flex items-center gap-2'>
      <span
        className='text-xs bg-primary text-white px-2 py-1 rounded font-mono'
        title='Currently active patient — readings from the device are tagged with this ID'
      >
        {patientID}
      </span>

      {editing ? (
        <div className='flex items-center gap-1'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder='New patient ID'
            className='text-xs border rounded px-2 py-1 w-28'
            autoFocus
          />
          <button
            onClick={handleStart}
            disabled={saving}
            className='text-xs bg-primary text-white px-2 py-1 rounded disabled:opacity-50'
          >
            {saving ? '...' : 'Start'}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setErrorMsg('');
            }}
            className='text-xs text-gray-500 px-1'
          >
            Cancel
          </button>
          {errorMsg && (
            <span className='text-xs text-red-600 ml-1'>{errorMsg}</span>
          )}
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          title='Start a new patient session'
          className='text-gray-500 hover:text-primary'
        >
          <UserPlus className='h-4 w-4' />
        </button>
      )}
    </div>
  );
}
