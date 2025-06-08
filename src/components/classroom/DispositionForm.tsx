
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Power } from 'lucide-react';
import { DispositionClasse, Place } from '@/types/configuration';

interface Student {
  id: number;
  inscriptionId: number;
  name: string;
}

interface DispositionFormProps {
  activeDisposition?: DispositionClasse;
  activeConfigId?: number;
  students: Student[];
  onCreateDisposition: (data: Partial<DispositionClasse> & { places: Omit<Place, 'id' | 'disposition'>[] }) => void;
  onActivateDisposition: (id: number) => void;
  isLoading: boolean;
  rows: number;
  linesPerRow: number;
  positionsPerLine: number;
}

const DispositionForm: React.FC<DispositionFormProps> = ({
  activeDisposition,
  activeConfigId,
  students,
  onCreateDisposition,
  onActivateDisposition,
  isLoading,
  rows,
  linesPerRow,
  positionsPerLine
}) => {
  const [dispositionId, setDispositionId] = useState<number | null>(null);
  const [dispositionName, setDispositionName] = useState('');
  const [description, setDescription] = useState('');
  const [seatAssignments, setSeatAssignments] = useState<{ [key: string]: number | null }>({});

  // Load active disposition data
  useEffect(() => {
    if (activeDisposition) {
      setDispositionId(activeDisposition.id);
      setDispositionName(activeDisposition.nom);
      setDescription(activeDisposition.description || '');
      
      // Load seat assignments from places
      // Note: This would need to be populated from the actual places data
      // when we fetch the full disposition with places
    } else {
      resetForm();
    }
  }, [activeDisposition]);

  const resetForm = () => {
    setDispositionId(null);
    setDispositionName('');
    setDescription('');
    setSeatAssignments({});
  };

  const generateSeatId = (row: number, line: number, position: string) => {
    return `${row}-${line}-${position}`;
  };

  const handleSeatAssignment = (seatId: string, inscriptionId: number | null) => {
    setSeatAssignments(prev => ({
      ...prev,
      [seatId]: inscriptionId
    }));
  };

  const getAvailableStudents = (currentSeatId: string) => {
    const assignedIds = Object.entries(seatAssignments)
      .filter(([seatId, id]) => seatId !== currentSeatId && id !== null)
      .map(([, id]) => id);
    
    return students.filter(student => !assignedIds.includes(student.inscriptionId));
  };

  const handleSave = () => {
    if (!dispositionName.trim() || !activeConfigId) {
      return;
    }

    // Convert seat assignments to places array
    const places: Omit<Place, 'id' | 'disposition'>[] = [];
    const positions = ['a', 'b', 'c', 'd', 'e', 'f'];

    for (let row = 1; row <= rows; row++) {
      for (let line = 1; line <= linesPerRow; line++) {
        for (let pos = 0; pos < positionsPerLine; pos++) {
          const position = positions[pos];
          const seatId = generateSeatId(row, line, position);
          const inscriptionId = seatAssignments[seatId];

          places.push({
            rangee: row,
            ligne: line,
            place: pos + 1,
            inscription: inscriptionId || 0, // 0 for unassigned
          });
        }
      }
    }

    const dispositionData: Partial<DispositionClasse> & { places: Omit<Place, 'id' | 'disposition'>[] } = {
      nom: dispositionName,
      description,
      configuration: activeConfigId,
      places,
    };

    // Only add id if we're updating an existing disposition
    if (dispositionId) {
      (dispositionData as any).id = dispositionId;
    }

    onCreateDisposition(dispositionData);
    
    if (!dispositionId) {
      resetForm();
    }
  };

  const handleActivate = () => {
    if (dispositionId) {
      onActivateDisposition(dispositionId);
    }
  };

  if (!activeConfigId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Veuillez d'abord activer une configuration pour créer des attributions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const positions = ['a', 'b', 'c', 'd', 'e', 'f'];

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <input type="hidden" value={dispositionId || ''} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="dispositionName">Nom de l'attribution</Label>
              <Input
                id="dispositionName"
                value={dispositionName}
                onChange={(e) => setDispositionName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={1}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading || !dispositionName.trim()}
              >
                <Save size={16} className="mr-1" />
                Sauvegarder
              </Button>
              
              {dispositionId && (
                <Button 
                  type="button"
                  onClick={handleActivate}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Power size={16} className="mr-1" />
                  Activer
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Seat Assignment Grid */}
        <div className="space-y-4 mt-6">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex + 1}`} className="space-y-4">
              <h3 className="font-medium">Rangée {rowIndex + 1}</h3>
              
              <div className="grid gap-4">
                {Array.from({ length: linesPerRow }).map((_, lineIndex) => (
                  <div key={`line-${rowIndex + 1}-${lineIndex + 1}`} className="p-4 border rounded-lg">
                    <h4 className="mb-2 text-sm font-medium">Ligne {lineIndex + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: positionsPerLine }).map((_, posIndex) => {
                        const position = positions[posIndex];
                        const seatId = generateSeatId(rowIndex + 1, lineIndex + 1, position);
                        const assignedInscriptionId = seatAssignments[seatId];
                        const assignedStudent = students.find(s => s.inscriptionId === assignedInscriptionId);
                        const availableStudents = getAvailableStudents(seatId);
                        
                        return (
                          <div key={seatId} className="space-y-2 p-3 border rounded-md bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Place {position.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">
                                {rowIndex + 1}-{lineIndex + 1}-{position}
                              </span>
                            </div>
                            
                            <Select
                              value={assignedInscriptionId?.toString() || "unassigned"}
                              onValueChange={(value) => {
                                const inscriptionId = value !== "unassigned" ? parseInt(value) : null;
                                handleSeatAssignment(seatId, inscriptionId);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un élève">
                                  {assignedStudent?.name}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unassigned">Non assigné</SelectItem>
                                {assignedStudent && (
                                  <SelectItem value={assignedStudent.inscriptionId.toString()}>
                                    {assignedStudent.name}
                                  </SelectItem>
                                )}
                                {availableStudents.map((student) => (
                                  <SelectItem key={student.inscriptionId} value={student.inscriptionId.toString()}>
                                    {student.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DispositionForm;
