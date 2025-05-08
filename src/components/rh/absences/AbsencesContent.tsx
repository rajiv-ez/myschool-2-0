
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, FilePlus, Users, ListFilter, Edit, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Absence, PersonnelMember } from '../types';
import AbsenceForm from './AbsenceForm';
import AbsenceDetails from './AbsenceDetails';
import PointageSystem from './PointageSystem';

interface AbsencesContentProps {
  personnel: PersonnelMember[];
  initialAbsences?: Absence[];
}

const AbsencesContent: React.FC<AbsencesContentProps> = ({ 
  personnel,
  initialAbsences = []
}) => {
  const { toast } = useToast();
  const [absences, setAbsences] = useState<Absence[]>(initialAbsences);
  const [filteredAbsences, setFilteredAbsences] = useState<Absence[]>(initialAbsences);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAddAbsenceModalOpen, setIsAddAbsenceModalOpen] = useState(false);
  const [isEditAbsenceModalOpen, setIsEditAbsenceModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  
  const [isPointageModalOpen, setIsPointageModalOpen] = useState(false);

  // Filter absences when search query changes
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredAbsences(absences);
    } else {
      setFilteredAbsences(absences.filter(absence => 
        absence.nom_complet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        absence.motif.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, absences]);

  const handleAddAbsence = (newAbsence: Absence) => {
    setAbsences([...absences, newAbsence]);
    setIsAddAbsenceModalOpen(false);
    toast({
      title: "Absence ajoutée",
      description: "L'absence a été ajoutée avec succès."
    });
  };

  const handleEditAbsence = (updatedAbsence: Absence) => {
    setAbsences(absences.map(a => a.id === updatedAbsence.id ? updatedAbsence : a));
    setIsEditAbsenceModalOpen(false);
    toast({
      title: "Absence mise à jour",
      description: "L'absence a été mise à jour avec succès."
    });
  };

  const handleDeleteAbsence = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette absence ?")) {
      setAbsences(absences.filter(a => a.id !== id));
      toast({
        title: "Absence supprimée",
        description: "L'absence a été supprimée avec succès."
      });
    }
  };

  const handleViewDetails = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsEditAbsenceModalOpen(true);
  };

  // Stats for the cards
  const currentMonthAbsences = absences.filter(abs => {
    const absDate = new Date(abs.date_debut);
    const today = new Date();
    return absDate.getMonth() === today.getMonth() && absDate.getFullYear() === today.getFullYear();
  }).length;

  const currentlyAbsent = absences.filter(abs => {
    const today = new Date();
    const startDate = new Date(abs.date_debut);
    const endDate = new Date(abs.date_fin);
    return today >= startDate && today <= endDate && abs.statut === 'Validée';
  }).length;

  const pendingAbsences = absences.filter(abs => abs.statut === 'En attente').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestion des absences</h3>
          <p className="text-muted-foreground">Suivi des absences et congés du personnel</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsPointageModalOpen(true)}
          >
            <Calendar size={16} />
            <span>Pointage</span>
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddAbsenceModalOpen(true)}
          >
            <FilePlus size={16} />
            <span>Nouvelle absence</span>
          </Button>
        </div>
      </div>
      
      <div className="flex mb-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Rechercher par personne ou motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={18} />
              Absences ce mois
            </CardTitle>
            <CardDescription>Total des absences du mois en cours</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentMonthAbsences}</p>
            <p className="text-sm text-muted-foreground">Sur {personnel.length} employés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users size={18} />
              Personnel absent
            </CardTitle>
            <CardDescription>Nombre actuel d'absents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentlyAbsent}</p>
            <p className="text-sm text-muted-foreground">Sur {personnel.length} employés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListFilter size={18} />
              En attente
            </CardTitle>
            <CardDescription>Demandes à traiter</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingAbsences}</p>
            <p className="text-sm text-muted-foreground">À valider ou refuser</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={18} />
            Historique des absences
          </CardTitle>
          <CardDescription>
            {filteredAbsences.length} absences enregistrées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Justificatif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAbsences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Aucune absence trouvée
                  </TableCell>
                </TableRow>
              ) : filteredAbsences.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.id}</TableCell>
                  <TableCell className="font-medium">{absence.nom_complet}</TableCell>
                  <TableCell>{formatDate(absence.date_debut)}</TableCell>
                  <TableCell>{formatDate(absence.date_fin)}</TableCell>
                  <TableCell>{truncate(absence.motif, 30)}</TableCell>
                  <TableCell>
                    {absence.justificatif ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Fourni
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Non fourni
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      absence.statut === 'Validée' 
                        ? 'bg-green-100 text-green-800' 
                        : absence.statut === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {absence.statut}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewDetails(absence)}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(absence)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteAbsence(absence.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Modals */}
      <Dialog open={isAddAbsenceModalOpen} onOpenChange={setIsAddAbsenceModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une absence</DialogTitle>
          </DialogHeader>
          <AbsenceForm 
            personnel={personnel}
            onSubmit={handleAddAbsence}
            onCancel={() => setIsAddAbsenceModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditAbsenceModalOpen} onOpenChange={setIsEditAbsenceModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier une absence</DialogTitle>
          </DialogHeader>
          {selectedAbsence && (
            <AbsenceForm 
              absence={selectedAbsence}
              personnel={personnel}
              onSubmit={handleEditAbsence}
              onCancel={() => setIsEditAbsenceModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'absence</DialogTitle>
          </DialogHeader>
          {selectedAbsence && (
            <AbsenceDetails 
              absence={selectedAbsence}
              onEdit={() => {
                setIsDetailsModalOpen(false);
                setIsEditAbsenceModalOpen(true);
              }}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPointageModalOpen} onOpenChange={setIsPointageModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Système de pointage</DialogTitle>
          </DialogHeader>
          <PointageSystem 
            personnel={personnel}
            onClose={() => setIsPointageModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

const truncate = (str: string, n: number) => {
  return (str.length > n) ? str.slice(0, n-1) + '...' : str;
};

export default AbsencesContent;
