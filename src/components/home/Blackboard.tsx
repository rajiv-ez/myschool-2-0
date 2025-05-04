
import React from 'react';

interface BlackboardProps {
  children: React.ReactNode;
  className?: string;
}

const Blackboard: React.FC<BlackboardProps> = ({ children, className = '' }) => {
  return (
    <div className={`blackboard rounded-lg p-6 md:p-8 relative overflow-hidden ${className}`}>
      {/* Effet de bordure en bois */}
      <div className="absolute inset-0 -z-10 rounded-lg border-[12px] border-amber-800 bg-amber-900"></div>
      
      {/* Sillons de tableau noir */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-amber-800 -mx-2 -mt-2 rounded-t"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-amber-800 -mx-2 -mb-2 rounded-b"></div>
      
      {/* Effet de texture */}
      <div className="absolute inset-0 -z-5 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'url("/images/blackboard-texture.jpg")',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             mixBlendMode: 'overlay'
           }}></div>
      
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent -z-5"></div>
      
      {/* Marques de craie et poussière */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-5">
        <div className="absolute top-2 left-4 h-6 w-6 bg-white/10 rounded-full blur-md"></div>
        <div className="absolute bottom-8 right-12 h-4 w-20 bg-white/5 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 right-1/4 h-2 w-8 bg-white/5 rounded-full blur-sm"></div>
      </div>
      
      {/* Contenu du tableau noir */}
      <div className="relative z-10 text-white">
        {children}
      </div>
    </div>
  );
};

export default Blackboard;
