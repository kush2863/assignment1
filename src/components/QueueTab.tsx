
import React, { useState, useEffect } from 'react';

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
    <div className="flex flex-col gap-4">
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
              className="bg-[#121624] rounded-xl overflow-hidden"
            >
              <div className="flex items-stretch h-24">
                {/* Left Side - Item Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    <span>Start Time</span>
                    <div className="text-white text-sm mt-0.5">{formatTime(item.startTime)}</div>
                  </div>
                </div>

                {/* Right Side - Progress Circle */}
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-20 h-20 relative flex items-center justify-center">
                    {/* Circular Progress Background */}
                    <svg className="w-full h-full absolute" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        stroke="#2A2A3C" 
                        strokeWidth="10"
                      />
                    </svg>
                    
                    {/* Circular Progress Indicator */}
                    <svg className="w-full h-full absolute -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        stroke={isCompleted ? "#00FF85" : "#9333EA"} 
                        strokeWidth="10" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * progress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-in-out"
                      />
                    </svg>
                    
                    {/* Progress Text */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-lg font-bold flex items-center">
                        {isCompleted ? 
                          <span className="text-[#00FF85]">100%</span> : 
                          <>
                            <span className="text-purple-500">&#x276F;</span>
                            <span>{progress}%</span>
                          </>
                        }
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-4 bottom-4 flex flex-col items-end">
                    <div className="text-xs text-gray-400">End Time</div>
                    <div className="text-sm">{formatTime(item.endTime)}</div>
                    <div className="text-xs mt-0.5 text-gray-400">
                      {isCompleted ? "Completed" : "Ongoing"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
