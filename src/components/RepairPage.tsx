import React, { useState, useEffect } from 'react';
import QueueTab from './QueueTab';
import TableTab from './TableTab';
import HistoryTab from './HistoryTab';

type TabType = 'queue' | 'table' | 'history';

export const RepairPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('queue');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'queue':
        return <QueueTab />;
      case 'table':
        return <TableTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <QueueTab />;
    }
  };

  return (
    <div className="min-h-screen crafting-gradient text-white">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Tab Navigation */}
        <div className="rounded-t-xl p-1 mb-0 flex justify-center border border-[#DBDBDB] bg-[linear-gradient(180deg,_#121624_0%,_#121624_100%)]">
          <div className="flex space-x-1 w-full">
            {(['queue', 'table', 'history'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-white/10 text-white shadow-lg border-b-2 border-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                  flex-1 text-center
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass-morphism rounded-b-xl rounded-tr-xl p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
