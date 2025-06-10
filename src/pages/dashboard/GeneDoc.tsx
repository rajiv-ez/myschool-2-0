
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  FileText, 
  Plus, 
  Crown, 
  Sparkles,
  Settings,
  Download 
} from 'lucide-react';
import { ModeleDocumentTab } from '@/components/gene-doc/ModeleDocumentTab';
import { DocumentGenereTab } from '@/components/gene-doc/DocumentGenereTab';

const GeneDoc: React.FC = () => {
  const [activeTab, setActiveTab] = useState('modeles');

  return (
    <div className="space-y-6">
      {/* Header Premium */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-yellow-300" />
                <Badge variant="secondary" className="bg-yellow-300/20 text-yellow-300 border-yellow-300/30">
                  PREMIUM
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">Génération de Documents</h1>
              <p className="text-purple-100">
                Créez des modèles personnalisés et générez automatiquement vos documents officiels
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Sparkles className="h-12 w-12 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2 w-fit">
            <TabsTrigger value="modeles" className="flex items-center gap-2">
              <Settings size={16} />
              Modèles
            </TabsTrigger>
            <TabsTrigger value="generes" className="flex items-center gap-2">
              <FileText size={16} />
              Documents Générés
            </TabsTrigger>
          </TabsList>

          <Button 
            variant="default" 
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus size={16} />
            {activeTab === 'modeles' ? 'Nouveau Modèle' : 'Générer Document'}
          </Button>
        </div>

        <TabsContent value="modeles" className="space-y-6">
          <ModeleDocumentTab />
        </TabsContent>

        <TabsContent value="generes" className="space-y-6">
          <DocumentGenereTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneDoc;
