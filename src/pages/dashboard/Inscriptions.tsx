
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Données fictives pour démonstration
const inscriptionsData = [
  { 
    id: 1, 
    nom: 'Ndong', 
    prenom: 'Marie', 
    classe: 'CM1', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '12/08/2024' 
  },
  { 
    id: 2, 
    nom: 'Obiang', 
    prenom: 'Paul', 
    classe: 'CE2', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '15/08/2024' 
  },
  { 
    id: 3, 
    nom: 'Mba', 
    prenom: 'Sophie', 
    classe: 'CM2', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '10/08/2024' 
  },
  { 
    id: 4, 
    nom: 'Ondo', 
    prenom: 'Jean', 
    classe: '6ème', 
    session: '2024-2025', 
    statut: 'Réinscription', 
    date: '18/08/2024' 
  },
  { 
    id: 5, 
    nom: 'Mintsa', 
    prenom: 'Lucie', 
    classe: '5ème', 
    session: '2024-2025', 
    statut: 'Nouvelle', 
    date: '05/08/2024' 
  }
];

const sessions = ['2024-2025', '2023-2024', '2022-2023'];
const classes = ['CM1', 'CM2', 'CE2', '6ème', '5ème', '4ème', '3ème'];
const statuts = ['Nouvelle', 'Réinscription'];

const Inscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('liste');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(inscriptionsData);
  const [filters, setFilters] = useState({
    session: '',
    classe: '',
    statut: ''
  });

  // Gérer les filtres
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Appliquer les filtres
    const filtered = inscriptionsData.filter(item => {
      if (newFilters.session && item.session !== newFilters.session) return false;
      if (newFilters.classe && item.classe !== newFilters.classe) return false;
      if (newFilters.statut && item.statut !== newFilters.statut) return false;
      if (searchTerm && 
          !`${item.nom} ${item.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !item.id.toString().includes(searchTerm)) return false;
      return true;
    });
    
    setFilteredData(filtered);
  };

  // Gérer la recherche
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    const filtered = inscriptionsData.filter(item => {
      if (filters.session && item.session !== filters.session) return false;
      if (filters.classe && item.classe !== filters.classe) return false;
      if (filters.statut && item.statut !== filters.statut) return false;
      if (term && 
          !`${item.nom} ${item.prenom}`.toLowerCase().includes(term.toLowerCase()) && 
          !item.id.toString().includes(term)) return false;
      return true;
    });
    
    setFilteredData(filtered);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      session: '',
      classe: '',
      statut: ''
    });
    setSearchTerm('');
    setFilteredData(inscriptionsData);
  };

  return (
    <div>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inscriptions et réinscriptions</h2>
          <p className="text-muted-foreground">Gérez les inscriptions des élèves pour l'année scolaire</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="flex items-center gap-2" variant="outline">
            <Download size={16} />
            Exporter
          </Button>
          <Button className="flex items-center gap-2" asChild>
            <Link to="/dashboard/inscriptions/nouvelle">
              <UserPlus size={18} />
              Nouvelle inscription
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:gap-2">
          <TabsTrigger value="liste">
            Liste des inscriptions
          </TabsTrigger>
          <TabsTrigger value="formulaire">
            Formulaire d'inscription
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="liste" className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom ou ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filters.session} onValueChange={(value) => handleFilterChange('session', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les sessions</SelectItem>
                  {sessions.map(session => (
                    <SelectItem key={session} value={session}>{session}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.classe} onValueChange={(value) => handleFilterChange('classe', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les classes</SelectItem>
                  {classes.map(classe => (
                    <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filters.statut} onValueChange={(value) => handleFilterChange('statut', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  {statuts.map(statut => (
                    <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="ghost" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((inscription) => (
                    <TableRow key={inscription.id}>
                      <TableCell>{inscription.id}</TableCell>
                      <TableCell className="font-medium">{inscription.nom}</TableCell>
                      <TableCell>{inscription.prenom}</TableCell>
                      <TableCell>{inscription.classe}</TableCell>
                      <TableCell>{inscription.session}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inscription.statut === 'Nouvelle' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {inscription.statut}
                        </span>
                      </TableCell>
                      <TableCell>{inscription.date}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Annuler l'inscription</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Aucune inscription ne correspond aux critères de recherche.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="formulaire" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Formulaire d'inscription</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations de l'élève</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="nom" className="text-sm font-medium">Nom</label>
                        <Input id="nom" placeholder="Nom de famille" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="prenom" className="text-sm font-medium">Prénom</label>
                        <Input id="prenom" placeholder="Prénom" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="date-naissance" className="text-sm font-medium">Date de naissance</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Sélectionner une date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          {/* Calendar will be added here */}
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lieu-naissance" className="text-sm font-medium">Lieu de naissance</label>
                      <Input id="lieu-naissance" placeholder="Ville de naissance" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sexe" className="text-sm font-medium">Sexe</label>
                      <Select>
                        <SelectTrigger id="sexe">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculin</SelectItem>
                          <SelectItem value="F">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="classe" className="text-sm font-medium">Classe souhaitée</label>
                      <Select>
                        <SelectTrigger id="classe">
                          <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map(classe => (
                            <SelectItem key={classe} value={classe}>{classe}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informations du tuteur</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="tuteur-nom" className="text-sm font-medium">Nom</label>
                        <Input id="tuteur-nom" placeholder="Nom du tuteur" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="tuteur-prenom" className="text-sm font-medium">Prénom</label>
                        <Input id="tuteur-prenom" placeholder="Prénom du tuteur" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="tuteur-telephone" className="text-sm font-medium">Téléphone</label>
                      <Input id="tuteur-telephone" placeholder="Numéro de téléphone" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="tuteur-email" className="text-sm font-medium">Email</label>
                      <Input id="tuteur-email" type="email" placeholder="Adresse email" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="tuteur-adresse" className="text-sm font-medium">Adresse</label>
                      <Input id="tuteur-adresse" placeholder="Adresse complète" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="tuteur-relation" className="text-sm font-medium">Relation avec l'élève</label>
                      <Select>
                        <SelectTrigger id="tuteur-relation">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pere">Père</SelectItem>
                          <SelectItem value="mere">Mère</SelectItem>
                          <SelectItem value="tuteur">Tuteur légal</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Documents requis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="acte-naissance" className="text-sm font-medium">Acte de naissance</label>
                      <Input id="acte-naissance" type="file" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="photo" className="text-sm font-medium">Photo d'identité</label>
                      <Input id="photo" type="file" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="bulletin" className="text-sm font-medium">Dernier bulletin</label>
                      <Input id="bulletin" type="file" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Annuler</Button>
                  <Button>Enregistrer l'inscription</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inscriptions;
