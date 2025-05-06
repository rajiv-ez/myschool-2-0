
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

interface Session {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  paliers: number;
}

interface FilterPaliersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  sessionFilter: string;
  setSessionFilter: (value: string) => void;
  statutFilter: string;
  setStatutFilter: (value: string) => void;
  sessions: Session[];
  applyFilter: () => void;
  resetFilter: () => void;
  onClose: () => void;
}

const FilterPaliers: React.FC<FilterPaliersProps> = ({
  searchTerm,
  setSearchTerm,
  sessionFilter,
  setSessionFilter,
  statutFilter,
  setStatutFilter,
  sessions,
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un palier..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sessions</SelectItem>
                {sessions.map(session => (
                  <SelectItem key={session.id} value={session.nom}>{session.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="sm:col-span-3 flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilter}>Réinitialiser</Button>
            <Button onClick={applyFilter}>Appliquer les filtres</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPaliers;
