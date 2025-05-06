import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { 
  CalendarDays, 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import EventForm from '@/components/events/EventForm';
import EventDetails from '@/components/events/EventDetails';
import EventDeleteConfirmation from '@/components/events/EventDeleteConfirmation';

// Données fictives pour les événements
const eventsData = [
  {
    id: 1,
    title: 'Réunion des enseignants',
    type: 'meeting',
    start: new Date(2024, 4, 15, 10, 0),
    end: new Date(2024, 4, 15, 12, 0),
    description: 'Réunion de coordination des enseignants pour le trimestre.',
    location: 'Salle de conférence',
    palier: 'Trimestre 3',
    allDay: false
  },
  {
    id: 2,
    title: 'Examen de mathématiques',
    type: 'exam',
    start: new Date(2024, 4, 18, 9, 0),
    end: new Date(2024, 4, 18, 11, 0),
    description: 'Examen final de mathématiques pour la classe de CM2.',
    location: 'Salle B12',
    palier: 'Trimestre 3',
    allDay: false
  },
  {
    id: 3,
    title: 'Cours de français',
    type: 'class',
    start: new Date(2024, 4, 16, 8, 30),
    end: new Date(2024, 4, 16, 10, 30),
    description: 'Cours de français pour la classe de CE2.',
    location: 'Salle A5',
    palier: 'Trimestre 3',
    allDay: false,
    recurring: true,
    recurrencePattern: 'weekly'
  },
  {
    id: 4,
    title: 'Congé - Fête nationale',
    type: 'holiday',
    start: new Date(2024, 4, 20),
    end: new Date(2024, 4, 20),
    description: 'Jour férié - Fête nationale',
    location: '',
    palier: 'Trimestre 3',
    allDay: true
  },
  {
    id: 5,
    title: 'Sortie scolaire',
    type: 'other',
    start: new Date(2024, 4, 22, 8, 0),
    end: new Date(2024, 4, 22, 18, 0),
    description: 'Sortie scolaire au musée national pour les classes de CM1 et CM2.',
    location: 'Musée National',
    palier: 'Trimestre 3',
    allDay: true
  }
];

// Données fictives pour les paliers
const paliersData = [
  { 
    id: 1, 
    nom: 'Trimestre 1', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '15/09/2024',
    dateFin: '15/12/2024',
    statut: 'Planifié'
  },
  { 
    id: 2, 
    nom: 'Trimestre 2', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '16/12/2024',
    dateFin: '15/03/2025',
    statut: 'Planifié'
  },
  { 
    id: 3, 
    nom: 'Trimestre 3', 
    session: 'Année scolaire 2024-2025', 
    dateDebut: '16/03/2025',
    dateFin: '30/06/2025',
    statut: 'Planifié'
  },
  { 
    id: 4, 
    nom: 'Trimestre 1', 
    session: 'Année scolaire 2023-2024', 
    dateDebut: '18/09/2023',
    dateFin: '15/12/2023',
    statut: 'Terminé'
  },
  { 
    id: 5, 
    nom: 'Trimestre 2', 
    session: 'Année scolaire 2023-2024', 
    dateDebut: '16/12/2023',
    dateFin: '15/03/2024',
    statut: 'Terminé'
  },
  { 
    id: 6, 
    nom: 'Trimestre 3', 
    session: 'Année scolaire 2023-2024', 
    dateDebut: '16/03/2024',
    dateFin: '30/06/2024',
    statut: 'Terminé'
  }
];

// Sample data for the missing props (academic classes, professors, rooms, and subjects)
const sampleAcademicClasses = [
  { id: 1, name: 'CM1', session: '2024-2025', mainTeacher: 'M. Dupont', capacity: 30, enrolled: 25, status: 'active' },
  { id: 2, name: 'CM2', session: '2024-2025', mainTeacher: 'Mme. Martin', capacity: 28, enrolled: 26, status: 'active' },
  { id: 3, name: 'CE2', session: '2024-2025', mainTeacher: 'M. Bernard', capacity: 30, enrolled: 22, status: 'active' },
  { id: 4, name: 'CE1', session: '2024-2025', mainTeacher: 'Mme. Thomas', capacity: 26, enrolled: 24, status: 'active' },
  { id: 5, name: 'CP', session: '2024-2025', mainTeacher: 'Mme. Petit', capacity: 25, enrolled: 20, status: 'active' },
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

const Evenements = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState(eventsData);
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  
  // Formater les événements pour FullCalendar
  const getFormattedEvents = () => {
    return events.map(event => ({
      id: event.id.toString(),
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        type: event.type,
        description: event.description,
        location: event.location,
        palier: event.palier,
        recurring: event.recurring,
        recurrencePattern: event.recurrencePattern
      },
      backgroundColor: getEventColor(event.type),
      borderColor: getEventColor(event.type)
    }));
  };
  
  // Couleur selon le type d'événement
  const getEventColor = (type: string) => {
    switch(type) {
      case 'meeting': return '#3b82f6'; // blue-500
      case 'exam': return '#f59e0b'; // amber-500
      case 'class': return '#10b981'; // emerald-500
      case 'holiday': return '#8b5cf6'; // violet-500
      default: return '#6b7280'; // gray-500
    }
  };
  
  // Référence au calendrier
  const handleCalendarReady = (calendar: any) => {
    setCalendarApi(calendar);
  };
  
  // Gérer le clic sur une date
  const handleDateClick = (arg: any) => {
    setSelectedEvent({
      start: arg.date,
      end: new Date(arg.date.getTime() + 60 * 60 * 1000), // +1 heure
      allDay: arg.allDay
    });
    setIsEditing(false);
    setIsEventModalOpen(true);
  };
  
  // Gérer le clic sur un événement
  const handleEventClick = (arg: any) => {
    const event = events.find(e => e.id.toString() === arg.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsEventDetailsModalOpen(true);
    }
  };
  
  // Éditer un événement
  const handleEditEvent = () => {
    setIsEventDetailsModalOpen(false);
    setIsEditing(true);
    setIsEventModalOpen(true);
  };
  
  // Supprimer un événement
  const handleDeleteEvent = () => {
    setIsEventDetailsModalOpen(false);
    setIsDeleteModalOpen(true);
  };
  
  // Confirmer la suppression
  const confirmDelete = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
      setEvents(updatedEvents);
      
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès."
      });
      
      setIsDeleteModalOpen(false);
    }
  };
  
  // Soumission du formulaire d'événement
  const handleEventSubmit = (data: any) => {
    if (isEditing && selectedEvent) {
      // Mise à jour d'un événement existant
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...data, id: event.id } : event
      );
      setEvents(updatedEvents);
      
      toast({
        title: "Événement mis à jour",
        description: "L'événement a été modifié avec succès."
      });
    } else {
      // Création d'un nouvel événement
      const newEvent = {
        ...data,
        id: Math.max(...events.map(e => e.id)) + 1
      };
      
      setEvents([...events, newEvent]);
      
      toast({
        title: "Événement créé",
        description: "Le nouvel événement a été créé avec succès."
      });
    }
    
    setIsEventModalOpen(false);
  };
  
  // Navigation dans le calendrier
  const handlePrevClick = () => {
    if (calendarApi) {
      calendarApi.prev();
    }
  };
  
  const handleNextClick = () => {
    if (calendarApi) {
      calendarApi.next();
    }
  };
  
  const handleTodayClick = () => {
    if (calendarApi) {
      calendarApi.today();
    }
  };
  
  // Changement de vue
  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des événements</h2>
          <p className="text-muted-foreground">Organisez et suivez tous les événements de l'établissement</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filtres
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setSelectedEvent({
                start: new Date(),
                end: new Date(Date.now() + 60 * 60 * 1000),
                allDay: false
              });
              setIsEditing(false);
              setIsEventModalOpen(true);
            }}
          >
            <Plus size={16} />
            Nouvel événement
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevClick}
                  className="rounded-r-none border-r-0"
                >
                  <ChevronLeft size={16} />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTodayClick}
                  className="rounded-none px-3 border-x-0"
                >
                  Aujourd'hui
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextClick}
                  className="rounded-l-none border-l-0"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
              <CardTitle id="calendar-title" className="text-base" />
            </div>
            <div className="flex items-center">
              <div className="flex space-x-1">
                <Button
                  variant={currentView === 'dayGridMonth' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('dayGridMonth')}
                >
                  Mois
                </Button>
                <Button
                  variant={currentView === 'timeGridWeek' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('timeGridWeek')}
                >
                  Semaine
                </Button>
                <Button
                  variant={currentView === 'timeGridDay' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('timeGridDay')}
                >
                  Jour
                </Button>
                <Button
                  variant={currentView === 'listWeek' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleViewChange('listWeek')}
                >
                  Liste
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[700px]">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              events={getFormattedEvents()}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              locale={frLocale}
              timeZone="local"
              height="100%"
              ref={(ref) => ref && handleCalendarReady(ref.getApi())}
              titleFormat={{ year: 'numeric', month: 'long' }}
              dayHeaderFormat={{ weekday: 'long' }}
              firstDay={1}
              titleRangeSeparator=" - "
              allDayText="Journée"
              noEventsText="Aucun événement à afficher"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Modale pour créer/modifier un événement */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier l\'événement' : 'Nouvel événement'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifiez les détails de l\'événement' : 'Remplissez les informations pour créer un nouvel événement'}
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            isEditing={isEditing}
            selectedEvent={selectedEvent}
            paliers={paliersData}
            academicClasses={sampleAcademicClasses}
            professors={sampleProfessors}
            rooms={sampleRooms}
            subjects={sampleSubjects}
            onSubmit={handleEventSubmit}
            onCancel={() => setIsEventModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modale des détails d'un événement */}
      <Dialog open={isEventDetailsModalOpen} onOpenChange={setIsEventDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'événement</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventDetails 
              event={selectedEvent}
              onEdit={handleEditEvent}
              onClose={() => setIsEventDetailsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Modale de confirmation de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'événement</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet événement ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EventDeleteConfirmation 
              event={selectedEvent}
              onConfirm={confirmDelete}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Evenements;
