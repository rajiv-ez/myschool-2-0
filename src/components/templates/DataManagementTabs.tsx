
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TabConfig } from './DataManagementPage';

interface DataManagementTabsProps<T extends { id: number }> {
  tabs: TabConfig<T>[];
}

function DataManagementTabs<T extends { id: number }>({ tabs }: DataManagementTabsProps<T>) {
  return (
    <TabsList className={`grid grid-cols-${tabs.length} mb-8`}>
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
