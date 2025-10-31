import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ECG Cardiovascular Monitoring System',
  description: 'Remote patient monitoring dashboard for ECG data',
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navbar />
        <main className='min-h-screen'>{children}</main>
        <footer className='bg-white border-t mt-12'>
          <div className='max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600'>
            <p>ECG Cardiovascular Monitoring System © {currentYear}</p>
            <p className='mt-1'>Remote Patient Monitoring v1.0</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
