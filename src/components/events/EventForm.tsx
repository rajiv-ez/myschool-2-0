
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { parse, format, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

// Types
interface Event {
  id: number;
  title: string;
  type: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  palier?: string;
  allDay: boolean;
  recurring?: boolean;
  recurrencePattern?: string;
}

interface Palier {
  id: number;
  nom: string;
  session: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
}

interface EventFormProps {
  isEditing: boolean;
  selectedEvent: Event | null;
  paliers: Palier[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  isEditing,
  selectedEvent,
  paliers,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [matchingPaliers, setMatchingPaliers] = useState<Palier[]>([]);
  const [autoDetectPalier, setAutoDetectPalier] = useState(true);
  
  // Initialiser le formulaire
  const form = useForm({
    defaultValues: {
      title: isEditing && selectedEvent ? selectedEvent.title : '',
      type: isEditing && selectedEvent ? selectedEvent.type : 'meeting',
      start: isEditing && selectedEvent 
        ? format(selectedEvent.start, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: isEditing && selectedEvent 
        ? format(selectedEvent.end, "yyyy-MM-dd'T'HH:mm")
        : format(new Date(Date.now() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
      description: isEditing && selectedEvent ? selectedEvent.description : '',
      location: isEditing && selectedEvent ? selectedEvent.location : '',
      palierId: isEditing && selectedEvent && selectedEvent.palier
        ? paliers.find(p => p.nom === selectedEvent.palier)?.id.toString() || ''
        : '',
      allDay: isEditing && selectedEvent ? selectedEvent.allDay : false,
      recurring: isEditing && selectedEvent ? !!selectedEvent.recurring : false,
      recurrencePattern: isEditing && selectedEvent && selectedEvent.recurrencePattern 
        ? selectedEvent.recurrencePattern 
        : 'weekly'
    }
  });
  
  // Détecter automatiquement le palier correspondant aux dates sélectionnées
  useEffect(() => {
    if (!autoDetectPalier) return;
    
    const startStr = form.watch('start');
    const endStr = form.watch('end');
    
    if (!startStr || !endStr) {
      setMatchingPaliers([]);
      return;
    }
    
    try {
      const startDate = new Date(startStr);
      const endDate = new Date(endStr);
      
      // Trouver les paliers qui contiennent ces dates
      const matching = paliers.filter(palier => {
        const palierStart = parse(palier.dateDebut, 'dd/MM/yyyy', new Date());
        const palierEnd = parse(palier.dateFin, 'dd/MM/yyyy', new Date());
        
        return isWithinInterval(startDate, { start: palierStart, end: palierEnd }) &&
               isWithinInterval(endDate, { start: palierStart, end: palierEnd });
      });
      
      setMatchingPaliers(matching);
      
      // Si un seul palier correspond, le sélectionner automatiquement
      if (matching.length === 1) {
        form.setValue('palierId', matching[0].id.toString());
      }
    } catch (error) {
      console.error("Erreur lors de la détection du palier:", error);
    }
  }, [form.watch('start'), form.watch('end'), autoDetectPalier, paliers]);
  
  // Soumission du formulaire
  const handleSubmit = (data: any) => {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    
    if (startDate >= endDate) {
      toast({
        title: "Erreur de validation",
        description: "La date de début doit être antérieure à la date de fin.",
        variant: "destructive"
      });
      return;
    }
    
    // Trouver le palier sélectionné
    const selectedPalier = data.palierId 
      ? paliers.find(p => p.id.toString() === data.palierId) 
      : null;
    
    const formattedData = {
      ...data,
      start: startDate,
      end: endDate,
      palier: selectedPalier ? selectedPalier.nom : undefined
    };
    
    onSubmit(formattedData);
  };
  
  // Récurrence conditionnelle
  const isRecurring = form.watch('recurring');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'événement</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="meeting">Réunion</SelectItem>
                  <SelectItem value="class">Cours</SelectItem>
                  <SelectItem value="exam">Examen</SelectItem>
                  <SelectItem value="holiday">Congé</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date et heure de début</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date et heure de fin</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Journée entière</FormLabel>
                <FormDescription>
                  Cochez cette case si l'événement dure toute la journée
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Gestion des paliers avec auto-détection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>Palier</FormLabel>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-detect"
                checked={autoDetectPalier} 
                onCheckedChange={(checked) => setAutoDetectPalier(checked === true)}
              />
              <label 
                htmlFor="auto-detect" 
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Auto-détecter
              </label>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="palierId"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={autoDetectPalier && matchingPaliers.length === 1}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un palier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {autoDetectPalier ? (
                      matchingPaliers.length > 0 ? (
                        matchingPaliers.map(palier => (
                          <SelectItem key={palier.id} value={palier.id.toString()}>
                            {palier.nom} ({palier.session})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Aucun palier correspondant aux dates
                        </SelectItem>
                      )
                    ) : (
                      paliers.map(palier => (
                        <SelectItem key={palier.id} value={palier.id.toString()}>
                          {palier.nom} ({palier.session})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {autoDetectPalier && matchingPaliers.length === 0 && (
                  <p className="text-sm text-amber-600">
                    Attention: Les dates choisies ne correspondent à aucun palier.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Récurrence */}
        <FormField
          control={form.control}
          name="recurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Événement récurrent</FormLabel>
                <FormDescription>
                  Cochez cette case si l'événement se répète régulièrement
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        {isRecurring && (
          <FormField
            control={form.control}
            name="recurrencePattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de récurrence</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de récurrence" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Quotidienne</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;
