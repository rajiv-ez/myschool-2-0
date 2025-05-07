
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface FraisSearchProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const FraisSearch: React.FC<FraisSearchProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input 
        placeholder="Rechercher un frais..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="pl-10"
      />
    </div>
  );
};

export default FraisSearch;
