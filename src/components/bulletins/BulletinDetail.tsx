
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Download } from 'lucide-react';
import { Eleve, Note, UniteEnseignement, Matiere } from './types';
import { useToast } from '@/hooks/use-toast';

interface BulletinDetailProps {
  eleve: Eleve;
  notes: Note[];
  unitesEnseignement: UniteEnseignement[];
  matieres: Matiere[];
  eleves: Eleve[];
  openPrintPreview: (eleveId: string) => void;
}

const BulletinDetail: React.FC<BulletinDetailProps> = ({ 
  eleve, 
  notes, 
  unitesEnseignement, 
  matieres, 
  eleves,
  openPrintPreview
}) => {
  const { toast } = useToast();
  
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
  
  return (
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
          onClick={() => openPrintPreview(eleve.id)} 
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          <span>Imprimer</span>
        </Button>
        <Button 
          onClick={() => {
            toast({
              title: "Export PDF",
              description: `Le bulletin de ${eleve.prenom} ${eleve.nom} a été exporté en PDF.`
            });
          }} 
          className="flex items-center gap-2"
        >
          <Download size={16} />
          <span>Exporter PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default BulletinDetail;
