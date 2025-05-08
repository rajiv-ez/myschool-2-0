
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PersonnelMember, Pointage } from '../types';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Clock, CheckCircle, TimerOff, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PointageSystemProps {
  personnel: PersonnelMember[];
  onClose: () => void;
}

const PointageSystem: React.FC<PointageSystemProps> = ({ personnel, onClose }) => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("today");
  const [pointages, setPointages] = useState<Pointage[]>([]);
  const [todayPointages, setTodayPointages] = useState<Pointage[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");
  const [comment, setComment] = useState("");
  const today = new Date().toISOString().split('T')[0];

  // Initialize today's pointage records if they don't exist
  useEffect(() => {
    const initTodayPointages = () => {
      const today = new Date().toISOString().split('T')[0];
      const existingTodayPointages = pointages.filter(p => p.date === today);

      // If we already have records for all personnel, don't create new ones
      if (existingTodayPointages.length >= personnel.length) {
        setTodayPointages(existingTodayPointages);
        return;
      }

      // Create new pointage records for personnel who don't have one today
      const newPointages: Pointage[] = [...existingTodayPointages];
      
      personnel.forEach(person => {
        const hasPointage = existingTodayPointages.some(p => p.personnel_id === person.id);
        if (!hasPointage) {
          newPointages.push({
            id: Math.random().toString(36).substring(2, 11),
            personnel_id: person.id,
            nom_complet: `${person.prenom} ${person.nom}`,
            date: today,
            heure_arrivee: "",
            statut: 'Absent',
          });
        }
      });

      setTodayPointages(newPointages);
      setPointages(prev => [...prev.filter(p => p.date !== today), ...newPointages]);
    };

    initTodayPointages();
  }, [personnel]);

  const handleArrival = () => {
    if (!selectedPersonId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un membre du personnel",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedPointages = todayPointages.map(p => {
      if (p.personnel_id === selectedPersonId) {
        return {
          ...p,
          heure_arrivee: currentTime,
          commentaire: comment || p.commentaire,
          statut: 'Présent'
        };
      }
      return p;
    });

    updatePointages(updatedPointages);
    toast({
      title: "Arrivée enregistrée",
      description: "L'arrivée a été enregistrée avec succès"
    });
  };

  const handleStartBreak = (pointageId: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedPointages = todayPointages.map(p => {
      if (p.id === pointageId) {
        return {
          ...p,
          heure_debut_pause: currentTime,
          statut: 'En pause'
        };
      }
      return p;
    });

    updatePointages(updatedPointages);
    toast({
      title: "Pause commencée",
      description: "Le début de la pause a été enregistré"
    });
  };

  const handleEndBreak = (pointageId: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedPointages = todayPointages.map(p => {
      if (p.id === pointageId) {
        return {
          ...p,
          heure_fin_pause: currentTime,
          statut: 'Présent'
        };
      }
      return p;
    });

    updatePointages(updatedPointages);
    toast({
      title: "Pause terminée",
      description: "La fin de la pause a été enregistrée"
    });
  };

  const handleDeparture = (pointageId: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const updatedPointages = todayPointages.map(p => {
      if (p.id === pointageId) {
        return {
          ...p,
          heure_depart: currentTime,
          statut: 'Parti'
        };
      }
      return p;
    });

    updatePointages(updatedPointages);
    toast({
      title: "Départ enregistré",
      description: "Le départ a été enregistré avec succès"
    });
  };

  const updatePointages = (updatedTodayPointages: Pointage[]) => {
    setTodayPointages(updatedTodayPointages);
    setPointages(prev => [...prev.filter(p => p.date !== today), ...updatedTodayPointages]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Présent':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Présent</Badge>;
      case 'En pause':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En pause</Badge>;
      case 'Parti':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Parti</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800 border-red-200">Absent</Badge>;
    }
  };

  // Filter pointages for history tab
  const historyPointages = pointages.filter(p => p.date !== today);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="today" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="today">Pointage du jour</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un membre du personnel" />
              </SelectTrigger>
              <SelectContent>
                {personnel.map(person => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.prenom} {person.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Commentaire (optionnel)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            
            <Button onClick={handleArrival} className="flex items-center gap-2">
              <Clock size={16} />
              <span>Marquer l'arrivée</span>
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personnel</TableHead>
                <TableHead>Heure d'arrivée</TableHead>
                <TableHead>Pause</TableHead>
                <TableHead>Retour de pause</TableHead>
                <TableHead>Heure de départ</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayPointages.map((pointage) => (
                <TableRow key={pointage.id}>
                  <TableCell className="font-medium">{pointage.nom_complet}</TableCell>
                  <TableCell>{pointage.heure_arrivee || '-'}</TableCell>
                  <TableCell>{pointage.heure_debut_pause || '-'}</TableCell>
                  <TableCell>{pointage.heure_fin_pause || '-'}</TableCell>
                  <TableCell>{pointage.heure_depart || '-'}</TableCell>
                  <TableCell>{getStatusBadge(pointage.statut)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {pointage.heure_arrivee && !pointage.heure_debut_pause && !pointage.heure_depart && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStartBreak(pointage.id)}
                          >
                            <Timer size={14} className="mr-1" /> Pause
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeparture(pointage.id)}
                          >
                            <TimerOff size={14} className="mr-1" /> Départ
                          </Button>
                        </>
                      )}
                      {pointage.heure_debut_pause && !pointage.heure_fin_pause && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEndBreak(pointage.id)}
                        >
                          <CheckCircle size={14} className="mr-1" /> Fin pause
                        </Button>
                      )}
                      {pointage.heure_fin_pause && !pointage.heure_depart && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeparture(pointage.id)}
                        >
                          <TimerOff size={14} className="mr-1" /> Départ
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Personnel</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Pause</TableHead>
                <TableHead>Fin pause</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyPointages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun historique de pointage
                  </TableCell>
                </TableRow>
              ) : (
                historyPointages
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((pointage) => (
                    <TableRow key={pointage.id}>
                      <TableCell>{new Date(pointage.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">{pointage.nom_complet}</TableCell>
                      <TableCell>{pointage.heure_arrivee || '-'}</TableCell>
                      <TableCell>{pointage.heure_debut_pause || '-'}</TableCell>
                      <TableCell>{pointage.heure_fin_pause || '-'}</TableCell>
                      <TableCell>{pointage.heure_depart || '-'}</TableCell>
                      <TableCell>{getStatusBadge(pointage.statut)}</TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default PointageSystem;
