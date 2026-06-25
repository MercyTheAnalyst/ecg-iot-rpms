'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, RefreshCw, Play } from 'lucide-react';
import { getCaptures, triggerCapture } from '@/lib/api';
import { usePatient } from '@/lib/PatientContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { formatDate, getRhythmColor } from '@/lib/utils';

// Renders one field's stat row (min/max/mean/range/SD/SE) — same shape as
// the workbook's STATISTICS block.
function StatRow({ label, stat }) {
  if (!stat) return null;
  return (
    <tr className='text-xs text-gray-600'>
      <td className='px-3 py-1 font-medium text-gray-700'>{label}</td>
      <td className='px-3 py-1'>{stat.min}</td>
      <td className='px-3 py-1'>{stat.max}</td>
      <td className='px-3 py-1 font-semibold text-gray-900'>{stat.mean}</td>
      <td className='px-3 py-1'>{stat.range}</td>
      <td className='px-3 py-1'>{stat.sd}</td>
      <td className='px-3 py-1'>{stat.se}</td>
    </tr>
  );
}

function CaptureCard({ capture }) {
  return (
    <div className='card mb-6'>
      <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
        <div>
          <p className='text-sm text-gray-500'>
            {formatDate(capture.recordedAt)}
          </p>
          <p className='text-xs text-gray-400'>
            Gain: {capture.gain} V/V &nbsp;•&nbsp; Vref: {capture.vref} V
          </p>
        </div>
        <span className='text-xs bg-primary text-white px-2 py-1 rounded'>
          n = {capture.readings?.length || 0} readings
        </span>
      </div>

      {/* Raw 10-reading table */}
      <div className='overflow-x-auto mb-4'>
        <table className='min-w-full text-sm'>
          <thead>
            <tr className='text-xs text-gray-500 uppercase'>
              <th className='px-3 py-2 text-left'>#</th>
              <th className='px-3 py-2 text-left'>HR (BPM)</th>
              <th className='px-3 py-2 text-left'>Rhythm</th>
              <th className='px-3 py-2 text-left'>Rpk_out (mV)</th>
              <th className='px-3 py-2 text-left'>Rpk_in (mV)</th>
              <th className='px-3 py-2 text-left'>P2P_out (mV)</th>
              <th className='px-3 py-2 text-left'>P2P_in (mV)</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {capture.readings.map((r, i) => (
              <tr key={i}>
                <td className='px-3 py-1'>{i + 1}</td>
                <td className='px-3 py-1 font-medium'>{r.hr?.toFixed(1)}</td>
                <td className={`px-3 py-1 ${getRhythmColor(r.rhythm)}`}>
                  {r.rhythm}
                </td>
                <td className='px-3 py-1'>{r.rpkOutMv?.toFixed(1)}</td>
                <td className='px-3 py-1'>{r.rpkInMv?.toFixed(3)}</td>
                <td className='px-3 py-1'>{r.p2pOutMv?.toFixed(1)}</td>
                <td className='px-3 py-1'>{r.p2pInMv?.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Server-computed statistics — same definitions as the trial workbook */}
      <div className='overflow-x-auto border-t pt-3'>
        <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>
          Statistics (SD uses n-1)
        </p>
        <table className='min-w-full text-xs'>
          <thead>
            <tr className='text-gray-400'>
              <th className='px-3 py-1 text-left'>Field</th>
              <th className='px-3 py-1 text-left'>Min</th>
              <th className='px-3 py-1 text-left'>Max</th>
              <th className='px-3 py-1 text-left'>Mean</th>
              <th className='px-3 py-1 text-left'>Range</th>
              <th className='px-3 py-1 text-left'>SD</th>
              <th className='px-3 py-1 text-left'>SE</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            <StatRow label='HR (BPM)' stat={capture.stats?.hr} />
            <StatRow label='Rpk_out (mV)' stat={capture.stats?.rpkOutMv} />
            <StatRow label='Rpk_in (mV)' stat={capture.stats?.rpkInMv} />
            <StatRow label='P2P_out (mV)' stat={capture.stats?.p2pOutMv} />
            <StatRow label='P2P_in (mV)' stat={capture.stats?.p2pInMv} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CapturesPage() {
  const { patientID, loading: patientLoading } = usePatient();

  const [captures, setCaptures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const [pending, setPending] = useState(false);
  const [triggerError, setTriggerError] = useState(null);

  const fetchCaptures = async (isRefresh = false) => {
    if (!patientID) return;
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getCaptures(patientID, 20);
      const newCaptures = data.captures || [];
      setCaptures((prev) => {
        // If we were waiting on a triggered capture and a new one just
        // appeared, the device finished — clear the pending state.
        if (pending && newCaptures.length > prev.length) {
          setPending(false);
        }
        return newCaptures;
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching captures:', err);
      setError('Failed to load captures');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTriggerCapture = async () => {
    setTriggering(true);
    setTriggerError(null);
    try {
      await triggerCapture();
      setPending(true);
    } catch (err) {
      console.error('Failed to trigger capture:', err);
      setTriggerError(
        err?.response?.data?.message ||
          'Failed to start capture — is a patient session active?',
      );
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    if (patientLoading) return;
    fetchCaptures();
    // Poll faster (5s) while waiting on a triggered capture so it appears
    // promptly; back off to the normal 15s cadence otherwise.
    const interval = setInterval(
      () => fetchCaptures(true),
      pending ? 5000 : 15000,
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientID, patientLoading, pending]);

  if (loading || patientLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <ErrorMessage message={error} onRetry={() => fetchCaptures()} />
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-4 flex-wrap gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <ClipboardList className='h-8 w-8 text-primary' />
            10-Reading Captures
          </h1>
          <p className='text-gray-600 mt-2'>
            {captures.length} capture{captures.length !== 1 ? 's' : ''} for
            patient {patientID}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={handleTriggerCapture}
            disabled={triggering || pending}
            className='btn-primary flex items-center gap-2 disabled:opacity-60'
            title="Equivalent to pressing 'c' in the device's serial monitor"
          >
            <Play className='h-4 w-4' />
            {pending
              ? 'Capturing…'
              : triggering
                ? 'Requesting…'
                : 'Start Capture'}
          </button>
          <button
            onClick={() => fetchCaptures(true)}
            disabled={refreshing}
            className='btn-primary flex items-center gap-2'
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {triggerError && (
        <div className='card border-2 border-red-200 bg-red-50 mb-6'>
          <p className='text-red-800 text-sm'>{triggerError}</p>
        </div>
      )}

      {pending && (
        <div className='card border-2 border-blue-200 bg-blue-50 mb-6'>
          <p className='text-blue-800 text-sm'>
            Capture requested — the device will pick this up within a few
            seconds. Keep the patient still and contact firm. This page will
            update automatically once the 10 readings are recorded (typically
            ~30-60s).
          </p>
        </div>
      )}

      {captures.length === 0 ? (
        <div className='card border-2 border-yellow-200 bg-yellow-50'>
          <p className='text-yellow-800 text-center'>
            No captures yet for this patient. Click{' '}
            <strong>Start Capture</strong> above, or type <code>c</code> in the
            device&apos;s serial monitor once it&apos;s calibrated and reading
            steadily.
          </p>
        </div>
      ) : (
        captures.map((capture) => (
          <CaptureCard key={capture._id} capture={capture} />
        ))
      )}
    </div>
  );
}
