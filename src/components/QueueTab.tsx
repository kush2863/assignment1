import React, { useState, useEffect } from 'react';
import { Hammer, CheckCircle } from 'lucide-react';
import advancedkit from '/public/advancedkit.svg';
import { Separator } from '@/components/ui/separator';

interface QueueItem {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  type: string;
}

const QueueTab = () => {
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
              className="w-[297px] rounded-[0px_0px_10px_10px] border-[2px] border-white/20 [background:linear-gradient(180deg,rgba(18,22,36,0)_0%,rgba(18,22,36,1)_100%)] mx-auto mb-[15px]"
            >
              <div className="flex flex-col items-center gap-2 p-2">
                <div className="flex items-center gap-1 w-full">
                  <div className="flex flex-wrap items-center gap-[2px_2px] flex-1">
                    <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[17px]">
                      {index + 1}
                    </div>
                    <div className="w-[51px] flex flex-col gap-0.5">
                      <div className="opacity-60 [font-family:'Inter',Helvetica] font-normal text-white text-[6.5px]">
                        Name
                      </div>
                      <div className="w-[75px] flex items-center gap-2.5 mr-[-24.00px] overflow-hidden">
                        <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[11px] tracking-[-0.16px] leading-[10.5px] whitespace-nowrap">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-[20.5px]" />
                  <div className="relative w-[90.25px] h-[45.5px]">
                    <div className="relative w-[90px] h-[45px]">
                      <div className="w-[34px] items-center absolute top-[21px] left-7 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 w-full mt-1">
                          <Hammer className="w-[8.75px] h-[8.75px] text-purple-400" />
                          <div className={`[font-family:'Inter',Helvetica] font-semibold text-white text-xs ${progress === 100 ? "mr-[-8.25px]" : "mr-[-1.25px]"}`}>
                            {progress}%
                          </div>
                        </div>
                      </div>
                      {/* Progress ring SVGs here, keep dynamic logic */}
                      <svg className="absolute w-[85px] h-[42px] top-[3px] left-[3px]" viewBox="0 0 150 100">
                        <path
                          d="M 15 90 A 60 60 0 0 1 135 90"
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.2)"
                          strokeWidth="14"
                          strokeLinecap="round"
                        />
                      </svg>
                      <svg className="absolute h-[42px] top-[3px] left-[3px]" width="85" height="42" viewBox="0 0 150 100">
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
                      <svg className="absolute w-[90px] h-[45px] top-0 left-0" viewBox="0 0 150 100">
                        <path
                          d="M 15 90 A 60 60 0 0 1 135 90"
                          fill="none"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.2"
                        />
                      </svg>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-[20.5px]" />
                  <div className="flex flex-wrap items-center gap-[2px_2px] flex-1">
                    <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[17px] px-1">
                      {isCompleted ? '0' : remainingTime.replace(/m.*/, '')}
                    </div>
                    <div className="flex flex-col gap-0.5 flex-1">
                      <div className="opacity-60 [font-family:'Inter',Helvetica] font-normal text-white text-[6.5px]">
                        Remaining
                      </div>
                      <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[11px] tracking-[-0.16px] leading-[10.5px] whitespace-nowrap">
                        Time
                      </div>
                    </div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-[20.5px]" />
                <div className="flex items-center justify-center gap-[13px] w-full">
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <div className="opacity-60 [font-family:'Inter',Helvetica] font-normal text-white text-[6.5px]">
                      Start Time
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[11px] text-center tracking-[-0.16px] leading-[10.5px] w-full">
                      {formatTime(item.startTime)}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-full" />
                  <div className="flex flex-col items-center gap-0.5 flex-1">
                    <div className="opacity-60 [font-family:'Inter',Helvetica] font-normal text-white text-[6.5px]">
                      End Time
                    </div>
                    <div className="[font-family:'Inter',Helvetica] font-semibold text-white text-[11px] text-center tracking-[-0.16px] leading-[10.5px] w-full">
                      {isCompleted ? 'Ongoing' : formatTime(item.endTime)}
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

export default QueueTab;