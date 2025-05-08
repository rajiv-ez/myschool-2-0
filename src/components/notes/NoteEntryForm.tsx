
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface NoteFormProps {
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  currentGrade?: number;
  currentComment?: string;
  onSave: (grade: number, comment: string) => void;
  onCancel: () => void;
}

const predefinedComments = [
  "Très bon travail, continue ainsi !",
  "Bon travail, mais peut encore progresser.",
  "Des progrès notables depuis la dernière évaluation.",
  "Doit approfondir ses connaissances sur ce sujet.",
  "Attention aux erreurs d'inattention.",
  "Effort soutenu, résultat encourageant.",
  "Doit travailler plus régulièrement."
];

const NoteEntryForm: React.FC<NoteFormProps> = ({
  studentId,
  studentName,
  subjectId,
  subjectName,
  currentGrade = 0,
  currentComment = "",
  onSave,
  onCancel
}) => {
  const [grade, setGrade] = useState(currentGrade);
  const [comment, setComment] = useState(currentComment);
  const { toast } = useToast();

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 20) {
      setGrade(value);
    }
  };

  const handlePredefinedComment = (selectedComment: string) => {
    setComment(selectedComment);
  };

  const handleSubmit = () => {
    if (grade < 0 || grade > 20) {
      toast({
        title: "Note invalide",
        description: "La note doit être comprise entre 0 et 20.",
        variant: "destructive"
      });
      return;
    }

    onSave(grade, comment);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-sm font-medium">Élève</label>
            <p className="text-sm">{studentName}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Matière</label>
            <p className="text-sm">{subjectName}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Note (sur 20)</label>
          <Input
            type="number"
            value={grade}
            onChange={handleGradeChange}
            min="0"
            max="20"
            step="0.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Commentaire prédéfini</label>
          <Select onValueChange={handlePredefinedComment}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un commentaire" />
            </SelectTrigger>
            <SelectContent>
              {predefinedComments.map((comment, index) => (
                <SelectItem key={index} value={comment}>
                  {comment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Commentaire personnalisé</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Entrez un commentaire..."
            rows={3}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogFooter>
    </div>
  );
};

export default NoteEntryForm;
