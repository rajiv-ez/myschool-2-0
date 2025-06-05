
import React from 'react';
import Blackboard from '@/components/home/Blackboard';
import SchoolNotice from '@/components/home/SchoolNotice';

const DashboardBlackboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Tableau d'annonces</h1>
        <p className="text-muted-foreground">Toutes les annonces importantes de votre établissement</p>
      </div>
      
      <Blackboard className="w-full">
        <div className="chalk-text text-2xl md:text-4xl font-chalk text-center mb-8">
          Actualités de l'école
        </div>
        <div className="chalk-line mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative transform transition-transform">
            <SchoolNotice 
              title="Réunion pédagogique" 
              content="Une réunion pédagogique se tiendra le jeudi 20 juin à 14h30 en salle des professeurs."
              date="15/06/2024"
              color="blue"
            />
          </div>
          <div className="relative transform transition-transform -rotate-1">
            <SchoolNotice 
              title="Examens de fin de trimestre" 
              content="Les examens de fin de trimestre débuteront le lundi 24 juin. Les plannings sont disponibles."
              date="10/06/2024"
              color="purple"
            />
          </div>
          <div className="relative transform transition-transform rotate-2">
            <SchoolNotice 
              title="Sortie pédagogique" 
              content="Sortie au musée national prévue pour les classes de 5ème le vendredi 28 juin."
              date="12/06/2024"
              color="orange"
            />
          </div>
          <div className="relative transform transition-transform rotate-1">
            <SchoolNotice 
              title="Collecte de fonds" 
              content="Collecte de fonds pour l'achat de nouveaux équipements sportifs. Objectif : 500 000 FCFA."
              date="08/06/2024"
              color="white"
            />
          </div>
          <div className="relative transform transition-transform -rotate-2">
            <SchoolNotice 
              title="Conseil de classe" 
              content="Les conseils de classe du 2ème trimestre se dérouleront du 1er au 5 juillet."
              date="05/06/2024"
              color="blue"
            />
          </div>
          <div className="relative transform transition-transform rotate-3">
            <SchoolNotice 
              title="Inscription nouvelles activités" 
              content="Ouverture des inscriptions pour les activités parascolaires : théâtre, musique, sport."
              date="03/06/2024"
              color="purple"
            />
          </div>
        </div>
      </Blackboard>
    </div>
  );
};

export default DashboardBlackboard;
