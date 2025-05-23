
import React from 'react';

interface HistoryItem {
  id: string;
  name: string;
  date: string;
  icon: string;
}

export const HistoryTab = () => {
  const historyItems: HistoryItem[] = [
    { id: '1', name: 'Repair Kit', date: '2024-06-17 16:07', icon: '🧰' },
    { id: '2', name: 'Bolt Assembly', date: '2024-02-17 11:26', icon: '🔩' },
    { id: '3', name: 'Hammer P', date: '2024-01-01 08:15', icon: '🔨' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Crafting History</h2>
      
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="glass-morphism rounded-xl p-6 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 glass-morphism rounded-lg flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.date}</p>
              </div>
              <div className="text-green-400 font-medium">
                Completed
              </div>
            </div>
          </div>
        ))}
      </div>

      {historyItems.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No crafting history</p>
          <p className="text-sm">Completed items will appear here</p>
        </div>
      )}
    </div>
  );
};
