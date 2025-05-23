
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Repair Queue</h2>
      
      {queueItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No items in queue</p>
          <p className="text-sm">Items will appear here when crafting begins</p>
        </div>
      ) : (
        queueItems.map((item) => {
          const progress = calculateProgress(item);
          const remainingTime = getRemainingTime(item);
          const isCompleted = progress >= 100;
          
          return (
            <div 
              key={item.id} 
              className={`glass-morphism rounded-xl p-6 transition-all duration-300 ${
                isCompleted ? 'animate-pulse border-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">{progress}%</div>
                  <div className="text-sm text-gray-300">{remainingTime}</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      isCompleted 
                        ? 'bg-green-500 progress-glow' 
                        : 'bg-gradient-to-r from-purple-600 to-purple-400'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white drop-shadow-lg">
                    {isCompleted ? 'Complete!' : 'Ongoing'}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
