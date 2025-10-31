// app/records/page.js (UPDATED)
'use client';

import { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Activity, Shield } from 'lucide-react';
import { getPatientRecords } from '@/lib/api';
import BlockchainBadge from '@/components/BlockchainBadge'; // 🆕 NEW
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { formatDate, getRhythmColor } from '@/lib/utils';
import Link from 'next/link'; // 🆕 NEW

const PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getPatientRecords(PATIENT_ID, 50);
      setRecords(data.records || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    const interval = setInterval(() => fetchRecords(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <ErrorMessage message={error} onRetry={() => fetchRecords()} />
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <BarChart3 className='h-8 w-8 text-primary' />
            Records History
          </h1>
          <p className='text-gray-600 mt-2'>
            {records.length} record{records.length !== 1 ? 's' : ''} for patient{' '}
            {PATIENT_ID}
          </p>
        </div>

        <button
          onClick={() => fetchRecords(true)}
          disabled={refreshing}
          className='btn-primary flex items-center gap-2'
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {records.length === 0 ? (
        <div className='card border-2 border-yellow-200 bg-yellow-50'>
          <p className='text-yellow-800 text-center'>
            No records available yet. Waiting for ESP32 data...
          </p>
        </div>
      ) : (
        <div className='card overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Timestamp
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Heart Rate
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Rhythm
                  </th>
                  {/* 🆕 NEW COLUMN */}
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Blockchain
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {records.map((record) => (
                  <tr key={record.recordID} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatDate(record.timestamp)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-2'>
                        <Activity className='h-4 w-4 text-primary' />
                        <span className='text-sm font-medium text-gray-900'>
                          {record.heartRate} BPM
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`text-sm font-medium ${getRhythmColor(
                          record.rhythm
                        )}`}
                      >
                        {record.rhythm}
                      </span>
                    </td>
                    {/* 🆕 NEW CELL */}
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <BlockchainBadge
                        status={
                          record.blockchainHash === 'stored' ? 'stored' : 'none'
                        }
                      />
                    </td>
                    {/* 🆕 NEW CELL */}
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <Link
                        href={`/verify/${record.recordID}`}
                        className='text-primary hover:text-primary-dark flex items-center gap-1'
                      >
                        <Shield className='h-4 w-4' />
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
