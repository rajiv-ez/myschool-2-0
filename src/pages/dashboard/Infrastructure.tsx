
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
import { Building, Home, School } from "lucide-react";

const Infrastructure = () => {
  const [activeTab, setActiveTab] = useState("succursales");

  // Données d'exemple
  const succursales = [
    { id: 1, nom: "Campus Principal", adresse: "Avenue des Écoles, Libreville", telephone: "+241 74 56 89 32", email: "campus@myschool.ga" },
    { id: 2, nom: "Campus Nord", adresse: "Quartier Nord, Libreville", telephone: "+241 65 43 21 98", email: "nord@myschool.ga" },
    { id: 3, nom: "Campus Est", adresse: "Quartier Est, Libreville", telephone: "+241 77 88 99 00", email: "est@myschool.ga" }
  ];

  const batiments = [
    { id: 1, nom: "Bâtiment A", succursale: "Campus Principal", etages: 3, annee_construction: 2010 },
    { id: 2, nom: "Bâtiment B", succursale: "Campus Principal", etages: 2, annee_construction: 2015 },
    { id: 3, nom: "Bâtiment C", succursale: "Campus Nord", etages: 4, annee_construction: 2018 },
    { id: 4, nom: "Bâtiment D", succursale: "Campus Est", etages: 2, annee_construction: 2020 }
  ];

  const salles = [
    { id: 1, nom: "Salle A101", batiment: "Bâtiment A", etage: 1, capacite: 30, type: "Salle de cours" },
    { id: 2, nom: "Salle A102", batiment: "Bâtiment A", etage: 1, capacite: 25, type: "Salle de cours" },
    { id: 3, nom: "Labo B201", batiment: "Bâtiment B", etage: 2, capacite: 20, type: "Laboratoire" },
    { id: 4, nom: "Salle C301", batiment: "Bâtiment C", etage: 3, capacite: 40, type: "Amphithéâtre" },
    { id: 5, nom: "Salle D101", batiment: "Bâtiment D", etage: 1, capacite: 35, type: "Salle de cours" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Infrastructure</h2>
        <div className="flex space-x-2">
          <Input type="text" placeholder="Rechercher..." className="max-w-xs" />
          <Button>Ajouter</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="succursales" className="flex items-center gap-2">
            <Building size={16} />
            Succursales
          </TabsTrigger>
          <TabsTrigger value="batiments" className="flex items-center gap-2">
            <School size={16} />
            Bâtiments
          </TabsTrigger>
          <TabsTrigger value="salles" className="flex items-center gap-2">
            <Home size={16} />
            Salles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="succursales" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {succursales.map((succursale) => (
                <TableRow key={succursale.id}>
                  <TableCell className="font-medium">{succursale.nom}</TableCell>
                  <TableCell>{succursale.adresse}</TableCell>
                  <TableCell>{succursale.telephone}</TableCell>
                  <TableCell>{succursale.email}</TableCell>
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

        <TabsContent value="batiments" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Succursale</TableHead>
                <TableHead>Étages</TableHead>
                <TableHead>Année de construction</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batiments.map((batiment) => (
                <TableRow key={batiment.id}>
                  <TableCell className="font-medium">{batiment.nom}</TableCell>
                  <TableCell>{batiment.succursale}</TableCell>
                  <TableCell>{batiment.etages}</TableCell>
                  <TableCell>{batiment.annee_construction}</TableCell>
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

        <TabsContent value="salles" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Bâtiment</TableHead>
                <TableHead>Étage</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salles.map((salle) => (
                <TableRow key={salle.id}>
                  <TableCell className="font-medium">{salle.nom}</TableCell>
                  <TableCell>{salle.batiment}</TableCell>
                  <TableCell>{salle.etage}</TableCell>
                  <TableCell>{salle.capacite} personnes</TableCell>
                  <TableCell>{salle.type}</TableCell>
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

export default Infrastructure;
