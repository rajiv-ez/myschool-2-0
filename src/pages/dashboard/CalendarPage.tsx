
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Printer, Filter, Clock, Book, Award, School } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const CalendarPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewType, setViewType] = useState("semaine");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [eventType, setEventType] = useState("all");

  // Générer les données d'événements pour la semaine
  const generateWeekEvents = () => {
    if (!date) return [];

    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const endDate = endOfWeek(date, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Types d'événements
    const eventTypes = ["cours", "evaluation", "evenement"];
    // Classes
    const classes = ["CM1", "CM2", "6e", "5e", "4e"];
    // Matières
    const subjects = ["Mathématiques", "Français", "Anglais", "Histoire", "Physique", "SVT"];
    // Périodes de la journée
    const periods = [
      { start: "08:00", end: "09:30" },
      { start: "09:45", end: "11:15" },
      { start: "11:30", end: "13:00" },
      { start: "14:00", end: "15:30" },
      { start: "15:45", end: "17:15" }
    ];

    // Générer des événements aléatoires pour chaque jour
    const events = days.flatMap(day => {
      // Ne pas générer d'événements le week-end
      if (day.getDay() === 0 || day.getDay() === 6) return [];

      return periods.map((period, index) => {
        // Ne pas remplir tous les créneaux
        if (Math.random() > 0.7) return null;

        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const classe = classes[Math.floor(Math.random() * classes.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        
        return {
          id: `event-${day.getTime()}-${index}`,
          title: type === "cours" ? `Cours de ${subject}` : 
                 type === "evaluation" ? `Évaluation de ${subject}` : 
                 `Réunion de ${subject}`,
          start: `${format(day, "yyyy-MM-dd")}T${period.start}`,
          end: `${format(day, "yyyy-MM-dd")}T${period.end}`,
          type,
          class: classe,
          subject,
          location: `Salle ${Math.floor(Math.random() * 20) + 101}`
        };
      }).filter(Boolean);
    });

    return events;
  };

  const weekEvents = generateWeekEvents();
  
  // Filtrer les événements
  const filteredEvents = weekEvents.filter(event => {
    if (selectedClass && event.class !== selectedClass) return false;
    if (eventType !== "all" && event.type !== eventType) return false;
    return true;
  });

  // Organiser les événements par jour pour la vue semaine
  const weekDays = date ? eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  }) : [];

  const eventsByDay = weekDays.map(day => {
    const dayString = format(day, "yyyy-MM-dd");
    return {
      date: day,
      events: filteredEvents.filter(event => event.start.startsWith(dayString))
        .sort((a, b) => a.start.localeCompare(b.start))
    };
  });

  // Fonction pour imprimer l'emploi du temps
  const printSchedule = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Calendrier scolaire</h2>
          <p className="text-muted-foreground">
            {date ? `Semaine du ${format(startOfWeek(date, { weekStartsOn: 1 }), "d MMMM", { locale: fr })} au ${format(endOfWeek(date, { weekStartsOn: 1 }), "d MMMM yyyy", { locale: fr })}` : 'Sélectionnez une date'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              <SelectItem value="CM1">CM1</SelectItem>
              <SelectItem value="CM2">CM2</SelectItem>
              <SelectItem value="6e">6e</SelectItem>
              <SelectItem value="5e">5e</SelectItem>
              <SelectItem value="4e">4e</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="primaire">Primaire</SelectItem>
              <SelectItem value="college">Collège</SelectItem>
              <SelectItem value="lycee">Lycée</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type d'événement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="cours">Cours</SelectItem>
              <SelectItem value="evaluation">Évaluations</SelectItem>
              <SelectItem value="evenement">Événements</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={printSchedule} className="flex items-center gap-2">
            <Printer size={16} />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm"
              locale={fr}
            />
            
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg">Légende</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Cours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Évaluations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Événements scolaires</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg pt-2">Statistiques</h3>
              <div className="space-y-1">
                <p>Total des événements: {filteredEvents.length}</p>
                <p>Cours: {filteredEvents.filter(e => e.type === "cours").length}</p>
                <p>Évaluations: {filteredEvents.filter(e => e.type === "evaluation").length}</p>
                <p>Événements: {filteredEvents.filter(e => e.type === "evenement").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="semaine" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="jour" onClick={() => setViewType("jour")} className="flex items-center gap-2">
                <CalendarIcon size={16} />
                Jour
              </TabsTrigger>
              <TabsTrigger value="semaine" onClick={() => setViewType("semaine")} className="flex items-center gap-2">
                <Filter size={16} />
                Semaine
              </TabsTrigger>
              <TabsTrigger value="mois" onClick={() => setViewType("mois")} className="flex items-center gap-2">
                <CalendarIcon size={16} />
                Mois
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jour" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  {date && (
                    <div>
                      <h3 className="font-bold text-lg mb-4">
                        {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                      </h3>
                      <div className="space-y-3">
                        {filteredEvents
                          .filter(event => event.start.startsWith(format(date, "yyyy-MM-dd")))
                          .sort((a, b) => a.start.localeCompare(b.start))
                          .map(event => (
                            <div 
                              key={event.id} 
                              className={`p-3 rounded-lg border ${
                                event.type === "cours" ? "bg-blue-50 border-blue-200" : 
                                event.type === "evaluation" ? "bg-red-50 border-red-200" : 
                                "bg-green-50 border-green-200"
                              }`}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-semibold">{event.title}</h4>
                                <span className="text-sm">
                                  {event.start.split('T')[1]} - {event.end.split('T')[1]}
                                </span>
                              </div>
                              <div className="text-sm mt-1 text-muted-foreground">
                                <p>Classe: {event.class} | Lieu: {event.location}</p>
                              </div>
                            </div>
                          ))}
                        {filteredEvents.filter(event => event.start.startsWith(format(date, "yyyy-MM-dd"))).length === 0 && (
                          <p className="text-center py-6 text-muted-foreground">Aucun événement prévu pour cette journée.</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="semaine" className="mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {eventsByDay.slice(0, 5).map((day) => (
                      <div key={format(day.date, "yyyy-MM-dd")} className="min-h-[300px] border rounded-lg p-2">
                        <h4 className="font-semibold text-center py-1 border-b mb-2">
                          {format(day.date, "EEEE d/MM", { locale: fr })}
                        </h4>
                        <div className="space-y-2">
                          {day.events.map((event) => (
                            <div 
                              key={event.id} 
                              className={`p-2 text-xs rounded ${
                                event.type === "cours" ? "bg-blue-50 border-l-4 border-blue-500" : 
                                event.type === "evaluation" ? "bg-red-50 border-l-4 border-red-500" : 
                                "bg-green-50 border-l-4 border-green-500"
                              }`}
                            >
                              <div className="font-semibold truncate">{event.title}</div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px]">{event.class}</span>
                                <span className="text-[10px]">{event.start.split('T')[1]}</span>
                              </div>
                              <div className="text-[10px] text-muted-foreground truncate">
                                {event.location}
                              </div>
                            </div>
                          ))}
                          {day.events.length === 0 && (
                            <p className="text-center text-xs text-muted-foreground pt-4">Aucun événement</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mois" className="mt-4">
              <Card>
                <CardContent className="p-4 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <CalendarIcon size={48} className="mx-auto text-muted-foreground" />
                    <p className="mt-2">Vue mensuelle à venir dans une prochaine mise à jour</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Section impression */}
      <div className="hidden print:block mt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">MySchool 2.0 - Emploi du temps</h1>
          <p className="text-muted-foreground">
            {date ? `Semaine du ${format(startOfWeek(date, { weekStartsOn: 1 }), "d MMMM", { locale: fr })} au ${format(endOfWeek(date, { weekStartsOn: 1 }), "d MMMM yyyy", { locale: fr })}` : ''}
          </p>
          {selectedClass && <p>Classe: {selectedClass}</p>}
        </div>
        
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Horaire</th>
              {weekDays.slice(0, 5).map(day => (
                <th key={format(day, "yyyy-MM-dd")} className="border p-2 text-center">
                  {format(day, "EEEE d/MM", { locale: fr })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["08:00-09:30", "09:45-11:15", "11:30-13:00", "14:00-15:30", "15:45-17:15"].map(timeSlot => (
              <tr key={timeSlot}>
                <td className="border p-2 font-semibold">{timeSlot}</td>
                {weekDays.slice(0, 5).map(day => {
                  const dayString = format(day, "yyyy-MM-dd");
                  const [startTime] = timeSlot.split('-');
                  const eventsAtTime = filteredEvents.filter(event => 
                    event.start.startsWith(dayString) && 
                    event.start.includes(`T${startTime}`)
                  );
                  
                  return (
                    <td key={`${dayString}-${timeSlot}`} className="border p-2 align-top min-h-[80px]">
                      {eventsAtTime.map(event => (
                        <div key={event.id} className="mb-2">
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs">
                            {event.class} - {event.location}
                          </div>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarPage;
