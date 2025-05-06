
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { format, parse, isWithinInterval, areIntervalsOverlapping } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

// Type pour les sessions
interface Session {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  paliers: number;
}

// Type pour les paliers
interface Palier {
  id: number;
  nom: string;
  session: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
}

interface PalierFormProps {
  isEditing: boolean;
  selectedItem: Palier | null;
  sessions: Session[];
  existingPaliers: Palier[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PalierForm: React.FC<PalierFormProps> = ({
  isEditing,
  selectedItem,
  sessions,
  existingPaliers,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [dateErrors, setDateErrors] = useState({
    overlap: false,
    outsideSession: false
  });

  // Initialiser le formulaire
  const form = useForm({
    defaultValues: {
      nom: isEditing && selectedItem ? selectedItem.nom : '',
      session: isEditing && selectedItem ? selectedItem.session : sessions.find(s => s.statut === 'Actif')?.nom || '',
      dateDebut: isEditing && selectedItem ? selectedItem.dateDebut.split('/').reverse().join('-') : '',
      dateFin: isEditing && selectedItem ? selectedItem.dateFin.split('/').reverse().join('-') : '',
      statut: isEditing && selectedItem ? selectedItem.statut : 'Planifié'
    }
  });

  // Mettre à jour la session sélectionnée quand le formulaire change
  useEffect(() => {
    const sessionName = form.watch('session');
    const session = sessions.find(s => s.nom === sessionName);
    setSelectedSession(session || null);
  }, [form.watch('session'), sessions]);

  // Vérifier les dates quand elles changent
  useEffect(() => {
    validateDates();
  }, [form.watch('dateDebut'), form.watch('dateFin'), selectedSession]);

  // Validation des dates
  const validateDates = () => {
    const dateDebut = form.watch('dateDebut');
    const dateFin = form.watch('dateFin');
    const sessionName = form.watch('session');
    
    let newErrors = { overlap: false, outsideSession: false };

    if (!dateDebut || !dateFin || !sessionName || !selectedSession) {
      return;
    }

    try {
      // Convertir les dates de formulaire (YYYY-MM-DD) en objets Date
      const startDate = new Date(dateDebut);
      const endDate = new Date(dateFin);
      
      // Convertir les dates de session (DD/MM/YYYY) en objets Date
      const sessionStart = parse(selectedSession.dateDebut, 'dd/MM/yyyy', new Date());
      const sessionEnd = parse(selectedSession.dateFin, 'dd/MM/yyyy', new Date());

      // Vérifier si les dates sont en dehors de la plage de la session
      if (!isWithinInterval(startDate, { start: sessionStart, end: sessionEnd }) ||
          !isWithinInterval(endDate, { start: sessionStart, end: sessionEnd })) {
        newErrors.outsideSession = true;
      }

      // Vérifier les chevauchements avec d'autres paliers
      const currentPalierId = isEditing && selectedItem ? selectedItem.id : -1;
      const otherPaliers = existingPaliers
        .filter(p => p.session === sessionName && p.id !== currentPalierId);

      const hasOverlap = otherPaliers.some(palier => {
        const palierStart = parse(palier.dateDebut, 'dd/MM/yyyy', new Date());
        const palierEnd = parse(palier.dateFin, 'dd/MM/yyyy', new Date());
        
        return areIntervalsOverlapping(
          { start: startDate, end: endDate },
          { start: palierStart, end: palierEnd }
        );
      });

      if (hasOverlap) {
        newErrors.overlap = true;
      }
    } catch (error) {
      console.error("Erreur lors de la validation des dates:", error);
    }

    setDateErrors(newErrors);
  };

  // Soumission du formulaire
  const handleSubmit = (data: any) => {
    if (dateErrors.overlap || dateErrors.outsideSession) {
      toast({
        title: "Erreur de validation",
        description: dateErrors.outsideSession 
          ? "Les dates doivent être comprises dans la période de la session."
          : "Ce palier chevauche un autre palier existant.",
        variant: "destructive"
      });
      return;
    }

    // Formater les dates pour l'affichage (YYYY-MM-DD -> DD/MM/YYYY)
    const formattedData = {
      ...data,
      dateDebut: data.dateDebut.split('-').reverse().join('/'),
      dateFin: data.dateFin.split('-').reverse().join('/')
    };

    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du palier</FormLabel>
              <FormControl>
                <Input placeholder="ex: Trimestre 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="session"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  // Réinitialiser les dates si la session change
                  if (!isEditing || field.value !== value) {
                    form.setValue('dateDebut', '');
                    form.setValue('dateFin', '');
                  }
                }} 
                defaultValue={field.value}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.nom}>
                      {session.nom} ({session.dateDebut} - {session.dateFin})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSession && (
                <div className="text-xs text-muted-foreground">
                  Période de la session: {selectedSession.dateDebut} au {selectedSession.dateFin}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateDebut"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Date de début</FormLabel>
                  {(dateErrors.overlap || dateErrors.outsideSession) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 ml-2 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {dateErrors.outsideSession 
                            ? "La date doit être comprise dans la période de la session."
                            : "Ce palier chevauche un autre palier existant."}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className={dateErrors.overlap || dateErrors.outsideSession ? "border-destructive" : ""}
                    disabled={!selectedSession}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateFin"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel>Date de fin</FormLabel>
                  {(dateErrors.overlap || dateErrors.outsideSession) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 ml-2 text-destructive" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {dateErrors.outsideSession 
                            ? "La date doit être comprise dans la période de la session."
                            : "Ce palier chevauche un autre palier existant."}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    className={dateErrors.overlap || dateErrors.outsideSession ? "border-destructive" : ""}
                    disabled={!selectedSession}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Planifié">Planifié</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button 
            type="submit"
            disabled={dateErrors.overlap || dateErrors.outsideSession}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PalierForm;
