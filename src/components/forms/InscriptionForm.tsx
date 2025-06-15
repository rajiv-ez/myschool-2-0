
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useInscriptionForm } from '@/hooks/useInscriptionForm';
import EleveSelect from './inscription/EleveSelect';
import ClasseAcademiqueSelect from './inscription/ClasseAcademiqueSelect';
import StatutSelect from './inscription/StatutSelect';
import ReinscriptionCheckbox from './inscription/ReinscriptionCheckbox';
import DateInscriptionField from './inscription/DateInscriptionField';

interface ClasseAcademique {
  id: number;
  classe: string;
  session: string;
  enseignant: string;
  eleves: number;
  capacite: number;
  statut: string;
}

interface Inscription {
  id: number;
  eleve: number;
  classe_session: number;
  date_inscription: string;
  est_reinscription: boolean;
  statut: string;
}

interface InscriptionFormProps {
  isEditing: boolean;
  selectedInscription: Inscription | null;
  classesAcademiques: ClasseAcademique[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const InscriptionForm: React.FC<InscriptionFormProps> = ({
  isEditing,
  selectedInscription,
  classesAcademiques,
  onSubmit,
  onCancel
}) => {
  const {
    form,
    selectedClasseAcademique,
    elevesWithUserInfo,
    activeClassesAcademiques,
    handleClasseAcademiqueChange,
    handleSubmit
  } = useInscriptionForm({
    isEditing,
    selectedInscription,
    classesAcademiques,
    onSubmit
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <EleveSelect 
          control={form.control}
          elevesWithUserInfo={elevesWithUserInfo}
        />
        
        <ClasseAcademiqueSelect
          control={form.control}
          activeClassesAcademiques={activeClassesAcademiques}
          onValueChange={handleClasseAcademiqueChange}
        />
        
        <StatutSelect control={form.control} />

        <ReinscriptionCheckbox register={form.register} />
        
        <DateInscriptionField control={form.control} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button 
            type="submit"
            disabled={!selectedClasseAcademique || !form.watch('eleve')}
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InscriptionForm;
