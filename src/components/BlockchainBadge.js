// components/BlockchainBadge.jsx
'use client';

import { Shield, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

export default function BlockchainBadge({ status, timestamp, size = 'sm' }) {
  // status: 'stored', 'pending', 'failed', null

  const configs = {
    stored: {
      icon: ShieldCheck,
      text: 'On Blockchain',
      className: 'bg-green-100 text-green-700 border-green-300',
      title: 'Data immutably stored on blockchain',
    },
    pending: {
      icon: Clock,
      text: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      title: 'Blockchain write in progress',
    },
    failed: {
      icon: ShieldAlert,
      text: 'Not on Chain',
      className: 'bg-red-100 text-red-700 border-red-300',
      title: 'Blockchain storage failed',
    },
    none: {
      icon: Shield,
      text: 'MongoDB Only',
      className: 'bg-gray-100 text-gray-600 border-gray-300',
      title: 'Not stored on blockchain',
    },
  };

  const config = configs[status] || configs.none;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.className} ${sizeClasses[size]}`}
      title={config.title}
    >
      <Icon className='h-3.5 w-3.5' />
      <span className='font-medium'>{config.text}</span>
    </div>
  );
}
