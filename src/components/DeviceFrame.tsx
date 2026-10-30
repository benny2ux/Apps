import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, BatteryCharging, Signal } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'android' | 'responsive'>('android');
  const [currentTime, setCurrentTime] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-start select-none">
      {/* Top Device Switcher Floating Banner (visible on larger screens) */}
      <header className="w-full bg-white border-b border-purple-100 px-4 py-2 flex items-center justify-between text-xs shadow-xs z-40">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-purple-900 font-display">TIME UP OS</span>
          <span className="hidden sm:inline text-gray-400">·</span>
          <span className="hidden sm:inline text-gray-500">Android Mobile-First Architecture</span>
        </div>

        <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-xl border border-purple-200">
          <button
            onClick={() => setDeviceMode('android')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'android'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Phone</span>
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              deviceMode === 'responsive'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex items-start justify-center p-0 sm:py-6 sm:px-4">
        {deviceMode === 'android' ? (
          /* Sleek Android Bezel & Status Bar */
          <div className="relative w-full max-w-[420px] h-[100dvh] sm:h-[860px] bg-white sm:rounded-[44px] shadow-2xl sm:border-[10px] sm:border-slate-900 overflow-hidden flex flex-col">
            {/* Android Punch Hole Camera & Speaker */}
            <div className="hidden sm:flex absolute top-2 inset-x-0 justify-center pointer-events-none z-50">
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700 shadow-inner" />
            </div>

            {/* Android Status Bar */}
            <div className="h-7 w-full px-5 pt-1.5 flex items-center justify-between text-[11px] font-bold text-gray-800 bg-white z-40 select-none">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5 text-gray-700">
                <Signal className="w-3.5 h-3.5" />
                <span className="text-[10px] font-extrabold text-purple-700">5G</span>
                <Wifi className="w-3.5 h-3.5" />
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* App Viewport */}
            <div className="flex-1 w-full overflow-y-auto bg-white flex flex-col relative">
              {children}
            </div>

            {/* Android Bottom Navigation Pill */}
            <div className="hidden sm:flex h-4 w-full bg-white items-center justify-center pointer-events-none z-40">
              <div className="w-28 h-1 rounded-full bg-slate-400/80" />
            </div>
          </div>
        ) : (
          /* Full Responsive Web View */
          <div className="w-full max-w-4xl min-h-screen bg-white sm:rounded-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
