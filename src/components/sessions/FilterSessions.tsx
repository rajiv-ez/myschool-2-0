
import React from 'react';
import { Search, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FilterSessionsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sessionStatut: string;
  setSessionStatut: (value: string) => void;
  applyFilter: () => void;
  resetFilter: () => void;
  onClose: () => void;
}

const FilterSessions: React.FC<FilterSessionsProps> = ({
  searchTerm,
  setSearchTerm,
  sessionStatut,
  setSessionStatut,
  applyFilter,
  resetFilter,
  onClose
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Filtres</CardTitle>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une session..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Select value={sessionStatut} onValueChange={setSessionStatut}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilter}>Réinitialiser</Button>
            <Button onClick={applyFilter}>Appliquer les filtres</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSessions;
