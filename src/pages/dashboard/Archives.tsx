
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
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ArchiveIcon, 
  Search, 
  Download, 
  Eye, 
  FileText,
  Filter,
  Calendar
} from 'lucide-react';
import { dmsService } from '@/services/dmsService';
import { Archive, TypeArchive } from '@/types/dms';
import { useToast } from '@/hooks/use-toast';

const Archives: React.FC = () => {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [typesArchives, setTypesArchives] = useState<TypeArchive[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [archivesRes, typesRes] = await Promise.all([
        dmsService.getArchives(),
        dmsService.getTypes(),
      ]);
      
      setArchives(archivesRes.data);
      setTypesArchives(typesRes.data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les archives",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredArchives = archives.filter(archive => {
    const matchesType = selectedType === 'all' || archive.type_archive.toString() === selectedType;
    const matchesSearch = searchTerm === '' || 
      archive.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      archive.tags.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const getTypeArchiveName = (typeId: number) => {
    const type = typesArchives.find(t => t.id === typeId);
    return type?.nom || 'Type inconnu';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = (archive: Archive) => {
    // Ici, on téléchargerait le fichier
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${archive.nom || 'l\'archive'} commencé`,
    });
  };

  const handleView = (archive: Archive) => {
    // Ici, on ouvrirait le fichier pour visualisation
    toast({
      title: "Visualisation",
      description: `Ouverture de ${archive.nom || 'l\'archive'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Archives</h2>
          <p className="text-muted-foreground">
            Consultez et gérez vos archives documentaires
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Exporter tout
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Filter size={18} />
            Filtres et recherche
          </CardTitle>
          <CardDescription>
            Filtrez les archives par type et recherchez par mots-clés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher dans les archives..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'archive" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {typesArchives.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArchiveIcon size={18} />
            Archives disponibles
            <Badge variant="secondary">{filteredArchives.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-25rem)] w-full">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Date création</TableHead>
                      <TableHead>Dernière modification</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArchives.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Aucune archive trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredArchives.map((archive) => (
                        <TableRow key={archive.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-muted-foreground" />
                              {archive.nom || `Archive #${archive.id}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getTypeArchiveName(archive.type_archive)}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {archive.description || 'Aucune description'}
                          </TableCell>
                          <TableCell>
                            {archive.tags ? (
                              <div className="flex flex-wrap gap-1">
                                {archive.tags.split(',').slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag.trim()}
                                  </Badge>
                                ))}
                                {archive.tags.split(',').length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{archive.tags.split(',').length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Aucun tag</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar size={14} />
                              {formatDate(archive.date_creation)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar size={14} />
                              {formatDate(archive.date_modification)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(archive)}
                              >
                                <Eye size={14} className="mr-1" />
                                Voir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(archive)}
                              >
                                <Download size={14} className="mr-1" />
                                Télécharger
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Archives;
