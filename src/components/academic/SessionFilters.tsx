
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface SessionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statutFilter: string;
  setStatutFilter: (value: string) => void;
  anneeFilter: string;
  setAnneeFilter: (value: string) => void;
  applyFilter: () => void;
  resetFilter: () => void;
  onClose: () => void;
}

export default function SessionFilters({
  searchTerm,
  setSearchTerm,
  statutFilter,
  setStatutFilter,
  anneeFilter,
  setAnneeFilter,
  applyFilter,
  resetFilter,
  onClose
}: SessionFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtres</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              placeholder="Nom de session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="annee">Année</Label>
            <Select value={anneeFilter} onValueChange={setAnneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les années" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={applyFilter}>Appliquer les filtres</Button>
          <Button variant="outline" onClick={resetFilter}>Réinitialiser</Button>
        </div>
      </CardContent>
    </Card>
  );
}
