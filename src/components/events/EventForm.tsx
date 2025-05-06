
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Check, Plus, Users, School, Book, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

// Types
interface Event {
  id: number;
  title: string;
  type: string;
  start: Date;
  end: Date;
  description: string;
  palier?: string;
  allDay: boolean;
  recurring?: boolean;
  recurrencePattern?: string;
  academicClasses?: string[];
  subjects?: string[];
  professors?: string[];
  assistants?: string[];
  rooms?: string[];
}

interface AcademicClass {
  id: number;
  name: string;
  session: string;
  mainTeacher: string;
  capacity: number;
  enrolled: number;
  status: string;
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
  academicClasses: AcademicClass[];
  professors: string[];
  rooms: string[];
  subjects: string[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  isEditing,
  selectedEvent,
  paliers,
  academicClasses,
  professors,
  rooms,
  subjects,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [matchingPaliers, setMatchingPaliers] = useState<Palier[]>([]);
  const [autoDetectPalier, setAutoDetectPalier] = useState(true);
  const [eventType, setEventType] = useState(isEditing && selectedEvent ? selectedEvent.type : 'meeting');
  
  // Multi-selection states
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  
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
  
  // Initialize multi-selection states from selected event
  useEffect(() => {
    if (isEditing && selectedEvent) {
      setSelectedClasses(selectedEvent.academicClasses || []);
      setSelectedRooms(selectedEvent.rooms || []);
      setSelectedProfessors(selectedEvent.professors || []);
      setSelectedAssistants(selectedEvent.assistants || []);
      setSelectedSubject(selectedEvent.subjects?.[0] || "");
      setEventType(selectedEvent.type);
    }
  }, [isEditing, selectedEvent]);
  
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
  
  // Handle adding and removing items from multi-selection arrays
  const toggleClass = (className: string) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter(c => c !== className));
    } else {
      setSelectedClasses([...selectedClasses, className]);
    }
  };
  
  const toggleRoom = (room: string) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };
  
  const toggleProfessor = (professor: string) => {
    if (selectedProfessors.includes(professor)) {
      setSelectedProfessors(selectedProfessors.filter(p => p !== professor));
    } else {
      setSelectedProfessors([...selectedProfessors, professor]);
    }
  };
  
  const toggleAssistant = (assistant: string) => {
    if (selectedAssistants.includes(assistant)) {
      setSelectedAssistants(selectedAssistants.filter(a => a !== assistant));
    } else {
      setSelectedAssistants([...selectedAssistants, assistant]);
    }
  };
  
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
      type: eventType,
      palier: selectedPalier ? selectedPalier.nom : undefined,
      academicClasses: selectedClasses,
      rooms: selectedRooms,
      professors: selectedProfessors,
      assistants: selectedAssistants,
      subjects: selectedSubject ? [selectedSubject] : []
    };
    
    onSubmit(formattedData);
  };
  
  // Récurrence conditionnelle
  const isRecurring = form.watch('recurring');
  
  // Render multi-selection badges
  const renderSelectedBadges = (items: string[], onRemove: (item: string) => void) => {
    return items.map(item => (
      <Badge key={item} className="m-1 flex items-center gap-1">
        {item}
        <button 
          type="button" 
          onClick={() => onRemove(item)} 
          className="ml-1 rounded-full hover:bg-primary-foreground/20"
        >
          <X size={14} />
        </button>
      </Badge>
    ));
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-h-[70vh] overflow-y-auto pr-1">
        <div className="space-y-4">
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
                  onValueChange={(value) => {
                    field.onChange(value);
                    setEventType(value);
                  }}
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
          
          {/* Champs dynamiques selon le type d'événement */}
          {(eventType === 'class' || eventType === 'exam') && (
            <div className="space-y-4 rounded-md border p-4">
              <h3 className="font-medium">Détails spécifiques</h3>
              
              {/* Classes académiques (multi-sélection) */}
              <div className="space-y-2">
                <FormLabel>Classes académiques</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      type="button"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      {selectedClasses.length > 0 
                        ? `${selectedClasses.length} classe(s) sélectionnée(s)` 
                        : "Sélectionner des classes"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <ScrollArea className="h-72 p-2">
                      <div className="space-y-2">
                        {academicClasses.map((academicClass) => (
                          <div key={academicClass.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`class-${academicClass.id}`}
                              checked={selectedClasses.includes(academicClass.name)}
                              onCheckedChange={() => toggleClass(academicClass.name)}
                            />
                            <label 
                              htmlFor={`class-${academicClass.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {academicClass.name} ({academicClass.session})
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap">
                  {renderSelectedBadges(selectedClasses, (cls) => toggleClass(cls))}
                </div>
              </div>
              
              {/* Matière */}
              {eventType === 'class' && (
                <div className="space-y-2">
                  <FormLabel>Matière</FormLabel>
                  <Select 
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Professeurs (multi-sélection) */}
              <div className="space-y-2">
                <FormLabel>Professeurs</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      type="button"
                    >
                      <School className="mr-2 h-4 w-4" />
                      {selectedProfessors.length > 0 
                        ? `${selectedProfessors.length} professeur(s) sélectionné(s)` 
                        : "Sélectionner des professeurs"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <ScrollArea className="h-72 p-2">
                      <div className="space-y-2">
                        {professors.map((professor) => (
                          <div key={professor} className="flex items-center space-x-2">
                            <Checkbox
                              id={`prof-${professor}`}
                              checked={selectedProfessors.includes(professor)}
                              onCheckedChange={() => toggleProfessor(professor)}
                            />
                            <label 
                              htmlFor={`prof-${professor}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {professor}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap">
                  {renderSelectedBadges(selectedProfessors, (prof) => toggleProfessor(prof))}
                </div>
              </div>
              
              {/* Suppléants (multi-sélection) - pour les examens principalement */}
              {eventType === 'exam' && (
                <div className="space-y-2">
                  <FormLabel>Suppléants / Surveillants</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        type="button"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {selectedAssistants.length > 0 
                          ? `${selectedAssistants.length} suppléant(s) sélectionné(s)` 
                          : "Sélectionner des suppléants"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <ScrollArea className="h-72 p-2">
                        <div className="space-y-2">
                          {professors.map((professor) => (
                            <div key={professor} className="flex items-center space-x-2">
                              <Checkbox
                                id={`assist-${professor}`}
                                checked={selectedAssistants.includes(professor)}
                                onCheckedChange={() => toggleAssistant(professor)}
                              />
                              <label 
                                htmlFor={`assist-${professor}`}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {professor}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap">
                    {renderSelectedBadges(selectedAssistants, (assist) => toggleAssistant(assist))}
                  </div>
                </div>
              )}
            
              {/* Salles (multi-sélection) */}
              <div className="space-y-2">
                <FormLabel>Salles</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      type="button"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {selectedRooms.length > 0 
                        ? `${selectedRooms.length} salle(s) sélectionnée(s)` 
                        : "Sélectionner des salles"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <ScrollArea className="h-72 p-2">
                      <div className="space-y-2">
                        {rooms.map((room) => (
                          <div key={room} className="flex items-center space-x-2">
                            <Checkbox
                              id={`room-${room}`}
                              checked={selectedRooms.includes(room)}
                              onCheckedChange={() => toggleRoom(room)}
                            />
                            <label 
                              htmlFor={`room-${room}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {room}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap">
                  {renderSelectedBadges(selectedRooms, (room) => toggleRoom(room))}
                </div>
              </div>
            </div>
          )}
          
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
                          <SelectItem value="none" disabled>
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
        </div>
        
        <DialogFooter className="pt-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit">{isEditing ? 'Mettre à jour' : 'Créer'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;
