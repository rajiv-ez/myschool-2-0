
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, FilterIcon, Download, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

// Données fictives pour la démonstration
const presencesData = [
  { 
    id: 1, 
    eleve: 'Ndong Marie', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeCours: 'Mathématiques', 
    present: true, 
    justifie: false, 
    commentaire: '' 
  },
  { 
    id: 2, 
    eleve: 'Obiang Paul', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeCours: 'Mathématiques', 
    present: false, 
    justifie: true, 
    commentaire: 'Certificat médical fourni' 
  },
  { 
    id: 3, 
    eleve: 'Mba Sophie', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeCours: 'Mathématiques', 
    present: true, 
    justifie: false, 
    commentaire: '' 
  },
  { 
    id: 4, 
    eleve: 'Ondo Jean', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeCours: 'Mathématiques', 
    present: false, 
    justifie: false, 
    commentaire: 'Absence à signaler aux parents' 
  },
  { 
    id: 5, 
    eleve: 'Mintsa Lucie', 
    classe: 'CM1', 
    date: '15/05/2024', 
    typeCours: 'Mathématiques', 
    present: true, 
    justifie: false, 
    commentaire: '' 
  },
];

const Presence: React.FC = () => {
  const [classe, setClasse] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [palier, setPalier] = useState<string>('');
  const [evenement, setEvenement] = useState<string>('');
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gestion des présences</h2>
          <p className="text-muted-foreground">Suivez les présences des élèves aux cours et événements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Nouvelle présence</span>
          </Button>
        </div>
      </div>

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
              <label className="text-sm font-medium">Palier</label>
              <Select value={palier} onValueChange={setPalier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un palier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trimestre1">1er Trimestre</SelectItem>
                  <SelectItem value="trimestre2">2ème Trimestre</SelectItem>
                  <SelectItem value="trimestre3">3ème Trimestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Événement</label>
              <Select value={evenement} onValueChange={setEvenement}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cours">Cours</SelectItem>
                  <SelectItem value="evaluation">Évaluation</SelectItem>
                  <SelectItem value="evenement">Événement scolaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck size={18} />
            Liste des présences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-25rem)] w-full">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Élève</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Justifié</TableHead>
                    <TableHead className="hidden md:table-cell">Commentaire</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presencesData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell className="font-medium">{item.eleve}</TableCell>
                      <TableCell>{item.classe}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.typeCours}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.present 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.present ? 'Présent' : 'Absent'}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.justifie ? 'Oui' : 'Non'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {item.commentaire || '-'}
                      </TableCell>
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
    </div>
  );
};

export default Presence;
