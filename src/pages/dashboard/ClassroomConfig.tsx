import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ClassroomEditor from '@/components/classroom/ClassroomEditor';
import ClassroomVisualization from '@/components/classroom/ClassroomVisualization';
import SeatChangeRequests from '@/components/classroom/SeatChangeRequests';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

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

export interface ClassroomConfiguration {
  id: string;
  name: string;
  config: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  };
}

export interface SeatAssignment {
  id: string;
  name: string;
  configId: string;
  seats: Seat[];
}

const ClassroomConfig = () => {
  const { toast } = useToast();
  
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
  
  // State for saved configurations and assignments
  const [savedConfigurations, setSavedConfigurations] = useState<ClassroomConfiguration[]>([]);
  const [savedAssignments, setSavedAssignments] = useState<SeatAssignment[]>([]);
  const [activeConfigurationName, setActiveConfigurationName] = useState<string>('');
  const [activeAssignmentName, setActiveAssignmentName] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  // Seats data structure
  const [seats, setSeats] = useState<Seat[]>([]);
  const [originalSeats, setOriginalSeats] = useState<Seat[]>([]);
  const [originalConfig, setOriginalConfig] = useState(classConfig);

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

  // Détecteur de changements
  useEffect(() => {
    // Vérifier les changements dans la configuration
    const configChanged = 
      originalConfig.rows !== classConfig.rows || 
      originalConfig.linesPerRow !== classConfig.linesPerRow || 
      originalConfig.positionsPerLine !== classConfig.positionsPerLine;
    
    // Vérifier les changements dans les attributions de sièges
    let seatsChanged = false;
    if (originalSeats.length !== seats.length) {
      seatsChanged = true;
    } else {
      for (let i = 0; i < seats.length; i++) {
        const originalSeat = originalSeats.find(s => s.id === seats[i].id);
        if (!originalSeat || originalSeat.studentId !== seats[i].studentId) {
          seatsChanged = true;
          break;
        }
      }
    }
    
    setHasChanges(configChanged || seatsChanged);
  }, [classConfig, seats, originalConfig, originalSeats]);

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
    setHasChanges(true);
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
    setHasChanges(true);
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
    
    const request = changeRequests.find(r => r.id === requestId);
    if (request && action === 'approve') {
      toast({
        title: "Demande approuvée",
        description: `La demande de ${request.studentName} a été approuvée.`
      });
    } else if (request && action === 'reject') {
      toast({
        title: "Demande rejetée",
        description: `La demande de ${request.studentName} a été rejetée.`
      });
    }
  };
  
  // Fonction pour sauvegarder une configuration
  const saveConfiguration = (name: string, config: typeof classConfig) => {
    const newConfig: ClassroomConfiguration = {
      id: uuidv4(),
      name,
      config: { ...config }
    };
    
    setSavedConfigurations(prev => [...prev, newConfig]);
    setActiveConfigurationName(name);
  };
  
  // Fonction pour sauvegarder une attribution de sièges
  const saveAssignment = (name: string, configId: string, seatsData: Seat[]) => {
    const newAssignment: SeatAssignment = {
      id: uuidv4(),
      name,
      configId,
      seats: JSON.parse(JSON.stringify(seatsData)) // Deep copy
    };
    
    setSavedAssignments(prev => [...prev, newAssignment]);
    setActiveAssignmentName(name);
  };
  
  // Fonction pour supprimer une configuration
  const deleteConfiguration = (id: string) => {
    // Vérifier si la configuration est utilisée par des attributions
    const usedByAssignments = savedAssignments.some(a => a.configId === id);
    if (usedByAssignments) {
      toast({
        title: "Impossible de supprimer",
        description: "Cette configuration est utilisée par une ou plusieurs attributions.",
        variant: "destructive"
      });
      return;
    }
    
    const configToDelete = savedConfigurations.find(c => c.id === id);
    if (configToDelete && configToDelete.name === activeConfigurationName) {
      setActiveConfigurationName('');
    }
    
    setSavedConfigurations(prev => prev.filter(c => c.id !== id));
  };
  
  // Fonction pour supprimer une attribution
  const deleteAssignment = (id: string) => {
    const assignmentToDelete = savedAssignments.find(a => a.id === id);
    if (assignmentToDelete && assignmentToDelete.name === activeAssignmentName) {
      setActiveAssignmentName('');
    }
    
    setSavedAssignments(prev => prev.filter(a => a.id !== id));
  };
  
  // Fonction pour appliquer les changements
  const applyChanges = () => {
    setOriginalConfig({ ...classConfig });
    setOriginalSeats(JSON.parse(JSON.stringify(seats)));
    setHasChanges(false);
  };
  
  // Initialisation au chargement
  useEffect(() => {
    // Créer la structure initiale des sièges
    updateClassroomConfig(classConfig);
    setOriginalConfig({ ...classConfig });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Mettre à jour les sièges originaux après la première création
  useEffect(() => {
    if (seats.length > 0 && originalSeats.length === 0) {
      setOriginalSeats(JSON.parse(JSON.stringify(seats)));
    }
  }, [seats, originalSeats]);

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
                savedConfigurations={savedConfigurations}
                savedAssignments={savedAssignments}
                updateConfig={updateClassroomConfig}
                assignStudent={assignStudentToSeat}
                saveConfiguration={saveConfiguration}
                saveAssignment={saveAssignment}
                deleteConfiguration={deleteConfiguration}
                deleteAssignment={deleteAssignment}
                applyChanges={applyChanges}
                hasChanges={hasChanges}
              />
            </TabsContent>
            
            <TabsContent value="visualization" className="pt-4">
              <ClassroomVisualization 
                seats={seats}
                students={students}
                activeConfiguration={activeConfigurationName}
                activeAssignment={activeAssignmentName}
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
