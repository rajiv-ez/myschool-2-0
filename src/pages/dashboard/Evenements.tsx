import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CalendarIcon, CalendarDays, Plus, Filter, Copy, Download, School, BookOpen, Award, User, Clock, Users, MapPin, Check, X } from 'lucide-react';

// Define event types
const EVENT_TYPES = {
  COURS: 'cours',
  EVALUATION: 'evaluation',
  EVENEMENT: 'evenement'
} as const;

type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

// Define interface for event extended props
interface EventExtendedProps {
  type: EventType;
  classe?: string;
  niveau?: string;
  matiere?: string;
  professeur?: string;
  salle?: string;
  description?: string;
}

// Define interface for events
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  backgroundColor: string;
  borderColor: string;
  extendedProps: EventExtendedProps;
}

// Colors for event types
const EVENT_COLORS = {
  [EVENT_TYPES.COURS]: '#4f46e5', // indigo pour les cours
  [EVENT_TYPES.EVALUATION]: '#e11d48', // rose pour les évaluations
  [EVENT_TYPES.EVENEMENT]: '#eab308' // amber pour les événements
};

// Sample data for demonstration
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Cours de Mathématiques',
    start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    extendedProps: {
      type: EVENT_TYPES.COURS,
      classe: 'CM1',
      matiere: 'Mathématiques',
      professeur: 'M. Dupont',
      salle: 'Salle 101',
      description: 'Cours sur les fractions',
      niveau: 'primaire'
    },
    backgroundColor: EVENT_COLORS[EVENT_TYPES.COURS],
    borderColor: EVENT_COLORS[EVENT_TYPES.COURS]
  },
  {
    id: '2',
    title: 'Évaluation de Français',
    start: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    end: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    extendedProps: {
      type: EVENT_TYPES.EVALUATION,
      classe: 'CM2',
      matiere: 'Français',
      professeur: 'Mme. Martin',
      salle: 'Salle 202',
      description: 'Contrôle sur la conjugaison',
      niveau: 'primaire'
    },
    backgroundColor: EVENT_COLORS[EVENT_TYPES.EVALUATION],
    borderColor: EVENT_COLORS[EVENT_TYPES.EVALUATION]
  },
  {
    id: '3',
    title: 'Journée Portes Ouvertes',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    allDay: true,
    extendedProps: {
      type: EVENT_TYPES.EVENEMENT,
      description: 'Journée portes ouvertes de l\'école',
      niveau: ''
    },
    backgroundColor: EVENT_COLORS[EVENT_TYPES.EVENEMENT],
    borderColor: EVENT_COLORS[EVENT_TYPES.EVENEMENT]
  }
];

// Form validation schema
const eventSchema = z.object({
  title: z.string().min(2, { message: 'Le titre est requis' }),
  type: z.string().min(1, { message: 'Le type d\'événement est requis' }),
  start: z.date({ required_error: 'La date de début est requise' }),
  end: z.date({ required_error: 'La date de fin est requise' }),
  allDay: z.boolean().optional(),
  classe: z.string().optional(),
  niveau: z.string().optional(),
  matiere: z.string().optional(),
  professeur: z.string().optional(),
  salle: z.string().optional(),
  description: z.string().optional()
}).refine(data => data.end > data.start, {
  message: "La date de fin doit être après la date de début",
  path: ["end"]
});

type EventFormValues = z.infer<typeof eventSchema>;

