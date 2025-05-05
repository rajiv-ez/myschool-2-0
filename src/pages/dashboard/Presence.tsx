
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ClipboardCheck, 
  FilterIcon, 
  Download, 
  Plus, 
  CalendarDays, 
  Award,
  BookOpen,
  Check,
  X,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Types d'événements
const EVENT_TYPES = {
  COURS: 'cours',
  EVALUATION: 'evaluation',
  EVENEMENT: 'evenement'
};

// Données fictives pour la démonstration
const presencesData = [
  { 
    id: 1, 
    eleve: 'Ndong Marie', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeEvenement: EVENT_TYPES.COURS,
    evenement: 'Cours de Mathématiques',
    present: true, 
    justifie: false, 
    bonus: 0,
    malus: 0,
    commentaire: '' 
  },
  { 
    id: 2, 
    eleve: 'Obiang Paul', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeEvenement: EVENT_TYPES.COURS,
    evenement: 'Cours de Mathématiques',
    present: false, 
    justifie: true,
    bonus: 0,
    malus: 0, 
    commentaire: 'Certificat médical fourni' 
  },
  { 
    id: 3, 
    eleve: 'Mba Sophie', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeEvenement: EVENT_TYPES.EVALUATION,
    evenement: 'Contrôle de Français',
    present: true, 
    justifie: false,
    bonus: 1,
    malus: 0, 
    commentaire: 'Excellente participation' 
  },
  { 
    id: 4, 
    eleve: 'Ondo Jean', 
    classe: 'CM1', 
    date: '15/05/2024',
    typeEvenement: EVENT_TYPES.COURS,
    evenement: 'Cours de Mathématiques',
    present: false, 
    justifie: false,
    bonus: 0,
    malus: 1, 
    commentaire: 'Absence non justifiée' 
  },
  { 
    id: 5, 
    eleve: 'Mintsa Lucie', 
    classe: 'CM2', 
    date: '16/05/2024',
    typeEvenement: EVENT_TYPES.EVENEMENT,
    evenement: 'Sortie scolaire au musée',
    present: true, 
    justifie: false,
    bonus: 2,
    malus: 0, 
    commentaire: 'A aidé à organiser l\'événement' 
  },
];

const evenementsData = [
  { id: 1, titre: 'Cours de Mathématiques', type: EVENT_TYPES.COURS, date: '15/05/2024', classe: 'CM1' },
  { id: 2, titre: 'Contrôle de Français', type: EVENT_TYPES.EVALUATION, date: '15/05/2024', classe: 'CM1' },
  { id: 3, titre: 'Sortie scolaire au musée', type: EVENT_TYPES.EVENEMENT, date: '16/05/2024', classe: 'CM2' },
  { id: 4, titre: 'Cours de Sciences', type: EVENT_TYPES.COURS, date: '16/05/2024', classe: 'CM2' }
];

const elevesData = [
  { id: 1, nom: 'Ndong Marie', classe: 'CM1' },
  { id: 2, nom: 'Obiang Paul', classe: 'CM1' },
  { id: 3, nom: 'Mba Sophie', classe: 'CM1' },
  { id: 4, nom: 'Ondo Jean', classe: 'CM1' },
  { id: 5, nom: 'Mintsa Lucie', classe: 'CM2' },
  { id: 6, nom: 'Mayombo Pierre', classe: 'CM2' },
];

