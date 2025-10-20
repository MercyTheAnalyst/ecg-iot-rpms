'use client';

import { Clock, Activity, Heart, TrendingUp } from 'lucide-react';

export default function ECGIntervalsCard({ intervals, rhythmAnalysis }) {
  // Helper function to check if interval is abnormal
  const isAbnormal = (value, min, max) => {
    if (!value) return false;
    return value < min || value > max;
  };

  const getIntervalColor = (value, min, max) => {
    if (!value) return 'text-gray-400';
    if (isAbnormal(value, min, max)) return 'text-red-600';
    return 'text-green-600';
  };

  const intervals_data = intervals || {};
  const rhythm = rhythmAnalysis || {};

  return (
    <div className='card'>
      <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
        <Clock className='h-5 w-5 text-primary' />
        ECG Intervals & Rhythm Analysis
      </h3>

      {/* Intervals Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        {/* PR Interval */}
        <div className='text-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-xs text-gray-500 mb-1'>PR Interval</div>
          <div
            className={`text-2xl font-bold ${getIntervalColor(
              intervals_data.PR,
              120,
              200
            )}`}
          >
            {intervals_data.PR || '--'}
            {intervals_data.PR && <span className='text-sm ml-1'>ms</span>}
          </div>
          <div className='text-xs text-gray-400 mt-1'>Normal: 120-200ms</div>
          {isAbnormal(intervals_data.PR, 120, 200) && (
            <div className='text-xs text-red-500 mt-1 font-medium'>
              {intervals_data.PR < 120 ? 'Short PR' : 'Long PR'}
            </div>
          )}
        </div>

        {/* QRS Duration */}
        <div className='text-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-xs text-gray-500 mb-1'>QRS Duration</div>
          <div
            className={`text-2xl font-bold ${getIntervalColor(
              intervals_data.QRS,
              80,
              120
            )}`}
          >
            {intervals_data.QRS || '--'}
            {intervals_data.QRS && <span className='text-sm ml-1'>ms</span>}
          </div>
          <div className='text-xs text-gray-400 mt-1'>Normal: 80-120ms</div>
          {isAbnormal(intervals_data.QRS, 80, 120) && (
            <div className='text-xs text-red-500 mt-1 font-medium'>
              Wide QRS
            </div>
          )}
        </div>

        {/* QT Interval */}
        <div className='text-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-xs text-gray-500 mb-1'>QT Interval</div>
          <div
            className={`text-2xl font-bold ${getIntervalColor(
              intervals_data.QT,
              350,
              440
            )}`}
          >
            {intervals_data.QT || '--'}
            {intervals_data.QT && <span className='text-sm ml-1'>ms</span>}
          </div>
          <div className='text-xs text-gray-400 mt-1'>Normal: 350-440ms</div>
          {isAbnormal(intervals_data.QT, 350, 440) && (
            <div className='text-xs text-red-500 mt-1 font-medium'>
              {intervals_data.QT < 350 ? 'Short QT' : 'Long QT'}
            </div>
          )}
        </div>

        {/* RR Interval */}
        <div className='text-center p-4 bg-gray-50 rounded-lg border border-gray-200'>
          <div className='text-xs text-gray-500 mb-1'>RR Interval</div>
          <div
            className={`text-2xl font-bold ${getIntervalColor(
              intervals_data.RR,
              600,
              1000
            )}`}
          >
            {intervals_data.RR || '--'}
            {intervals_data.RR && <span className='text-sm ml-1'>ms</span>}
          </div>
          <div className='text-xs text-gray-400 mt-1'>Normal: 600-1000ms</div>
          {intervals_data.RR && (
            <div className='text-xs text-blue-500 mt-1'>
              ({Math.round(60000 / intervals_data.RR)} BPM)
            </div>
          )}
        </div>
      </div>

      {/* Rhythm Analysis */}
      {rhythm.type && (
        <div className='border-t pt-4'>
          <h4 className='text-sm font-semibold mb-3 flex items-center gap-2'>
            <Activity className='h-4 w-4' />
            Rhythm Analysis
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Rhythm Type */}
            <div className='flex items-center gap-3 p-3 bg-blue-50 rounded-lg'>
              <Heart className='h-5 w-5 text-blue-600' />
              <div>
                <div className='text-xs text-gray-600'>Rhythm Type</div>
                <div className='font-semibold text-blue-900'>{rhythm.type}</div>
              </div>
            </div>

            {/* Regularity */}
            <div className='flex items-center gap-3 p-3 bg-purple-50 rounded-lg'>
              <TrendingUp className='h-5 w-5 text-purple-600' />
              <div>
                <div className='text-xs text-gray-600'>Regularity</div>
                <div
                  className={`font-semibold ${
                    rhythm.isRegular ? 'text-green-700' : 'text-orange-700'
                  }`}
                >
                  {rhythm.isRegular ? 'Regular' : 'Irregular'}
                </div>
              </div>
            </div>

            {/* Variability */}
            <div className='flex items-center gap-3 p-3 bg-green-50 rounded-lg'>
              <Activity className='h-5 w-5 text-green-600' />
              <div>
                <div className='text-xs text-gray-600'>RR Variability</div>
                <div className='font-semibold text-green-900'>
                  {rhythm.variability
                    ? `${rhythm.variability.toFixed(1)}%`
                    : '--'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Interpretation */}
      {(intervals_data.PR || intervals_data.QRS || intervals_data.QT) && (
        <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
          <div className='text-sm font-medium text-yellow-900 mb-2'>
            📋 Clinical Notes:
          </div>
          <ul className='text-xs text-yellow-800 space-y-1'>
            {isAbnormal(intervals_data.QRS, 80, 120) && (
              <li>
                • Wide QRS complex may indicate bundle branch block or
                ventricular origin
              </li>
            )}
            {isAbnormal(intervals_data.QT, 350, 440) &&
              intervals_data.QT > 440 && (
                <li>
                  • Prolonged QT interval increases risk of torsades de pointes
                  arrhythmia
                </li>
              )}
            {isAbnormal(intervals_data.PR, 120, 200) &&
              intervals_data.PR > 200 && (
                <li>
                  • First-degree AV block present (PR interval &gt; 200ms)
                </li>
              )}
            {rhythm.type === 'Irregular' && (
              <li>
                • Irregular rhythm detected - consider atrial fibrillation or
                premature beats
              </li>
            )}
            {!isAbnormal(intervals_data.PR, 120, 200) &&
              !isAbnormal(intervals_data.QRS, 80, 120) &&
              !isAbnormal(intervals_data.QT, 350, 440) &&
              rhythm.isRegular && (
                <li className='text-green-700'>
                  ✓ All intervals within normal limits
                </li>
              )}
          </ul>
        </div>
      )}

      {/* No Data Message */}
      {!intervals_data.PR &&
        !intervals_data.QRS &&
        !intervals_data.QT &&
        !rhythm.type && (
          <div className='text-center py-8 text-gray-400'>
            <Activity className='h-12 w-12 mx-auto mb-2 opacity-50' />
            <p>No interval data available yet</p>
            <p className='text-sm mt-1'>Waiting for ECG measurements...</p>
          </div>
        )}
    </div>
  );
}
