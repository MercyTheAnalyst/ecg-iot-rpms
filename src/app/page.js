'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import { getPatientDashboard, getPatientRecords } from '@/lib/api';
import StatCard from '@/components/StatCard';
import AlertBadge from '@/components/AlertBadge';
import RealTimeECGChart from '@/components/RealtimeECGChart';
import ECGIntervalsCard from '@/components/ECGIntervalsCard';
import ECGChart from '@/components/ECGChart';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { formatDate, getRhythmColor } from '@/lib/utils';
import BlockchainBadge from '@/components/BlockchainBadge';

const PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001';

export default function EnhancedDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [recentRecord, setRecentRecord] = useState(null);
  const [error, setError] = useState(null);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [dashboardData, recordsData] = await Promise.all([
        getPatientDashboard(PATIENT_ID),
        getPatientRecords(PATIENT_ID, 1),
      ]);

      setDashboard(dashboardData);
      if (recordsData.records && recordsData.records.length > 0) {
        setRecentRecord(recordsData.records[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDashboard(true), 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <ErrorMessage message={error} onRetry={() => fetchDashboard()} />
      </div>
    );
  }

  if (!dashboard || !dashboard.currentData) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='card border-2 border-yellow-200 bg-yellow-50'>
          <p className='text-yellow-800'>
            No data available for patient {PATIENT_ID}. Waiting for ESP32 to
            send data...
          </p>
        </div>
      </div>
    );
  }

  const { currentData, statistics, recentAlerts } = dashboard;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8 flex items-start justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Enhanced Patient Dashboard
          </h1>
          <p className='text-gray-600 mt-2'>Patient ID: {PATIENT_ID}</p>
          <p className='text-sm text-gray-500 mt-1'>
            Last updated: {formatDate(currentData.timestamp)}
          </p>

          <div className='mt-2'>
            <BlockchainBadge
              status={currentData.blockchainStored ? 'stored' : 'pending'}
              size='md'
            />
          </div>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className='btn-primary flex items-center gap-2'
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Current Heart Rate'
          value={`${currentData.heartRate} BPM`}
          icon={Heart}
          subtitle={
            <span className={getRhythmColor(currentData.rhythm)}>
              {currentData.rhythm}
            </span>
          }
        />

        <StatCard
          title='Average Heart Rate'
          value={`${statistics.averageHeartRate} BPM`}
          icon={Activity}
        />

        <StatCard
          title='Min / Max HR'
          value={`${statistics.minHeartRate} / ${statistics.maxHeartRate}`}
          icon={TrendingUp}
          subtitle='BPM'
        />

        <StatCard
          title='Total Records'
          value={statistics.totalRecords}
          icon={Clock}
        />
      </div>

      {/* LIVE ECG WAVEFORM (Real-time via WebSocket) */}
      <div className='mb-8'>
        <RealTimeECGChart />
      </div>

      {/* ECG Intervals & Rhythm Analysis */}
      {(currentData.intervals || currentData.rhythmAnalysis) && (
        <div className='mb-8'>
          <ECGIntervalsCard
            intervals={currentData.intervals}
            rhythmAnalysis={currentData.rhythmAnalysis}
          />
        </div>
      )}

      {/* Historical ECG Waveform (from last stored record) */}
      {recentRecord &&
        recentRecord.ecgSamples &&
        recentRecord.ecgSamples.length > 0 && (
          <div className='mb-8'>
            <ECGChart
              data={recentRecord.ecgSamples}
              title='Historical ECG Waveform (Last Saved Record)'
            />
          </div>
        )}

      {/* Rhythm Distribution */}
      {statistics.rhythmDistribution &&
        Object.keys(statistics.rhythmDistribution).length > 0 && (
          <div className='card mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Rhythm Distribution</h2>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {Object.entries(statistics.rhythmDistribution).map(
                ([rhythm, count]) => (
                  <div
                    key={rhythm}
                    className='text-center p-4 bg-gray-50 rounded-lg border border-gray-200'
                  >
                    <p className='text-3xl font-bold text-gray-900'>{count}</p>
                    <p className={`text-sm mt-1 ${getRhythmColor(rhythm)}`}>
                      {rhythm}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Recent Alerts */}
      {recentAlerts && recentAlerts.length > 0 && (
        <div className='card'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Recent Alerts</h2>
            <span className='text-sm text-gray-500'>
              {recentAlerts.length} alert{recentAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className='space-y-3'>
            {recentAlerts.map((alert, index) => (
              <AlertBadge key={alert._id || index} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {recentAlerts && recentAlerts.length === 0 && (
        <div className='card border-2 border-green-200 bg-green-50'>
          <p className='text-green-800 text-center'>
            ✓ No alerts - All vitals within normal range
          </p>
        </div>
      )}
    </div>
  );
}
