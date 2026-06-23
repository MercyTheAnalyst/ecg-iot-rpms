'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Activity,
  Bell,
  BarChart3,
  Shield,
  Info,
  ClipboardList,
} from 'lucide-react';
import PatientSelector from './PatientSelector';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path
      ? 'bg-primary text-white'
      : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <nav className='bg-white shadow-lg border-b-4 border-primary'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex items-center'>
            <Heart className='h-8 w-8 text-primary mr-2' />
            <span className='text-xl font-bold text-gray-900'>ECG Monitor</span>
            {/* FIX: was a hardcoded "PT001" span. Now shows whichever patient
                is currently active, and lets staff start a new session. */}
            <span className='ml-3'>
              <PatientSelector />
            </span>
          </div>

          <div className='flex space-x-2 items-center'>
            <Link
              href='/'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/',
              )}`}
            >
              <Activity className='h-5 w-5' />
              <span className='hidden sm:inline'>Dashboard</span>
            </Link>

            <Link
              href='/alerts'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/alerts',
              )}`}
            >
              <Bell className='h-5 w-5' />
              <span className='hidden sm:inline'>Alerts</span>
            </Link>

            <Link
              href='/records'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/records',
              )}`}
            >
              <BarChart3 className='h-5 w-5' />
              <span className='hidden sm:inline'>Records</span>
            </Link>

            <Link
              href='/captures'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/captures',
              )}`}
            >
              <ClipboardList className='h-5 w-5' />
              <span className='hidden sm:inline'>Captures</span>
            </Link>

            <Link
              href='/blockchain'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/blockchain',
              )}`}
            >
              <Shield className='h-5 w-5' />
              <span className='hidden sm:inline'>Blockchain</span>
            </Link>
            <Link
              href='/about'
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${isActive(
                '/about',
              )}`}
            >
              <Info className='h-5 w-5' />
              <span className='hidden sm:inline'>About</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
