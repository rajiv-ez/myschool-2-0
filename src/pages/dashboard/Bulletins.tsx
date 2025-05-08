
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BulletinsFilters from '@/components/bulletins/BulletinsFilters';
import BulletinDetail from '@/components/bulletins/BulletinDetail';
import BulletinPrintModal from '@/components/bulletins/BulletinPrintModal';
import { Eleve, Note, UniteEnseignement, Matiere, FilterOptions } from '@/components/bulletins/types';

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
  const [filters, setFilters] = useState<FilterOptions>({
    session: "all",
    palier: "all",
    classe: "all"
  });
  const [notes] = useState<Note[]>(demoNotes);
  const [selectedEleve, setSelectedEleve] = useState(eleves[0].id);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [printAllMode, setPrintAllMode] = useState(false);

  // Gérer l'impression des bulletins
  const handlePrint = () => {
    window.print();
    setPrintModalOpen(false);
    toast({
      title: printAllMode ? "Bulletins imprimés" : "Bulletin imprimé",
      description: printAllMode ? "Les bulletins ont été envoyés à l'impression." : "Le bulletin a été envoyé à l'impression."
    });
  };

  // Ouvrir la modal d'aperçu d'impression
  const openPrintPreview = (eleveId?: string, all: boolean = false) => {
    if (eleveId) {
      setSelectedEleve(eleveId);
    }
    setPrintAllMode(all);
    setPrintModalOpen(true);
  };

  // Filtrer les élèves selon les filtres sélectionnés
  const filteredEleves = eleves.filter(eleve => {
    if (filters.classe !== "all" && eleve.classe.toLowerCase() !== filters.classe.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Mettre à jour les filtres
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
            onClick={() => openPrintPreview(undefined, true)} 
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimer Tous</span>
            <span className="sm:hidden">Imprimer</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              toast({
                title: "Export PDF",
                description: "Les bulletins ont été exportés en PDF"
              });
            }}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exporter PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
          <Button 
            onClick={() => openPrintPreview(selectedEleve)} 
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Imprimer Sélection</span>
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <BulletinsFilters filters={filters} updateFilter={updateFilter} />

      {/* Onglets des élèves */}
      <div className="border rounded-lg shadow bg-white">
        <Tabs 
          defaultValue={eleves[0].id} 
          value={selectedEleve} 
          onValueChange={setSelectedEleve}
          className="p-6"
        >
          <ScrollArea className="w-full" type="always">
            <div className="pb-3">
              <TabsList className="w-full flex-nowrap flex justify-start overflow-x-auto">
                {filteredEleves.map(eleve => (
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

          {filteredEleves.map(eleve => (
            <TabsContent key={eleve.id} value={eleve.id} className="mt-4">
              <BulletinDetail 
                eleve={eleve}
                notes={notes}
                unitesEnseignement={unitesEnseignement}
                matieres={matieres}
                eleves={eleves}
                openPrintPreview={(eleveId) => openPrintPreview(eleveId)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Modal d'aperçu d'impression */}
      <BulletinPrintModal 
        open={printModalOpen}
        setOpen={setPrintModalOpen}
        selectedEleve={selectedEleve}
        printAllMode={printAllMode}
        eleves={eleves}
        notes={notes}
        unitesEnseignement={unitesEnseignement}
        matieres={matieres}
        filters={filters}
        filteredEleves={filteredEleves}
        handlePrint={handlePrint}
      />

      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          .bulletin-page, .bulletin-page * {
            visibility: visible;
          }
          .bulletin-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
          .page-break {
            page-break-before: always;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Bulletins;
