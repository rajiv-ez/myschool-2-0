
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FinancialDashboard from '@/components/financial/FinancialDashboard';
import PaiementsManagement from '@/components/financial/PaiementsManagement';
import DepensesManagement from '@/components/financial/DepensesManagement';
import FraisScolairesManagement from '@/components/financial/FraisScolairesManagement';

const GestionFinanciere = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion Financière Complète</h1>
          <p className="text-muted-foreground">
            Tableau de bord et gestion financière de l'établissement
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
              <TabsTrigger value="paiements">Paiements</TabsTrigger>
              <TabsTrigger value="depenses">Dépenses</TabsTrigger>
              <TabsTrigger value="frais">Frais Scolaires</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-4">
              <FinancialDashboard />
            </TabsContent>
            
            <TabsContent value="paiements" className="pt-4">
              <PaiementsManagement />
            </TabsContent>
            
            <TabsContent value="depenses" className="pt-4">
              <DepensesManagement />
            </TabsContent>
            
            <TabsContent value="frais" className="pt-4">
              <FraisScolairesManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionFinanciere;
