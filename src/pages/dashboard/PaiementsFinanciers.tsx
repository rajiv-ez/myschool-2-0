
import React from 'react';
import PaiementsManagement from '@/components/financial/PaiementsManagement';

const PaiementsFinanciers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion Financière</h1>
          <p className="text-muted-foreground">
            Suivi des paiements et gestion de la trésorerie
          </p>
        </div>
      </div>

      <PaiementsManagement />
    </div>
  );
};

export default PaiementsFinanciers;
