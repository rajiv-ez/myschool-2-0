
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import NoteGradeCalculator from './NoteGradeCalculator';
import NoteEntryForm from './NoteEntryForm';
import { Grade, Student, Subject } from './types';

interface GradeEntryProps {
  student: Student;
  subject: Subject;
  grade: Grade | undefined;
  onGradeUpdate: (studentId: string, subjectId: string, value: number, comment: string) => void;
}

const GradeEntry: React.FC<GradeEntryProps> = ({
  student,
  subject,
  grade,
  onGradeUpdate
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSave = (value: number, comment: string) => {
    onGradeUpdate(student.id, subject.id, value, comment);
    setOpen(false);
  };

  const displayGrade = grade ? (
    <div className="flex items-center justify-between">
      <NoteGradeCalculator grade={grade.value} />
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => setOpen(true)}
      >
        <Edit size={16} />
      </Button>
    </div>
  ) : (
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={() => setOpen(true)}
    >
      Saisir
    </Button>
  );
  
  return (
    <>
      {displayGrade}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {grade ? 'Modifier' : 'Saisir'} une note
            </DialogTitle>
          </DialogHeader>
          <NoteEntryForm 
            studentId={student.id}
            studentName={student.name}
            subjectId={subject.id}
            subjectName={subject.name}
            currentGrade={grade?.value}
            currentComment={grade?.comment}
            onSave={handleSave}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GradeEntry;
