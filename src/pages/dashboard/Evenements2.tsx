import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO, isWithinInterval, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import EventForm from '@/components/events/EventForm';
import EventDeleteConfirmation from '@/components/events/EventDeleteConfirmation';
import { 
  CalendarDays, 
  Plus, 
  Filter, 
  Copy, 
  Download, 
  Search, 
  BookOpen, 
  Award, 
  User, 
  Clock, 
  Users, 
  MapPin, 
  Check, 
  X,
  School,
  Info,
  List
} from 'lucide-react';

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

// Sample data for academic classes, professors, rooms and subjects
const sampleAcademicClasses = [
  { id: 1, name: 'CM1', session: '2023-2024', mainTeacher: 'M. Dupont', capacity: 30, enrolled: 25, status: 'active' },
  { id: 2, name: 'CM2', session: '2023-2024', mainTeacher: 'Mme. Martin', capacity: 28, enrolled: 26, status: 'active' },
  { id: 3, name: 'CE2', session: '2023-2024', mainTeacher: 'M. Bernard', capacity: 30, enrolled: 22, status: 'active' },
  { id: 4, name: 'CE1', session: '2023-2024', mainTeacher: 'Mme. Thomas', capacity: 26, enrolled: 24, status: 'active' },
  { id: 5, name: 'CP', session: '2023-2024', mainTeacher: 'Mme. Petit', capacity: 25, enrolled: 20, status: 'active' },
];

const samplePaliers = [
  { id: 1, nom: 'Premier trimestre', session: '2023-2024', dateDebut: '01/09/2023', dateFin: '15/12/2023', statut: 'terminé' },
  { id: 2, nom: 'Second trimestre', session: '2023-2024', dateDebut: '16/12/2023', dateFin: '31/03/2024', statut: 'terminé' },
  { id: 3, nom: 'Troisième trimestre', session: '2023-2024', dateDebut: '01/04/2024', dateFin: '06/07/2024', statut: 'actif' },
];

const sampleProfessors = [
  'M. Dupont', 'Mme. Martin', 'M. Bernard', 'Mme. Thomas', 'M. Petit', 'Mme. Robert'
];

const sampleRooms = [
  'Salle 101', 'Salle 102', 'Salle 201', 'Salle 202', 'Gymnase', 'Amphithéâtre', 'Laboratoire', 'Bibliothèque'
];

const sampleSubjects = [
  'Mathématiques', 'Français', 'Histoire-Géographie', 'Sciences', 'Anglais', 'Arts plastiques', 'Musique', 'Sport'
];

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
  },
  {
    id: '4',
    title: 'Cours de Sciences',
    start: new Date(new Date().setDate(new Date().getDate() + 1).valueOf()).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 1).valueOf()).toISOString(),
    extendedProps: {
      type: EVENT_TYPES.COURS,
      classe: 'CE2',
      matiere: 'Sciences',
      professeur: 'M. Bernard',
      salle: 'Salle 103',
      description: 'Le cycle de l\'eau',
      niveau: 'primaire'
    },
    backgroundColor: EVENT_COLORS[EVENT_TYPES.COURS],
    borderColor: EVENT_COLORS[EVENT_TYPES.COURS]
  },
  {
    id: '5',
    title: 'Réunion Parents-Professeurs',
    start: new Date(new Date().setDate(new Date().getDate() + 3).valueOf()).toISOString(),
    end: new Date(new Date().setDate(new Date().getDate() + 3).valueOf()).toISOString(),
    extendedProps: {
      type: EVENT_TYPES.EVENEMENT,
      description: 'Réunion trimestrielle parents-professeurs',
      niveau: 'primaire'
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
  academicClasses: z.array(z.string()).optional(),
  subjects: z.array(z.string()).optional(),
  professors: z.array(z.string()).optional(),
  rooms: z.array(z.string()).optional(),
  description: z.string().optional()
}).refine(data => data.end > data.start, {
  message: "La date de fin doit être après la date de début",
  path: ["end"]
});

type EventFormValues = z.infer<typeof eventSchema>;

