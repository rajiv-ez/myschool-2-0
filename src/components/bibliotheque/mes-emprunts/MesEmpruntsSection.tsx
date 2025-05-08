
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, CheckCircle, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DemandeEmprunt, Livre } from '../types';
import DemandeEmpruntForm from './DemandeEmpruntForm';

interface MesEmpruntsSectionProps {
  livres: Livre[];
}

const MesEmpruntsSection: React.FC<MesEmpruntsSectionProps> = ({ livres }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemandeModalOpen, setIsDemandeModalOpen] = useState(false);
  const [demandes, setDemandes] = useState<DemandeEmprunt[]>([
    {
      id: 1,
      livre_id: 1,
      titre: "Les Misérables",
      eleve_id: "E001",
      eleve_nom: "Marie Ndongo",
      classe: "3ème",
      date_demande: "2023-05-15",
      raison: "Pour projet de lecture",
      statut: "Validée"
    },
    {
      id: 2,
      livre_id: 5,
      titre: "Le Petit Nicolas",
      eleve_id: "E001",
      eleve_nom: "Marie Ndongo",
      classe: "3ème",
      date_demande: "2023-06-02",
      raison: "Pour lecture loisir",
      statut: "En attente"
    },
    {
      id: 3,
      livre_id: 3,
      titre: "Harry Potter à l'école des sorciers",
      eleve_id: "E001",
      eleve_nom: "Marie Ndongo",
      classe: "3ème",
      date_demande: "2023-04-10",
      raison: "Pour lecture loisir",
      statut: "Refusée"
    }
  ]);
  
  const [filteredDemandes, setFilteredDemandes] = useState(demandes);
  
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredDemandes(demandes);
    } else {
      setFilteredDemandes(demandes.filter(demande => 
        demande.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demande.raison.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, demandes]);
  
  const handleAddDemande = (newDemande: DemandeEmprunt) => {
    setDemandes([...demandes, newDemande]);
    setIsDemandeModalOpen(false);
    toast({
      title: "Demande envoyée",
      description: "Votre demande d'emprunt a été envoyée avec succès."
    });
  };
  
  const handleCancelDemande = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) {
      setDemandes(demandes.filter(d => d.id !== id));
      toast({
        title: "Demande annulée",
        description: "Votre demande d'emprunt a été annulée avec succès."
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Validée':
        return <Badge className="bg-green-100 text-green-800">Validée</Badge>;
      case 'Refusée':
        return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };
  
  // Group demandes by status
  const currentDemandes = demandes.filter(d => d.statut === "En attente");
  const historiqueDemandes = demandes.filter(d => d.statut !== "En attente");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Mes Emprunts</h2>
          <p className="text-muted-foreground">Gestion de vos demandes d'emprunt</p>
        </div>
        <Button 
          onClick={() => setIsDemandeModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Nouvelle demande</span>
        </Button>
      </div>
      
      <div className="flex mb-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Rechercher par titre ou raison..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={18} />
              En attente
            </CardTitle>
            <CardDescription>Demandes en cours de traitement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{currentDemandes.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle size={18} />
              Validées
            </CardTitle>
            <CardDescription>Emprunts acceptés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{demandes.filter(d => d.statut === "Validée").length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen size={18} />
              Total
            </CardTitle>
            <CardDescription>Toutes demandes confondues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{demandes.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} />
            Demandes en cours
          </CardTitle>
          <CardDescription>
            Vos demandes d'emprunt actuellement en attente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livre</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDemandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Aucune demande en cours
                  </TableCell>
                </TableRow>
              ) : currentDemandes.map(demande => (
                <TableRow key={demande.id}>
                  <TableCell className="font-medium">{demande.titre}</TableCell>
                  <TableCell>{formatDate(demande.date_demande)}</TableCell>
                  <TableCell>{demande.raison}</TableCell>
                  <TableCell>
                    {getStatusBadge(demande.statut)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelDemande(demande.id)}
                    >
                      Annuler
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={18} />
            Historique des emprunts
          </CardTitle>
          <CardDescription>
            Vos demandes d'emprunt passées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livre</TableHead>
                <TableHead>Date de demande</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historiqueDemandes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Aucun historique d'emprunt
                  </TableCell>
                </TableRow>
              ) : historiqueDemandes.map(demande => (
                <TableRow key={demande.id}>
                  <TableCell className="font-medium">{demande.titre}</TableCell>
                  <TableCell>{formatDate(demande.date_demande)}</TableCell>
                  <TableCell>{demande.raison}</TableCell>
                  <TableCell>
                    {getStatusBadge(demande.statut)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Demande d'emprunt modal */}
      <Dialog open={isDemandeModalOpen} onOpenChange={setIsDemandeModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Faire une demande d'emprunt</DialogTitle>
          </DialogHeader>
          <DemandeEmpruntForm 
            livres={livres.filter(l => l.disponible)}
            onSubmit={handleAddDemande}
            onCancel={() => setIsDemandeModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
};

export default MesEmpruntsSection;
