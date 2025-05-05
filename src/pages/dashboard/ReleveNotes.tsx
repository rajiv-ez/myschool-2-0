
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Download, Filter, Check, X, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
interface Evaluation {
  id: string;
  nom: string;
  date: string;
  coefficient: number;
}

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
}

interface Matiere {
  id: string;
  nom: string;
  evaluations: Evaluation[];
}

interface Note {
  eleveId: string;
  evaluationId: string;
  valeur: number;
  presenceBonus: number; // Bonus lié à la présence
  presenceMalus: number; // Malus lié à l'absence
}

// Données de démonstration
const matieres: Matiere[] = [
  {
    id: '1',
    nom: 'Mathématiques',
    evaluations: [
      { id: '1', nom: 'Contrôle 1', date: '2025-02-15', coefficient: 2 },
      { id: '2', nom: 'Contrôle 2', date: '2025-03-01', coefficient: 1 },
      { id: '3', nom: 'Devoir Maison', date: '2025-03-15', coefficient: 0.5 }
    ]
  },
  {
    id: '2',
    nom: 'Français',
    evaluations: [
      { id: '4', nom: 'Dictée', date: '2025-02-10', coefficient: 1 },
      { id: '5', nom: 'Expression écrite', date: '2025-02-25', coefficient: 2 },
      { id: '6', nom: 'Lecture', date: '2025-03-10', coefficient: 1 }
    ]
  },
  {
    id: '3',
    nom: 'Histoire-Géographie',
    evaluations: [
      { id: '7', nom: 'Contrôle Histoire', date: '2025-02-12', coefficient: 1 },
      { id: '8', nom: 'Exposé Géographie', date: '2025-03-05', coefficient: 1.5 }
    ]
  }
];

const eleves: Eleve[] = [
  { id: '1', nom: 'Dupont', prenom: 'Marie' },
  { id: '2', nom: 'Martin', prenom: 'Thomas' },
  { id: '3', nom: 'Bernard', prenom: 'Lucie' },
  { id: '4', nom: 'Petit', prenom: 'Nicolas' },
  { id: '5', nom: 'Robert', prenom: 'Emma' },
  { id: '6', nom: 'Richard', prenom: 'Lucas' }
];

// Générer des notes aléatoires pour la démonstration
const generateRandomNotes = (): Note[] => {
  const notes: Note[] = [];
  
  eleves.forEach(eleve => {
    matieres.forEach(matiere => {
      matiere.evaluations.forEach(evaluation => {
        const baseNote = Math.floor(Math.random() * 15) + 5; // Note entre 5 et 20
        const presenceBonus = Math.random() > 0.7 ? Math.random() * 2 : 0; // Bonus entre 0 et 2 (30% de chance)
        const presenceMalus = Math.random() > 0.9 ? Math.random() * 3 : 0; // Malus entre 0 et 3 (10% de chance)
        
        notes.push({
          eleveId: eleve.id,
          evaluationId: evaluation.id,
          valeur: baseNote,
          presenceBonus,
          presenceMalus
        });
      });
    });
  });
  
  return notes;
};

const demoNotes = generateRandomNotes();