const Evenements2: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [filterClasse, setFilterClasse] = useState("all");
  const [filterNiveau, setFilterNiveau] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [searchQuery, setSearchQuery] = useState("");
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
      academicClasses: [],
      subjects: [],
      professors: [],
      rooms: [],
      description: ''
    }
  });

  useEffect(() => {
    if (isEventDialogOpen && !isEditing) {
      let startDate = selectedDate || new Date();
      let endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 2);
      
      form.reset({
        title: '',
        type: EVENT_TYPES.COURS,
        start: startDate,
        end: endDate,
        allDay: false,
        academicClasses: [],
        subjects: [],
        professors: [],
        rooms: [],
        description: ''
      });
    }
  }, [isEventDialogOpen, isEditing, form, selectedDate]);

  useEffect(() => {
    if (isEditing && selectedEvent) {
      form.reset({
        title: selectedEvent.title,
        type: selectedEvent.extendedProps?.type || EVENT_TYPES.COURS,
        start: new Date(selectedEvent.start),
        end: new Date(selectedEvent.end || selectedEvent.start),
        allDay: selectedEvent.allDay || false,
        academicClasses: selectedEvent.extendedProps?.classe ? [selectedEvent.extendedProps?.classe] : [],
        subjects: selectedEvent.extendedProps?.matiere ? [selectedEvent.extendedProps?.matiere] : [],
        professors: selectedEvent.extendedProps?.professeur ? [selectedEvent.extendedProps?.professeur] : [],
        rooms: selectedEvent.extendedProps?.salle ? [selectedEvent.extendedProps?.salle] : [],
        description: selectedEvent.extendedProps?.description || ''
      });
    }
  }, [isEditing, selectedEvent, form]);

  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
    setIsEditing(false);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleCreateOrUpdateEvent = (data: any) => {
    const eventColor = EVENT_COLORS[data.type as keyof typeof EVENT_COLORS];
    
    // Convert the complex data from the form to match the CalendarEvent structure
    const extendedProps: EventExtendedProps = {
      type: data.type as EventType,
      classe: data.academicClasses?.[0] || undefined,
      niveau: data.academicClasses?.length ? "primaire" : undefined, // Simplified for example
      matiere: data.subjects?.[0] || undefined,
      professeur: data.professors?.[0] || undefined,
      salle: data.rooms?.[0] || undefined,
      description: data.description
    };
    
    const eventData: CalendarEvent = {
      id: isEditing && selectedEvent ? selectedEvent.id : String(new Date().getTime()),
      title: data.title,
      start: data.start.toISOString(),
      end: data.end.toISOString(),
      allDay: data.allDay,
      backgroundColor: eventColor,
      borderColor: eventColor,
      extendedProps: extendedProps
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
    const currentDate = selectedDate || new Date();
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 7);
    
    const currentWeekEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= weekStartDate && eventDate < weekEndDate;
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
    // Filter by class
    if (filterClasse !== "all" && event.extendedProps?.classe !== filterClasse) return false;
    
    // Filter by level
    if (filterNiveau !== "all" && event.extendedProps?.niveau !== filterNiveau) return false;
    
    // Filter by type
    if (filterType !== "all" && event.extendedProps?.type !== filterType) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.extendedProps?.description?.toLowerCase().includes(query) ||
        event.extendedProps?.classe?.toLowerCase().includes(query) ||
        event.extendedProps?.matiere?.toLowerCase().includes(query) ||
        event.extendedProps?.professeur?.toLowerCase().includes(query) ||
        event.extendedProps?.salle?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // For all-day events, only check the date portion
      if (event.allDay) {
        return (
          eventStart.getDate() === date.getDate() &&
          eventStart.getMonth() === date.getMonth() &&
          eventStart.getFullYear() === date.getFullYear()
        );
      }
      
      // For non-all-day events, check if the date falls within the event timeframe
      return isWithinInterval(date, { start: eventStart, end: eventEnd });
    });
  };

  // Function to determine tile class based on events
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length === 0) return null;
    
    // Return classes based on event types
    const classNames = ['event-day'];
    
    if (eventsOnDate.some(e => e.extendedProps.type === EVENT_TYPES.COURS)) {
      classNames.push('has-course');
    }
    if (eventsOnDate.some(e => e.extendedProps.type === EVENT_TYPES.EVALUATION)) {
      classNames.push('has-evaluation');
    }
    if (eventsOnDate.some(e => e.extendedProps.type === EVENT_TYPES.EVENEMENT)) {
      classNames.push('has-event');
    }
    
    return classNames.join(' ');
  };

  // Function to render custom tile content
  const renderTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const eventsOnDate = getEventsForDate(date);
    if (eventsOnDate.length === 0) return null;
    
    // Count event types
    const coursCount = eventsOnDate.filter(e => e.extendedProps.type === EVENT_TYPES.COURS).length;
    const evalCount = eventsOnDate.filter(e => e.extendedProps.type === EVENT_TYPES.EVALUATION).length;
    const eventCount = eventsOnDate.filter(e => e.extendedProps.type === EVENT_TYPES.EVENEMENT).length;
    
    return (
      <div className="event-indicators flex flex-wrap gap-1 mt-1">
        {coursCount > 0 && (
          <div 
            className="event-dot rounded-full w-2 h-2" 
            style={{ backgroundColor: EVENT_COLORS[EVENT_TYPES.COURS] }}
            title={`${coursCount} cours`}
          ></div>
        )}
        {evalCount > 0 && (
          <div 
            className="event-dot rounded-full w-2 h-2" 
            style={{ backgroundColor: EVENT_COLORS[EVENT_TYPES.EVALUATION] }}
            title={`${evalCount} évaluations`}
          ></div>
        )}
        {eventCount > 0 && (
          <div 
            className="event-dot rounded-full w-2 h-2" 
            style={{ backgroundColor: EVENT_COLORS[EVENT_TYPES.EVENEMENT] }}
            title={`${eventCount} événements`}
          ></div>
        )}
      </div>
    );
  };

  // New function to handle delete confirmation
  const handleConfirmDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      toast({
        title: "Événement supprimé",
        description: `L'événement "${selectedEvent.title}" a été supprimé`,
      });
      setIsDeleteConfirmationOpen(false);
      setIsEventDetailsOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteRequest = () => {
    setIsEventDetailsOpen(false);
    setIsDeleteConfirmationOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Gestion des Événements (v2)</h2>
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
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Modifier l'événement" : "Nouvel événement"}
                </DialogTitle>
              </DialogHeader>
              
              <EventForm 
                isEditing={isEditing}
                selectedEvent={selectedEvent}
                paliers={samplePaliers}
                academicClasses={sampleAcademicClasses}
                professors={sampleProfessors}
                rooms={sampleRooms}
                subjects={sampleSubjects}
                onSubmit={handleCreateOrUpdateEvent}
                onCancel={() => setIsEventDialogOpen(false)}
              />
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
          
          <Tabs defaultValue="calendar" onValueChange={(value) => setView(value as 'calendar' | 'list')}>
            <TabsList>
              <TabsTrigger value="calendar">
                <CalendarDays size={16} className="mr-2" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="list">
                <List size={16} className="mr-2" />
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
                  <SelectItem value="all">Toutes les classes</SelectItem>
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
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="primaire">Primaire</SelectItem>
                  <SelectItem value="college">Collège</SelectItem>
                  <SelectItem value="lycee">Lycée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'événement</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value={EVENT_TYPES.COURS}>Cours</SelectItem>
                  <SelectItem value={EVENT_TYPES.EVALUATION}>Évaluations</SelectItem>
                  <SelectItem value={EVENT_TYPES.EVENEMENT}>Événements</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un événement..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {view === 'calendar' ? (
        <Card>
          <CardContent className="pt-6">
            <div className="react-calendar-wrapper">
              <style>{`
                .react-calendar {
                  width: 100%;
                  max-width: 100%;
                  background: white;
                  border: none;
                  font-family: inherit;
                  line-height: 1.5;
                }
                .react-calendar__navigation button {
                  padding: 5px;
                  min-width: 44px;
                  background: none;
                  font-size: 16px;
                  margin-top: 8px;
                }
                .react-calendar__navigation button:disabled {
                  opacity: 0.5;
                }
                .react-calendar__navigation button:enabled:hover,
                .react-calendar__navigation button:enabled:focus {
                  background-color: #f5f5f5;
                  border-radius: 4px;
                }
                .react-calendar__month-view__weekdays {
                  text-align: center;
                  text-transform: uppercase;
                  font-size: 0.8em;
                  font-weight: 500;
                  padding: 5px 0;
                }
                .react-calendar__month-view__weekdays__weekday {
                  padding: 8px;
                }
                .react-calendar__month-view__days__day {
                  padding: 10px 6px;
                  position: relative;
                }
                .react-calendar__tile {
                  text-align: center;
                  padding: 10px 6px;
                  background: none;
                  position: relative;
                }
                .react-calendar__tile:enabled:hover,
                .react-calendar__tile:enabled:focus {
                  background-color: #f5f5f5;
                  border-radius: 4px;
                }
                .react-calendar__tile--now {
                  background: var(--accent);
                  border-radius: 4px;
                }
                .react-calendar__tile--now:enabled:hover,
                .react-calendar__tile--now:enabled:focus {
                  background: var(--accent-foreground);
                  color: white;
                }
                .react-calendar__tile--active {
                  background: var(--primary);
                  color: white;
                  border-radius: 4px;
                }
                .react-calendar__tile--active:enabled:hover,
                .react-calendar__tile--active:enabled:focus {
                  background: var(--primary);
                }
                .event-indicators {
                  display: flex;
                  justify-content: center;
                  margin-top: 3px;
                }
                .event-day {
                  font-weight: 500;
                }
                .event-dot {
                  height: 6px;
                  width: 6px;
                  border-radius: 50%;
                  margin: 0 1px;
                }
                .has-course abbr {
                  text-decoration: none;
                  position: relative;
                }
                .has-course abbr::after {
                  content: '';
                  position: absolute;
                  bottom: -6px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 5px;
                  height: 5px;
                  background: #4f46e5;
                  border-radius: 50%;
                }
              `}</style>
              
              <Calendar
                onChange={(value) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  } else if (Array.isArray(value) && value.length > 0) {
                    setSelectedDate(value[0]);
                  }
                }}
                value={selectedDate}
                onClickDay={(value) => handleDateClick(value)}
                locale="fr-FR"
                tileClassName={getTileClassName}
                tileContent={renderTileContent}
              />
              
              {selectedDate && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Événements du {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                  </h3>
                  
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate).length > 0 ? (
                      getEventsForDate(selectedDate).map(event => (
                        <Card key={event.id} className="overflow-hidden">
                          <div 
                            className="h-2" 
                            style={{ backgroundColor: event.backgroundColor }}
                          ></div>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-base">{event.title}</h4>
                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                  <Clock size={14} className="mr-1" />
                                  {event.allDay 
                                    ? "Toute la journée" 
                                    : `${format(new Date(event.start), "HH:mm", { locale: fr })} - ${format(new Date(event.end), "HH:mm", { locale: fr })}`}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    handleEditEvent();
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventDetailsOpen(true);
                                  }}
                                >
                                  Détails
                                </Button>
                              </div>
                            </div>
                            
                            {event.extendedProps.type !== EVENT_TYPES.EVENEMENT && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {event.extendedProps.classe && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Users size={12} />
                                    {event.extendedProps.classe}
                                  </Badge>
                                )}
                                
                                {event.extendedProps.matiere && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <School size={12} />
                                    {event.extendedProps.matiere}
                                  </Badge>
                                )}
                                
                                {event.extendedProps.professeur && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <User size={12} />
                                    {event.extendedProps.professeur}
                                  </Badge>
                                )}
                                
                                {event.extendedProps.salle && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {event.extendedProps.salle}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <p className="mt-2">Aucun événement prévu pour cette date</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => handleDateClick(selectedDate)}
                        >
                          Ajouter un événement
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des événements</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents
                  .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                  .map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <div 
                        className="h-2" 
                        style={{ backgroundColor: event.backgroundColor }}
                      ></div>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h4 className="font-medium text-base">{event.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <CalendarDays size={14} className="mr-1" />
                              {format(new Date(event.start), "dd MMMM yyyy", { locale: fr })}
                              {event.allDay 
                                ? " (Toute la journée)" 
                                : ` ${format(new Date(event.start), "HH:mm", { locale: fr })} - ${format(new Date(event.end), "HH:mm", { locale: fr })}`}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedEvent(event);
                                handleEditEvent();
                              }}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEventDetailsOpen(true);
                              }}
                            >
                              Détails
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge 
                            className="flex items-center gap-1"
                            style={{ 
                              backgroundColor: event.backgroundColor,
                              color: 'white' 
                            }}
                          >
                            {event.extendedProps.type === EVENT_TYPES.COURS && (
                              <>
                                <BookOpen size={12} />
                                Cours
                              </>
                            )}
                            {event.extendedProps.type === EVENT_TYPES.EVALUATION && (
                              <>
                                <Award size={12} />
                                Évaluation
                              </>
                            )}
                            {event.extendedProps.type === EVENT_TYPES.EVENEMENT && (
                              <>
                                <CalendarDays size={12} />
                                Événement
                              </>
                            )}
                          </Badge>
                          
                          {event.extendedProps.classe && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Users size={12} />
                              {event.extendedProps.classe}
                            </Badge>
                          )}
                          
                          {event.extendedProps.matiere && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <School size={12} />
                              {event.extendedProps.matiere}
                            </Badge>
                          )}
                          
                          {event.extendedProps.salle && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin size={12} />
                              {event.extendedProps.salle}
                            </Badge>
                          )}
                        </div>
                        
                        {event.extendedProps.description && (
                          <div className="mt-3 pt-3 border-t text-sm">
                            <div className="flex items-start gap-1">
                              <Info size={14} className="mt-0.5 text-muted-foreground" />
                              <p>{event.extendedProps.description}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Aucun événement ne correspond à vos critères</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsEventDialogOpen(true)}
                >
                  Ajouter un événement
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
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
                <Button variant="destructive" onClick={handleDeleteRequest} className="flex items-center gap-2">
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
      
      {/* Add the delete confirmation dialog */}
      <Dialog open={isDeleteConfirmationOpen} onOpenChange={setIsDeleteConfirmationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedEvent && (
            <EventDeleteConfirmation 
              event={selectedEvent}
              onConfirm={handleConfirmDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Evenements2;
