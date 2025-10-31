// app/verify/[recordID]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { verifyRecord, getAuditTrail } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function VerifyRecordPage() {
  const params = useParams();
  const router = useRouter();
  const recordID = params.recordID;

  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [auditTrail, setAuditTrail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!recordID) return;

      try {
        setLoading(true);

        // Fetch verification
        const verifyData = await verifyRecord(recordID);
        setVerification(verifyData.verification);

        // Fetch audit trail
        try {
          const auditData = await getAuditTrail(recordID);
          setAuditTrail(auditData);
        } catch (err) {
          console.log('Audit trail not available:', err);
        }

        setError(null);
      } catch (err) {
        console.error('Error verifying record:', err);
        setError(err.message || 'Failed to verify record');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [recordID]);

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </button>
        <div className='card border-2 border-red-200 bg-red-50'>
          <div className='flex items-center gap-2 text-red-800'>
            <XCircle className='h-5 w-5' />
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <p>No verification data available</p>
      </div>
    );
  }

  const isVerified =
    verification.dataMatch && verification.integrity === 'VERIFIED';

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 hover:underline'
      >
        <ArrowLeft className='h-4 w-4' />
        Back to Records
      </button>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
          <Shield className='h-8 w-8 text-primary' />
          Data Integrity Verification
        </h1>
        <p className='text-gray-600 mt-2 font-mono text-sm break-all'>
          {recordID}
        </p>
      </div>

      {/* Verification Status Card */}
      <div
        className={`card border-2 mb-6 ${
          isVerified
            ? 'border-green-300 bg-green-50'
            : 'border-red-300 bg-red-50'
        }`}
      >
        <div className='flex items-start gap-4'>
          {isVerified ? (
            <CheckCircle className='h-12 w-12 text-green-600 flex-shrink-0' />
          ) : (
            <XCircle className='h-12 w-12 text-red-600 flex-shrink-0' />
          )}

          <div className='flex-1'>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isVerified ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {isVerified ? '✓ Data Verified' : '✗ Verification Failed'}
            </h2>
            <p className={`${isVerified ? 'text-green-800' : 'text-red-800'}`}>
              {isVerified
                ? 'This record has been cryptographically verified. The data in MongoDB matches the immutable record on the blockchain.'
                : 'Data mismatch detected between MongoDB and blockchain. This record may have been tampered with.'}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Details */}
      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        {/* MongoDB Data */}
        <div className='card'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <span className='text-blue-600'>📊</span>
            MongoDB Record
          </h3>
          {verification.mongoData ? (
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Patient ID:</span>
                <span className='font-mono'>
                  {verification.mongoData.patientID}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Heart Rate:</span>
                <span className='font-semibold'>
                  {verification.mongoData.heartRate} BPM
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Rhythm:</span>
                <span>{verification.mongoData.rhythm}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Timestamp:</span>
                <span className='text-xs'>
                  {verification.mongoData.timestamp}
                </span>
              </div>
            </div>
          ) : (
            <p className='text-gray-500'>No MongoDB data</p>
          )}
        </div>

        {/* Blockchain Data */}
        <div className='card'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
            <Shield className='h-5 w-5 text-green-600' />
            Blockchain Record
          </h3>
          {verification.blockchainData ? (
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Patient ID:</span>
                <span className='font-mono'>
                  {verification.blockchainData.patientID}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Heart Rate:</span>
                <span className='font-semibold'>
                  {verification.blockchainData.heartRate} BPM
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Rhythm:</span>
                <span>{verification.blockchainData.rhythm}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Stored At:</span>
                <span className='text-xs'>
                  {verification.blockchainData.storedAt}
                </span>
              </div>
            </div>
          ) : (
            <p className='text-gray-500'>No blockchain data</p>
          )}
        </div>
      </div>

      {/* Audit Trail */}
      {auditTrail &&
        auditTrail.auditTrail &&
        auditTrail.auditTrail.length > 0 && (
          <div className='card'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Clock className='h-5 w-5 text-primary' />
              Blockchain Audit Trail
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Complete transaction history from the blockchain. This record has{' '}
              {auditTrail.transactionCount} transaction(s).
            </p>

            <div className='space-y-4'>
              {auditTrail.auditTrail.map((tx, index) => (
                <div
                  key={tx.txId || index}
                  className='border-l-4 border-green-500 pl-4 py-2 bg-gray-50 rounded'
                >
                  <div className='flex items-center gap-2 mb-2'>
                    <CheckCircle className='h-4 w-4 text-green-600' />
                    <span className='text-sm font-semibold'>
                      Transaction #{index + 1}
                    </span>
                  </div>
                  <div className='text-xs space-y-1 text-gray-600'>
                    <p>
                      <span className='font-medium'>TX ID:</span>{' '}
                      <span className='font-mono break-all'>{tx.txId}</span>
                    </p>
                    <p>
                      <span className='font-medium'>Timestamp:</span>{' '}
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <span className='font-medium'>Action:</span>{' '}
                      {tx.isDelete ? 'Deleted' : 'Created'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Info Box */}
      <div className='card border-2 border-blue-200 bg-blue-50 mt-6'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5' />
          <div className='text-sm text-blue-900'>
            <p className='font-semibold mb-1'>What does verification mean?</p>
            <p>
              This verification compares the data stored in our MongoDB database
              with the immutable record on the Hyperledger Fabric blockchain. If
              both match, it proves the data hasn&apos;t been tampered with
              since it was originally recorded by the ESP32 device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
