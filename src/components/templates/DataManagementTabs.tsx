
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TabConfig } from './DataManagementPage';

interface DataManagementTabsProps {
  tabs: TabConfig<any>[]; // Changed to accept any type for flexibility
}

function DataManagementTabs({ tabs }: DataManagementTabsProps) {
  const getGridCols = (count: number) => {
    switch (count) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-4';
    }
  };

  return (
    <TabsList className={`grid ${getGridCols(tabs.length)} mb-8`}>
      {tabs.map(tab => (
        <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
          <tab.icon size={16} />
          <span className="hidden md:inline">{tab.label}</span>
          <Badge variant="outline" className="ml-1">
            {tab.items.length}
          </Badge>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

export default DataManagementTabs;
