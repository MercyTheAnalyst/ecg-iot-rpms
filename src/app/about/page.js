'use client';

import {
  Heart,
  Shield,
  Wifi,
  Monitor,
  Cpu,
  Activity,
  Globe,
  BookOpen,
  Info,
} from 'lucide-react';

const phases = [
  {
    number: '01',
    icon: Cpu,
    title: 'Hardware Setup',
    description:
      'Built a compact wearable device using the AD8232 ECG sensor module and ESP32 microcontroller, capable of capturing ECG signals, Heart Rate (BPM), and Heart Rhythm Patterns with onboard OLED display feedback.',
  },
  {
    number: '02',
    icon: Activity,
    title: 'Firmware Development',
    description:
      'Developed custom firmware in the Arduino IDE with libraries for real-time ECG acquisition, signal processing, and wireless data transmission over Wi-Fi using HTTPClient and ArduinoJson.',
  },
  {
    number: '03',
    icon: Wifi,
    title: 'Backend Development',
    description:
      'Built a Node.js REST API using Express, CORS, and body-parser to bridge the IoT device, blockchain network, and web dashboard — deployed on AWS EC2 for reliable cloud hosting.',
  },
  {
    number: '04',
    icon: Shield,
    title: 'Blockchain Integration',
    description:
      'Integrated Hyperledger Fabric, a permissioned blockchain, to ensure tamper-proof storage and full traceability of all patient ECG records. Chaincode written in Go, containerised with Docker and Docker Compose.',
  },
  {
    number: '05',
    icon: Monitor,
    title: 'Web Dashboard',
    description:
      'Developed a real-time Next.js clinical dashboard providing live ECG waveform visualisation, heart rate monitoring, interval and rhythm analysis, automated anomaly alerts, and a live blockchain status indicator.',
  },
];

const techStack = [
  {
    label: 'Hardware',
    items: ['AD8232 ECG Sensor', 'ESP32 Microcontroller', 'OLED Display'],
  },
  { label: 'Firmware', items: ['Arduino IDE', 'HTTPClient', 'ArduinoJson'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'AWS EC2'] },
  {
    label: 'Blockchain',
    items: ['Hyperledger Fabric', 'Go Chaincode', 'Docker'],
  },
  { label: 'Frontend', items: ['Next.js', 'Tailwind CSS', 'Vercel'] },
];

export default function AboutPage() {
  return (
    <div className='max-w-7xl mx-auto px-4 py-12'>
      {/* Hero Section */}
      <div className='text-center mb-16'>
        <div className='inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
          <BookOpen className='h-4 w-4' />
          Master&apos;s Research Project turned Startup
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4 leading-tight'>
          Blockchain-Enabled IoT Framework for
          <br />
          <span className='text-primary'>Secure Remote ECG Monitoring</span>
        </h1>
        <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
          A validated research prototype combining wearable IoT hardware,
          real-time clinical dashboards, and permissioned blockchain technology
          to make cardiac monitoring accessible, secure, and continuous —
          particularly for low- and middle-income regions.
        </p>
      </div>

      {/* Abstract Card */}
      <div className='card border-l-4 border-primary mb-16 bg-blue-50'>
        <div className='flex items-start gap-3 mb-3'>
          <Info className='h-5 w-5 text-primary mt-0.5 shrink-0' />
          <h2 className='text-lg font-semibold text-gray-900'>
            Research Abstract
          </h2>
        </div>
        <div className='text-gray-700 space-y-3 text-sm leading-relaxed pl-8'>
          <p>
            <span className='font-semibold'>Background:</span> Traditional ECG
            machines operate as stand-alone, point-of-care devices that store
            data locally, limiting their ability to support real-time remote
            monitoring — especially for patients with intermittent arrhythmias.
          </p>
          <p>
            <span className='font-semibold'>Objective:</span> Remote Patient
            Monitoring Systems lack secure interoperability and tamper-proof
            management of ECG measurements. This project presents a
            blockchain-enabled IoT framework to address these gaps.
          </p>
          <p>
            <span className='font-semibold'>Results:</span> Experimental results
            revealed reliable readings with an average resting heart rate of 69
            BPM across 10 consecutive measurements. Patient data is stored and
            transmitted via Hyperledger Fabric blockchain for integrity and
            traceability.
          </p>
          <p>
            <span className='font-semibold'>Conclusion:</span> The system
            enhances accessibility and affordability of ECG monitoring, reduces
            hospital visits through continuous remote monitoring, and enables
            timely emergency alerts including automated cardiac anomaly
            detection.
          </p>
        </div>
      </div>

      {/* 5 Phases */}
      <div className='mb-16'>
        <h2 className='text-2xl font-bold text-gray-900 mb-2 text-center'>
          How It Was Built
        </h2>
        <p className='text-gray-500 text-center mb-10'>
          Five development phases from hardware to deployment
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.number}
                className='card hover:shadow-lg transition-shadow duration-200 relative overflow-hidden'
              >
                <span className='absolute top-4 right-4 text-5xl font-black text-gray-100 select-none leading-none'>
                  {phase.number}
                </span>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='p-2 bg-blue-50 rounded-lg'>
                    <Icon className='h-5 w-5 text-primary' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>{phase.title}</h3>
                </div>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  {phase.description}
                </p>
              </div>
            );
          })}

          {/* Impact card fills the 6th spot */}
          <div className='card bg-primary text-white hover:shadow-lg transition-shadow duration-200 relative overflow-hidden'>
            <span className='absolute top-4 right-4 text-5xl font-black text-blue-400 select-none leading-none opacity-40'>
              ✦
            </span>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <Globe className='h-5 w-5 text-white' />
              </div>
              <h3 className='font-semibold'>Real-World Impact</h3>
            </div>
            <p className='text-sm text-blue-100 leading-relaxed'>
              Designed for community health centres and rural hospitals in
              low-income regions where Holter monitors and traditional ECG
              machines remain out of reach.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className='card mb-16'>
        <h2 className='text-2xl font-bold text-gray-900 mb-8 text-center'>
          Technology Stack
        </h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
          {techStack.map((group) => (
            <div key={group.label} className='text-center'>
              <p className='text-xs font-bold text-primary uppercase tracking-widest mb-3'>
                {group.label}
              </p>
              <ul className='space-y-2'>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className='text-sm text-gray-700 bg-gray-50 rounded px-2 py-1 border border-gray-100'
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div className='text-center'>
        <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-4'>
          Research Keywords
        </p>
        <div className='flex flex-wrap justify-center gap-2'>
          {[
            'Blockchain',
            'Cardiovascular System',
            'Data Privacy',
            'Hyperledger Fabric',
            'Internet of Things (IoT)',
            'Remote Patient Monitoring',
            'ECG',
            'ESP32',
          ].map((kw) => (
            <span
              key={kw}
              className='px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 shadow-sm'
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
