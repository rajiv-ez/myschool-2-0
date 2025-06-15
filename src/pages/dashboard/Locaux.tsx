
import React from 'react';
import { Building, Home, DoorClosed } from 'lucide-react';
import DataManagementPage, { TabConfig } from '@/components/templates/DataManagementPage';
import SuccursaleForm from '@/components/forms/SuccursaleForm';
import BatimentForm from '@/components/forms/BatimentForm';
import SalleForm from '@/components/forms/SalleForm';
import { useInfrastructureData } from '@/hooks/useInfrastructureData';
import { exportSuccursalesToExcel, exportBatimentsToExcel, exportSallesToExcel } from '@/utils/excelUtils';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';

const Locaux: React.FC = () => {
  const {
    succursales, batiments, salles,
    createSuccursale, updateSuccursale, deleteSuccursale,
    createBatiment, updateBatiment, deleteBatiment,
    createSalle, updateSalle, deleteSalle,
    fromApi
  } = useInfrastructureData();

  function getSuccursaleName(id: number) {
    return succursales.find(s => s.id === id)?.nom || 'Inconnue';
  }

  function getBatimentName(id: number) {
    return batiments.find(b => b.id === id)?.nom || 'Inconnu';
  }

  const handleImportData = async (type: string, data: any[]) => {
    try {
      switch (type) {
        case 'succursales':
          for (const item of data) {
            await createSuccursale(item);
          }
          break;
        case 'batiments':
          for (const item of data) {
            await createBatiment(item);
          }
          break;
        case 'salles':
          for (const item of data) {
            await createSalle(item);
          }
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  const tabs: TabConfig<Succursale | Batiment | Salle>[] = [
    {
      id: 'succursales',
      label: 'Succursales',
      icon: Building,
      items: succursales,
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'nom', label: 'Nom', render: (item) => <span className="font-medium">{(item as Succursale).nom}</span> },
        { key: 'adresse', label: 'Adresse' },
        { key: 'ville', label: 'Ville' },
        { key: 'pays', label: 'Pays' },
        { 
          key: 'est_siege', 
          label: 'Siège', 
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              (item as Succursale).est_siege ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {(item as Succursale).est_siege ? 'Siège' : 'Annexe'}
            </span>
          )
        },
      ],
      searchFields: ['nom', 'ville', 'adresse'],
      form: SuccursaleForm,
      createLabel: 'Nouvelle Succursale',
      exportFunction: exportSuccursalesToExcel,
      importType: 'succursales',
      onImport: (data) => handleImportData('succursales', data),
    },
    {
      id: 'batiments',
      label: 'Bâtiments',
      icon: Home,
      items: batiments,
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'nom', label: 'Nom', render: (item) => <span className="font-medium">{(item as Batiment).nom}</span> },
        { key: 'succursale', label: 'Succursale', render: (item) => getSuccursaleName((item as Batiment).succursale) },
      ],
      searchFields: ['nom'],
      filters: {
        batimentSuccursale: {
          type: 'select',
          placeholder: 'Succursale',
          options: succursales.map(s => ({ value: s.id.toString(), label: s.nom })),
          filterFunction: (item: Batiment, value: string) => item.succursale === parseInt(value)
        }
      },
      form: BatimentForm,
      createLabel: 'Nouveau Bâtiment',
      exportFunction: (items) => exportBatimentsToExcel(items as Batiment[], succursales),
      importType: 'batiments',
      onImport: (data) => handleImportData('batiments', data),
    },
    {
      id: 'salles',
      label: 'Salles',
      icon: DoorClosed,
      items: salles,
      columns: [
        { key: 'id', label: 'ID' },
        { key: 'nom', label: 'Nom', render: (item) => <span className="font-medium">{(item as Salle).nom}</span> },
        { key: 'batiment', label: 'Bâtiment', render: (item) => getBatimentName((item as Salle).batiment) },
        { 
          key: 'capacite', 
          label: 'Capacité',
          render: (item) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              (item as Salle).capacite <= 30 ? 'bg-orange-100 text-orange-800' :
              (item as Salle).capacite <= 100 ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {(item as Salle).capacite} places
            </span>
          )
        },
      ],
      searchFields: ['nom'],
      filters: {
        salleCapacite: {
          type: 'select',
          placeholder: 'Capacité',
          options: [
            { value: 'small', label: '≤ 30' },
            { value: 'medium', label: '31-100' },
            { value: 'large', label: '> 100' }
          ],
          filterFunction: (item: Salle, value: string) => {
            switch (value) {
              case 'small': return item.capacite <= 30;
              case 'medium': return item.capacite > 30 && item.capacite <= 100;
              case 'large': return item.capacite > 100;
              default: return true;
            }
          }
        }
      },
      form: SalleForm,
      createLabel: 'Nouvelle Salle',
      exportFunction: (items) => exportSallesToExcel(items as Salle[], batiments),
      importType: 'salles',
      onImport: (data) => handleImportData('salles', data),
    },
  ];

  return (
    <DataManagementPage
      title="Gestion des Locaux"
      description="Gérez les succursales, bâtiments et salles de votre établissement"
      tabs={tabs}
      fromApi={fromApi}
      additionalProps={{ succursales, batiments }}
    />
  );
};

export default Locaux;
