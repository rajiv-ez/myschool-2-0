
import React from 'react';

interface NoteGradeCalculatorProps {
  grade: number;
  maxGrade?: number;
}

const NoteGradeCalculator: React.FC<NoteGradeCalculatorProps> = ({ 
  grade, 
  maxGrade = 20 
}) => {
  // Détermine la couleur en fonction de la note
  const getColorClass = () => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 65) return "text-emerald-500";
    if (percentage >= 50) return "text-amber-500";
    if (percentage >= 35) return "text-orange-500";
    return "text-red-600";
  };

  return (
    <span className={`font-semibold ${getColorClass()}`}>
      {grade.toFixed(1)}/{maxGrade}
    </span>
  );
};

export default NoteGradeCalculator;
