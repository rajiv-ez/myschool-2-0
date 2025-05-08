
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer, X } from 'lucide-react';
import BulletinTemplate from './BulletinTemplate';
import { Eleve, Note, UniteEnseignement, Matiere, FilterOptions } from './types';

interface BulletinPrintModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEleve: string;
  printAllMode: boolean;
  eleves: Eleve[];
  notes: Note[];
  unitesEnseignement: UniteEnseignement[];
  matieres: Matiere[];
  filters: FilterOptions;
  filteredEleves: Eleve[];
  handlePrint: () => void;
}

const BulletinPrintModal: React.FC<BulletinPrintModalProps> = ({
  open,
  setOpen,
  selectedEleve,
  printAllMode,
  eleves,
  notes,
  unitesEnseignement,
  matieres,
  filters,
  filteredEleves,
  handlePrint
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Aperçu avant impression
            </DialogTitle>
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-2">
              <Printer size={16} />
              <span>Imprimer</span>
            </Button>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-8rem)] p-6">
          {printAllMode ? (
            <div>
              {filteredEleves.map(eleve => (
                <BulletinTemplate 
                  key={eleve.id}
                  eleve={eleve}
                  notes={notes}
                  unitesEnseignement={unitesEnseignement}
                  matieres={matieres}
                  session={filters.session !== "all" ? filters.session : "2024-2025"}
                  periode={filters.palier !== "all" ? 
                    filters.palier === "trimestre1" ? "1er Trimestre" : 
                    filters.palier === "trimestre2" ? "2ème Trimestre" : 
                    "3ème Trimestre" : "1er Trimestre"
                  }
                />
              ))}
            </div>
          ) : (
            <BulletinTemplate 
              eleve={eleves.find(e => e.id === selectedEleve) || eleves[0]}
              notes={notes}
              unitesEnseignement={unitesEnseignement}
              matieres={matieres}
              session={filters.session !== "all" ? filters.session : "2024-2025"}
              periode={filters.palier !== "all" ? 
                filters.palier === "trimestre1" ? "1er Trimestre" : 
                filters.palier === "trimestre2" ? "2ème Trimestre" : 
                "3ème Trimestre" : "1er Trimestre"
              }
            />
          )}
        </ScrollArea>
        <DialogFooter className="sticky bottom-0 bg-white px-6 py-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <X size={16} />
            <span>Fermer</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulletinPrintModal;
