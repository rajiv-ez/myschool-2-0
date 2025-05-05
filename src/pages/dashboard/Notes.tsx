
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Layers, FilterIcon, Download, Plus, FileText, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Données fictives pour la démonstration
const notesData = [
  { 
    id: 1, 
    eleve: 'Ndong Marie', 
    classe: 'CM1', 
    matiere: 'Mathématiques',
    evaluation: 'Contrôle continu 1',
    note: 15,
    coefficient: 2,
    date: '10/05/2024',
    commentaire: 'Bon travail'
  },
  { 
    id: 2, 
    eleve: 'Obiang Paul', 
    classe: 'CM1', 
    matiere: 'Mathématiques',
    evaluation: 'Contrôle continu 1',
    note: 12,
    coefficient: 2,
    date: '10/05/2024',
    commentaire: 'Moyen, peut mieux faire'
  },
  { 
    id: 3, 
    eleve: 'Mba Sophie', 
    classe: 'CM1', 
    matiere: 'Français',
    evaluation: 'Dictée',
    note: 17,
    coefficient: 1,
    date: '12/05/2024',
    commentaire: 'Excellent travail'
  },
  { 
    id: 4, 
    eleve: 'Ondo Jean', 
    classe: 'CM1', 
    matiere: 'Sciences',
    evaluation: 'Examen 1',
    note: 10,
    coefficient: 3,
    date: '15/05/2024',
    commentaire: 'À améliorer'
  },
  { 
    id: 5, 
    eleve: 'Mintsa Lucie', 
    classe: 'CM1', 
    matiere: 'Histoire',
    evaluation: 'Présentation',
    note: 18,
    coefficient: 1,
    date: '14/05/2024',
    commentaire: 'Travail remarquable'
  },
];

const bulletinsData = [
  {
    id: 1,
    eleve: 'Ndong Marie',
    classe: 'CM1',
    session: '2023-2024',
    periode: '1er Trimestre',
    moyenne: 14.5,
    rang: '3/30',
    appreciationGenerale: 'Bon trimestre, élève sérieuse et appliquée.'
  },
  {
    id: 2,
    eleve: 'Obiang Paul',
    classe: 'CM1',
    session: '2023-2024',
    periode: '1er Trimestre',
    moyenne: 11.2,
    rang: '15/30',
    appreciationGenerale: 'Trimestre moyen, des efforts à fournir.'
  },
  {
    id: 3,
    eleve: 'Mba Sophie',
    classe: 'CM1',
    session: '2023-2024',
    periode: '1er Trimestre',
    moyenne: 16.8,
    rang: '1/30',
    appreciationGenerale: 'Excellent trimestre, félicitations.'
  },
  {
    id: 4,
    eleve: 'Ondo Jean',
    classe: 'CM1',
    session: '2023-2024',
    periode: '1er Trimestre',
    moyenne: 9.5,
    rang: '22/30',
    appreciationGenerale: 'Trimestre insuffisant, travail à approfondir.'
  },
];

const Notes: React.FC = () => {
  const [classe, setClasse] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [palier, setPalier] = useState<string>('');
  const [matiere, setMatiere] = useState<string>('');
  const [activeTab, setActiveTab] = useState('notes');
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des notes</h2>
          <p className="text-muted-foreground">Gérez les notes et bulletins des élèves</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>{activeTab === 'notes' ? 'Nouvelle note' : 'Nouveau bulletin'}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <Layers size={16} />
            <span>Notes</span>
          </TabsTrigger>
          <TabsTrigger value="bulletins" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Bulletins</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FilterIcon size={18} />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Classe</label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm1">CM1</SelectItem>
                  <SelectItem value="cm2">CM2</SelectItem>
                  <SelectItem value="ce1">CE1</SelectItem>
                  <SelectItem value="ce2">CE2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session</label>
              <Select value={session} onValueChange={setSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={palier} onValueChange={setPalier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trimestre1">1er Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2ème Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {activeTab === 'notes' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Matière</label>
                <Select value={matiere} onValueChange={setMatiere}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathématiques</SelectItem>
                    <SelectItem value="francais">Français</SelectItem>
                    <SelectItem value="hist-geo">Histoire-Géo</SelectItem>
                    <SelectItem value="sciences">Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TabsContent value="notes" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers size={18} />
              Liste des notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-35rem)] w-full">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead className="hidden md:table-cell">Évaluation</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="hidden md:table-cell">Coef.</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.eleve}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell>{item.matiere}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.evaluation}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.note >= 14 
                              ? 'bg-green-100 text-green-800' 
                              : item.note >= 10 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.note}/20
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{item.coefficient}</TableCell>
                        <TableCell className="hidden md:table-cell">{item.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Modifier</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bulletins" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={18} />
              Bulletins de notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-35rem)] w-full">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Élève</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Moyenne</TableHead>
                      <TableHead className="hidden md:table-cell">Rang</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulletinsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell className="font-medium">{item.eleve}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell>{item.session}</TableCell>
                        <TableCell>{item.periode}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.moyenne >= 14 
                              ? 'bg-green-100 text-green-800' 
                              : item.moyenne >= 10 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.moyenne}/20
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{item.rang}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>Voir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
};

export default Notes;
