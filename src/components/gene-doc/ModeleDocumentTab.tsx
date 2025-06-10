
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Plus,
  Settings2
} from 'lucide-react';
import { dmsService } from '@/services/dmsService';
import { ModeleDocument, ChampsModele } from '@/types/dms';
import { useToast } from '@/hooks/use-toast';
import { ModeleDocumentForm } from './ModeleDocumentForm';
import { ChampsModeleDialog } from './ChampsModeleDialog';

export const ModeleDocumentTab: React.FC = () => {
  const [modeles, setModeles] = useState<ModeleDocument[]>([]);
  const [champs, setChamps] = useState<ChampsModele[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedModele, setSelectedModele] = useState<ModeleDocument | null>(null);
  const [showChampsDialog, setShowChampsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [modelesRes, champsRes] = await Promise.all([
        dmsService.getModelesDocuments(),
        dmsService.getChampsModeles(),
      ]);
      
      setModeles(modelesRes.data);
      setChamps(champsRes.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les modèles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredModeles = modeles.filter(modele =>
    modele.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    modele.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModeleChampsCount = (modeleId: number) => {
    return champs.filter(champ => champ.modele_document === modeleId).length;
  };

  const handleEditModele = (modele: ModeleDocument) => {
    setSelectedModele(modele);
    setShowForm(true);
  };

  const handleConfigureChamps = (modele: ModeleDocument) => {
    setSelectedModele(modele);
    setShowChampsDialog(true);
  };

  const handleCreateModele = () => {
    setSelectedModele(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Modèles</p>
                <p className="text-2xl font-bold">{modeles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Champs Configurés</p>
                <p className="text-2xl font-bold">{champs.length}</p>
              </div>
              <Settings2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modèles Actifs</p>
                <p className="text-2xl font-bold">{modeles.length}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Actifs
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Modèles de Documents</CardTitle>
            <Button onClick={handleCreateModele} className="flex items-center gap-2">
              <Plus size={16} />
              Nouveau Modèle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un modèle..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des modèles */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du Modèle</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Champs</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModeles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun modèle trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredModeles.map((modele) => (
                      <TableRow key={modele.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-purple-600" />
                            {modele.nom}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {modele.description || 'Aucune description'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getModeleChampsCount(modele.id)} champs
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {modele.template ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Configuré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              En attente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfigureChamps(modele)}
                            >
                              <Settings2 size={14} className="mr-1" />
                              Champs
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditModele(modele)}
                            >
                              <Edit size={14} className="mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showForm && (
        <ModeleDocumentForm
          modele={selectedModele}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedModele(null);
          }}
          onSuccess={() => {
            loadData();
            setShowForm(false);
            setSelectedModele(null);
          }}
        />
      )}

      {showChampsDialog && selectedModele && (
        <ChampsModeleDialog
          modele={selectedModele}
          open={showChampsDialog}
          onClose={() => {
            setShowChampsDialog(false);
            setSelectedModele(null);
          }}
          onSuccess={() => {
            loadData();
            setShowChampsDialog(false);
            setSelectedModele(null);
          }}
        />
      )}
    </div>
  );
};
