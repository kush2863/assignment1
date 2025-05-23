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
       {/* Tab Navigation */}
<div className="rounded-t-xl p-1 mb-0 flex justify-center border border-[#DBDBDB] bg-[linear-gradient(180deg,_#121624_0%,_#121624_100%)]">
<div className="flex w-full">
{(['queue', 'table', 'history'] as TabType[]).map((tab) => (
<button
key={tab}
onClick={() => setActiveTab(tab)}
className={`
  flex flex-row items-start justify-center
  px-4 py-3 gap-2 h-11
  font-medium text-sm transition-all duration-200
  flex-1
  ${activeTab === tab
    ? 'text-white relative'
    : 'text-gray-300 hover:text-white'
  }
`}
style={{
  ...(activeTab === tab
    ? {
        background: 'linear-gradient(0deg, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0) 85%)',
        borderBottom: '2px solid #fff',
      }
    : {})
}}
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
