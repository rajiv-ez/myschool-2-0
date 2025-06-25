
import React from 'react';
import DepensesManagement from '@/components/financial/DepensesManagement';

const GestionDepenses = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Dépenses</h1>
          <p className="text-muted-foreground">
            Suivi et contrôle des dépenses de l'établissement
          </p>
        </div>
      </div>

      <DepensesManagement />
    </div>
  );
};

export default GestionDepenses;
