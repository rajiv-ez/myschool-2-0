
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
import { FileText, Book, Bookmark, ListIcon } from "lucide-react";

const Education = () => {
  const [activeTab, setActiveTab] = useState("unites");

  // Données d'exemple
  const unites = [
    { id: 1, code: "MTH", nom: "Mathématiques", description: "Unité d'enseignement des mathématiques" },
    { id: 2, code: "FRA", nom: "Français", description: "Unité d'enseignement du français" },
    { id: 3, code: "ANG", nom: "Anglais", description: "Unité d'enseignement de l'anglais" },
    { id: 4, code: "SCI", nom: "Sciences", description: "Unité d'enseignement des sciences" }
  ];

  const matieres = [
    { id: 1, code: "ALG", nom: "Algèbre", unite: "Mathématiques", coefficient: 2 },
    { id: 2, code: "GEO", nom: "Géométrie", unite: "Mathématiques", coefficient: 2 },
    { id: 3, code: "GRAM", nom: "Grammaire", unite: "Français", coefficient: 1.5 },
    { id: 4, code: "LIT", nom: "Littérature", unite: "Français", coefficient: 1.5 },
    { id: 5, code: "PHYS", nom: "Physique", unite: "Sciences", coefficient: 2 }
  ];

  const chapitres = [
    { id: 1, numero: 1, titre: "Équations du premier degré", matiere: "Algèbre", duree: "6h" },
    { id: 2, numero: 2, titre: "Équations du second degré", matiere: "Algèbre", duree: "8h" },
    { id: 3, numero: 1, titre: "Le triangle", matiere: "Géométrie", duree: "4h" },
    { id: 4, numero: 1, titre: "Les temps verbaux", matiere: "Grammaire", duree: "5h" },
    { id: 5, numero: 1, titre: "Les forces", matiere: "Physique", duree: "7h" }
  ];

  const lecons = [
    { id: 1, numero: 1, titre: "Résolution d'équation simple", chapitre: "Équations du premier degré", duree: "2h" },
    { id: 2, numero: 2, titre: "Application aux problèmes concrets", chapitre: "Équations du premier degré", duree: "2h" },
    { id: 3, numero: 1, titre: "Formule du discriminant", chapitre: "Équations du second degré", duree: "3h" },
    { id: 4, numero: 1, titre: "Propriétés du triangle", chapitre: "Le triangle", duree: "2h" },
    { id: 5, numero: 1, titre: "Les forces et le mouvement", chapitre: "Les forces", duree: "2h" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Structure d'Enseignement</h2>
        <div className="flex space-x-2">
          <Input type="text" placeholder="Rechercher..." className="max-w-xs" />
          <Button>Ajouter</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="unites" className="flex items-center gap-2">
            <FileText size={16} />
            Unités d'enseignement
          </TabsTrigger>
          <TabsTrigger value="matieres" className="flex items-center gap-2">
            <Book size={16} />
            Matières
          </TabsTrigger>
          <TabsTrigger value="chapitres" className="flex items-center gap-2">
            <Bookmark size={16} />
            Chapitres
          </TabsTrigger>
          <TabsTrigger value="lecons" className="flex items-center gap-2">
            <ListIcon size={16} />
            Leçons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unites" className="pt-4">
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
              {unites.map((unite) => (
                <TableRow key={unite.id}>
                  <TableCell className="font-medium">{unite.code}</TableCell>
                  <TableCell>{unite.nom}</TableCell>
                  <TableCell>{unite.description}</TableCell>
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

        <TabsContent value="matieres" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Unité d'enseignement</TableHead>
                <TableHead>Coefficient</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matieres.map((matiere) => (
                <TableRow key={matiere.id}>
                  <TableCell className="font-medium">{matiere.code}</TableCell>
                  <TableCell>{matiere.nom}</TableCell>
                  <TableCell>{matiere.unite}</TableCell>
                  <TableCell>{matiere.coefficient}</TableCell>
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

        <TabsContent value="chapitres" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Durée estimée</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chapitres.map((chapitre) => (
                <TableRow key={chapitre.id}>
                  <TableCell className="font-medium">{chapitre.numero}</TableCell>
                  <TableCell>{chapitre.titre}</TableCell>
                  <TableCell>{chapitre.matiere}</TableCell>
                  <TableCell>{chapitre.duree}</TableCell>
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

        <TabsContent value="lecons" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Chapitre</TableHead>
                <TableHead>Durée estimée</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lecons.map((lecon) => (
                <TableRow key={lecon.id}>
                  <TableCell className="font-medium">{lecon.numero}</TableCell>
                  <TableCell>{lecon.titre}</TableCell>
                  <TableCell>{lecon.chapitre}</TableCell>
                  <TableCell>{lecon.duree}</TableCell>
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

export default Education;
