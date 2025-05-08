
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FilterToolbar from '@/components/notes/FilterToolbar';
import GradesTable from '@/components/notes/GradesTable';
import { Student, Subject, Grade, FilterOptions } from '@/components/notes/types';

// Données de démonstration
const mockStudents: Student[] = [
  { id: '1', name: 'Marie Dupont', classe: 'CM1' },
  { id: '2', name: 'Thomas Martin', classe: 'CM1' },
  { id: '3', name: 'Lucie Bernard', classe: 'CM1' },
  { id: '4', name: 'Nicolas Petit', classe: 'CM2' },
  { id: '5', name: 'Emma Robert', classe: 'CM2' },
  { id: '6', name: 'Lucas Richard', classe: 'CM2' },
];

const mockSubjects: Subject[] = [
  { id: '1', name: 'Français', teacher: 'Mme Laurent', coefficient: 3 },
  { id: '2', name: 'Mathématiques', teacher: 'M. Dubois', coefficient: 3 },
  { id: '3', name: 'Histoire-Géo', teacher: 'Mme Rousseau', coefficient: 2 },
  { id: '4', name: 'Sciences', teacher: 'M. Lefèvre', coefficient: 2 },
  { id: '5', name: 'Anglais', teacher: 'M. Moreau', coefficient: 2 },
];

// Générer des notes de démonstration
const generateMockGrades = (): Grade[] => {
  const grades: Grade[] = [];
  
  mockStudents.forEach(student => {
    mockSubjects.forEach(subject => {
      // Ne générer des notes que pour certains étudiants/matières
      if (Math.random() > 0.3) {
        grades.push({
          studentId: student.id,
          subjectId: subject.id,
          value: parseFloat((Math.random() * 10 + 10).toFixed(1)), // Note entre 10 et 20
          comment: "Travail satisfaisant",
          date: new Date().toISOString(),
        });
      }
    });
  });
  
  return grades;
};

const mockGrades = generateMockGrades();

const Notes: React.FC = () => {
  const { toast } = useToast();
  const [grades, setGrades] = useState<Grade[]>(mockGrades);
  const [filters, setFilters] = useState<FilterOptions>({
    classe: 'all',
    subject: 'all',
    period: 'all'
  });

  // Liste des valeurs uniques pour les filtres
  const classes = Array.from(new Set(mockStudents.map(s => s.classe)));
  const subjects = Array.from(new Set(mockSubjects.map(s => s.name)));
  const periods = ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'];

  // Mise à jour des filtres
  const handleFilterChange = (filter: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  // Filtrer les étudiants selon les critères
  const filteredStudents = mockStudents.filter(student => {
    if (filters.classe !== 'all' && student.classe !== filters.classe) {
      return false;
    }
    return true;
  });

  // Filtrer les matières selon les critères
  const filteredSubjects = mockSubjects.filter(subject => {
    if (filters.subject !== 'all' && subject.name !== filters.subject) {
      return false;
    }
    return true;
  });

  // Mise à jour d'une note
  const handleGradeUpdate = (studentId: string, subjectId: string, value: number, comment: string) => {
    const existingGradeIndex = grades.findIndex(
      g => g.studentId === studentId && g.subjectId === subjectId
    );
    
    if (existingGradeIndex >= 0) {
      // Mettre à jour la note existante
      const updatedGrades = [...grades];
      updatedGrades[existingGradeIndex] = {
        ...updatedGrades[existingGradeIndex],
        value,
        comment,
        date: new Date().toISOString()
      };
      setGrades(updatedGrades);
    } else {
      // Ajouter une nouvelle note
      setGrades([
        ...grades,
        {
          studentId,
          subjectId,
          value,
          comment,
          date: new Date().toISOString()
        }
      ]);
    }
    
    toast({
      title: "Note enregistrée",
      description: "La note a été enregistrée avec succès."
    });
  };

  // Export des notes
  const handleExport = () => {
    toast({
      title: "Export des notes",
      description: "Les notes ont été exportées au format CSV."
    });
  };

  // Impression des notes
  const handlePrint = () => {
    window.print();
    toast({
      title: "Impression",
      description: "La grille de notes a été envoyée à l'imprimante."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Saisie des notes</h2>
          <p className="text-muted-foreground">Consultez et modifiez les notes des élèves</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Exporter</span>
          </Button>
          <Button 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Imprimer</span>
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <FilterToolbar 
        filters={filters}
        classes={classes}
        subjects={subjects}
        periods={periods}
        onFilterChange={handleFilterChange}
      />

      {/* Table des notes */}
      <GradesTable
        students={filteredStudents}
        subjects={filteredSubjects}
        grades={grades}
        onGradeUpdate={handleGradeUpdate}
      />
    </div>
  );
};

export default Notes;
