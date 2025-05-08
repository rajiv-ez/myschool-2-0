
import React from 'react';
import { PersonnelMember } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, UserCircle2 } from 'lucide-react';
import { findContratForPersonnel } from '../utils';
import { Contrat } from '../types';

interface PersonnelDetailsProps {
  personne: PersonnelMember;
  contrats: Contrat[];
  onEdit: () => void;
  onClose: () => void;
}

const PersonnelDetails: React.FC<PersonnelDetailsProps> = ({
  personne,
  contrats,
  onEdit,
  onClose
}) => {
  // Calculate years of experience
  const calculateExperience = (dateEmbauche: string) => {
    const embauche = new Date(dateEmbauche);
    const today = new Date();
    let years = today.getFullYear() - embauche.getFullYear();
    const m = today.getMonth() - embauche.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < embauche.getDate())) {
      years--;
    }
    
    return years;
  };

  const contratActuel = findContratForPersonnel(contrats, personne.id);
  const experience = calculateExperience(personne.date_embauche);

  return (
    <div className="py-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-muted">
          {personne.photo ? (
            <img 
              src={personne.photo} 
              alt={`${personne.prenom} ${personne.nom}`} 
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <UserCircle2 className="h-10 w-10 text-primary" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{personne.prenom} <span className="uppercase">{personne.nom}</span></h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{personne.poste}</Badge>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              personne.statut === 'Actif' 
                ? 'bg-green-100 text-green-800' 
                : personne.statut === 'En congé'
                ? 'bg-yellow-100 text-yellow-800'
                : personne.statut === 'Suspendu'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {personne.statut}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
            <p>{new Date(personne.dateNaissance).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Lieu de naissance</p>
            <p>{personne.lieuNaissance}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Genre</p>
          <p>{personne.genre}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Adresse</p>
          <p>{personne.adresse}</p>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p>{personne.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Téléphones</p>
            <p>
              {personne.tel1}
              {personne.tel2 && <>, {personne.tel2}</>}
              {personne.whatsapp && (
                <div>
                  <a 
                    href={`https://wa.me/${personne.whatsapp.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp: {personne.whatsapp}
                  </a>
                </div>
              )}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Date d'embauche</p>
            <p>{new Date(personne.date_embauche).toLocaleDateString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Ancienneté</p>
            <p>{experience} an{experience > 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {personne.poste === 'Enseignant' && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Enseignements</p>
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <GraduationCap size={16} className="text-muted-foreground" />
                <span>Matières : {personne.matieres.join(', ')}</span>
              </div>
              <div className="flex gap-2 items-center">
                <UserCircle2 size={16} className="text-muted-foreground" />
                <span>Niveaux : {personne.niveaux.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 p-3 rounded-md bg-muted">
          <h4 className="text-sm font-semibold mb-2">Contrat actuel</h4>
          {contratActuel ? (
            <div className="text-sm">
              <p>Type : {contratActuel.type_contrat}</p>
              <p>Salaire : {contratActuel.salaire}</p>
              <p>Début : {contratActuel.date_debut}</p>
              {contratActuel.date_fin && <p>Fin : {contratActuel.date_fin}</p>}
              <p>Statut : {contratActuel.statut}</p>
            </div>
          ) : (
            <p className="text-sm">Aucun contrat associé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetails;
