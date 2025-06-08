
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useClassroomData } from '@/hooks/useClassroomData';
import { useQuery } from '@tanstack/react-query';
import { configurationService } from '@/services/configurationService';

const ClassroomVisualization: React.FC = () => {
  const [activeSeatId, setActiveSeatId] = useState<string | null>(null);
  
  const {
    activeConfiguration,
    activeDisposition,
    getStudentsForActiveConfig
  } = useClassroomData();

  // Fetch places for active disposition
  const { data: placesResponse } = useQuery({
    queryKey: ['places', activeDisposition?.id],
    queryFn: () => activeDisposition ? configurationService.getPlacesByDisposition(activeDisposition.id) : Promise.resolve({ data: [] }),
    enabled: !!activeDisposition
  });

  const places = placesResponse?.data || [];
  const students = getStudentsForActiveConfig();

  if (!activeConfiguration) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune configuration active. Veuillez activer une configuration pour voir la visualisation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { nb_rangees: rows, nb_lignes_par_rangee: linesPerRow, nb_places_par_ligne: positionsPerLine } = activeConfiguration;
  
  const getStudentForPlace = (place: any) => {
    if (!place.inscription) return null;
    return students.find(s => s.inscriptionId === place.inscription);
  };

  const getSeatId = (row: number, line: number, position: number) => {
    const positionLetter = String.fromCharCode(96 + position); // a, b, c, etc.
    return `${row}-${line}-${positionLetter}`;
  };

  const getPlaceForSeat = (row: number, line: number, position: number) => {
    return places.find(p => p.rangee === row && p.ligne === line && p.place === position);
  };

  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Configuration active :</h4>
              <p className="font-medium">{activeConfiguration?.nom || 'Aucune configuration active'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Attribution active :</h4>
              <p className="font-medium">{activeDisposition?.nom || 'Aucune attribution active'}</p>
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
            
            {/* Representation des sièges */}
            <div className="grid gap-8">
              {Array.from({ length: linesPerRow }, (_, lineIndex) => {
                const lineNumber = lineIndex + 1;
                return (
                  <div key={`line-${lineNumber}`} className="flex justify-center gap-8">
                    {Array.from({ length: rows }, (_, rowIndex) => {
                      const rowNumber = rowIndex + 1;
                      
                      return (
                        <div key={`row-${rowNumber}-line-${lineNumber}`} className="flex gap-2">
                          {Array.from({ length: positionsPerLine }, (_, posIndex) => {
                            const position = posIndex + 1;
                            const seatId = getSeatId(rowNumber, lineNumber, position);
                            const place = getPlaceForSeat(rowNumber, lineNumber, position);
                            const student = place ? getStudentForPlace(place) : null;

                            return (
                              <TooltipProvider key={seatId}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`
                                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center 
                                        ${student ? 'bg-blue-500 text-white' : 'bg-gray-300'}
                                        cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-300
                                        transition-all duration-200
                                        ${activeSeatId === seatId ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                                      `}
                                      onClick={() => setActiveSeatId(activeSeatId === seatId ? null : seatId)}
                                    >
                                      <span className="text-xs">
                                        {String.fromCharCode(96 + position)}{rowNumber}{lineNumber}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      <span className="font-semibold">Position:</span> Rangée {rowNumber}, Ligne {lineNumber}, Place {String.fromCharCode(96 + position).toUpperCase()}
                                    </p>
                                    <p>
                                      <span className="font-semibold">Élève:</span> {student?.name || 'Non assigné'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
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
              {activeSeatId ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Détails de la place</h3>
                  {(() => {
                    const [row, line, pos] = activeSeatId.split('-');
                    const position = pos.charCodeAt(0) - 96;
                    const place = getPlaceForSeat(parseInt(row), parseInt(line), position);
                    const student = place ? getStudentForPlace(place) : null;
                    
                    return (
                      <div className="p-4 border rounded-md bg-gray-50">
                        <p className="mb-2">
                          <span className="font-semibold">Position:</span> Rangée {row}, Ligne {line}, Place {pos.toUpperCase()}
                        </p>
                        
                        {student ? (
                          <div className="space-y-2">
                            <p><span className="font-semibold">Élève:</span> {student.name}</p>
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
                    );
                  })()}
                  
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
