
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaiementSalaire, PersonnelMember } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FichePaiePreviewProps {
  paiement: PaiementSalaire;
  personnel: PersonnelMember | undefined;
  onClose: () => void;
}

const FichePaiePreview: React.FC<FichePaiePreviewProps> = ({
  paiement,
  personnel,
  onClose
}) => {
  if (!personnel) {
    return (
      <div className="text-center p-4">
        <p>Impossible de trouver les informations du personnel.</p>
        <Button className="mt-4" onClick={onClose}>Fermer</Button>
      </div>
    );
  }

  const formattedDate = paiement.date_paiement || new Date().toLocaleDateString('fr-FR');
  
  return (
    <ScrollArea className="max-h-[calc(100vh-12rem)]">
      <div className="p-6 bg-white print:shadow-none">
        <div className="border border-gray-200 p-8 rounded-md print:border-none" id="fiche-paie">
          {/* Header */}
          <div className="mb-8 text-center border-b pb-4">
            <h1 className="text-2xl font-bold">BULLETIN DE PAIE</h1>
            <p className="text-muted-foreground">Mois de {paiement.mois} {paiement.annee}</p>
          </div>
          
          {/* Company and Employee Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="font-bold mb-2 text-lg">EMPLOYEUR</h2>
              <p className="font-semibold">École Excellence</p>
              <p>123 Avenue de l'Éducation</p>
              <p>Libreville, Gabon</p>
              <p>Tel: +241 12 34 56 78</p>
              <p>Email: contact@ecole-excellence.ga</p>
            </div>
            
            <div>
              <h2 className="font-bold mb-2 text-lg">EMPLOYÉ</h2>
              <p className="font-semibold">{personnel.prenom} {personnel.nom}</p>
              <p>{personnel.adresse}</p>
              <p>Poste: {personnel.poste}</p>
              <p>Tel: {personnel.tel1}</p>
              <p>Email: {personnel.email}</p>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="mb-8">
            <h2 className="font-bold mb-4 text-lg border-b pb-2">DÉTAILS DE LA RÉMUNÉRATION</h2>
            
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Salaire de base</td>
                  <td className="py-2 text-right">{paiement.montant_base.toLocaleString()} FCFA</td>
                </tr>
                
                {paiement.primes > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Primes</td>
                    <td className="py-2 text-right text-green-600">+{paiement.primes.toLocaleString()} FCFA</td>
                  </tr>
                )}
                
                {/* Example detailed primes - in a real app, these would come from the database */}
                {paiement.primes > 0 && (
                  <>
                    <tr>
                      <td className="py-1 pl-8 text-sm">Prime d'ancienneté</td>
                      <td className="py-1 text-right text-sm">+{(paiement.primes * 0.3).toLocaleString()} FCFA</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1 pl-8 text-sm">Prime de rendement</td>
                      <td className="py-1 text-right text-sm">+{(paiement.primes * 0.7).toLocaleString()} FCFA</td>
                    </tr>
                  </>
                )}
                
                {paiement.deductions > 0 && (
                  <tr className="border-b">
                    <td className="py-2 font-medium">Déductions</td>
                    <td className="py-2 text-right text-red-600">-{paiement.deductions.toLocaleString()} FCFA</td>
                  </tr>
                )}
                
                {/* Example detailed deductions - in a real app, these would come from the database */}
                {paiement.deductions > 0 && (
                  <>
                    <tr>
                      <td className="py-1 pl-8 text-sm">Cotisations sociales</td>
                      <td className="py-1 text-right text-sm">-{(paiement.deductions * 0.6).toLocaleString()} FCFA</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1 pl-8 text-sm">Avances sur salaire</td>
                      <td className="py-1 text-right text-sm">-{(paiement.deductions * 0.4).toLocaleString()} FCFA</td>
                    </tr>
                  </>
                )}
                
                <tr className="font-bold">
                  <td className="py-4">SALAIRE NET</td>
                  <td className="py-4 text-right">{paiement.montant_final.toLocaleString()} FCFA</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Payment Information */}
          <div className="mb-8">
            <h2 className="font-bold mb-4 text-lg border-b pb-2">INFORMATION DE PAIEMENT</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Méthode de paiement:</span> {paiement.methode_paiement}</p>
                <p><span className="font-medium">Date de paiement:</span> {formattedDate}</p>
              </div>
              <div>
                <p><span className="font-medium">Statut:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    paiement.statut === 'Payé' 
                      ? 'bg-green-100 text-green-800' 
                      : paiement.statut === 'En attente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {paiement.statut}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Ce bulletin de paie est généré électroniquement et ne nécessite pas de signature.</p>
            <p className="mt-2">Pour toute question concernant votre paie, veuillez contacter le service des ressources humaines.</p>
            <p className="font-semibold mt-4">École Excellence © {new Date().getFullYear()}</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4 print:hidden">
          <Button onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default FichePaiePreview;