const Evenements: React.FC = () => {
  // ... keep existing code (state variables, refs, hooks)

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterClasse, setFilterClasse] = useState("");
  const [filterNiveau, setFilterNiveau] = useState("");
  const calendarRef = useRef<FullCalendar | null>(null);
  const { toast } = useToast();

  // Formulaire pour ajouter/éditer un événement
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: EVENT_TYPES.COURS,
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
      allDay: false,
      classe: '',
      niveau: '',
      matiere: '',
      professeur: '',
      salle: '',
      description: ''
    }
  });

  // ... keep existing code (useEffect hooks)

  useEffect(() => {
    if (isEventDialogOpen && !isEditing) {
      form.reset({
        title: '',
        type: EVENT_TYPES.COURS,
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 2)),
        allDay: false,
        classe: '',
        niveau: '',
        matiere: '',
        professeur: '',
        salle: '',
        description: ''
      });
    }
  }, [isEventDialogOpen, isEditing, form]);

  useEffect(() => {
    if (isEditing && selectedEvent) {
      form.reset({
        title: selectedEvent.title,
        type: selectedEvent.extendedProps?.type || EVENT_TYPES.COURS,
        start: new Date(selectedEvent.start),
        end: new Date(selectedEvent.end || selectedEvent.start),
        allDay: selectedEvent.allDay || false,
        classe: selectedEvent.extendedProps?.classe || '',
        niveau: selectedEvent.extendedProps?.niveau || '',
        matiere: selectedEvent.extendedProps?.matiere || '',
        professeur: selectedEvent.extendedProps?.professeur || '',
        salle: selectedEvent.extendedProps?.salle || '',
        description: selectedEvent.extendedProps?.description || ''
      });
    }
  }, [isEditing, selectedEvent, form]);

  const handleDateSelect = (selectInfo: any) => {
    form.setValue('start', selectInfo.start);
    form.setValue('end', selectInfo.end);
    form.setValue('allDay', selectInfo.allDay);
    setIsEditing(false);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsEventDetailsOpen(true);
  };

  const handleCreateOrUpdateEvent = (data: EventFormValues) => {
    const eventColor = EVENT_COLORS[data.type as keyof typeof EVENT_COLORS];
    
    const eventData: CalendarEvent = {
      id: isEditing && selectedEvent ? selectedEvent.id : String(new Date().getTime()),
      title: data.title,
      start: data.start.toISOString(),
      end: data.end.toISOString(),
      allDay: data.allDay,
      backgroundColor: eventColor,
      borderColor: eventColor,
      extendedProps: {
        type: data.type as EventType,
        classe: data.classe,
        niveau: data.niveau,
        matiere: data.matiere,
        professeur: data.professeur,
        salle: data.salle,
        description: data.description
      }
    };

    if (isEditing) {
      setEvents(events.map(event => event.id === eventData.id ? eventData : event));
      toast({
        title: "Événement mis à jour",
        description: `L'événement "${data.title}" a été mis à jour`,
      });
    } else {
      setEvents([...events, eventData]);
      toast({
        title: "Événement créé",
        description: `L'événement "${data.title}" a été ajouté au calendrier`,
      });
    }

    setIsEventDialogOpen(false);
    setIsEditing(false);
    setSelectedEvent(null);
  };

  // ... keep existing code (event handlers)

  const handleEditEvent = () => {
    setIsEditing(true);
    setIsEventDetailsOpen(false);
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      toast({
        title: "Événement supprimé",
        description: `L'événement "${selectedEvent.title}" a été supprimé`,
      });
      setIsEventDetailsOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDuplicateWeek = () => {
    const currentApi = calendarRef.current?.getApi();
    if (!currentApi) return;

    const currentView = currentApi.view;
    const currentStart = currentView.currentStart;
    
    const currentWeekEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      const weekStart = new Date(currentStart);
      const weekEnd = new Date(currentStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      return eventDate >= weekStart && eventDate < weekEnd;
    });
    
    if (currentWeekEvents.length === 0) {
      toast({
        title: "Aucun événement à dupliquer",
        description: "Il n'y a pas d'événements dans la semaine en cours",
        variant: "destructive"
      });
      return;
    }
    
    const newEvents = currentWeekEvents.map(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      startDate.setDate(startDate.getDate() + 7);
      endDate.setDate(endDate.getDate() + 7);
      
      return {
        ...event,
        id: String(new Date().getTime() + Math.random()),
        start: startDate.toISOString(),
        end: endDate.toISOString()
      };
    });
    
    setEvents([...events, ...newEvents]);
    toast({
      title: "Semaine dupliquée",
      description: `${newEvents.length} événements ont été dupliqués à la semaine suivante`,
    });
  };

  const handleGeneratePDF = () => {
    toast({
      title: "Programme généré",
      description: "Le programme hebdomadaire a été généré en PDF",
    });
  };

  const filteredEvents = events.filter(event => {
    if (filterClasse && event.extendedProps?.classe !== filterClasse) return false;
    if (filterNiveau && event.extendedProps?.niveau !== filterNiveau) return false;
    return true;
  });

  // ... keep existing code (JSX and render function)
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gestion des Événements</h2>
          <p className="text-muted-foreground">Planifiez et organisez tous vos événements scolaires</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                <span>Nouvel événement</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier l'événement" : "Nouvel événement"}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateOrUpdateEvent)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'événement" {...field} />
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
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={EVENT_TYPES.COURS}>Cours</SelectItem>
                            <SelectItem value={EVENT_TYPES.EVALUATION}>Évaluation</SelectItem>
                            <SelectItem value={EVENT_TYPES.EVENEMENT}>Événement scolaire</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de début</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal flex justify-between"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP à HH:mm", { locale: fr })
                                  ) : (
                                    <span>Choisir une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const currentDate = field.value || new Date();
                                    date.setHours(currentDate.getHours(), currentDate.getMinutes());
                                    field.onChange(date);
                                  }
                                }}
                              />
                              <div className="p-3 border-t border-border">
                                <Input
                                  type="time"
                                  value={format(field.value || new Date(), "HH:mm")}
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    const date = new Date(field.value || new Date());
                                    date.setHours(hours);
                                    date.setMinutes(minutes);
                                    field.onChange(date);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="end"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date de fin</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className="pl-3 text-left font-normal flex justify-between"
                                >
                                  {field.value ? (
                                    format(field.value, "PPP à HH:mm", { locale: fr })
                                  ) : (
                                    <span>Choisir une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const currentDate = field.value || new Date();
                                    date.setHours(currentDate.getHours(), currentDate.getMinutes());
                                    field.onChange(date);
                                  }
                                }}
                              />
                              <div className="p-3 border-t border-border">
                                <Input
                                  type="time"
                                  value={format(field.value || new Date(), "HH:mm")}
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    const date = new Date(field.value || new Date());
                                    date.setHours(hours);
                                    date.setMinutes(minutes);
                                    field.onChange(date);
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {form.watch('type') !== EVENT_TYPES.EVENEMENT && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="classe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Classe</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ''}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une classe" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="CP">CP</SelectItem>
                                <SelectItem value="CE1">CE1</SelectItem>
                                <SelectItem value="CE2">CE2</SelectItem>
                                <SelectItem value="CM1">CM1</SelectItem>
                                <SelectItem value="CM2">CM2</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="niveau"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niveau</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ''}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un niveau" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="primaire">Primaire</SelectItem>
                                <SelectItem value="college">Collège</SelectItem>
                                <SelectItem value="lycee">Lycée</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  {form.watch('type') === EVENT_TYPES.COURS && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="matiere"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Matière</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ''}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une matière" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mathematiques">Mathématiques</SelectItem>
                                <SelectItem value="francais">Français</SelectItem>
                                <SelectItem value="histoire_geo">Histoire-Géographie</SelectItem>
                                <SelectItem value="sciences">Sciences</SelectItem>
                                <SelectItem value="anglais">Anglais</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="professeur"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Professeur</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value || ''}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un professeur" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="M. Dupont">M. Dupont</SelectItem>
                                <SelectItem value="Mme. Martin">Mme. Martin</SelectItem>
                                <SelectItem value="M. Bernard">M. Bernard</SelectItem>
                                <SelectItem value="Mme. Thomas">Mme. Thomas</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="salle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salle</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ''}
                          value={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une salle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Salle 101">Salle 101</SelectItem>
                            <SelectItem value="Salle 102">Salle 102</SelectItem>
                            <SelectItem value="Salle 201">Salle 201</SelectItem>
                            <SelectItem value="Salle 202">Salle 202</SelectItem>
                            <SelectItem value="Gymnase">Gymnase</SelectItem>
                            <SelectItem value="Amphithéâtre">Amphithéâtre</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Textarea
                            placeholder="Description de l'événement"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEventDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      {isEditing ? "Mettre à jour" : "Créer"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={handleDuplicateWeek} className="flex items-center gap-2">
            <Copy size={16} />
            <span className="hidden sm:inline">Dupliquer la semaine</span>
            <span className="sm:hidden">Dupliquer</span>
          </Button>
          
          <Button variant="outline" onClick={handleGeneratePDF} className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Exporter PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter size={18} />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={filterClasse} onValueChange={setFilterClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les classes</SelectItem>
                  <SelectItem value="CP">CP</SelectItem>
                  <SelectItem value="CE1">CE1</SelectItem>
                  <SelectItem value="CE2">CE2</SelectItem>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau</label>
              <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  <SelectItem value="primaire">Primaire</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="h-[calc(100vh-24rem)]">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              locale={frLocale}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={filteredEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="100%"
              allDaySlot={true}
              slotDuration="00:30:00"
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(selectedEvent.start), "PPP", { locale: fr })}
                  {selectedEvent.allDay ? '' : ` à ${format(new Date(selectedEvent.start), "HH:mm", { locale: fr })}`}
                  {selectedEvent.end && !selectedEvent.allDay && 
                    ` - ${format(new Date(selectedEvent.end), "HH:mm", { locale: fr })}`}
                </span>
              </div>
              
              {selectedEvent.extendedProps?.type && (
                <div className="flex items-center gap-2">
                  {selectedEvent.extendedProps.type === EVENT_TYPES.COURS && <BookOpen className="h-4 w-4 text-muted-foreground" />}
                  {selectedEvent.extendedProps.type === EVENT_TYPES.EVALUATION && <Award className="h-4 w-4 text-muted-foreground" />}
                  {selectedEvent.extendedProps.type === EVENT_TYPES.EVENEMENT && <CalendarDays className="h-4 w-4 text-muted-foreground" />}
                  <span className="capitalize">
                    {selectedEvent.extendedProps.type === EVENT_TYPES.COURS && "Cours"}
                    {selectedEvent.extendedProps.type === EVENT_TYPES.EVALUATION && "Évaluation"}
                    {selectedEvent.extendedProps.type === EVENT_TYPES.EVENEMENT && "Événement scolaire"}
                  </span>
                </div>
              )}
              
              {selectedEvent.extendedProps?.classe && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Classe: {selectedEvent.extendedProps.classe}</span>
                </div>
              )}
              
              {selectedEvent.extendedProps?.matiere && (
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span>Matière: {selectedEvent.extendedProps.matiere}</span>
                </div>
              )}
              
              {selectedEvent.extendedProps?.professeur && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Professeur: {selectedEvent.extendedProps.professeur}</span>
                </div>
              )}
              
              {selectedEvent.extendedProps?.salle && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Salle: {selectedEvent.extendedProps.salle}</span>
                </div>
              )}
              
              {selectedEvent.extendedProps?.description && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm">{selectedEvent.extendedProps.description}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="destructive" onClick={handleDeleteEvent} className="flex items-center gap-2">
                  <X size={16} />
                  <span>Supprimer</span>
                </Button>
                <Button onClick={handleEditEvent} className="flex items-center gap-2">
                  <Check size={16} />
                  <span>Modifier</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Evenements;
