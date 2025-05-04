
import React from 'react';

interface BlackboardProps {
  children: React.ReactNode;
  className?: string;
}

const Blackboard: React.FC<BlackboardProps> = ({ children, className = '' }) => {
  return (
    <div className={`blackboard rounded-lg p-6 md:p-8 relative ${className}`}>
      {/* Effet de bordure en bois */}
      <div className="absolute inset-0 -z-10 rounded-lg border-8 border-amber-800 bg-amber-900"></div>
      
      {/* Sillons de tableau noir */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-amber-800 -mx-2 -mt-2 rounded-t"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-800 -mx-2 -mb-2 rounded-b"></div>
      
      {/* Contenu du tableau noir */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Blackboard;
