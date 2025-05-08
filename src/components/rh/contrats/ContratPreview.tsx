
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Contrat, PersonnelMember } from '../types';
import { Printer } from 'lucide-react';

interface ContratPreviewProps {
  contrat: Contrat;
  personnel: PersonnelMember | null;
  onClose: () => void;
}

const ContratPreview: React.FC<ContratPreviewProps> = ({
  contrat,
  personnel,
  onClose
}) => {
  const handlePrint = () => {
    const printContents = document.getElementById('contrat-print-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };
  
  if (!personnel) {
    return (
      <div className="text-center py-8">
        <p>Aucune information disponible sur l'employé.</p>
        <Button className="mt-4" onClick={onClose}>Fermer</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Aperçu du contrat</h2>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer size={16} />
          <span>Imprimer</span>
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4" id="contrat-print-content">
        <div className="space-y-8 p-6 bg-white">
          <div className="text-center border-b pb-6">
            <h1 className="text-2xl font-bold mb-2">CONTRAT DE TRAVAIL</h1>
            <p className="text-lg">{contrat.type_contrat}</p>
          </div>
          
          <div>
            <p className="mb-4">Entre les soussignés :</p>
            <p className="mb-2 font-medium">L'ÉTABLISSEMENT,</p>
            <p>Nom de l'établissement : École ABC</p>
            <p>Adresse : 123 Avenue de l'Éducation, Libreville</p>
            <p>Représenté par : M. Le Directeur</p>
            <p className="mb-4">Ci-après dénommé « L'EMPLOYEUR »</p>
            
            <p className="mb-2 font-medium">ET</p>
            <p>Nom et prénom : {personnel.prenom} {personnel.nom}</p>
            <p>Date de naissance : {new Date(personnel.dateNaissance).toLocaleDateString()}</p>
            <p>Lieu de naissance : {personnel.lieuNaissance}</p>
            <p>Adresse : {personnel.adresse}</p>
            <p>Ci-après dénommé(e) « L'EMPLOYÉ(E) »</p>
          </div>
          
          <div className="space-y-6">
            {contrat.clauses && contrat.clauses.map((clause) => (
              <div key={clause.id} className="space-y-2">
                <h3 className="font-semibold">{clause.title}</h3>
                <p className="whitespace-pre-line">{clause.content}</p>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-12 pt-6">
            <div>
              <p className="font-medium mb-1">Pour l'employeur :</p>
              <p>Fait à Libreville, le {new Date().toLocaleDateString()}</p>
              <div className="h-20 mt-2 border-b border-dashed"></div>
              <p className="text-center text-sm mt-1">Signature et cachet</p>
            </div>
            <div>
              <p className="font-medium mb-1">L'employé(e) :</p>
              <p>Lu et approuvé</p>
              <div className="h-20 mt-2 border-b border-dashed"></div>
              <p className="text-center text-sm mt-1">Signature</p>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>Fermer</Button>
      </div>
    </div>
  );
};

export default ContratPreview;
