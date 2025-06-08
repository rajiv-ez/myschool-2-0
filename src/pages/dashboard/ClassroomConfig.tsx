
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ClassroomEditor from '@/components/classroom/ClassroomEditor';
import ClassroomVisualization from '@/components/classroom/ClassroomVisualization';
import SeatChangeRequests from '@/components/classroom/SeatChangeRequests';

// Temporary mock data for change requests - this should be replaced with real API data
const mockChangeRequests = [
  {
    id: 1,
    studentId: 3,
    studentName: "Jean Moussa",
    requestDate: new Date(),
    reason: "Problème de vision, besoin d'être plus proche du tableau",
    status: 'pending' as const
  },
  {
    id: 2,
    studentId: 5,
    studentName: "Paul Biyoghe",
    requestDate: new Date(Date.now() - 86400000),
    reason: "Préfère être à côté de la fenêtre pour plus de lumière",
    status: 'pending' as const
  }
];

const ClassroomConfig = () => {
  const handleChangeRequest = (requestId: number, action: 'approve' | 'reject') => {
    // TODO: Implement with real API
    console.log('Handle change request:', requestId, action);
  };

  const pendingRequests = mockChangeRequests.filter(r => r.status === 'pending');

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
                {pendingRequests.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="pt-4">
              <ClassroomEditor />
            </TabsContent>
            
            <TabsContent value="visualization" className="pt-4">
              <ClassroomVisualization />
            </TabsContent>
            
            <TabsContent value="requests" className="pt-4">
              <SeatChangeRequests 
                requests={pendingRequests}
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
