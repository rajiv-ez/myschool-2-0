
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, Seat } from '@/pages/dashboard/ClassroomConfig';

interface ClassroomEditorProps {
  classConfig: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  };
  seats: Seat[];
  students: Student[];
  updateConfig: (config: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  }) => void;
  assignStudent: (seatId: string, studentId?: number) => void;
}

const ClassroomEditor: React.FC<ClassroomEditorProps> = ({
  classConfig,
  seats,
  students,
  updateConfig,
  assignStudent
}) => {
  const [rows, setRows] = useState(classConfig.rows);
  const [linesPerRow, setLinesPerRow] = useState(classConfig.linesPerRow);
  const [positionsPerLine, setPositionsPerLine] = useState(classConfig.positionsPerLine);
  
  const [editMode, setEditMode] = useState<'config' | 'assignment'>('config');

  // Lorsque les valeurs changent, mettons à jour le local state
  useEffect(() => {
    setRows(classConfig.rows);
    setLinesPerRow(classConfig.linesPerRow);
    setPositionsPerLine(classConfig.positionsPerLine);
  }, [classConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      rows,
      linesPerRow,
      positionsPerLine
    });
  };

  const getStudentNameById = (studentId?: number): string => {
    if (!studentId) return 'Non assigné';
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Non assigné';
  };

  const getUnassignedStudents = (): Student[] => {
    const assignedStudentIds = seats.map(seat => seat.studentId).filter(Boolean);
    return students.filter(student => !assignedStudentIds.includes(student.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button 
          variant={editMode === 'config' ? 'default' : 'outline'}
          onClick={() => setEditMode('config')}
        >
          Configuration des rangées
        </Button>
        <Button 
          variant={editMode === 'assignment' ? 'default' : 'outline'}
          onClick={() => setEditMode('assignment')}
        >
          Attribution des places
        </Button>
      </div>

      {editMode === 'config' ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rows">Nombre de rangées</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linesPerRow">Lignes par rangée</Label>
                  <Input
                    id="linesPerRow"
                    type="number"
                    min="1"
                    max="5"
                    value={linesPerRow}
                    onChange={(e) => setLinesPerRow(parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="positionsPerLine">Places par ligne</Label>
                  <Input
                    id="positionsPerLine"
                    type="number"
                    min="1"
                    max="6"
                    value={positionsPerLine}
                    onChange={(e) => setPositionsPerLine(parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <Button type="submit" className="mt-4">Mettre à jour la configuration</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {Array.from({ length: classConfig.rows }).map((_, rowIndex) => (
              <div key={`row-${rowIndex + 1}`} className="space-y-4">
                <h3 className="font-medium">Rangée {rowIndex + 1}</h3>
                
                <div className="grid gap-4">
                  {Array.from({ length: classConfig.linesPerRow }).map((_, lineIndex) => (
                    <div key={`line-${rowIndex + 1}-${lineIndex + 1}`} className="p-4 border rounded-lg">
                      <h4 className="mb-2 text-sm font-medium">Ligne {lineIndex + 1}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: classConfig.positionsPerLine }).map((_, posIndex) => {
                          const position = String.fromCharCode(97 + posIndex); // a, b, c, etc.
                          const seatId = `${rowIndex + 1}-${lineIndex + 1}-${position}`;
                          const seat = seats.find(s => s.id === seatId);
                          
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
                                value={seat?.studentId?.toString() || "unassigned"}
                                onValueChange={(value) => {
                                  const studentId = value !== "unassigned" ? parseInt(value) : undefined;
                                  assignStudent(seatId, studentId);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un élève" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">Non assigné</SelectItem>
                                  {students.map((student) => (
                                    <SelectItem
                                      key={student.id}
                                      value={student.id.toString()}
                                      disabled={
                                        seat?.studentId !== student.id &&
                                        seats.some(s => s.studentId === student.id)
                                      }
                                    >
                                      {student.name}
                                      {seats.some(s => s.studentId === student.id && s.id !== seatId) ? 
                                        ' (déjà assigné)' : ''}
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
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="font-medium mb-2">Élèves non assignés</h3>
            <div className="flex flex-wrap gap-2">
              {getUnassignedStudents().length === 0 ? (
                <p className="text-sm text-gray-500">Tous les élèves ont été assignés à une place.</p>
              ) : (
                getUnassignedStudents().map(student => (
                  <div key={student.id} className="px-3 py-1.5 bg-white border rounded-full text-sm">
                    {student.name}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomEditor;
