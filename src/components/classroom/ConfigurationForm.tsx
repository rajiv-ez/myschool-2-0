
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Power } from 'lucide-react';
import { ConfigurationClasse } from '@/types/configuration';
import { ClasseSession } from '@/types/academic';

interface ConfigurationFormProps {
  activeConfiguration?: ConfigurationClasse;
  classeSessions: ClasseSession[];
  onCreateConfiguration: (data: Partial<ConfigurationClasse>) => void;
  onActivateConfiguration: (id: number) => void;
  isLoading: boolean;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  activeConfiguration,
  classeSessions,
  onCreateConfiguration,
  onActivateConfiguration,
  isLoading
}) => {
  const [configId, setConfigId] = useState<number | null>(null);
  const [configName, setConfigName] = useState('');
  const [classeSession, setClasseSession] = useState<number | null>(null);
  const [rows, setRows] = useState(3);
  const [linesPerRow, setLinesPerRow] = useState(3);
  const [positionsPerLine, setPositionsPerLine] = useState(3);

  // Load active configuration data
  useEffect(() => {
    if (activeConfiguration) {
      setConfigId(activeConfiguration.id);
      setConfigName(activeConfiguration.nom);
      setClasseSession(activeConfiguration.classe_session);
      setRows(activeConfiguration.nb_rangees);
      setLinesPerRow(activeConfiguration.nb_lignes_par_rangee);
      setPositionsPerLine(activeConfiguration.nb_places_par_ligne);
    } else {
      resetForm();
    }
  }, [activeConfiguration]);

  const resetForm = () => {
    setConfigId(null);
    setConfigName('');
    setClasseSession(null);
    setRows(3);
    setLinesPerRow(3);
    setPositionsPerLine(3);
  };

  const handleSave = () => {
    if (!configName.trim() || !classeSession) {
      return;
    }

    const configData: Partial<ConfigurationClasse> = {
      nom: configName,
      classe_session: classeSession,
      nb_rangees: rows,
      nb_lignes_par_rangee: linesPerRow,
      nb_places_par_ligne: positionsPerLine,
    };

    if (configId) {
      // Update existing configuration
      configData.id = configId;
    }

    onCreateConfiguration(configData);
    
    if (!configId) {
      resetForm();
    }
  };

  const handleActivate = () => {
    if (configId) {
      onActivateConfiguration(configId);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
          <input type="hidden" value={configId || ''} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div className="col-span-1">
              <Label htmlFor="configName">Nom de la configuration</Label>
              <Input
                id="configName"
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                required
              />
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="classeSession">Classe Session</Label>
              <Select
                value={classeSession?.toString() || ''}
                onValueChange={(value) => setClasseSession(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {classeSessions.map((session) => (
                    <SelectItem key={session.id} value={session.id.toString()}>
                      Classe {session.classe} - Session {session.session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <Label htmlFor="rows">Rangées</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="linesPerRow">Lignes/rangée</Label>
              <Input
                id="linesPerRow"
                type="number"
                min="1"
                max="5"
                value={linesPerRow}
                onChange={(e) => setLinesPerRow(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="col-span-1">
              <Label htmlFor="positionsPerLine">Places/ligne</Label>
              <Input
                id="positionsPerLine"
                type="number"
                min="1"
                max="6"
                value={positionsPerLine}
                onChange={(e) => setPositionsPerLine(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="col-span-1 flex gap-2">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading || !configName.trim() || !classeSession}
              >
                <Save size={16} className="mr-1" />
                Sauvegarder
              </Button>
              
              {configId && (
                <Button 
                  type="button"
                  onClick={handleActivate}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <Power size={16} className="mr-1" />
                  Activer
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigurationForm;
