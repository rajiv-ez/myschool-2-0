
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, Download, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// Types
interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
}

interface Matiere {
  id: string;
  nom: string;
  coefficient: number;
  uniteEnseignementId: string;
}

interface UniteEnseignement {
  id: string;
  nom: string;
  coefficient: number;
}

interface Note {
  eleveId: string;
  matiereId: string;
  valeur: number;
  appreciation?: string;
}

// Données de démonstration
const unitesEnseignement: UniteEnseignement[] = [
  { id: '1', nom: 'Disciplines fondamentales', coefficient: 3 },
  { id: '2', nom: 'Sciences et technologies', coefficient: 2 },
  { id: '3', nom: 'Langues et cultures', coefficient: 1.5 },
  { id: '4', nom: 'Disciplines sportives et artistiques', coefficient: 1 }
];

const matieres: Matiere[] = [
  { id: '1', nom: 'Français', coefficient: 3, uniteEnseignementId: '1' },
  { id: '2', nom: 'Mathématiques', coefficient: 3, uniteEnseignementId: '1' },
  { id: '3', nom: 'Histoire-Géographie', coefficient: 2, uniteEnseignementId: '1' },
  { id: '4', nom: 'Sciences', coefficient: 2, uniteEnseignementId: '2' },
  { id: '5', nom: 'Technologie', coefficient: 1, uniteEnseignementId: '2' },
  { id: '6', nom: 'Anglais', coefficient: 2, uniteEnseignementId: '3' },
  { id: '7', nom: 'Arts plastiques', coefficient: 1, uniteEnseignementId: '4' },
  { id: '8', nom: 'Éducation physique', coefficient: 2, uniteEnseignementId: '4' }
];

const appreciations = [
  "Excellent travail, continue ainsi !",
  "Bon travail mais peut encore progresser.",
  "Des efforts à faire pour améliorer les résultats.",
  "Doit travailler plus régulièrement.",
  "Très bons résultats, félicitations !",
  "Ensemble satisfaisant.",
  "Résultats en progression, encourageant.",
  "Attention aux difficultés qui s'accumulent."
];

const eleves: Eleve[] = [
  { id: '1', nom: 'Dupont', prenom: 'Marie', classe: 'CM1' },
  { id: '2', nom: 'Martin', prenom: 'Thomas', classe: 'CM1' },
  { id: '3', nom: 'Bernard', prenom: 'Lucie', classe: 'CM1' },
  { id: '4', nom: 'Petit', prenom: 'Nicolas', classe: 'CM1' },
  { id: '5', nom: 'Robert', prenom: 'Emma', classe: 'CM1' },
  { id: '6', nom: 'Richard', prenom: 'Lucas', classe: 'CM1' }
];

// Générer des notes aléatoires pour la démonstration
const generateRandomNotes = (): Note[] => {
  const notes: Note[] = [];
  
  eleves.forEach(eleve => {
    matieres.forEach(matiere => {
      const note = Math.floor(Math.random() * 15) + 5; // Note entre 5 et 20
      const appreciationIndex = Math.floor(Math.random() * appreciations.length);
      
      notes.push({
        eleveId: eleve.id,
        matiereId: matiere.id,
        valeur: note,
        appreciation: appreciations[appreciationIndex]
      });
    });
  });
  
  return notes;
};

const demoNotes = generateRandomNotes();

