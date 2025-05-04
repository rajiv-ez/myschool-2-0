
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Printer, FileText } from "lucide-react";

const Notes = () => {
  const [selectedSession, setSelectedSession] = useState("2023-2024");
  const [selectedPalier, setSelectedPalier] = useState("1");
  const [selectedClass, setSelectedClass] = useState("CM1");
  const [activeTab, setActiveTab] = useState("mathematiques");

  // Données d'exemple
  const students = [
    { id: 1, nom: "Nguema", prenom: "Marc", photo: null },
    { id: 2, nom: "Ekomi", prenom: "Sarah", photo: null },
    { id: 3, nom: "Mbadinga", prenom: "Jean", photo: null },
    { id: 4, nom: "Nze", prenom: "Marie", photo: null },
    { id: 5, nom: "Ndong", prenom: "Pierre", photo: null },
  ];

  const matieres = [
    { id: "mathematiques", nom: "Mathématiques" },
    { id: "francais", nom: "Français" },
    { id: "sciences", nom: "Sciences" },
    { id: "anglais", nom: "Anglais" },
    { id: "histoire", nom: "Histoire" }
  ];

  const evaluations = {
    mathematiques: [
      { id: 1, titre: "Devoir 1", coefficient: 1, date: "2023-10-15" },
      { id: 2, titre: "Examen mi-trimestre", coefficient: 2, date: "2023-11-05" },
      { id: 3, titre: "Devoir 2", coefficient: 1, date: "2023-11-20" },
      { id: 4, titre: "Examen final", coefficient: 3, date: "2023-12-10" }
    ],
    francais: [
      { id: 1, titre: "Dictée", coefficient: 1, date: "2023-10-10" },
      { id: 2, titre: "Rédaction", coefficient: 2, date: "2023-11-02" },
      { id: 3, titre: "Grammaire", coefficient: 1, date: "2023-11-18" },
      { id: 4, titre: "Examen final", coefficient: 3, date: "2023-12-08" }
    ],
    sciences: [
      { id: 1, titre: "TP 1", coefficient: 1, date: "2023-10-20" },
      { id: 2, titre: "Contrôle", coefficient: 2, date: "2023-11-08" },
      { id: 3, titre: "Examen final", coefficient: 3, date: "2023-12-12" }
    ]
  };

  // Génération de notes fictives
  const generateNotes = () => {
    const notes = {};
    
    students.forEach(student => {
      notes[student.id] = {};
      
      matieres.forEach(matiere => {
        notes[student.id][matiere.id] = {};
        
        if (evaluations[matiere.id]) {
          evaluations[matiere.id].forEach(assessment => {
            // Note entre 0 et 20
            notes[student.id][matiere.id][assessment.id] = (Math.random() * 20).toFixed(2);
          });
        }
      });
      
      // Ajout d'un bonus/malus basé sur la présence
      notes[student.id].presenceBonus = (Math.random() * 2 - 1).toFixed(1); // Entre -1 et +1
    });
    
    return notes;
  };

  const notes = generateNotes();

  // Calcul de la moyenne pour un étudiant dans une matière
  const calculateAverage = (studentId, matiereId) => {
    if (!evaluations[matiereId]) return "N/A";
    
    let totalPoints = 0;
    let totalCoeff = 0;
    
    evaluations[matiereId].forEach(assessment => {
      const note = parseFloat(notes[studentId][matiereId][assessment.id]);
      totalPoints += note * assessment.coefficient;
      totalCoeff += assessment.coefficient;
    });
    
    return totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Relevé des Notes</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimer</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Session</label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2022-2023">2022-2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Palier</label>
              <Select value={selectedPalier} onValueChange={setSelectedPalier}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un palier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Trimestre 1</SelectItem>
                  <SelectItem value="2">Trimestre 2</SelectItem>
                  <SelectItem value="3">Trimestre 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Classe</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CM1">CM1</SelectItem>
                  <SelectItem value="CM2">CM2</SelectItem>
                  <SelectItem value="6e">6e</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-4">Appliquer les filtres</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full overflow-x-auto flex-nowrap p-0">
                {matieres.map(matiere => (
                  <TabsTrigger key={matiere.id} value={matiere.id}>
                    {matiere.nom}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            {matieres.map(matiere => (
              <TabsContent key={matiere.id} value={matiere.id} className="m-0">
                <div className="overflow-x-auto">
                  <Table className="border">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10">Élève</TableHead>
                        {evaluations[matiere.id]?.map(assessment => (
                          <TableHead key={assessment.id} className="text-center">
                            <div>{assessment.titre}</div>
                            <div className="text-xs text-muted-foreground">Coef. {assessment.coefficient}</div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center bg-muted">
                          <div>Bonus/Malus</div>
                          <div className="text-xs text-muted-foreground">(Présences)</div>
                        </TableHead>
                        <TableHead className="text-center font-bold bg-muted">Moyenne</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(student => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium sticky left-0 bg-background z-10">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center">
                                {student.photo || student.prenom.charAt(0)}
                              </div>
                              <span>{student.nom} {student.prenom}</span>
                            </div>
                          </TableCell>
                          
                          {evaluations[matiere.id]?.map(assessment => (
                            <TableCell key={assessment.id} className="text-center">
                              <Input 
                                type="number" 
                                min="0" 
                                max="20" 
                                step="0.25"
                                className="w-16 text-center mx-auto"
                                defaultValue={notes[student.id][matiere.id][assessment.id]}
                              />
                            </TableCell>
                          ))}
                          
                          <TableCell className="text-center bg-muted">
                            <span className={notes[student.id].presenceBonus > 0 ? "text-green-600" : "text-red-600"}>
                              {notes[student.id].presenceBonus > 0 ? "+" : ""}{notes[student.id].presenceBonus}
                            </span>
                          </TableCell>
                          
                          <TableCell className="text-center font-bold bg-muted">
                            {calculateAverage(student.id, matiere.id)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileText size={16} />
                    Exporter cette matière
                  </Button>
                  <Button variant="default">Enregistrer les modifications</Button>
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notes;
