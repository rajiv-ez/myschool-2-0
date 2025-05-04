
import React from 'react';
import { cn } from '@/lib/utils';

interface SchoolNoticeProps {
  title: string;
  content: React.ReactNode;
  date?: string;
  color?: 'blue' | 'purple' | 'orange' | 'white';
  className?: string;
}

const SchoolNotice: React.FC<SchoolNoticeProps> = ({
  title,
  content,
  date,
  color = 'white',
  className
}) => {
  const colorClasses = {
    blue: "bg-myschool-blue-soft border-myschool-purple",
    purple: "bg-myschool-purple-soft border-myschool-purple",
    orange: "bg-orange-100 border-myschool-orange",
    white: "bg-white border-myschool-gray"
  };

  return (
    <div 
      className={cn(
        "notice-paper rounded-md border p-4 rotate-1 transform transition-transform hover:rotate-0 hover:scale-105",
        colorClasses[color],
        className
      )}
    >
      <div className="text-lg font-bold mb-2">{title}</div>
      <div className="text-myschool-gray-dark">{content}</div>
      {date && (
        <div className="mt-3 text-xs italic text-gray-500">
          {date}
        </div>
      )}
      
      {/* Épingles simulées */}
      <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-red-500 border border-red-600 shadow"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-red-500 border border-red-600 shadow"></div>
    </div>
  );
};

export default SchoolNotice;
