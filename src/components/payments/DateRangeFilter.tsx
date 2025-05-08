
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
  onReset: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
  onReset
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <label htmlFor="startDate" className="text-sm font-medium">
              Date de début
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 flex-1">
            <label htmlFor="endDate" className="text-sm font-medium">
              Date de fin
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={onFilter}
              className="flex items-center gap-2"
            >
              <Search size={16} />
              <span>Filtrer</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span>Réinitialiser</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilter;
