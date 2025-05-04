
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { CalendarPlus } from 'lucide-react';

// Données fictives pour démonstration
const sessionsData = [
  { 
    id: 1, 
    nom: 'Année scolaire 2024-2025', 
    dateDebut: '15/09/2024', 
    dateFin: '30/06/2025',
    statut: 'Actif',
    paliers: 12
  },
  { 
    id: 2, 
    nom: 'Année scolaire 2023-2024', 
    dateDebut: '18/09/2023', 
    dateFin: '28/06/2024',
    statut: 'Terminé',
    paliers: 10
  },
  { 
    id: 3, 
    nom: 'Année scolaire 2022-2023', 
    dateDebut: '19/09/2022', 
    dateFin: '30/06/2023',
    statut: 'Terminé',
    paliers: 8
  }
];

const paliersData = [
  { 
    id: 1, 
    classe: 'CP', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Ntoutoume',
    eleves: 28,
    statut: 'Actif'
  },
  { 
    id: 2, 
    classe: 'CE1', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'M. Ekomi',
    eleves: 25,
    statut: 'Actif'
  },
  { 
    id: 3, 
    classe: 'CE2', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Abessolo',
    eleves: 22,
    statut: 'Actif'
  },
  { 
    id: 4, 
    classe: 'CM1', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'M. Mboumba',
    eleves: 20,
    statut: 'Actif'
  },
  { 
    id: 5, 
    classe: 'CM2', 
    session: 'Année scolaire 2024-2025', 
    enseignant: 'Mme Ovono',
    eleves: 24,
    statut: 'Actif'
  }
];

const Sessions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Sessions et Paliers</h2>
        <p className="text-muted-foreground">Gérez les sessions scolaires et les paliers (classes)</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-2 max-w-md">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="paliers">Paliers</TabsTrigger>
          </TabsList>
          
          <Button className="flex items-center gap-2">
            <CalendarPlus size={18} />
            {activeTab === 'sessions' ? 'Nouvelle session' : 'Nouveau palier'}
          </Button>
        </div>
        
        <TabsContent value="sessions">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom de la session</TableHead>
                  <TableHead>Date de début</TableHead>
                  <TableHead>Date de fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paliers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessionsData.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.id}</TableCell>
                    <TableCell className="font-medium">{session.nom}</TableCell>
                    <TableCell>{session.dateDebut}</TableCell>
                    <TableCell>{session.dateFin}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.statut === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.statut}
                      </span>
                    </TableCell>
                    <TableCell>{session.paliers}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Gérer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="paliers">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Enseignant principal</TableHead>
                  <TableHead>Élèves</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paliersData.map((palier) => (
                  <TableRow key={palier.id}>
                    <TableCell>{palier.id}</TableCell>
                    <TableCell className="font-medium">{palier.classe}</TableCell>
                    <TableCell>{palier.session}</TableCell>
                    <TableCell>{palier.enseignant}</TableCell>
                    <TableCell>{palier.eleves}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        palier.statut === 'Actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {palier.statut}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sessions;
