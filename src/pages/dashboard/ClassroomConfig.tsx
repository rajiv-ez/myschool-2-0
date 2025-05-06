
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ClassroomEditor from '@/components/classroom/ClassroomEditor';
import ClassroomVisualization from '@/components/classroom/ClassroomVisualization';
import SeatChangeRequests from '@/components/classroom/SeatChangeRequests';

// Types pour la gestion des places
export interface Student {
  id: number;
  name: string;
}

export interface Seat {
  id: string;
  row: number;
  line: number;
  position: string;
  studentId?: number;
}

export interface SeatChangeRequest {
  id: number;
  studentId: number;
  studentName: string;
  requestDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ClassroomConfig = () => {
  // Sample data for students
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Eric Ndong" },
    { id: 2, name: "Marie Koumba" },
    { id: 3, name: "Jean Moussa" },
    { id: 4, name: "Alice Okemba" },
    { id: 5, name: "Paul Biyoghe" },
    { id: 6, name: "Sylvie Ndong" },
    { id: 7, name: "Marc Ondo" },
    { id: 8, name: "Lucie Aubame" },
    { id: 9, name: "Thomas Moussavou" },
    { id: 10, name: "Claire Ekogha" }
  ]);

  // Configuration for rows, lines per row, and positions per line
  const [classConfig, setClassConfig] = useState({
    rows: 3,
    linesPerRow: 3,
    positionsPerLine: 3
  });

  // Seats data structure
  const [seats, setSeats] = useState<Seat[]>([]);

  // Sample change requests
  const [changeRequests, setChangeRequests] = useState<SeatChangeRequest[]>([
    {
      id: 1,
      studentId: 3,
      studentName: "Jean Moussa",
      requestDate: new Date(),
      reason: "Problème de vision, besoin d'être plus proche du tableau",
      status: 'pending'
    },
    {
      id: 2,
      studentId: 5,
      studentName: "Paul Biyoghe",
      requestDate: new Date(Date.now() - 86400000), // Yesterday
      reason: "Préfère être à côté de la fenêtre pour plus de lumière",
      status: 'pending'
    }
  ]);

  // Fonction pour créer ou mettre à jour les sièges
  const updateClassroomConfig = (config: typeof classConfig) => {
    setClassConfig(config);
    
    // Créer la nouvelle structure des sièges
    const newSeats: Seat[] = [];
    const positions = ['a', 'b', 'c', 'd', 'e', 'f'];

    for (let row = 1; row <= config.rows; row++) {
      for (let line = 1; line <= config.linesPerRow; line++) {
        for (let pos = 0; pos < config.positionsPerLine; pos++) {
          const seatId = `${row}-${line}-${positions[pos]}`;
          
          // Préserver l'attribution des étudiants si le siège existait déjà
          const existingSeat = seats.find(s => s.id === seatId);
          
          newSeats.push({
            id: seatId,
            row,
            line,
            position: positions[pos],
            studentId: existingSeat?.studentId
          });
        }
      }
    }
    
    setSeats(newSeats);
  };

  // Fonction pour attribuer un étudiant à un siège
  const assignStudentToSeat = (seatId: string, studentId?: number) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, studentId } 
          : studentId && seat.studentId === studentId 
            ? { ...seat, studentId: undefined } // Retirer l'étudiant de son siège précédent
            : seat
      )
    );
  };

  // Fonction pour gérer les demandes de changement
  const handleChangeRequest = (requestId: number, action: 'approve' | 'reject') => {
    setChangeRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } 
          : req
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configuration de Salle de Classe</h1>
          <p className="text-muted-foreground">
            Organisez votre salle de classe et gérez les places des élèves
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="editor">
            <TabsList className="mb-4">
              <TabsTrigger value="editor">Configuration</TabsTrigger>
              <TabsTrigger value="visualization">Visualisation</TabsTrigger>
              <TabsTrigger value="requests">
                Demandes de changement
                {changeRequests.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    {changeRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="pt-4">
              <ClassroomEditor 
                classConfig={classConfig}
                seats={seats}
                students={students}
                updateConfig={updateClassroomConfig}
                assignStudent={assignStudentToSeat}
              />
            </TabsContent>
            
            <TabsContent value="visualization" className="pt-4">
              <ClassroomVisualization 
                seats={seats}
                students={students}
              />
            </TabsContent>
            
            <TabsContent value="requests" className="pt-4">
              <SeatChangeRequests 
                requests={changeRequests.filter(r => r.status === 'pending')}
                onRequestAction={handleChangeRequest}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassroomConfig;
