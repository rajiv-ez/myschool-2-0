
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { School } from '@/types/schools';

interface SchoolSearchProps {
  schools: School[];
  onFilter: (filteredSchools: School[]) => void;
}

const SchoolSearch: React.FC<SchoolSearchProps> = ({ schools, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const handleSearch = () => {
    let filtered = schools;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(school => 
        school.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.adresse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (selectedNote !== 'all') {
      const noteValue = parseInt(selectedNote);
      filtered = filtered.filter(school => school.note >= noteValue);
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(school => 
        school.adresse.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    onFilter(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedNote('all');
    setSelectedCity('all');
    onFilter(schools);
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedNote, selectedCity]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une école par nom, description ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedNote} onValueChange={setSelectedNote}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Note minimale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les notes</SelectItem>
              <SelectItem value="5">5 étoiles</SelectItem>
              <SelectItem value="4">4+ étoiles</SelectItem>
              <SelectItem value="3">3+ étoiles</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="libreville">Libreville</SelectItem>
              <SelectItem value="port-gentil">Port-Gentil</SelectItem>
              <SelectItem value="franceville">Franceville</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={handleReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchoolSearch;
