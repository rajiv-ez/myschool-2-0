
import React from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useInscriptionForm } from '@/hooks/useInscriptionForm';
import EleveSearchSelect from './inscription/EleveSearchSelect';
import ClasseAcademiqueSelect from './inscription/ClasseAcademiqueSelect';
import StatutSelect from './inscription/StatutSelect';
import ReinscriptionCheckbox from './inscription/ReinscriptionCheckbox';
import DateInscriptionField from './inscription/DateInscriptionField';
import CapacityAlert from './inscription/CapacityAlert';

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
    isReinscription,
    capacityError,
    duplicateError,
    handleClasseAcademiqueChange,
    handleEleveChange,
    handleSubmit
  } = useInscriptionForm({
    isEditing,
    selectedInscription,
    classesAcademiques,
    onSubmit
  });

  const isFormValid = selectedClasseAcademique && 
                     form.watch('eleve') && 
                     !capacityError &&
                     !duplicateError;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <EleveSearchSelect 
          control={form.control}
          elevesWithUserInfo={elevesWithUserInfo}
          onValueChange={handleEleveChange}
          disabled={isEditing}
        />
        
        <ClasseAcademiqueSelect
          control={form.control}
          activeClassesAcademiques={activeClassesAcademiques}
          onValueChange={handleClasseAcademiqueChange}
        />

        <CapacityAlert capacityError={capacityError} />
        
        {duplicateError && (
          <CapacityAlert capacityError={duplicateError} />
        )}
        
        <StatutSelect control={form.control} />

        <ReinscriptionCheckbox 
          control={form.control}
          isReinscription={isReinscription}
        />
        
        <DateInscriptionField control={form.control} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button 
            type="submit"
            disabled={!isFormValid}
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InscriptionForm;
