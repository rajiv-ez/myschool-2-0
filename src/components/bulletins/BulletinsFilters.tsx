
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { FilterOptions } from './types';

interface BulletinsFiltersProps {
  filters: FilterOptions;
  updateFilter: (key: keyof FilterOptions, value: string) => void;
}

const BulletinsFilters: React.FC<BulletinsFiltersProps> = ({ filters, updateFilter }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter size={18} />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Session</label>
            <Select 
              value={filters.session} 
              onValueChange={(value) => updateFilter('session', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sessions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sessions</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Palier</label>
            <Select 
              value={filters.palier} 
              onValueChange={(value) => updateFilter('palier', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les paliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les paliers</SelectItem>
                <SelectItem value="trimestre1">1er Trimestre</SelectItem>
                <SelectItem value="trimestre2">2ème Trimestre</SelectItem>
                <SelectItem value="trimestre3">3ème Trimestre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Classe</label>
            <Select 
              value={filters.classe} 
              onValueChange={(value) => updateFilter('classe', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                <SelectItem value="CP">CP</SelectItem>
                <SelectItem value="CE1">CE1</SelectItem>
                <SelectItem value="CE2">CE2</SelectItem>
                <SelectItem value="CM1">CM1</SelectItem>
                <SelectItem value="CM2">CM2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulletinsFilters;
