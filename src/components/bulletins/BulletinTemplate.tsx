
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eleve, Matiere, Note, UniteEnseignement } from './types';

// Logo et informations de l'école pour le bulletin (exemple)
const schoolInfo = {
  nom: "École Primaire Excellencia",
  address: "123 Avenue de l'Éducation, Libreville",
  telephone: "+241 77 123 456",
  email: "contact@excellencia.edu",
  logo: "/path/to/logo.png", // Chemin vers le logo de l'école
  slogan: "Éduquer pour l'avenir"
};

interface BulletinTemplateProps {
  eleve: Eleve; 
  notes: Note[]; 
  unitesEnseignement: UniteEnseignement[]; 
  matieres: Matiere[];
  session?: string;
  periode?: string;
}

const BulletinTemplate: React.FC<BulletinTemplateProps> = ({ 
  eleve, 
  notes, 
  unitesEnseignement, 
  matieres,
  session = "2024-2025",
  periode = "1er Trimestre"
}) => {
  // Fonctions de calcul
  const getNoteForMatiereAndEleve = (matiereId: string, eleveId: string): number | null => {
    const note = notes.find(n => n.eleveId === eleveId && n.matiereId === matiereId);
    return note ? note.valeur : null;
  };

  const getAppreciationForMatiereAndEleve = (matiereId: string, eleveId: string): string => {
    const note = notes.find(n => n.eleveId === eleveId && n.matiereId === matiereId);
    return note?.appreciation || '';
  };

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

  const getRangEleve = (): string => {
    // Simuler un rang pour cet exemple
    return `${Math.floor(Math.random() * 5) + 1}/6`;
  };

  return (
    <div className="bulletin-page mx-auto max-w-4xl bg-white p-8 mb-10 print:mb-0">
      <div className="header flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
        <div className="school-info">
          <h1 className="text-2xl font-bold">{schoolInfo.nom}</h1>
          <p className="text-sm text-gray-500">{schoolInfo.address}</p>
          <p className="text-sm text-gray-500">Tel: {schoolInfo.telephone}</p>
          <p className="text-xs text-gray-400 italic">{schoolInfo.slogan}</p>
        </div>
        <div className="bulletin-info text-right">
          <h2 className="text-xl font-semibold">Bulletin de Notes</h2>
          <p className="text-sm">Session: {session}</p>
          <p className="text-sm">Période: {periode}</p>
        </div>
      </div>

      <div className="student-info mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Informations de l'élève</h3>
        <div className="grid grid-cols-2">
          <div>
            <p><strong>Nom:</strong> {eleve.nom}</p>
            <p><strong>Prénom:</strong> {eleve.prenom}</p>
          </div>
          <div>
            <p><strong>Classe:</strong> {eleve.classe}</p>
            <p><strong>Moyenne Générale:</strong> <span className="font-bold">{getMoyenneGenerale(eleve.id)?.toString() || 'N/A'}/20</span></p>
            <p><strong>Rang:</strong> {getRangEleve()}</p>
          </div>
        </div>
      </div>

      <div className="grades-table mb-8">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead style={{ width: '30%' }}>Matière</TableHead>
              <TableHead style={{ width: '10%' }} className="text-center">Note</TableHead>
              <TableHead style={{ width: '10%' }} className="text-center">Coef.</TableHead>
              <TableHead style={{ width: '50%' }}>Appréciation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitesEnseignement.map(unite => (
              <React.Fragment key={unite.id}>
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={4} className="font-semibold">
                    {unite.nom}
                  </TableCell>
                </TableRow>

                {matieres
                  .filter(matiere => matiere.uniteEnseignementId === unite.id)
                  .map(matiere => (
                    <TableRow key={matiere.id}>
                      <TableCell className="pl-6">
                        {matiere.nom}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {getNoteForMatiereAndEleve(matiere.id, eleve.id)?.toString() || 'N/A'}/20
                      </TableCell>
                      <TableCell className="text-center">
                        {matiere.coefficient}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getAppreciationForMatiereAndEleve(matiere.id, eleve.id)}
                      </TableCell>
                    </TableRow>
                  ))}

                <TableRow>
                  <TableCell className="font-semibold text-right">
                    Moyenne {unite.nom.toLowerCase()}:
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {getMoyenneForUnite(unite.id, eleve.id)?.toString() || 'N/A'}/20
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            <TableRow className="bg-gray-100 border-t-4">
              <TableCell className="font-bold text-right">
                Moyenne Générale:
              </TableCell>
              <TableCell className="text-center font-bold text-lg">
                {getMoyenneGenerale(eleve.id)?.toString() || 'N/A'}/20
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="appreciation-generale p-4 border border-gray-200 rounded mb-8">
        <h4 className="font-semibold mb-2">Appréciation générale:</h4>
        <p className="italic">Bon trimestre dans l'ensemble. Continuez vos efforts !</p>
      </div>

      <div className="signatures flex justify-between mt-16 pt-4 border-t">
        <div>
          <p className="font-semibold">Le Chef d'établissement</p>
          <div className="h-10"></div>
          <p>Signature et cachet</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Date d'émission</p>
          <p>{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
      
      <div className="footer text-center text-xs text-gray-400 mt-8 pt-4 border-t">
        <p>{schoolInfo.nom} - {schoolInfo.address} - Tel: {schoolInfo.telephone} - Email: {schoolInfo.email}</p>
      </div>
    </div>
  );
};

export default BulletinTemplate;
