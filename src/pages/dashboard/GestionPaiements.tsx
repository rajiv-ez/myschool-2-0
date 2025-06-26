
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from 'lucide-react';
import PaiementsManagement from '@/components/financial/PaiementsManagement';
import DepensesManagement from '@/components/financial/DepensesManagement';
import TotalsSummary from '@/components/payments/TotalsSummary';
import { useFinancialData } from '@/hooks/useFinancialData';

const GestionPaiements = () => {
  const { statistics, loading, fromApi } = useFinancialData();

  if (loading) {
    return <div className="p-4">Chargement des données financières...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Paiements</h1>
          <p className="text-muted-foreground">
            Suivi des recettes, dépenses et bilan financier
          </p>
        </div>
        <Badge variant={fromApi ? "default" : "secondary"} className="flex items-center gap-1">
          {fromApi ? (
            <>
              <Wifi size={12} />
              En ligne
            </>
          ) : (
            <>
              <WifiOff size={12} />
              Hors ligne
            </>
          )}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="bilan">
            <TabsList className="mb-4">
              <TabsTrigger value="bilan">Bilan</TabsTrigger>
              <TabsTrigger value="recettes">Recettes</TabsTrigger>
              <TabsTrigger value="depenses">Dépenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bilan" className="pt-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Résumé Financier</h2>
                  <TotalsSummary 
                    totalIn={statistics.totalPaiements} 
                    totalOut={statistics.totalDepenses} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-2">Informations générales</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Paiements en attente:</span>
                          <span className="font-semibold">{statistics.paiementsEnAttente}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Paiements validés:</span>
                          <span className="font-semibold">{statistics.paiementsPayes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Source des données:</span>
                          <Badge variant={fromApi ? "default" : "secondary"} className="text-xs">
                            {fromApi ? "En ligne" : "Hors ligne"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-2">Analyse</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Ratio Recettes/Dépenses:</span>
                          <span className="font-semibold">
                            {statistics.totalDepenses > 0 
                              ? `${(statistics.totalPaiements / statistics.totalDepenses * 100).toFixed(1)}%`
                              : 'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>État financier:</span>
                          <Badge variant={statistics.balance >= 0 ? "default" : "destructive"}>
                            {statistics.balance >= 0 ? "Positif" : "Négatif"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recettes" className="pt-4">
              <PaiementsManagement />
            </TabsContent>
            
            <TabsContent value="depenses" className="pt-4">
              <DepensesManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionPaiements;