const Presence: React.FC = () => {
  const [classe, setClasse] = useState<string>("all");
  const [session, setSession] = useState<string>("all");
  const [palier, setPalier] = useState<string>("all");
  const [typeEvenement, setTypeEvenement] = useState<string>("all");
  const [presences, setPresences] = useState(presencesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("individuelle");

  // Nouvel état pour le formulaire de présence individuelle
  const [newPresence, setNewPresence] = useState({
    eleve: '',
    evenement: '',
    present: true,
    justifie: false,
    bonus: 0,
    malus: 0,
    commentaire: ''
  });

  // Nouvel état pour le formulaire de présence groupée
  const [groupPresence, setGroupPresence] = useState({
    evenement: '',
    eleves: [] as string[],
    commentaire: ''
  });

  const handleOpenDialog = (presence?: any) => {
    if (presence) {
      setSelectedPresence(presence);
      setIsEditMode(true);
    } else {
      setSelectedPresence(null);
      setIsEditMode(false);
      setNewPresence({
        eleve: '',
        evenement: '',
        present: true,
        justifie: false,
        bonus: 0,
        malus: 0,
        commentaire: ''
      });
      setGroupPresence({
        evenement: '',
        eleves: [],
        commentaire: ''
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedPresence(null);
    setIsEditMode(false);
  };
  
  const handleSaveIndividualPresence = () => {
    if (isEditMode && selectedPresence) {
      // Mise à jour d'une présence existante
      setPresences(prevPresences => 
        prevPresences.map(p => 
          p.id === selectedPresence.id 
            ? { ...selectedPresence } 
            : p
        )
      );
    } else {
      // Création d'une nouvelle présence
      const evenementInfo = evenementsData.find(e => e.id === parseInt(newPresence.evenement));
      const eleveInfo = elevesData.find(e => e.id === parseInt(newPresence.eleve));
      
      if (evenementInfo && eleveInfo) {
        const newPresenceRecord = {
          id: presences.length + 1,
          eleve: eleveInfo.nom,
          classe: eleveInfo.classe,
          date: evenementInfo.date,
          typeEvenement: evenementInfo.type,
          evenement: evenementInfo.titre,
          present: newPresence.present,
          justifie: newPresence.justifie,
          bonus: newPresence.bonus,
          malus: newPresence.malus,
          commentaire: newPresence.commentaire
        };
        
        setPresences([...presences, newPresenceRecord]);
      }
    }
    
    handleCloseDialog();
  };
  
  const handleSaveGroupPresence = () => {
    const evenementInfo = evenementsData.find(e => e.id === parseInt(groupPresence.evenement));
    
    if (evenementInfo && groupPresence.eleves.length > 0) {
      const newPresenceRecords = groupPresence.eleves.map((eleveId, index) => {
        const eleveInfo = elevesData.find(e => e.id === parseInt(eleveId));
        
        if (eleveInfo) {
          return {
            id: presences.length + index + 1,
            eleve: eleveInfo.nom,
            classe: eleveInfo.classe,
            date: evenementInfo.date,
            typeEvenement: evenementInfo.type,
            evenement: evenementInfo.titre,
            present: true, // Par défaut, tous les élèves sont marqués présents
            justifie: false,
            bonus: 0,
            malus: 0,
            commentaire: groupPresence.commentaire
          };
        }
        return null;
      }).filter(record => record !== null);
      
      setPresences([...presences, ...newPresenceRecords as any]);
    }
    
    handleCloseDialog();
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case EVENT_TYPES.COURS:
        return <BookOpen size={16} className="text-blue-500" />;
      case EVENT_TYPES.EVALUATION:
        return <Award size={16} className="text-red-500" />;
      case EVENT_TYPES.EVENEMENT:
        return <CalendarDays size={16} className="text-amber-500" />;
      default:
        return null;
    }
  };
  
  const filteredPresences = presences.filter(item => {
    if (classe !== "all" && item.classe !== classe) return false;
    if (typeEvenement !== "all" && item.typeEvenement !== typeEvenement) return false;
    return true;
  });
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des présences</h2>
          <p className="text-muted-foreground">Suivez les présences des élèves aux cours, évaluations et événements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={() => handleOpenDialog()}>
            <Plus size={16} />
            <span>Nouvelle présence</span>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FilterIcon size={18} />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                  <SelectItem value="CE1">CE1</SelectItem>
                  <SelectItem value="CE2">CE2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session</label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Palier</label>
              <Select value={palier} onValueChange={setPalier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un palier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les paliers</SelectItem>
                  <SelectItem value="trimestre1">1er Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2ème Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'événement</label>
              <Select value={typeEvenement} onValueChange={setTypeEvenement}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value={EVENT_TYPES.COURS}>Cours</SelectItem>
                  <SelectItem value={EVENT_TYPES.EVALUATION}>Évaluation</SelectItem>
                  <SelectItem value={EVENT_TYPES.EVENEMENT}>Événement scolaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck size={18} />
            Liste des présences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-25rem)] w-full">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Événement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Justifié</TableHead>
                    <TableHead className="hidden md:table-cell">Bonus/Malus</TableHead>
                    <TableHead className="hidden md:table-cell">Commentaire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPresences.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="font-medium">{item.eleve}</TableCell>
                      <TableCell>{item.classe}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getEventTypeIcon(item.typeEvenement)}
                          <span>{item.evenement}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.present 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.present ? 'Présent' : 'Absent'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.justifie ? 'Oui' : 'Non'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {item.bonus > 0 && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <ThumbsUp size={12} className="mr-1" /> +{item.bonus}
                            </Badge>
                          )}
                          {item.malus > 0 && (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                              <ThumbsDown size={12} className="mr-1" /> -{item.malus}
                            </Badge>
                          )}
                          {item.bonus === 0 && item.malus === 0 && "-"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.commentaire || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(item)}>Modifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Modal de présence */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Modifier la présence' : 'Nouvelle présence'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className={isEditMode ? 'hidden' : 'block'}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individuelle">Individuelle</TabsTrigger>
              <TabsTrigger value="groupe">Par groupe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individuelle" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eleve">Élève</Label>
                  <Select 
                    value={isEditMode ? selectedPresence?.eleve : newPresence.eleve} 
                    onValueChange={(value) => isEditMode 
                      ? setSelectedPresence({...selectedPresence, eleve: value}) 
                      : setNewPresence({...newPresence, eleve: value})
                    }
                    disabled={isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {elevesData.map(eleve => (
                        <SelectItem key={eleve.id} value={eleve.id.toString()}>
                          {eleve.nom} ({eleve.classe})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evenement">Événement</Label>
                  <Select 
                    value={isEditMode ? selectedPresence?.evenement : newPresence.evenement} 
                    onValueChange={(value) => isEditMode 
                      ? setSelectedPresence({...selectedPresence, evenement: value}) 
                      : setNewPresence({...newPresence, evenement: value})
                    }
                    disabled={isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un événement" />
                    </SelectTrigger>
                    <SelectContent>
                      {evenementsData.map(evt => (
                        <SelectItem key={evt.id} value={evt.id.toString()}>
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(evt.type)}
                            <span>{evt.titre} - {evt.date} ({evt.classe})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Présence</Label>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant={isEditMode 
                          ? selectedPresence.present ? "default" : "outline"
                          : newPresence.present ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => isEditMode 
                          ? setSelectedPresence({...selectedPresence, present: true}) 
                          : setNewPresence({...newPresence, present: true})
                        }
                      >
                        <Check size={16} className="mr-2" />
                        Présent
                      </Button>
                      <Button 
                        type="button" 
                        variant={isEditMode 
                          ? !selectedPresence.present ? "default" : "outline"
                          : !newPresence.present ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => isEditMode 
                          ? setSelectedPresence({...selectedPresence, present: false}) 
                          : setNewPresence({...newPresence, present: false})
                        }
                      >
                        <X size={16} className="mr-2" />
                        Absent
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Label>Absence justifiée</Label>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant={isEditMode 
                          ? selectedPresence.justifie ? "default" : "outline"
                          : newPresence.justifie ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => isEditMode 
                          ? setSelectedPresence({...selectedPresence, justifie: true}) 
                          : setNewPresence({...newPresence, justifie: true})
                        }
                        disabled={isEditMode 
                          ? selectedPresence.present 
                          : newPresence.present
                        }
                      >
                        <Check size={16} className="mr-2" />
                        Oui
                      </Button>
                      <Button 
                        type="button" 
                        variant={isEditMode 
                          ? !selectedPresence.justifie ? "default" : "outline"
                          : !newPresence.justifie ? "default" : "outline"
                        }
                        className="flex-1"
                        onClick={() => isEditMode 
                          ? setSelectedPresence({...selectedPresence, justifie: false}) 
                          : setNewPresence({...newPresence, justifie: false})
                        }
                        disabled={isEditMode 
                          ? selectedPresence.present 
                          : newPresence.present
                        }
                      >
                        <X size={16} className="mr-2" />
                        Non
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="bonus">Bonus de présence</Label>
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-2"
                        onClick={() => {
                          if (isEditMode) {
                            const newBonus = Math.max(0, selectedPresence.bonus - 1);
                            setSelectedPresence({...selectedPresence, bonus: newBonus});
                          } else {
                            const newBonus = Math.max(0, newPresence.bonus - 1);
                            setNewPresence({...newPresence, bonus: newBonus});
                          }
                        }}
                        disabled={(isEditMode ? selectedPresence.bonus : newPresence.bonus) <= 0}
                      >
                        -
                      </Button>
                      <Input 
                        type="number" 
                        min="0" 
                        value={isEditMode ? selectedPresence.bonus : newPresence.bonus}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (isEditMode) {
                            setSelectedPresence({...selectedPresence, bonus: value});
                          } else {
                            setNewPresence({...newPresence, bonus: value});
                          }
                        }}
                        className="text-center mx-2"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-2"
                        onClick={() => {
                          if (isEditMode) {
                            setSelectedPresence({...selectedPresence, bonus: selectedPresence.bonus + 1});
                          } else {
                            setNewPresence({...newPresence, bonus: newPresence.bonus + 1});
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="malus">Malus de présence</Label>
                    <div className="flex items-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-2"
                        onClick={() => {
                          if (isEditMode) {
                            const newMalus = Math.max(0, selectedPresence.malus - 1);
                            setSelectedPresence({...selectedPresence, malus: newMalus});
                          } else {
                            const newMalus = Math.max(0, newPresence.malus - 1);
                            setNewPresence({...newPresence, malus: newMalus});
                          }
                        }}
                        disabled={(isEditMode ? selectedPresence.malus : newPresence.malus) <= 0}
                      >
                        -
                      </Button>
                      <Input 
                        type="number" 
                        min="0" 
                        value={isEditMode ? selectedPresence.malus : newPresence.malus}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          if (isEditMode) {
                            setSelectedPresence({...selectedPresence, malus: value});
                          } else {
                            setNewPresence({...newPresence, malus: value});
                          }
                        }}
                        className="text-center mx-2"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="px-2"
                        onClick={() => {
                          if (isEditMode) {
                            setSelectedPresence({...selectedPresence, malus: selectedPresence.malus + 1});
                          } else {
                            setNewPresence({...newPresence, malus: newPresence.malus + 1});
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commentaire">Commentaire</Label>
                  <Textarea 
                    id="commentaire" 
                    placeholder="Saisir un commentaire (optionnel)"
                    value={isEditMode ? selectedPresence?.commentaire : newPresence.commentaire}
                    onChange={(e) => isEditMode 
                      ? setSelectedPresence({...selectedPresence, commentaire: e.target.value}) 
                      : setNewPresence({...newPresence, commentaire: e.target.value})
                    }
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="groupe" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="evenement-groupe">Événement</Label>
                  <Select 
                    value={groupPresence.evenement} 
                    onValueChange={(value) => setGroupPresence({...groupPresence, evenement: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un événement" />
                    </SelectTrigger>
                    <SelectContent>
                      {evenementsData.map(evt => (
                        <SelectItem key={evt.id} value={evt.id.toString()}>
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(evt.type)}
                            <span>{evt.titre} - {evt.date} ({evt.classe})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eleves-groupe">Élèves présents</Label>
                  <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                    {elevesData.map(eleve => (
                      <div key={eleve.id} className="flex items-center mb-2">
                        <input 
                          type="checkbox"
                          id={`eleve-${eleve.id}`}
                          value={eleve.id}
                          checked={groupPresence.eleves.includes(eleve.id.toString())}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGroupPresence({
                                ...groupPresence, 
                                eleves: [...groupPresence.eleves, eleve.id.toString()]
                              });
                            } else {
                              setGroupPresence({
                                ...groupPresence, 
                                eleves: groupPresence.eleves.filter(id => id !== eleve.id.toString())
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <label htmlFor={`eleve-${eleve.id}`}>
                          {eleve.nom} ({eleve.classe})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commentaire-groupe">Commentaire</Label>
                  <Textarea 
                    id="commentaire-groupe" 
                    placeholder="Commentaire commun pour tous les élèves (optionnel)"
                    value={groupPresence.commentaire}
                    onChange={(e) => setGroupPresence({...groupPresence, commentaire: e.target.value})}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>Annuler</Button>
            <Button 
              onClick={activeTab === 'individuelle' || isEditMode 
                ? handleSaveIndividualPresence 
                : handleSaveGroupPresence
              }
            >
              {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Presence;
