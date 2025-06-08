
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Folder } from 'lucide-react';
import type { ClassroomConfiguration, SeatAssignment } from '@/pages/dashboard/ClassroomConfig';

interface SavedConfigsListProps {
  configurations: ClassroomConfiguration[];
  assignments: SeatAssignment[];
  onDeleteConfiguration: (id: string) => void;
  onDeleteAssignment: (id: string) => void;
}

const SavedConfigsList: React.FC<SavedConfigsListProps> = ({
  configurations,
  assignments,
  onDeleteConfiguration,
  onDeleteAssignment
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Configurations sauvegardées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Configurations sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configurations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune configuration sauvegardée</p>
          ) : (
            <div className="space-y-2">
              {configurations.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{config.name}</h4>
                    <p className="text-sm text-gray-500">
                      {config.config.rows}R × {config.config.linesPerRow}L × {config.config.positionsPerLine}P
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteConfiguration(config.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attributions sauvegardées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Attributions sauvegardées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune attribution sauvegardée</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{assignment.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {assignment.seats.filter(s => s.studentId).length} élèves assignés
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteAssignment(assignment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SavedConfigsList;
