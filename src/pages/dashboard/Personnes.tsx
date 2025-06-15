
import React, { useState } from 'react';
import { Users, GraduationCap, UserCheck } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import PersonneForm from '@/components/forms/PersonneForm';
import { useUsersData } from '@/hooks/useUsersData';
import { EleveDetail, TuteurDetail } from '@/types/users';
import * as XLSX from 'xlsx';

const Personnes: React.FC = () => {
  const {
    elevesDetails,
    tuteursDetails,
    loading,
    createEleveDetail,
    updateEleveDetail,
    deleteEleveDetail,
    createTuteurDetail,
    updateTuteurDetail,
    deleteTuteurDetail,
  } = useUsersData();

  // Export functions
  const exportElevesToExcel = (items: EleveDetail[]) => {
    const data = items.map(eleve => ({
      'Matricule': eleve.matricule,
      'Nom': eleve.user.nom,
      'Prénom': eleve.user.prenom,
      'Email': eleve.user.email,
      'Genre': eleve.user.genre === 'M' ? 'Masculin' : eleve.user.genre === 'F' ? 'Féminin' : 'Autre',
      'Date de naissance': eleve.user.date_naissance,
      'Lieu de naissance': eleve.user.lieu_naissance,
      'Adresse': eleve.user.adresse,
      'Téléphone 1': eleve.user.tel1,
      'Téléphone 2': eleve.user.tel2 || '',
      'WhatsApp': eleve.user.whatsapp || '',
      'Photo': eleve.user.photo || '',
      'Statut': eleve.user.is_active ? 'Actif' : 'Inactif'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Élèves');
    XLSX.writeFile(wb, 'eleves.xlsx');
  };

  const exportTuteursToExcel = (items: TuteurDetail[]) => {
    const data = items.map(tuteur => ({
      'Nom': tuteur.user.nom,
      'Prénom': tuteur.user.prenom,
      'Email': tuteur.user.email,
      'Genre': tuteur.user.genre === 'M' ? 'Masculin' : tuteur.user.genre === 'F' ? 'Féminin' : 'Autre',
      'Date de naissance': tuteur.user.date_naissance,
      'Lieu de naissance': tuteur.user.lieu_naissance,
      'Adresse': tuteur.user.adresse,
      'Téléphone 1': tuteur.user.tel1,
      'Téléphone 2': tuteur.user.tel2 || '',
      'WhatsApp': tuteur.user.whatsapp || '',
      'Profession': tuteur.profession,
      'Photo': tuteur.user.photo || '',
      'Statut': tuteur.user.is_active ? 'Actif' : 'Inactif'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tuteurs');
    XLSX.writeFile(wb, 'tuteurs.xlsx');
  };

  // Import functions
  const handleElevesImport = async (data: any[]) => {
    console.log('Importing eleves:', data);
  };

  const handleTuteursImport = async (data: any[]) => {
    console.log('Importing tuteurs:', data);
  };

  // Tab configurations
  const tabs: TabConfig<any>[] = [
    {
      id: 'eleves',
      label: 'Élèves',
      icon: GraduationCap,
      items: elevesDetails,
      columns: [
        {
          key: 'matricule',
          label: 'Matricule',
          render: (item: EleveDetail) => (
            <span className="font-medium">{item.matricule}</span>
          )
        },
        {
          key: 'nom',
          label: 'Nom',
          render: (item: EleveDetail) => item.user.nom
        },
        {
          key: 'prenom',
          label: 'Prénom',
          render: (item: EleveDetail) => item.user.prenom
        },
        {
          key: 'email',
          label: 'Email',
          render: (item: EleveDetail) => item.user.email
        },
        {
          key: 'tel1',
          label: 'Téléphone',
          render: (item: EleveDetail) => item.user.tel1
        },
        {
          key: 'statut',
          label: 'Statut',
          render: (item: EleveDetail) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.user.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.user.is_active ? 'Actif' : 'Inactif'}
            </span>
          )
        }
      ],
      searchFields: ['user.nom', 'user.prenom', 'user.email', 'matricule'],
      filters: {
        statut: {
          type: 'select' as const,
          placeholder: 'Statut',
          options: [
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Actif' },
            { value: 'inactive', label: 'Inactif' }
          ],
          filterFunction: (item: EleveDetail, value: string) => 
            value === 'all' || 
            (value === 'active' ? item.user.is_active : !item.user.is_active)
        }
      },
      form: ({ item, onSubmit, onCancel, isSubmitting }: any) => (
        <PersonneForm
          item={item}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          entityType="eleve"
        />
      ),
      createLabel: 'Nouvel élève',
      exportFunction: exportElevesToExcel,
      importType: 'eleves' as const,
      onImport: handleElevesImport
    },
    {
      id: 'tuteurs',
      label: 'Tuteurs',
      icon: UserCheck,
      items: tuteursDetails,
      columns: [
        {
          key: 'nom',
          label: 'Nom',
          render: (item: TuteurDetail) => (
            <span className="font-medium">{item.user.nom}</span>
          )
        },
        {
          key: 'prenom',
          label: 'Prénom',
          render: (item: TuteurDetail) => item.user.prenom
        },
        {
          key: 'email',
          label: 'Email',
          render: (item: TuteurDetail) => item.user.email
        },
        {
          key: 'tel1',
          label: 'Téléphone',
          render: (item: TuteurDetail) => item.user.tel1
        },
        {
          key: 'profession',
          label: 'Profession',
          render: (item: TuteurDetail) => item.profession
        },
        {
          key: 'statut',
          label: 'Statut',
          render: (item: TuteurDetail) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.user.is_active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {item.user.is_active ? 'Actif' : 'Inactif'}
            </span>
          )
        }
      ],
      searchFields: ['user.nom', 'user.prenom', 'user.email', 'profession'],
      filters: {
        statut: {
          type: 'select' as const,
          placeholder: 'Statut',
          options: [
            { value: 'all', label: 'Tous' },
            { value: 'active', label: 'Actif' },
            { value: 'inactive', label: 'Inactif' }
          ],
          filterFunction: (item: TuteurDetail, value: string) => 
            value === 'all' || 
            (value === 'active' ? item.user.is_active : !item.user.is_active)
        }
      },
      form: ({ item, onSubmit, onCancel, isSubmitting }: any) => (
        <PersonneForm
          item={item}
          onSubmit={onSubmit}
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          entityType="tuteur"
        />
      ),
      createLabel: 'Nouveau tuteur',
      exportFunction: exportTuteursToExcel,
      importType: 'tuteurs' as const,
      onImport: handleTuteursImport
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <DataManagementPage
      title="Gestion des Personnes"
      description="Gérez les informations des élèves et tuteurs"
      tabs={tabs}
      fromApi={false}
      additionalProps={{
        createEleveDetail,
        updateEleveDetail,
        deleteEleveDetail,
        createTuteurDetail,
        updateTuteurDetail,
        deleteTuteurDetail,
      }}
    />
  );
};

export default Personnes;
