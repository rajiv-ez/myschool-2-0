
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Student, Seat } from '@/pages/dashboard/ClassroomConfig';

interface ClassroomVisualizationProps {
  seats: Seat[];
  students: Student[];
  activeConfiguration?: string;
  activeAssignment?: string;
}

const ClassroomVisualization: React.FC<ClassroomVisualizationProps> = ({
  seats,
  students,
  activeConfiguration,
  activeAssignment
}) => {
  // Trouver le nombre maximal de rangées, lignes et positions
  const maxRow = Math.max(...seats.map(s => s.row), 0);
  const maxLinesPerRow = Math.max(...Array.from({ length: maxRow }, (_, i) => {
    const rowIndex = i + 1;
    return Math.max(...seats.filter(s => s.row === rowIndex).map(s => s.line), 0);
  }), 0);
  const maxPositionsPerLine = Math.max(...seats.map(s => s.position.charCodeAt(0) - 96), 0);
  
  const [activeSeat, setActiveSeat] = useState<Seat | null>(null);

  const getStudentForSeat = (seat: Seat): Student | undefined => {
    if (seat.studentId) {
      return students.find(s => s.id === seat.studentId);
    }
    return undefined;
  };

  // Organiser les sièges par rangée, ligne et position
  const seatsByRow = Array.from({ length: maxRow }, (_, rowIndex) => {
    const row = rowIndex + 1;
    return Array.from({ length: maxLinesPerRow }, (_, lineIndex) => {
      const line = lineIndex + 1;
      const positions = seats
        .filter(s => s.row === row && s.line === line)
        .sort((a, b) => a.position.localeCompare(b.position));
      return positions;
    });
  });

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Configuration active :</h4>
              <p className="font-medium">{activeConfiguration || 'Aucune configuration active'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Attribution active :</h4>
              <p className="font-medium">{activeAssignment || 'Aucune attribution active'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Visualisation des tables et du tableau */}
        <div className="md:w-3/4">
          <div className="w-full p-6 bg-gray-100 border rounded-lg">
            {/* Tableau de l'enseignant (en haut) */}
            <div className="w-full flex justify-center mb-8">
              <div className="h-16 w-64 bg-gray-300 rounded flex items-center justify-center text-sm font-medium">
                <span>Tableau</span>
              </div>
            </div>
            
            {/* Representation des sièges selon la nouvelle structure */}
            <div className="grid gap-8">
              {Array.from({ length: maxLinesPerRow }, (_, lineIndex) => {
                const lineNumber = lineIndex + 1;
                return (
                  <div key={`line-${lineNumber}`} className="flex justify-center gap-8">
                    {Array.from({ length: maxRow }, (_, rowIndex) => {
                      const rowNumber = rowIndex + 1;
                      const seatsInPosition = seats.filter(
                        s => s.row === rowNumber && s.line === lineNumber
                      ).sort((a, b) => a.position.localeCompare(b.position));
                      
                      return (
                        <div key={`row-${rowNumber}-line-${lineNumber}`} className="flex gap-2">
                          {seatsInPosition.map((seat) => (
                            <TooltipProvider key={seat.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`
                                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                                      ${seat.studentId ? 'bg-blue-500 text-white' : 'bg-gray-300'}
                                      cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-300
                                      transition-all duration-200
                                    `}
                                    onClick={() => setActiveSeat(seat === activeSeat ? null : seat)}
                                  >
                                    <span className="text-xs">
                                      r{seat.row}l{seat.line}p{seat.position}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    <span className="font-semibold">Position:</span> Rangée {seat.row}, Ligne {seat.line}, Place {seat.position.toUpperCase()}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Élève:</span> {getStudentForSeat(seat)?.name || 'Non assigné'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Informations sur le siège sélectionné */}
        <div className="md:w-1/4">
          <Card className="h-full">
            <CardContent className="pt-6">
              {activeSeat ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Détails de la place</h3>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <p className="mb-2"><span className="font-semibold">Position:</span> Rangée {activeSeat.row}, Ligne {activeSeat.line}, Place {activeSeat.position.toUpperCase()}</p>
                    
                    {activeSeat.studentId ? (
                      <div className="space-y-2">
                        <p><span className="font-semibold">Élève:</span> {getStudentForSeat(activeSeat)?.name}</p>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Place assignée</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span>Place non assignée</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-medium mt-4">Légende</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Place assignée</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span>Place non assignée</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <p className="text-muted-foreground mb-2">
                    Cliquez sur une place pour voir ses détails
                  </p>
                  
                  <h3 className="font-medium mt-8">Légende</h3>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Place assignée</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span>Place non assignée</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClassroomVisualization;
