
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar as CalendarIcon, FileText } from "lucide-react";

const Presence = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState("CM1");
  const [selectedSession, setSelectedSession] = useState("2023-2024");
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [activeTab, setActiveTab] = useState("presence");
  
  // Données d'exemple
  const students = [
    { id: 1, nom: "Nguema", prenom: "Marc", photo: null, statut: "present" },
    { id: 2, nom: "Ekomi", prenom: "Sarah", photo: null, statut: "absent" },
    { id: 3, nom: "Mbadinga", prenom: "Jean", photo: null, statut: "present" },
    { id: 4, nom: "Nze", prenom: "Marie", photo: null, statut: "retard" },
    { id: 5, nom: "Ndong", prenom: "Pierre", photo: null, statut: "present" },
    { id: 6, nom: "Abessolo", prenom: "Claire", photo: null, statut: "justifie" },
    { id: 7, nom: "Ovono", prenom: "Thomas", photo: null, statut: "present" },
    { id: 8, nom: "Minko", prenom: "Élise", photo: null, statut: "present" },
    { id: 9, nom: "Koumba", prenom: "Joseph", photo: null, statut: "absent" },
    { id: 10, nom: "Bibang", prenom: "Hélène", photo: null, statut: "present" }
  ];

  const events = [
    { id: 1, type: "cours", matiere: "Mathématiques", date: "2023-10-15", heure: "08:00", duree: "1h30", salle: "A101" },
    { id: 2, type: "cours", matiere: "Français", date: "2023-10-15", heure: "10:00", duree: "1h30", salle: "A101" },
    { id: 3, type: "evaluation", matiere: "Sciences", date: "2023-10-16", heure: "09:00", duree: "2h00", salle: "A102" },
    { id: 4, type: "evenement", matiere: "Sortie scolaire", date: "2023-10-17", heure: "09:00", duree: "4h00", salle: "Externe" }
  ];

  const handleChangeStatus = (studentId: number, newStatus: string) => {
    // Cette fonction serait implémentée pour changer le statut d'un élève
    console.log(`Changement de statut pour l'élève ${studentId} : ${newStatus}`);
  };

  // Statistiques de présence par élève
  const studentStats = students.map((student) => {
    let presences = Math.floor(Math.random() * 30);
    let absences = Math.floor(Math.random() * 10);
    let retards = Math.floor(Math.random() * 5);
    let total = presences + absences + retards;
    
    return {
      ...student,
      presences,
      absences,
      retards,
      tauxPresence: Math.round((presences / total) * 100)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des présences</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm max-w-[300px] mx-auto"
                locale={fr}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                  <SelectItem value="6e">6e</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Trimestre 1</SelectItem>
                  <SelectItem value="2">Trimestre 2</SelectItem>
                  <SelectItem value="3">Trimestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Événement</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les événements</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.matiere} ({event.heure})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button className="w-full">Appliquer les filtres</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="presence" className="flex items-center gap-2">
                  <Clock size={16} />
                  Pointage
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <FileText size={16} />
                  Statistiques
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="presence" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.photo || student.prenom.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{student.nom} {student.prenom}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${
                            student.statut === 'present' ? 'text-green-500' :
                            student.statut === 'absent' ? 'text-red-500' :
                            student.statut === 'retard' ? 'text-orange-500' : 'text-blue-500'
                          }`}>
                            {student.statut === 'present' && <CheckCircle size={16} />}
                            {student.statut === 'absent' && <XCircle size={16} />}
                            {student.statut === 'retard' && <Clock size={16} />}
                            {student.statut === 'justifie' && <AlertCircle size={16} />}
                            <span className="capitalize">{student.statut}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={student.statut}
                            onValueChange={(value) => handleChangeStatus(student.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Modifier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Présent</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="retard">Retard</SelectItem>
                              <SelectItem value="justifie">Justifié</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline">Réinitialiser</Button>
                <Button>Enregistrer les présences</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Élève</TableHead>
                      <TableHead className="text-center">Présences</TableHead>
                      <TableHead className="text-center">Absences</TableHead>
                      <TableHead className="text-center">Retards</TableHead>
                      <TableHead className="text-center">Taux de présence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentStats.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {student.photo || student.prenom.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{student.nom} {student.prenom}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-green-600 font-medium">
                          {student.presences}
                        </TableCell>
                        <TableCell className="text-center text-red-600 font-medium">
                          {student.absences}
                        </TableCell>
                        <TableCell className="text-center text-orange-600 font-medium">
                          {student.retards}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                student.tauxPresence > 90 ? 'bg-green-500' :
                                student.tauxPresence > 80 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${student.tauxPresence}%` }}
                            ></div>
                          </div>
                          <div className="text-xs mt-1">{student.tauxPresence}%</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Résumé classe {selectedClass}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Taux de présence moyen:</span>
                        <span className="font-semibold">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Élèves avec absences &gt; 20%:</span>
                        <span className="font-semibold text-red-500">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Retards cumulés:</span>
                        <span className="font-semibold">23</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Actions recommandées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500" />
                        <span>Contacter les parents de Ekomi Sarah</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle size={14} className="text-red-500" />
                        <span>Contacter les parents de Koumba Joseph</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-500" />
                        <span>Discuter des retards répétés avec Nze Marie</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText size={16} />
                  Exporter le rapport
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Presence;
