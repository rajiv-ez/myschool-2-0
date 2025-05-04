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
import {
  Printer,
  FileText
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Student {
  id: number;
  nom: string;
  prenom: string;
  photo: string | null;
}

interface Matiere {
  id: number;
  nom: string;
  coefficient: number;
  moyenne: number;
}

interface Unite {
  id: number;
  nom: string;
  matieres: Matiere[];
}

interface StudentData {
  unites: Record<number, {
    moyenne: number;
    matieres: Record<number, number>;
  }>;
  moyenne: number;
  moyenneClasse: number;
  rang: number;
  effectif: number;
  plusForte: number;
  plusFaible: number;
  appreciation: string;
  absences: number;
  retards: number;
}

const Bulletins = () => {
  const [selectedSession, setSelectedSession] = useState("2023-2024");
  const [selectedPalier, setSelectedPalier] = useState("1");
  const [selectedClass, setSelectedClass] = useState("CM1");
  
  // Données d'exemple
  const students: Student[] = [
    { id: 1, nom: "Nguema", prenom: "Marc", photo: null },
    { id: 2, nom: "Ekomi", prenom: "Sarah", photo: null },
    { id: 3, nom: "Mbadinga", prenom: "Jean", photo: null },
    { id: 4, nom: "Nze", prenom: "Marie", photo: null },
    { id: 5, nom: "Ndong", prenom: "Pierre", photo: null },
  ];

  const [activeTab, setActiveTab] = useState(students[0].id.toString());

  const unites: Unite[] = [
    {
      id: 1, 
      nom: "Mathématiques et Sciences", 
      matieres: [
        { id: 1, nom: "Mathématiques", coefficient: 4, moyenne: 15.5 },
        { id: 2, nom: "Sciences", coefficient: 3, moyenne: 14.2 }
      ]
    },
    {
      id: 2, 
      nom: "Langues", 
      matieres: [
        { id: 3, nom: "Français", coefficient: 4, moyenne: 13.8 },
        { id: 4, nom: "Anglais", coefficient: 2, moyenne: 12.5 }
      ]
    },
    {
      id: 3, 
      nom: "Sciences humaines", 
      matieres: [
        { id: 5, nom: "Histoire-Géographie", coefficient: 2, moyenne: 14.0 },
        { id: 6, nom: "Éducation civique", coefficient: 1, moyenne: 16.0 }
      ]
    },
    {
      id: 4, 
      nom: "Éducation physique et artistique", 
      matieres: [
        { id: 7, nom: "Sport", coefficient: 1, moyenne: 16.5 },
        { id: 8, nom: "Arts plastiques", coefficient: 1, moyenne: 15.0 }
      ]
    }
  ];

  const generateStudentData = () => {
    const data: Record<number, StudentData> = {};
    
    students.forEach(student => {
      const studentData: StudentData = {
        unites: {} as Record<number, {
          moyenne: number;
          matieres: Record<number, number>;
        }>,
        moyenne: 0,
        moyenneClasse: 13.8,
        rang: 0,
        effectif: students.length,
        plusForte: 16.5,
        plusFaible: 10.2,
        appreciation: "",
        absences: Math.floor(Math.random() * 5),
        retards: Math.floor(Math.random() * 3)
      };
      
      let totalPoints = 0;
      let totalCoeff = 0;
      
      unites.forEach(unite => {
        studentData.unites[unite.id] = {
          moyenne: 0,
          matieres: {} as Record<number, number>
        };
        
        let unitePoints = 0;
        let uniteCoeff = 0;
        
        unite.matieres.forEach(matiere => {
          // Générer une note aléatoire entre 8 et 19
          const note = 8 + Math.random() * 11;
          studentData.unites[unite.id].matieres[matiere.id] = parseFloat(note.toFixed(2));
          
          unitePoints += note * matiere.coefficient;
          uniteCoeff += matiere.coefficient;
          
          totalPoints += note * matiere.coefficient;
          totalCoeff += matiere.coefficient;
        });
        
        studentData.unites[unite.id].moyenne = parseFloat((unitePoints / uniteCoeff).toFixed(2));
      });
      
      studentData.moyenne = parseFloat((totalPoints / totalCoeff).toFixed(2));
      
      // Générer une appréciation
      const moyenne = studentData.moyenne;
      if (moyenne >= 16) {
        studentData.appreciation = "Excellent trimestre. Continuez ainsi !";
      } else if (moyenne >= 14) {
        studentData.appreciation = "Très bon trimestre. Félicitations !";
      } else if (moyenne >= 12) {
        studentData.appreciation = "Bon trimestre. Peut encore s'améliorer.";
      } else if (moyenne >= 10) {
        studentData.appreciation = "Trimestre moyen. Des efforts à fournir.";
      } else {
        studentData.appreciation = "Résultats insuffisants. Travaillez davantage.";
      }
      
      data[student.id] = studentData;
    });
    
    // Attribution des rangs en fonction des moyennes
    const rankedStudents = students.map(s => ({
      id: s.id,
      moyenne: data[s.id].moyenne
    })).sort((a, b) => b.moyenne - a.moyenne);
    
    rankedStudents.forEach((s, index) => {
      data[s.id].rang = index + 1;
    });
    
    return data;
  };

  const studentData = generateStudentData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Bulletins de Notes</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Exporter tous</span>
            <span className="sm:hidden">Exporter</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimer tous</span>
            <span className="sm:hidden">Imprimer</span>
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
                {students.map(student => (
                  <TabsTrigger key={student.id} value={student.id.toString()}>
                    {student.nom} {student.prenom}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="pt-6">
            {students.map(student => (
              <TabsContent key={student.id} value={student.id.toString()} className="m-0">
                <div className="space-y-6 print:p-8">
                  {/* En-tête du bulletin */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-bold">École Gabonaise Digitale</h3>
                      <p className="text-muted-foreground">{selectedSession} - {selectedClass}</p>
                      <p className="text-muted-foreground">Trimestre {selectedPalier}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                        {student.photo || student.prenom.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{student.nom} {student.prenom}</h4>
                        <p>Né(e) le 12/05/2013</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corps du bulletin */}
                  <div className="space-y-8">
                    {unites.map(unite => (
                      <div key={unite.id} className="space-y-2">
                        <h4 className="font-bold text-md">{unite.nom}</h4>
                        <Table className="border">
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Matière</TableHead>
                              <TableHead className="text-center">Coefficient</TableHead>
                              <TableHead className="text-center">Note moyenne</TableHead>
                              <TableHead className="text-center">Moyenne classe</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unite.matieres.map(matiere => (
                              <TableRow key={matiere.id}>
                                <TableCell className="font-medium">{matiere.nom}</TableCell>
                                <TableCell className="text-center">{matiere.coefficient}</TableCell>
                                <TableCell className="text-center font-semibold">
                                  {studentData[student.id].unites[unite.id].matieres[matiere.id]}
                                </TableCell>
                                <TableCell className="text-center">{matiere.moyenne}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/30">
                              <TableCell colSpan={2} className="font-semibold">Moyenne de l'unité</TableCell>
                              <TableCell className="text-center font-bold">
                                {studentData[student.id].unites[unite.id].moyenne}
                              </TableCell>
                              <TableCell className="text-center"></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ))}
                    
                    {/* Résumé */}
                    <div className="bg-muted/20 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="font-bold">Moyenne générale: 
                            <span className="ml-2 text-lg">{studentData[student.id].moyenne}/20</span>
                          </p>
                          <p>Rang: {studentData[student.id].rang} sur {studentData[student.id].effectif}</p>
                        </div>
                        <div className="space-y-2">
                          <p>Moyenne de la classe: {studentData[student.id].moyenneClasse}</p>
                          <p>Plus forte moyenne: {studentData[student.id].plusForte}</p>
                          <p>Plus faible moyenne: {studentData[student.id].plusFaible}</p>
                        </div>
                        <div className="space-y-2">
                          <p>Absences: {studentData[student.id].absences} demi-journée(s)</p>
                          <p>Retards: {studentData[student.id].retards}</p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h4 className="font-bold mb-2">Appréciation générale:</h4>
                        <p className="italic">{studentData[student.id].appreciation}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-2 print:hidden">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileText size={16} />
                      Exporter
                    </Button>
                    <Button className="flex items-center gap-2">
                      <Printer size={16} />
                      Imprimer
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Bulletins;
