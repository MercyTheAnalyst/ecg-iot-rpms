// app/blockchain/page.js (NEW FILE)
'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Server, Clock, TrendingUp } from 'lucide-react';
import { getSystemHealth, getBlockchainRecords } from '@/lib/api';
import BlockchainBadge from '@/components/BlockchainBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

const PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001';

export default function BlockchainPage() {
  const [health, setHealth] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [healthData, blockchainData] = await Promise.all([
          getSystemHealth(),
          getBlockchainRecords(PATIENT_ID),
        ]);

        setHealth(healthData);
        setRecords(blockchainData.records || []);
      } catch (err) {
        console.error('Error fetching blockchain data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const isBlockchainConnected = health?.blockchain === 'connected';

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
          <Shield className='h-8 w-8 text-primary' />
          Blockchain Integration
        </h1>
        <p className='text-gray-600 mt-2'>
          Immutable data storage powered by Hyperledger Fabric
        </p>
      </div>

      {/* System Status */}
      <div className='grid md:grid-cols-3 gap-6 mb-8'>
        <div className='card'>
          <div className='flex items-center gap-3 mb-2'>
            <Shield
              className={`h-8 w-8 ${
                isBlockchainConnected ? 'text-green-600' : 'text-red-600'
              }`}
            />
            <div>
              <h3 className='font-semibold'>Blockchain</h3>
              <p
                className={`text-sm ${
                  isBlockchainConnected ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isBlockchainConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center gap-3 mb-2'>
            <Server
              className={`h-8 w-8 ${
                health?.mongodb === 'connected'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            />
            <div>
              <h3 className='font-semibold'>MongoDB</h3>
              <p
                className={`text-sm ${
                  health?.mongodb === 'connected'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {health?.mongodb === 'connected' ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center gap-3 mb-2'>
            <TrendingUp className='h-8 w-8 text-blue-600' />
            <div>
              <h3 className='font-semibold'>Blockchain Records</h3>
              <p className='text-sm text-gray-600'>{records.length} records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className='grid md:grid-cols-2 gap-6 mb-8'>
        <div className='card border-2 border-green-200 bg-green-50'>
          <h3 className='font-semibold text-green-900 mb-3 flex items-center gap-2'>
            <CheckCircle className='h-5 w-5' />
            How Blockchain Protects Your Data
          </h3>
          <ul className='space-y-2 text-sm text-green-800'>
            <li>
              • <strong>Immutable:</strong> Records cannot be altered or deleted
            </li>
            <li>
              • <strong>Transparent:</strong> Complete audit trail of all
              changes
            </li>
            <li>
              • <strong>Decentralized:</strong> No single point of failure
            </li>
            <li>
              • <strong>Verified:</strong> Cryptographic proof of authenticity
            </li>
          </ul>
        </div>

        <div className='card border-2 border-blue-200 bg-blue-50'>
          <h3 className='font-semibold text-blue-900 mb-3 flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            Data Flow
          </h3>
          <div className='space-y-2 text-sm text-blue-800'>
            <p>1. ESP32 sends ECG data → Server</p>
            <p>2. Server stores in MongoDB (fast)</p>
            <p>3. Server stores on Blockchain (immutable)</p>
            <p>4. You can verify data integrity anytime</p>
          </div>
        </div>
      </div>

      {/* Recent Blockchain Records */}
      <div className='card'>
        <h2 className='text-xl font-semibold mb-4'>
          Recent Blockchain Records
        </h2>
        {records.length === 0 ? (
          <p className='text-gray-600 text-center py-8'>
            No blockchain records yet
          </p>
        ) : (
          <div className='space-y-3'>
            {records.slice(0, 10).map((record) => (
              <div
                key={record.recordID}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border'
              >
                <div>
                  <p className='font-mono text-sm text-gray-600'>
                    {record.recordID}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {new Date(record.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-right'>
                    <p className='font-semibold'>{record.heartRate} BPM</p>
                    <p className='text-xs text-gray-600'>{record.rhythm}</p>
                  </div>
                  <Link
                    href={`/verify/${record.recordID}`}
                    className='btn-primary text-sm'
                  >
                    Verify
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
