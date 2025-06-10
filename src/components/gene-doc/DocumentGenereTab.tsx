
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
  Download, 
  Eye, 
  Search,
  Plus,
  Calendar,
  User
} from 'lucide-react';
import { dmsService } from '@/services/dmsService';
import { DocumentGenere, ModeleDocument } from '@/types/dms';
import { useToast } from '@/hooks/use-toast';
import { GenerateDocumentDialog } from './GenerateDocumentDialog';

export const DocumentGenereTab: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentGenere[]>([]);
  const [modeles, setModeles] = useState<ModeleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [documentsRes, modelesRes] = await Promise.all([
        dmsService.getDocumentsGeneres(),
        dmsService.getModelesDocuments(),
      ]);
      
      setDocuments(documentsRes.data);
      setModeles(modelesRes.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModeleName = (modeleId: number) => {
    const modele = modeles.find(m => m.id === modeleId);
    return modele?.nom || 'Modèle inconnu';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (document: DocumentGenere) => {
    if (document.fichier_genere) {
      // Ici, on téléchargerait le fichier
      toast({
        title: "Téléchargement",
        description: "Téléchargement du document commencé",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Aucun fichier généré disponible",
        variant: "destructive",
      });
    }
  };

  const handleView = (document: DocumentGenere) => {
    if (document.fichier_genere) {
      // Ici, on ouvrirait le document
      toast({
        title: "Visualisation",
        description: "Ouverture du document",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Aucun fichier généré disponible",
        variant: "destructive",
      });
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const modeleName = getModeleName(doc.modele);
    return modeleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           Object.values(doc.donnees).some(value => 
             value.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents Générés</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">
                  {documents.filter(doc => {
                    const docDate = new Date(doc.date_creation);
                    const now = new Date();
                    return docDate.getMonth() === now.getMonth() && 
                           docDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modèles Utilisés</p>
                <p className="text-2xl font-bold">
                  {new Set(documents.map(doc => doc.modele)).size}
                </p>
              </div>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                Variés
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Documents Générés</CardTitle>
            <Button 
              onClick={() => setShowGenerateDialog(true)} 
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <Plus size={16} />
              Générer Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un document..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table des documents */}
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
                    <TableHead>Modèle</TableHead>
                    <TableHead>Données</TableHead>
                    <TableHead>Date de Création</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Aucun document généré trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-green-600" />
                            {getModeleName(document.modele)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {Object.entries(document.donnees).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                            {Object.keys(document.donnees).length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{Object.keys(document.donnees).length - 2} autres champs
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            {formatDate(document.date_creation)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {document.fichier_genere ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Généré
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              En cours
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {document.fichier_genere && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(document)}
                                >
                                  <Eye size={14} className="mr-1" />
                                  Voir
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownload(document)}
                                >
                                  <Download size={14} className="mr-1" />
                                  Télécharger
                                </Button>
                              </>
                            )}
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

      {/* Dialog pour générer un document */}
      {showGenerateDialog && (
        <GenerateDocumentDialog
          open={showGenerateDialog}
          onClose={() => setShowGenerateDialog(false)}
          onSuccess={() => {
            loadData();
            setShowGenerateDialog(false);
          }}
        />
      )}
    </div>
  );
};
