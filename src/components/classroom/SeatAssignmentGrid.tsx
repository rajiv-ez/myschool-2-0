
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import type { Seat, Student } from '@/pages/dashboard/ClassroomConfig';

interface SeatAssignmentGridProps {
  seats: Seat[];
  students: Student[];
  onAssignStudent: (seatId: string, studentId?: number) => void;
}

const SeatAssignmentGrid: React.FC<SeatAssignmentGridProps> = ({
  seats,
  students,
  onAssignStudent
}) => {
  const getAvailableStudents = (currentSeatId: string) => {
    const assignedStudentIds = seats
      .filter(seat => seat.id !== currentSeatId && seat.studentId)
      .map(seat => seat.studentId);
    
    return students.filter(student => !assignedStudentIds.includes(student.id));
  };

  const groupSeatsByRowAndLine = () => {
    const grouped: { [key: string]: Seat[] } = {};
    
    seats.forEach(seat => {
      const key = `${seat.row}-${seat.line}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(seat);
    });

    return grouped;
  };

  const groupedSeats = groupSeatsByRowAndLine();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Attribution des places
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedSeats)
            .sort(([a], [b]) => {
              const [rowA, lineA] = a.split('-').map(Number);
              const [rowB, lineB] = b.split('-').map(Number);
              return rowA - rowB || lineA - lineB;
            })
            .map(([key, rowSeats]) => {
              const [row, line] = key.split('-').map(Number);
              const sortedSeats = rowSeats.sort((a, b) => a.position.localeCompare(b.position));
              
              return (
                <div key={key} className="border rounded-lg p-3">
                  <h4 className="font-medium mb-2">
                    Rangée {row} - Ligne {line}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {sortedSeats.map((seat) => {
                      const assignedStudent = seat.studentId 
                        ? students.find(s => s.id === seat.studentId)
                        : null;
                      const availableStudents = getAvailableStudents(seat.id);

                      return (
                        <div key={seat.id} className="min-w-48">
                          <div className="text-xs text-gray-500 mb-1">
                            Place {seat.position.toUpperCase()}
                          </div>
                          <Select
                            value={seat.studentId?.toString() || ''}
                            onValueChange={(value) => 
                              onAssignStudent(seat.id, value ? parseInt(value) : undefined)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choisir un élève">
                                {assignedStudent?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Aucun élève</SelectItem>
                              {assignedStudent && (
                                <SelectItem value={assignedStudent.id.toString()}>
                                  {assignedStudent.name}
                                </SelectItem>
                              )}
                              {availableStudents.map((student) => (
                                <SelectItem key={student.id} value={student.id.toString()}>
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
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeatAssignmentGrid;
