import { CheckCircle, History } from 'lucide-react';
import React from 'react';
import { Clock } from 'lucide-react';
import advancedkit from '/public/advancedkit.svg';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'failed';
}
  const HistoryTab = () => {
  const historyItems: HistoryItem[] = [
    { id: '1', name: 'Repair Kit', date: '2024-06-17 16:07', status: 'completed' },
    { id: '2', name: 'Bolt Assembly', date: '2024-02-17 11:26', status: 'completed' },
    { id: '3', name: 'Hammer P', date: '2024-01-01 08:15', status: 'completed' },
    { id: '4', name: 'Broken Scope', date: '2024-05-10 14:32', status: 'failed' },
    { id: '5', name: 'Combat Knife', date: '2024-04-22 09:45', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Crafting History</h2>
        <span className="text-sm text-gray-400">({historyItems.length} records)</span>
      </div>
      
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-gradient-to-b from-[#23242B] to-[#181922] rounded-2xl p-4 sm:p-6 border-2 border-dashed border-[#6B6B7B] min-h-[110px]"
          >
            <div className="flex-shrink-0 flex justify-center items-center w-[100px] h-[100px] rounded-[20px]" style={{background: 'linear-gradient(168.45deg, rgba(255,255,255,0.4) -64.17%, rgba(255,255,255,0) 89.83%)'}}>
              <img src={advancedkit} alt="item" className="w-[75px] h-[75px] object-contain" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <span className="font-bold text-white text-lg sm:text-xl leading-tight truncate">{item.name}</span>
              <span className="text-[#B0B0C3] text-sm sm:text-base mt-1 truncate">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {historyItems.length === 0 && (
        <div className="text-center py-10 sm:py-16 text-gray-400">
          <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg sm:text-xl font-medium">No crafting history</p>
          <p className="text-xs sm:text-sm">Completed items will appear here</p>
        </div>
      )}
    </div>
  );
};
export default HistoryTab;