const ReleveNotes: React.FC = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedPalier, setSelectedPalier] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState(matieres[0].id);
  const [notes, setNotes] = useState<Note[]>(demoNotes);
  const [selectedEleve, setSelectedEleve] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Filtrer les notes pour la matière sélectionnée
  const filteredNotes = selectedMatiere 
    ? notes.filter(note => {
        const matiere = matieres.find(m => m.id === selectedMatiere);
        return matiere?.evaluations.some(ev => ev.id === note.evaluationId);
      })
    : [];

  // Calculer la moyenne d'un élève pour une évaluation spécifique (avec bonus/malus)
  const getNoteForEleveAndEvaluation = (eleveId: string, evaluationId: string): number | null => {
    const note = notes.find(n => n.eleveId === eleveId && n.evaluationId === evaluationId);
    if (!note) return null;
    
    // Calculer la note finale avec bonus/malus
    let noteFinal = note.valeur + note.presenceBonus - note.presenceMalus;
    // Garantir que la note est entre 0 et 20
    noteFinal = Math.max(0, Math.min(20, noteFinal));
    return parseFloat(noteFinal.toFixed(1));
  };

  // Calculer la moyenne pondérée d'un élève pour une matière
  const getMoyenneForEleve = (eleveId: string, matiereId: string): number | null => {
    const matiere = matieres.find(m => m.id === matiereId);
    if (!matiere) return null;
    
    let totalPoints = 0;
    let totalCoefficients = 0;
    
    matiere.evaluations.forEach(evaluation => {
      const note = getNoteForEleveAndEvaluation(eleveId, evaluation.id);
      if (note !== null) {
        totalPoints += note * evaluation.coefficient;
        totalCoefficients += evaluation.coefficient;
      }
    });
    
    if (totalCoefficients === 0) return null;
    return parseFloat((totalPoints / totalCoefficients).toFixed(1));
  };

  // Mettre à jour une note
  const updateNote = (eleveId: string, evaluationId: string, value: number) => {
    // Valider la note
    if (value < 0) value = 0;
    if (value > 20) value = 20;
    
    setNotes(prev => 
      prev.map(note => 
        note.eleveId === eleveId && note.evaluationId === evaluationId
          ? { ...note, valeur: value }
          : note
      )
    );
  };

  // Gérer l'impression des relevés
  const handlePrint = (eleveId?: string) => {
    if (eleveId) {
      const eleve = eleves.find(e => e.id === eleveId);
      toast({
        title: "Impression en cours",
        description: `Le relevé de notes de ${eleve?.prenom} ${eleve?.nom} est en cours d'impression.`
      });
    } else {
      toast({
        title: "Impression en cours",
        description: "Les relevés de notes de toute la classe sont en cours d'impression."
      });
    }
  };

  // Gérer l'export en PDF
  const handleExport = (eleveId?: string) => {
    if (eleveId) {
      const eleve = eleves.find(e => e.id === eleveId);
      toast({
        title: "Export PDF",
        description: `Le relevé de notes de ${eleve?.prenom} ${eleve?.nom} a été exporté en PDF.`
      });
    } else {
      toast({
        title: "Export PDF",
        description: "Les relevés de notes de toute la classe ont été exportés en PDF."
      });
    }
  };

  const getCurrentMatiere = () => matieres.find(m => m.id === selectedMatiere);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Relevé des Notes</h2>
          <p className="text-muted-foreground">Consultez et gérez les notes des élèves</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => handlePrint()} 
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimer Tout</span>
            <span className="sm:hidden">Imprimer</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleExport()} 
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exporter PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button 
            onClick={() => setIsEditing(!isEditing)} 
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Check size={16} />
                <span>Terminer</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Modifier</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter size={18} />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sessions</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Palier</label>
              <Select value={selectedPalier} onValueChange={setSelectedPalier}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les paliers" />
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
              <label className="text-sm font-medium">Classe</label>
              <Select value={selectedClasse} onValueChange={setSelectedClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les classes</SelectItem>
                  <SelectItem value="CP">CP</SelectItem>
                  <SelectItem value="CE1">CE1</SelectItem>
                  <SelectItem value="CE2">CE2</SelectItem>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Élève</label>
              <Select value={selectedEleve || ""} onValueChange={setSelectedEleve}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les élèves" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les élèves</SelectItem>
                  {eleves.map(eleve => (
                    <SelectItem key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets des matières */}
      <Card>
        <CardContent className="pt-6">
          <Tabs 
            defaultValue={matieres[0].id} 
            value={selectedMatiere} 
            onValueChange={setSelectedMatiere}
          >
            <ScrollArea className="w-full" type="always">
              <div className="pb-3">
                <TabsList className="w-full flex-nowrap flex justify-start overflow-x-auto">
                  {matieres.map(matiere => (
                    <TabsTrigger 
                      key={matiere.id} 
                      value={matiere.id}
                      className="whitespace-nowrap"
                    >
                      {matiere.nom}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </ScrollArea>

            {matieres.map(matiere => (
              <TabsContent key={matiere.id} value={matiere.id} className="mt-4">
                <ScrollArea className="h-[calc(100vh-26rem)]" type="always">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-[180px] min-w-[180px] sticky left-0 bg-muted/50 z-20">
                            Élève
                          </TableHead>
                          {matiere.evaluations.map(evaluation => (
                            <TableHead key={evaluation.id} className="text-center min-w-[150px]">
                              <div>{evaluation.nom}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(evaluation.date).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Coef. {evaluation.coefficient}
                              </div>
                            </TableHead>
                          ))}
                          <TableHead className="text-center bg-muted/70 min-w-[100px]">
                            Moyenne
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eleves
                          .filter(eleve => !selectedEleve || selectedEleve === "all" || eleve.id === selectedEleve)
                          .map(eleve => (
                            <TableRow key={eleve.id}>
                              <TableCell className="font-medium sticky left-0 bg-white z-10">
                                <div className="flex items-center justify-between">
                                  <span>{eleve.prenom} {eleve.nom}</span>
                                  <div className="flex gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={() => handlePrint(eleve.id)}
                                      title="Imprimer"
                                    >
                                      <Printer size={14} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6"
                                      onClick={() => handleExport(eleve.id)}
                                      title="Exporter PDF"
                                    >
                                      <Download size={14} />
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                              {matiere.evaluations.map(evaluation => (
                                <TableCell key={evaluation.id} className="text-center">
                                  {isEditing ? (
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      max="20" 
                                      className="w-16 mx-auto text-center h-8"
                                      value={getNoteForEleveAndEvaluation(eleve.id, evaluation.id) || ''}
                                      onChange={(e) => updateNote(eleve.id, evaluation.id, parseFloat(e.target.value))}
                                    />
                                  ) : (
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {getNoteForEleveAndEvaluation(eleve.id, evaluation.id)?.toString() || 'N/A'}
                                      </span>
                                      {/* Afficher bonus/malus si présent */}
                                      {notes.find(n => n.eleveId === eleve.id && n.evaluationId === evaluation.id)?.presenceBonus > 0 && (
                                        <span className="text-xs text-green-600">
                                          +{notes.find(n => n.eleveId === eleve.id && n.evaluationId === evaluation.id)?.presenceBonus.toFixed(1)}
                                        </span>
                                      )}
                                      {notes.find(n => n.eleveId === eleve.id && n.evaluationId === evaluation.id)?.presenceMalus > 0 && (
                                        <span className="text-xs text-red-600">
                                          -{notes.find(n => n.eleveId === eleve.id && n.evaluationId === evaluation.id)?.presenceMalus.toFixed(1)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-bold bg-muted/20">
                                {getMoyenneForEleve(eleve.id, matiere.id)?.toString() || 'N/A'}
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>

                {/* Statistiques de classe */}
                {(!selectedEleve || selectedEleve === "all") && (
                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Statistiques de classe</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Moyenne de la classe</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {parseFloat(
                              eleves
                                .map(e => getMoyenneForEleve(e.id, matiere.id) || 0)
                                .filter(n => n > 0)
                                .reduce((acc, curr, _, arr) => acc + curr / arr.length, 0)
                                .toFixed(1)
                            ) || 'N/A'}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Note la plus haute</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {Math.max(...eleves
                              .map(e => getMoyenneForEleve(e.id, matiere.id) || 0)
                              .filter(n => n > 0)
                            ).toFixed(1)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Note la plus basse</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {Math.min(...eleves
                              .map(e => getMoyenneForEleve(e.id, matiere.id) || 0)
                              .filter(n => n > 0)
                            ).toFixed(1)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReleveNotes;