const Bulletins: React.FC = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedPalier, setSelectedPalier] = useState("all");
  const [selectedClasse, setSelectedClasse] = useState("all");
  const [notes] = useState<Note[]>(demoNotes);
  const [selectedEleve, setSelectedEleve] = useState(eleves[0].id);
  
  // Obtenir les notes d'un élève pour une matière spécifique
  const getNoteForMatiereAndEleve = (matiereId: string, eleveId: string): number | null => {
    const note = notes.find(n => n.eleveId === eleveId && n.matiereId === matiereId);
    return note ? note.valeur : null;
  };

  // Obtenir l'appréciation pour une matière et un élève
  const getAppreciationForMatiereAndEleve = (matiereId: string, eleveId: string): string => {
    const note = notes.find(n => n.eleveId === eleveId && n.matiereId === matiereId);
    return note?.appreciation || '';
  };

  // Calculer la moyenne pour une unité d'enseignement
  const getMoyenneForUnite = (uniteId: string, eleveId: string): number | null => {
    const matieresInUnite = matieres.filter(m => m.uniteEnseignementId === uniteId);
    
    let totalPoints = 0;
    let totalCoefficients = 0;
    
    matieresInUnite.forEach(matiere => {
      const note = getNoteForMatiereAndEleve(matiere.id, eleveId);
      if (note !== null) {
        totalPoints += note * matiere.coefficient;
        totalCoefficients += matiere.coefficient;
      }
    });
    
    if (totalCoefficients === 0) return null;
    return parseFloat((totalPoints / totalCoefficients).toFixed(1));
  };

  // Calculer la moyenne générale
  const getMoyenneGenerale = (eleveId: string): number | null => {
    let totalPoints = 0;
    let totalCoefficients = 0;
    
    unitesEnseignement.forEach(unite => {
      const moyenneUnite = getMoyenneForUnite(unite.id, eleveId);
      if (moyenneUnite !== null) {
        totalPoints += moyenneUnite * unite.coefficient;
        totalCoefficients += unite.coefficient;
      }
    });
    
    if (totalCoefficients === 0) return null;
    return parseFloat((totalPoints / totalCoefficients).toFixed(1));
  };

  // Calculer la moyenne de la classe pour une matière
  const getMoyenneClasseForMatiere = (matiereId: string): number | null => {
    const notesForMatiere = notes.filter(n => n.matiereId === matiereId);
    
    if (notesForMatiere.length === 0) return null;
    
    const sum = notesForMatiere.reduce((acc, note) => acc + note.valeur, 0);
    return parseFloat((sum / notesForMatiere.length).toFixed(1));
  };

  // Calculer la moyenne générale de la classe
  const getMoyenneGeneraleClasse = (): number | null => {
    return parseFloat(
      (eleves
        .map(eleve => getMoyenneGenerale(eleve.id) || 0)
        .reduce((acc, curr) => acc + curr, 0) / eleves.length)
        .toFixed(1)
    );
  };

  // Déterminer le rang de l'élève
  const getRangEleve = (eleveId: string): number => {
    const moyennes = eleves.map(eleve => ({
      id: eleve.id,
      moyenne: getMoyenneGenerale(eleve.id) || 0
    }));
    
    // Trier par ordre décroissant
    moyennes.sort((a, b) => b.moyenne - a.moyenne);
    
    // Trouver la position de l'élève
    const position = moyennes.findIndex(m => m.id === eleveId);
    return position + 1; // +1 car les index commencent à 0
  };

  // Gérer l'impression des bulletins
  const handlePrint = (eleveId?: string) => {
    if (eleveId) {
      const eleve = eleves.find(e => e.id === eleveId);
      toast({
        title: "Impression en cours",
        description: `Le bulletin de ${eleve?.prenom} ${eleve?.nom} est en cours d'impression.`
      });
    } else {
      toast({
        title: "Impression en cours",
        description: "Les bulletins de toute la classe sont en cours d'impression."
      });
    }
  };

  // Gérer l'export en PDF
  const handleExport = (eleveId?: string) => {
    if (eleveId) {
      const eleve = eleves.find(e => e.id === eleveId);
      toast({
        title: "Export PDF",
        description: `Le bulletin de ${eleve?.prenom} ${eleve?.nom} a été exporté en PDF.`
      });
    } else {
      toast({
        title: "Export PDF",
        description: "Les bulletins de toute la classe ont été exportés en PDF."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Bulletins</h2>
          <p className="text-muted-foreground">Consultez les bulletins de notes des élèves</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => handlePrint()} 
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimer Tous</span>
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
            onClick={() => handlePrint(selectedEleve)} 
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Imprimer Sélection</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Onglets des élèves */}
      <Card>
        <CardContent className="pt-6">
          <Tabs 
            defaultValue={eleves[0].id} 
            value={selectedEleve} 
            onValueChange={setSelectedEleve}
          >
            <ScrollArea className="w-full" type="always">
              <div className="pb-3">
                <TabsList className="w-full flex-nowrap flex justify-start overflow-x-auto">
                  {eleves.map(eleve => (
                    <TabsTrigger 
                      key={eleve.id} 
                      value={eleve.id}
                      className="whitespace-nowrap"
                    >
                      {eleve.prenom} {eleve.nom}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </ScrollArea>

            {eleves.map(eleve => (
              <TabsContent key={eleve.id} value={eleve.id} className="mt-4">
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Élève</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold">{eleve.prenom} {eleve.nom}</p>
                        <p className="text-muted-foreground">Classe: {eleve.classe}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Moyenne Générale</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {getMoyenneGenerale(eleve.id)?.toString() || 'N/A'} / 20
                        </div>
                        <Progress 
                          value={(getMoyenneGenerale(eleve.id) || 0) * 5} 
                          className="h-2 mt-2" 
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Rang</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {getRangEleve(eleve.id)} / {eleves.length}
                        </div>
                        <p className="text-muted-foreground">
                          Moyenne de classe: {getMoyenneGeneraleClasse()?.toString() || 'N/A'} / 20
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <ScrollArea className="h-[calc(100vh-28rem)]" type="always">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead colSpan={5} className="text-center font-bold text-lg">
                            Bulletin de Notes
                          </TableHead>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableHead style={{ width: '30%' }}>Matière</TableHead>
                          <TableHead style={{ width: '10%' }} className="text-center">Note</TableHead>
                          <TableHead style={{ width: '10%' }} className="text-center">Coef.</TableHead>
                          <TableHead style={{ width: '10%' }} className="text-center">Moyenne Classe</TableHead>
                          <TableHead style={{ width: '40%' }}>Appréciation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unitesEnseignement.map(unite => (
                          <React.Fragment key={unite.id}>
                            <TableRow className="bg-muted/20">
                              <TableCell colSpan={2} className="font-semibold">
                                {unite.nom}
                              </TableCell>
                              <TableCell className="text-center">
                                {unite.coefficient}
                              </TableCell>
                              <TableCell className="text-center">-</TableCell>
                              <TableCell>-</TableCell>
                            </TableRow>

                            {matieres
                              .filter(matiere => matiere.uniteEnseignementId === unite.id)
                              .map(matiere => (
                                <TableRow key={matiere.id}>
                                  <TableCell className="pl-6">
                                    {matiere.nom}
                                  </TableCell>
                                  <TableCell className="text-center font-medium">
                                    {getNoteForMatiereAndEleve(matiere.id, eleve.id)?.toString() || 'N/A'} / 20
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {matiere.coefficient}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {getMoyenneClasseForMatiere(matiere.id)?.toString() || 'N/A'}
                                  </TableCell>
                                  <TableCell className="max-w-[300px] text-sm">
                                    {getAppreciationForMatiereAndEleve(matiere.id, eleve.id)}
                                  </TableCell>
                                </TableRow>
                              ))}

                            <TableRow className="border-t-2">
                              <TableCell className="font-semibold text-right">
                                Moyenne {unite.nom.toLowerCase()}:
                              </TableCell>
                              <TableCell className="text-center font-bold">
                                {getMoyenneForUnite(unite.id, eleve.id)?.toString() || 'N/A'} / 20
                              </TableCell>
                              <TableCell colSpan={3}></TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}

                        <TableRow className="bg-muted/40 border-t-4">
                          <TableCell className="font-bold text-right">
                            Moyenne Générale:
                          </TableCell>
                          <TableCell className="text-center font-bold text-lg">
                            {getMoyenneGenerale(eleve.id)?.toString() || 'N/A'} / 20
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                        </TableRow>
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold text-right">
                            Rang:
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {getRangEleve(eleve.id)} / {eleves.length}
                          </TableCell>
                          <TableCell colSpan={3}></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  <div className="mt-6 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handlePrint(eleve.id)} 
                      className="flex items-center gap-2"
                    >
                      <Printer size={16} />
                      <span>Imprimer</span>
                    </Button>
                    <Button 
                      onClick={() => handleExport(eleve.id)} 
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      <span>Exporter PDF</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bulletins;
