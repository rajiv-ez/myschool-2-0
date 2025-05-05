
import React, { useState } from 'react';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArchiveIcon, 
  CalendarIcon, 
  UserIcon, 
  ClipboardList, 
  Download, 
  Search, 
  FileText, 
  Filter, 
  Eye 
} from 'lucide-react';

// Données fictives pour la démonstration
const archivesInscriptions = [
  { 
    id: 101, 
    nom: 'Ondo', 
    prenom: 'Marie', 
    classe: 'CM2', 
    session: '2021-2022', 
    statut: 'Réinscription',
    date: '15/07/2021'
  },
  { 
    id: 102, 
    nom: 'Mouloungui', 
    prenom: 'Jean', 
    classe: '5ème', 
    session: '2022-2023', 
    statut: 'Nouvelle',
    date: '20/07/2022'
  },
  { 
    id: 103, 
    nom: 'Ntoutoume', 
    prenom: 'Alice', 
    classe: 'CE1', 
    session: '2021-2022', 
    statut: 'Nouvelle',
    date: '10/08/2021'
  },
  { 
    id: 104, 
    nom: 'Moussavou', 
    prenom: 'Paul', 
    classe: '3ème', 
    session: '2020-2021', 
    statut: 'Réinscription',
    date: '05/08/2020'
  }
];

const archivesBulletins = [
  { 
    id: 201, 
    nom: 'Ondo Marie', 
    classe: 'CM2', 
    session: '2021-2022',
    periode: '1er Trimestre',
    moyenne: 14.5,
    date: '15/12/2021'
  },
  { 
    id: 202, 
    nom: 'Mouloungui Jean', 
    classe: '5ème', 
    session: '2022-2023',
    periode: '2ème Trimestre',
    moyenne: 12.8,
    date: '20/03/2023'
  },
  { 
    id: 203, 
    nom: 'Ntoutoume Alice', 
    classe: 'CE1', 
    session: '2021-2022',
    periode: '3ème Trimestre',
    moyenne: 15.2,
    date: '10/06/2022'
  }
];

const archivesDocuments = [
  { 
    id: 301, 
    titre: 'Emploi du temps 2021-2022', 
    type: 'PDF', 
    taille: '1.2 MB',
    session: '2021-2022',
    date: '01/09/2021',
    auteur: 'Admin'
  },
  { 
    id: 302, 
    titre: 'Liste des admis au BEPC 2023', 
    type: 'Excel', 
    taille: '450 KB',
    session: '2022-2023',
    date: '15/07/2023',
    auteur: 'Direction'
  },
  { 
    id: 303, 
    titre: 'Règlement intérieur 2022', 
    type: 'Word', 
    taille: '320 KB',
    session: '2022-2023',
    date: '05/09/2022',
    auteur: 'Direction'
  }
];

const Archives: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inscriptions');
  const [selectedSession, setSelectedSession] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Archives</h2>
          <p className="text-muted-foreground">Consultez les archives des années précédentes</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Exporter
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Filtrez les archives par session et mots-clés</CardDescription>
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
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les sessions</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                    <SelectItem value="2021-2022">2021-2022</SelectItem>
                    <SelectItem value="2020-2021">2020-2021</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="inscriptions" className="flex items-center gap-2">
              <UserIcon size={16} />
              <span>Inscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="bulletins" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Bulletins</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <ClipboardList size={16} />
              <span>Documents</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inscriptions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon size={18} />
                  Archives des inscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prénom</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivesInscriptions
                          .filter(inscription => 
                            (selectedSession === 'all' || inscription.session === selectedSession) &&
                            (searchTerm === '' || 
                              inscription.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              inscription.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
                          )
                          .map((inscription) => (
                            <TableRow key={inscription.id}>
                              <TableCell>{inscription.id}</TableCell>
                              <TableCell className="font-medium">{inscription.nom}</TableCell>
                              <TableCell>{inscription.prenom}</TableCell>
                              <TableCell>{inscription.classe}</TableCell>
                              <TableCell>{inscription.session}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  inscription.statut === 'Nouvelle' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {inscription.statut}
                                </span>
                              </TableCell>
                              <TableCell>{inscription.date}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  <Eye size={14} className="mr-1" />
                                  Voir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulletins">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} />
                  Archives des bulletins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Élève</TableHead>
                          <TableHead>Classe</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead>Période</TableHead>
                          <TableHead>Moyenne</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivesBulletins
                          .filter(bulletin => 
                            (selectedSession === 'all' || bulletin.session === selectedSession) &&
                            (searchTerm === '' || bulletin.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                          )
                          .map((bulletin) => (
                            <TableRow key={bulletin.id}>
                              <TableCell>{bulletin.id}</TableCell>
                              <TableCell className="font-medium">{bulletin.nom}</TableCell>
                              <TableCell>{bulletin.classe}</TableCell>
                              <TableCell>{bulletin.session}</TableCell>
                              <TableCell>{bulletin.periode}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  bulletin.moyenne >= 14 
                                    ? 'bg-green-100 text-green-800' 
                                    : bulletin.moyenne >= 10 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {bulletin.moyenne}/20
                                </span>
                              </TableCell>
                              <TableCell>{bulletin.date}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  <Download size={14} className="mr-1" />
                                  Télécharger
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList size={18} />
                  Archives des documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-35rem)] w-full">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Titre</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Taille</TableHead>
                          <TableHead>Session</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Auteur</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivesDocuments
                          .filter(doc => 
                            (selectedSession === 'all' || doc.session === selectedSession) &&
                            (searchTerm === '' || doc.titre.toLowerCase().includes(searchTerm.toLowerCase()))
                          )
                          .map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.id}</TableCell>
                              <TableCell className="font-medium">{doc.titre}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  doc.type === 'PDF' 
                                    ? 'bg-red-100 text-red-800' 
                                    : doc.type === 'Excel'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {doc.type}
                                </span>
                              </TableCell>
                              <TableCell>{doc.taille}</TableCell>
                              <TableCell>{doc.session}</TableCell>
                              <TableCell>{doc.date}</TableCell>
                              <TableCell>{doc.auteur}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  <Download size={14} className="mr-1" />
                                  Télécharger
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Archives;
