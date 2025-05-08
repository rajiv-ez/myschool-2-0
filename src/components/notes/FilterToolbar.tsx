
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { FilterOptions } from './types';

interface FilterToolbarProps {
  filters: FilterOptions;
  classes: string[];
  subjects: string[];
  periods: string[];
  onFilterChange: (filter: keyof FilterOptions, value: string) => void;
}

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  classes,
  subjects,
  periods,
  onFilterChange
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Classe</label>
            <Select 
              value={filters.classe} 
              onValueChange={(value) => onFilterChange('classe', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {classes.map((classe) => (
                  <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Matière</label>
            <Select 
              value={filters.subject} 
              onValueChange={(value) => onFilterChange('subject', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select 
              value={filters.period} 
              onValueChange={(value) => onFilterChange('period', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les périodes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Année complète</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterToolbar;
