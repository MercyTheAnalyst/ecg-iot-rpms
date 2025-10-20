'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';

const MAX_DATA_POINTS = 400; // 2 seconds at 200Hz
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://192.168.1.6:3001/ws';
const PATIENT_ID = process.env.NEXT_PUBLIC_PATIENT_ID || 'PT001';

export default function RealTimeECGChart() {
  const [ecgData, setEcgData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentHR, setCurrentHR] = useState(0);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('✓ WebSocket connected');
          setIsConnected(true);

          // Send handshake
          ws.send(
            JSON.stringify({
              type: 'connect',
              patientID: PATIENT_ID,
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle real-time ECG stream
            if (data.type === 'stream') {
              setEcgData((prev) => {
                const newData = [...prev, data.value];
                // Keep only last MAX_DATA_POINTS
                if (newData.length > MAX_DATA_POINTS) {
                  return newData.slice(-MAX_DATA_POINTS);
                }
                return newData;
              });

              if (data.hr) {
                setCurrentHR(data.hr);
              }
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          console.log('❌ WebSocket disconnected');
          setIsConnected(false);

          // Reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };
      } catch (err) {
        console.error('Failed to connect WebSocket:', err);
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Draw ECG waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ecgData.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid (like ECG paper)
    ctx.strokeStyle = '#1a3a1a';
    ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw ECG waveform
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const xStep = width / MAX_DATA_POINTS;
    const yScale = height / 4096; // ESP32 ADC range

    ecgData.forEach((value, index) => {
      const x = index * xStep;
      const y = height - value * yScale; // Invert Y axis

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [ecgData]);

  return (
    <div className='card'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Activity className='h-5 w-5 text-primary' />
          <h3 className='text-lg font-semibold'>Live ECG Waveform</h3>
        </div>

        <div className='flex items-center gap-4'>
          {/* Heart Rate Display */}
          <div className='text-right'>
            <div className='text-2xl font-bold text-primary'>
              {currentHR > 0 ? currentHR : '--'}
            </div>
            <div className='text-xs text-gray-500'>BPM</div>
          </div>

          {/* Connection Status */}
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
              isConnected
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isConnected ? (
              <>
                <Wifi className='h-4 w-4' />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff className='h-4 w-4' />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Canvas for ECG waveform */}
      <div className='bg-black rounded-lg border-2 border-gray-700 overflow-hidden'>
        <canvas
          ref={canvasRef}
          width={1200}
          height={300}
          className='w-full'
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>

      <div className='mt-2 text-xs text-gray-500 text-center'>
        {isConnected ? (
          <span>Real-time ECG streaming from ESP32</span>
        ) : (
          <span>Waiting for connection... Make sure ESP32 is powered on</span>
        )}
      </div>
    </div>
  );
}
