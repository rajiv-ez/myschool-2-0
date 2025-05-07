
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, Seat } from '@/pages/dashboard/ClassroomConfig';
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ClassroomEditorProps {
  classConfig: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  };
  seats: Seat[];
  students: Student[];
  savedConfigurations: {
    id: string;
    name: string;
    config: { rows: number; linesPerRow: number; positionsPerLine: number; };
  }[];
  savedAssignments: {
    id: string;
    name: string;
    configId: string;
    seats: Seat[];
  }[];
  updateConfig: (config: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  }) => void;
  assignStudent: (seatId: string, studentId?: number) => void;
  saveConfiguration: (name: string, config: { rows: number; linesPerRow: number; positionsPerLine: number }) => void;
  saveAssignment: (name: string, configId: string, seats: Seat[]) => void;
  deleteConfiguration: (id: string) => void;
  deleteAssignment: (id: string) => void;
  applyChanges: () => void;
  hasChanges: boolean;
}

const ClassroomEditor: React.FC<ClassroomEditorProps> = ({
  classConfig,
  seats,
  students,
  savedConfigurations,
  savedAssignments,
  updateConfig,
  assignStudent,
  saveConfiguration,
  saveAssignment,
  deleteConfiguration,
  deleteAssignment,
  applyChanges,
  hasChanges
}) => {
  const [rows, setRows] = useState(classConfig.rows);
  const [linesPerRow, setLinesPerRow] = useState(classConfig.linesPerRow);
  const [positionsPerLine, setPositionsPerLine] = useState(classConfig.positionsPerLine);
  
  const [editMode, setEditMode] = useState<'config' | 'assignment'>('config');
  const [configName, setConfigName] = useState<string>('');
  const [assignmentName, setAssignmentName] = useState<string>('');
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [activeConfigName, setActiveConfigName] = useState<string>('');
  const [isConfigTableOpen, setIsConfigTableOpen] = useState(false);
  const [isAssignmentTableOpen, setIsAssignmentTableOpen] = useState(false);

  const { toast } = useToast();

  // Lorsque les valeurs changent, mettons à jour le local state
  useEffect(() => {
    setRows(classConfig.rows);
    setLinesPerRow(classConfig.linesPerRow);
    setPositionsPerLine(classConfig.positionsPerLine);
  }, [classConfig]);

  // Trouver la configuration active
  useEffect(() => {
    const activeConfig = savedConfigurations.find(
      config => 
        config.config.rows === classConfig.rows && 
        config.config.linesPerRow === classConfig.linesPerRow && 
        config.config.positionsPerLine === classConfig.positionsPerLine
    );
    
    if (activeConfig) {
      setActiveConfigName(activeConfig.name);
      setSelectedConfigId(activeConfig.id);
    } else {
      setActiveConfigName('');
    }
  }, [classConfig, savedConfigurations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      rows,
      linesPerRow,
      positionsPerLine
    });
  };

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour la configuration",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si le nom existe déjà
    const exists = savedConfigurations.some(conf => conf.name === configName);
    if (exists) {
      toast({
        title: "Erreur",
        description: "Ce nom de configuration existe déjà",
        variant: "destructive"
      });
      return;
    }

    saveConfiguration(configName, { rows, linesPerRow, positionsPerLine });
    setConfigName('');
    toast({
      title: "Configuration sauvegardée",
      description: `La configuration "${configName}" a été sauvegardée avec succès.`
    });
  };

  const handleSaveAndApplyConfiguration = () => {
    if (!configName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour la configuration",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si le nom existe déjà
    const exists = savedConfigurations.some(conf => conf.name === configName);
    if (exists) {
      toast({
        title: "Erreur",
        description: "Ce nom de configuration existe déjà",
        variant: "destructive"
      });
      return;
    }

    saveConfiguration(configName, { rows, linesPerRow, positionsPerLine });
    applyChanges();
    setConfigName('');
    toast({
      title: "Configuration sauvegardée et appliquée",
      description: `La configuration "${configName}" a été sauvegardée et appliquée avec succès.`
    });
  };

  const handleSaveAssignment = () => {
    if (!assignmentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour l'attribution",
        variant: "destructive"
      });
      return;
    }

    if (!selectedConfigId) {
      toast({
        title: "Erreur",
        description: "Aucune configuration active",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si le nom existe déjà
    const exists = savedAssignments.some(assign => assign.name === assignmentName);
    if (exists) {
      toast({
        title: "Erreur",
        description: "Ce nom d'attribution existe déjà",
        variant: "destructive"
      });
      return;
    }

    saveAssignment(assignmentName, selectedConfigId, seats);
    setAssignmentName('');
    toast({
      title: "Attribution sauvegardée",
      description: `L'attribution "${assignmentName}" a été sauvegardée avec succès.`
    });
  };

  const handleSaveAndApplyAssignment = () => {
    if (!assignmentName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour l'attribution",
        variant: "destructive"
      });
      return;
    }

    if (!selectedConfigId) {
      toast({
        title: "Erreur",
        description: "Aucune configuration active",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si le nom existe déjà
    const exists = savedAssignments.some(assign => assign.name === assignmentName);
    if (exists) {
      toast({
        title: "Erreur",
        description: "Ce nom d'attribution existe déjà",
        variant: "destructive"
      });
      return;
    }

    saveAssignment(assignmentName, selectedConfigId, seats);
    applyChanges();
    setAssignmentName('');
    toast({
      title: "Attribution sauvegardée et appliquée",
      description: `L'attribution "${assignmentName}" a été sauvegardée et appliquée avec succès.`
    });
  };

  const handleLoadConfiguration = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId);
    if (config) {
      // Update form fields with the configuration values
      setConfigName(config.name);
      setRows(config.config.rows);
      setLinesPerRow(config.config.linesPerRow);
      setPositionsPerLine(config.config.positionsPerLine);
      
      // Load the configuration to the application
      updateConfig(config.config);
      
      toast({
        title: "Configuration chargée",
        description: `La configuration "${config.name}" a été chargée.`
      });
      setIsConfigTableOpen(false);
    }
  };

  const handleLoadAssignment = (assignmentId: string) => {
    const assignment = savedAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      // Update the assignment name in the form
      setAssignmentName(assignment.name);
      
      // Charger d'abord la configuration associée
      const config = savedConfigurations.find(c => c.id === assignment.configId);
      if (config) {
        updateConfig(config.config);
      }
      
      // Appliquer ensuite les attributions de sièges
      assignment.seats.forEach(seat => {
        assignStudent(seat.id, seat.studentId);
      });
      
      toast({
        title: "Attribution chargée",
        description: `L'attribution "${assignment.name}" a été chargée.`
      });
      setIsAssignmentTableOpen(false);
    }
  };

  const getStudentNameById = (studentId?: number): string => {
    if (!studentId) return 'Non assigné';
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Non assigné';
  };

  const getUnassignedStudents = (): Student[] => {
    const assignedStudentIds = seats.map(seat => seat.studentId).filter(Boolean) as number[];
    return students.filter(student => !assignedStudentIds.includes(student.id));
  };

  const getCurrentAssignmentsForConfig = () => {
    if (!selectedConfigId) return [];
    return savedAssignments.filter(a => a.configId === selectedConfigId);
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button 
          variant={editMode === 'config' ? 'default' : 'outline'}
          onClick={() => setEditMode('config')}
        >
          Configuration des rangées
        </Button>
        <Button 
          variant={editMode === 'assignment' ? 'default' : 'outline'}
          onClick={() => setEditMode('assignment')}
        >
          Attribution des places
        </Button>
      </div>

      {editMode === 'config' ? (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-6 gap-4 items-end">
                <div className="col-span-6 sm:col-span-1">
                  <Label htmlFor="configName">Nom de la configuration</Label>
                  <Input
                    id="configName"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                  />
                </div>
                <div className="col-span-6 sm:col-span-1">
                  <Label htmlFor="rows">Nombre de rangées</Label>
                  <Input
                    id="rows"
                    type="number"
                    min="1"
                    max="10"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-1">
                  <Label htmlFor="linesPerRow">Lignes par rangée</Label>
                  <Input
                    id="linesPerRow"
                    type="number"
                    min="1"
                    max="5"
                    value={linesPerRow}
                    onChange={(e) => setLinesPerRow(parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-1">
                  <Label htmlFor="positionsPerLine">Places par ligne</Label>
                  <Input
                    id="positionsPerLine"
                    type="number"
                    min="1"
                    max="6"
                    value={positionsPerLine}
                    onChange={(e) => setPositionsPerLine(parseInt(e.target.value))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-1">
                  <Button type="button" onClick={handleSaveConfiguration} className="w-full">
                    <Save size={16} className="mr-1" />
                    Sauvegarder
                  </Button>
                </div>
                <div className="col-span-6 sm:col-span-1">
                  <Button 
                    type="button" 
                    onClick={handleSaveAndApplyConfiguration} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Save size={16} className="mr-1" /> 
                    Sauvegarder & Appliquer
                  </Button>
                </div>
              </div>
            </form>

            <Collapsible 
              open={isConfigTableOpen} 
              onOpenChange={setIsConfigTableOpen} 
              className="border rounded-md p-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Configurations existantes</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isConfigTableOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                {savedConfigurations.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    Aucune configuration sauvegardée
                  </p>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[200px]">Nom</TableHead>
                          <TableHead>Rangées</TableHead>
                          <TableHead>Lignes</TableHead>
                          <TableHead>Places</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedConfigurations.map((config) => (
                          <TableRow key={config.id} className="h-8 text-sm">
                            <TableCell>{config.name}</TableCell>
                            <TableCell>{config.config.rows}</TableCell>
                            <TableCell>{config.config.linesPerRow}</TableCell>
                            <TableCell>{config.config.positionsPerLine}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLoadConfiguration(config.id)}
                              >
                                Charger
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  deleteConfiguration(config.id);
                                  toast({
                                    title: "Configuration supprimée",
                                    description: `La configuration "${config.name}" a été supprimée.`
                                  });
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="col-span-4 sm:col-span-1">
                <Label htmlFor="activeConfig">Configuration</Label>
                <Input
                  id="activeConfig"
                  value={activeConfigName}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <Label htmlFor="assignmentName">Nom de l'attribution</Label>
                <Input
                  id="assignmentName"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  disabled={!selectedConfigId}
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <Button 
                  type="button" 
                  onClick={handleSaveAssignment} 
                  className="w-full"
                  disabled={!selectedConfigId}
                >
                  <Save size={16} className="mr-1" /> 
                  Sauvegarder
                </Button>
              </div>
              <div className="col-span-4 sm:col-span-1">
                <Button 
                  type="button" 
                  onClick={handleSaveAndApplyAssignment} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!selectedConfigId}
                >
                  <Save size={16} className="mr-1" /> 
                  Sauvegarder & Appliquer
                </Button>
              </div>
            </div>

            <Collapsible 
              open={isAssignmentTableOpen} 
              onOpenChange={setIsAssignmentTableOpen} 
              className="border rounded-md p-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Attributions existantes pour cette configuration</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isAssignmentTableOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="mt-2">
                {getCurrentAssignmentsForConfig().length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">
                    Aucune attribution sauvegardée pour cette configuration
                  </p>
                ) : (
                  <ScrollArea className="h-[200px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Nom</TableHead>
                          <TableHead>Date de création</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCurrentAssignmentsForConfig().map((assignment) => (
                          <TableRow key={assignment.id} className="h-8 text-sm">
                            <TableCell>{assignment.name}</TableCell>
                            <TableCell>{new Date().toLocaleDateString()}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleLoadAssignment(assignment.id)}
                              >
                                Charger
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => {
                                  deleteAssignment(assignment.id);
                                  toast({
                                    title: "Attribution supprimée",
                                    description: `L'attribution "${assignment.name}" a été supprimée.`
                                  });
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CollapsibleContent>
            </Collapsible>

            {selectedConfigId ? (
              <div className="grid gap-6 mt-4">
                {Array.from({ length: classConfig.rows }).map((_, rowIndex) => (
                  <div key={`row-${rowIndex + 1}`} className="space-y-4">
                    <h3 className="font-medium">Rangée {rowIndex + 1}</h3>
                    
                    <div className="grid gap-4">
                      {Array.from({ length: classConfig.linesPerRow }).map((_, lineIndex) => (
                        <div key={`line-${rowIndex + 1}-${lineIndex + 1}`} className="p-4 border rounded-lg">
                          <h4 className="mb-2 text-sm font-medium">Ligne {lineIndex + 1}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: classConfig.positionsPerLine }).map((_, posIndex) => {
                              const position = String.fromCharCode(97 + posIndex); // a, b, c, etc.
                              const seatId = `${rowIndex + 1}-${lineIndex + 1}-${position}`;
                              const seat = seats.find(s => s.id === seatId);
                              
                              return (
                                <div key={seatId} className="space-y-2 p-3 border rounded-md bg-gray-50">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      Place {position.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {rowIndex + 1}-{lineIndex + 1}-{position}
                                    </span>
                                  </div>
                                  
                                  <Select
                                    value={seat?.studentId?.toString() || "unassigned"}
                                    onValueChange={(value) => {
                                      const studentId = value !== "unassigned" ? parseInt(value) : undefined;
                                      assignStudent(seatId, studentId);
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionner un élève" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unassigned">Non assigné</SelectItem>
                                      {students.map((student) => (
                                        <SelectItem
                                          key={student.id}
                                          value={student.id.toString()}
                                          disabled={
                                            seat?.studentId !== student.id &&
                                            seats.some(s => s.studentId === student.id)
                                          }
                                        >
                                          {student.name}
                                          {seats.some(s => s.studentId === student.id && s.id !== seatId) ? 
                                            ' (déjà assigné)' : ''}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-md bg-gray-50">
                <p className="text-muted-foreground">
                  Aucune configuration chargée. Veuillez charger une configuration pour attribuer des places.
                </p>
              </div>
            )}

            {selectedConfigId && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="font-medium mb-2">Élèves non assignés</h3>
                <div className="flex flex-wrap gap-2">
                  {getUnassignedStudents().length === 0 ? (
                    <p className="text-sm text-gray-500">Tous les élèves ont été assignés à une place.</p>
                  ) : (
                    getUnassignedStudents().map(student => (
                      <div key={student.id} className="px-3 py-1.5 bg-white border rounded-full text-sm">
                        {student.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedConfigId && (
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  type="button" 
                  onClick={handleSaveAssignment} 
                  disabled={!selectedConfigId}
                >
                  <Save size={16} className="mr-1" /> 
                  Sauvegarder
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveAndApplyAssignment} 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!selectedConfigId}
                >
                  <Save size={16} className="mr-1" /> 
                  Sauvegarder & Appliquer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassroomEditor;
