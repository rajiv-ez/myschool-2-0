
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import GradeEntry from './GradeEntry';
import NoteGradeCalculator from './NoteGradeCalculator';
import { Student, Subject, Grade } from './types';

interface GradesTableProps {
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
  onGradeUpdate: (studentId: string, subjectId: string, value: number, comment: string) => void;
}

const GradesTable: React.FC<GradesTableProps> = ({ students, subjects, grades, onGradeUpdate }) => {
  // Calcule la moyenne d'un étudiant pour une matière
  const getStudentSubjectAverage = (studentId: string, subjectId: string): number | null => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.subjectId === subjectId);
    if (studentGrades.length === 0) return null;
    
    const sum = studentGrades.reduce((total, grade) => total + grade.value, 0);
    return parseFloat((sum / studentGrades.length).toFixed(1));
  };

  // Calcule la moyenne générale d'un étudiant
  const getStudentAverage = (studentId: string): number | null => {
    let totalPoints = 0;
    let totalCoef = 0;
    
    subjects.forEach(subject => {
      const avg = getStudentSubjectAverage(studentId, subject.id);
      if (avg !== null) {
        totalPoints += avg * subject.coefficient;
        totalCoef += subject.coefficient;
      }
    });
    
    if (totalCoef === 0) return null;
    return parseFloat((totalPoints / totalCoef).toFixed(1));
  };

  // Calcule la moyenne de la classe pour une matière
  const getClassSubjectAverage = (subjectId: string): number | null => {
    let total = 0;
    let count = 0;
    
    students.forEach(student => {
      const avg = getStudentSubjectAverage(student.id, subjectId);
      if (avg !== null) {
        total += avg;
        count++;
      }
    });
    
    if (count === 0) return null;
    return parseFloat((total / count).toFixed(1));
  };

  // Calcule la moyenne générale de la classe
  const getClassAverage = (): number | null => {
    let total = 0;
    let count = 0;
    
    students.forEach(student => {
      const avg = getStudentAverage(student.id);
      if (avg !== null) {
        total += avg;
        count++;
      }
    });
    
    if (count === 0) return null;
    return parseFloat((total / count).toFixed(1));
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="w-[200px]">Élève</TableHead>
              {subjects.map(subject => (
                <TableHead key={subject.id} className="w-[120px] text-center">
                  {subject.name}
                  <div className="text-xs text-muted-foreground">Coef. {subject.coefficient}</div>
                </TableHead>
              ))}
              <TableHead className="text-center font-medium bg-muted/20 w-[120px]">
                Moyenne
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.name}
                  <div className="text-xs text-muted-foreground">{student.classe}</div>
                </TableCell>
                
                {subjects.map(subject => {
                  const studentGrade = grades.find(
                    g => g.studentId === student.id && g.subjectId === subject.id
                  );
                  
                  return (
                    <TableCell key={`${student.id}-${subject.id}`} className="text-center">
                      <GradeEntry
                        student={student}
                        subject={subject}
                        grade={studentGrade}
                        onGradeUpdate={onGradeUpdate}
                      />
                    </TableCell>
                  );
                })}
                
                <TableCell className="text-center font-medium bg-muted/10">
                  {getStudentAverage(student.id) !== null ? (
                    <NoteGradeCalculator grade={getStudentAverage(student.id)!} />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Ligne des moyennes de la classe */}
            <TableRow className="bg-muted/20 font-semibold">
              <TableCell>Moyenne de la classe</TableCell>
              {subjects.map(subject => (
                <TableCell key={`avg-${subject.id}`} className="text-center">
                  {getClassSubjectAverage(subject.id) !== null ? (
                    <NoteGradeCalculator grade={getClassSubjectAverage(subject.id)!} />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold bg-muted/30">
                {getClassAverage() !== null ? (
                  <NoteGradeCalculator grade={getClassAverage()!} />
                ) : (
                  "N/A"
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default GradesTable;
