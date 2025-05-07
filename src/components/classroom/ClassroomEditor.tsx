
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, Seat } from '@/pages/dashboard/ClassroomConfig';
import { useToast } from "@/hooks/use-toast";
import { Save, Trash2, Check, Plus } from 'lucide-react';

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

  const { toast } = useToast();

  // Lorsque les valeurs changent, mettons à jour le local state
  useEffect(() => {
    setRows(classConfig.rows);
    setLinesPerRow(classConfig.linesPerRow);
    setPositionsPerLine(classConfig.positionsPerLine);
  }, [classConfig]);

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
        description: "Veuillez sélectionner une configuration",
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

  const handleLoadConfiguration = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId);
    if (config) {
      updateConfig(config.config);
      toast({
        title: "Configuration chargée",
        description: `La configuration "${config.name}" a été chargée.`
      });
    }
  };

  const handleLoadAssignment = (assignmentId: string) => {
    const assignment = savedAssignments.find(a => a.id === assignmentId);
    if (assignment) {
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
    }
  };

  const getStudentNameById = (studentId?: number): string => {
    if (!studentId) return 'Non assigné';
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Non assigné';
  };

  const getUnassignedStudents = (): Student[] => {
    const assignedStudentIds = seats.map(seat => seat.studentId).filter(Boolean);
    return students.filter(student => !assignedStudentIds.includes(student.id));
  };

  const handleApplyChanges = () => {
    applyChanges();
    toast({
      title: "Changements appliqués",
      description: "Les changements ont été appliqués avec succès."
    });
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

      {hasChanges && (
        <div className="flex justify-end">
          <Button 
            onClick={handleApplyChanges} 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
          >
            <Check size={16} className="mr-2" />
            Appliquer les changements
          </Button>
        </div>
      )}

      {editMode === 'config' ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
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
                  
                  <div className="space-y-2">
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
                  
                  <div className="space-y-2">
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
                </div>
                
                <Button type="submit" className="mt-4">Mettre à jour la configuration</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Gestion des configurations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Sauvegarder la configuration actuelle</h4>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nom de la configuration" 
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                    />
                    <Button onClick={handleSaveConfiguration}>
                      <Save size={16} className="mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Configurations sauvegardées</h4>
                  {savedConfigurations.length === 0 ? (
                    <p className="text-muted-foreground">Aucune configuration sauvegardée</p>
                  ) : (
                    <div className="space-y-2">
                      {savedConfigurations.map(config => (
                        <div key={config.id} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{config.name}</span>
                          <div className="flex gap-2">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-medium">Attribution des places</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Sauvegarder l'attribution actuelle</h4>
                  <div className="space-y-2">
                    <Input 
                      placeholder="Nom de l'attribution" 
                      value={assignmentName}
                      onChange={(e) => setAssignmentName(e.target.value)}
                    />
                    <Select 
                      value={selectedConfigId} 
                      onValueChange={setSelectedConfigId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        {savedConfigurations.map(config => (
                          <SelectItem key={config.id} value={config.id}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleSaveAssignment} className="w-full">
                      <Save size={16} className="mr-2" />
                      Sauvegarder l'attribution
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Attributions sauvegardées</h4>
                  {savedAssignments.length === 0 ? (
                    <p className="text-muted-foreground">Aucune attribution sauvegardée</p>
                  ) : (
                    <div className="space-y-2">
                      {savedAssignments.map(assignment => (
                        <div key={assignment.id} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{assignment.name}</span>
                          <div className="flex gap-2">
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
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6">
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
        </div>
      )}
    </div>
  );
};

export default ClassroomEditor;
