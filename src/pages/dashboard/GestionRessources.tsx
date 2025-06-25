
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FraisScolairesManagement from '@/components/financial/FraisScolairesManagement';
import GestionStock from '@/components/ressources/GestionStock';

const GestionRessources = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Moyens Généraux</h1>
          <p className="text-muted-foreground">
            Gérez les frais scolaires et les stocks de votre établissement
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="fraisScolaires">
            <TabsList className="mb-4">
              <TabsTrigger value="fraisScolaires">Frais Scolaires</TabsTrigger>
              <TabsTrigger value="stock">Gestion des Stocks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fraisScolaires" className="pt-4">
              <FraisScolairesManagement />
            </TabsContent>
            
            <TabsContent value="stock" className="pt-4">
              <GestionStock />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionRessources;
