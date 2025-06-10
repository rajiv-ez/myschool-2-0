
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  genreFilter: string;
  setGenreFilter: (value: string) => void;
  statutFilter: string;
  setStatutFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  applyFilter: () => void;
  resetFilter: () => void;
  onClose: () => void;
}

export default function UserFilters({
  searchTerm,
  setSearchTerm,
  genreFilter,
  setGenreFilter,
  statutFilter,
  setStatutFilter,
  typeFilter,
  setTypeFilter,
  applyFilter,
  resetFilter,
  onClose
}: UserFiltersProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              placeholder="Nom, prénom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="genre">Genre</Label>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                <SelectItem value="M">Masculin</SelectItem>
                <SelectItem value="F">Féminin</SelectItem>
                <SelectItem value="A">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="statut">Statut</Label>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="staff">Personnel</SelectItem>
                <SelectItem value="student">Étudiant</SelectItem>
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
