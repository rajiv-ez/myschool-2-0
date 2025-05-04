
import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School, GridIcon, Users } from "lucide-react";

const Academics = () => {
  const [activeTab, setActiveTab] = useState("niveaux");

  // Données d'exemple
  const niveaux = [
    { id: 1, code: "MAT", nom: "Maternelle", description: "Cycle maternel (3-5 ans)" },
    { id: 2, code: "PRI", nom: "Primaire", description: "Cycle primaire (6-11 ans)" },
    { id: 3, code: "COL", nom: "Collège", description: "Premier cycle secondaire (12-15 ans)" },
    { id: 4, code: "LYC", nom: "Lycée", description: "Second cycle secondaire (16-18 ans)" }
  ];

  const specialites = [
    { id: 1, code: "GEN", nom: "Général", niveau: "Primaire", description: "Enseignement général" },
    { id: 2, code: "SCI", nom: "Sciences", niveau: "Lycée", description: "Parcours scientifique" },
    { id: 3, code: "LIT", nom: "Littéraire", niveau: "Lycée", description: "Parcours littéraire" },
    { id: 4, code: "TEC", nom: "Technique", niveau: "Collège", description: "Parcours technique" }
  ];

  const classes = [
    { id: 1, code: "CP", nom: "Cours Préparatoire", niveau: "Primaire", specialite: "Général" },
    { id: 2, code: "CE1", nom: "Cours Élémentaire 1", niveau: "Primaire", specialite: "Général" },
    { id: 3, code: "CM1", nom: "Cours Moyen 1", niveau: "Primaire", specialite: "Général" },
    { id: 4, code: "CM2", nom: "Cours Moyen 2", niveau: "Primaire", specialite: "Général" },
    { id: 5, code: "6e", nom: "Sixième", niveau: "Collège", specialite: "Général" },
    { id: 6, code: "2ndS", nom: "Seconde Scientifique", niveau: "Lycée", specialite: "Sciences" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Structure Académique</h2>
        <div className="flex space-x-2">
          <Input type="text" placeholder="Rechercher..." className="max-w-xs" />
          <Button>Ajouter</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="niveaux" className="flex items-center gap-2">
            <School size={16} />
            Niveaux
          </TabsTrigger>
          <TabsTrigger value="specialites" className="flex items-center gap-2">
            <GridIcon size={16} />
            Spécialités
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Users size={16} />
            Classes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="niveaux" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {niveaux.map((niveau) => (
                <TableRow key={niveau.id}>
                  <TableCell className="font-medium">{niveau.code}</TableCell>
                  <TableCell>{niveau.nom}</TableCell>
                  <TableCell>{niveau.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Supprimer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="specialites" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialites.map((specialite) => (
                <TableRow key={specialite.id}>
                  <TableCell className="font-medium">{specialite.code}</TableCell>
                  <TableCell>{specialite.nom}</TableCell>
                  <TableCell>{specialite.niveau}</TableCell>
                  <TableCell>{specialite.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Supprimer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="classes" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classe) => (
                <TableRow key={classe.id}>
                  <TableCell className="font-medium">{classe.code}</TableCell>
                  <TableCell>{classe.nom}</TableCell>
                  <TableCell>{classe.niveau}</TableCell>
                  <TableCell>{classe.specialite}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Supprimer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Academics;
