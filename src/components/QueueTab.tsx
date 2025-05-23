import React, { useState, useEffect } from 'react';
import { Hammer, CheckCircle } from 'lucide-react';
import advancedkit from '/public/advancedkit.svg';

interface QueueItem {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  type: string;
}

export const QueueTab = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: '1',
      name: 'Repair Kit',
      startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 minutes ago
      endTime: new Date(Date.now() + 15 * 60 * 1000), // Ends in 15 minutes
      type: 'repair'
    },
    {
      id: '2',
      name: 'Pistol Neon Fu',
      startTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
      endTime: new Date(Date.now() + 5 * 60 * 1000), // Ends in 5 minutes
      type: 'weapon'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueItems(prevItems => {
        return prevItems.filter(item => {
          const now = new Date();
          return now < item.endTime;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateProgress = (item: QueueItem): number => {
    const now = new Date();
    const totalDuration = item.endTime.getTime() - item.startTime.getTime();
    const elapsed = now.getTime() - item.startTime.getTime();
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
    return Math.round(progress);
  };

  const getRemainingTime = (item: QueueItem): string => {
    const now = new Date();
    const remaining = Math.max(0, item.endTime.getTime() - now.getTime());
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (remaining <= 0) return 'Completed';
    return `${minutes}m ${seconds}s`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-900 min-h-screen">
      {queueItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No items in queue</p>
          <p className="text-sm">Items will appear here when crafting begins</p>
        </div>
      ) : (
        queueItems.map((item, index) => {
          const progress = calculateProgress(item);
          const remainingTime = getRemainingTime(item);
          const isCompleted = progress >= 100;
          
          return (
            <div
              key={item.id}
              className="flex flex-col bg-gradient-to-b from-[#23242B] to-[#181922] rounded-2xl px-4 py-4 min-h-[170px] gap-2 w-full max-w-[350px] mx-auto"
            >
              {/* Top: Number, Image, Name */}
              <div className="flex flex-row items-center gap-3 w-full">
                <div className="text-xl font-bold text-white">{index + 1}</div>
                <img src={advancedkit} alt="item" className="w-[40px] h-[40px] object-contain" />
                <div className="flex flex-col">
                  <div className="text-base font-bold text-white leading-tight">{item.name}</div>
                  <div className="text-xs text-gray-400 leading-tight">Start Time <span className="text-white font-semibold">{formatTime(item.startTime)}</span></div>
                </div>
              </div>
              {/* Progress Ring Centered */}
              <div className="flex flex-col items-center w-full mt-2">
                <div className="w-[150px] h-[100px] relative flex items-center justify-center overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 150 100">
                    <path
                      d="M 15 90 A 60 60 0 0 1 135 90"
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.2)"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Progress semicircle */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 150 100">
                    <path
                      d="M 15 90 A 60 60 0 0 1 135 90"
                      fill="none"
                      stroke={isCompleted ? "#10B981" : "url(#progressGradient)"}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray="188.4"
                      strokeDashoffset={188.4 - (188.4 * progress) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2737CF" />
                        <stop offset="100%" stopColor="#DA1A41" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Progress percentage */}
                  <div className="absolute inset-0 flex items-center justify-center flex-col mt-8">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Hammer className="w-6 h-6 text-purple-400" />
                        <span className="text-2xl font-extrabold text-white">{progress}%</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Bottom: Time Info Row */}
              <div className="flex flex-row justify-between items-center w-full mt-2">
                <div className="flex flex-col items-start">
                  <div className="text-xs text-gray-400">Remaining</div>
                  <div className="text-lg font-bold text-white">{isCompleted ? '0' : remainingTime.split(' ')[0]}</div>
                  <div className="text-xs text-gray-400">Time</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400">End Time</div>
                  <div className="text-base font-semibold text-white">{isCompleted ? 'Ongoing' : formatTime(item.endTime)}</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default QueueTab;