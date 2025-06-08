
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Settings } from 'lucide-react';

interface ConfigurationPanelProps {
  classConfig: {
    rows: number;
    linesPerRow: number;
    positionsPerLine: number;
  };
  onConfigChange: (config: { rows: number; linesPerRow: number; positionsPerLine: number }) => void;
  onSaveConfig: (name: string) => void;
}

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  classConfig,
  onConfigChange,
  onSaveConfig
}) => {
  const [configName, setConfigName] = React.useState('');

  const handleSave = () => {
    if (configName.trim()) {
      onSaveConfig(configName);
      setConfigName('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration de la classe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="rows">Nombre de rangées</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="10"
              value={classConfig.rows}
              onChange={(e) => onConfigChange({
                ...classConfig,
                rows: parseInt(e.target.value) || 1
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="lines">Lignes par rangée</Label>
            <Input
              id="lines"
              type="number"
              min="1"
              max="10"
              value={classConfig.linesPerRow}
              onChange={(e) => onConfigChange({
                ...classConfig,
                linesPerRow: parseInt(e.target.value) || 1
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="positions">Places par ligne</Label>
            <Input
              id="positions"
              type="number"
              min="1"
              max="6"
              value={classConfig.positionsPerLine}
              onChange={(e) => onConfigChange({
                ...classConfig,
                positionsPerLine: parseInt(e.target.value) || 1
              })}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Nom de la configuration"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={!configName.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
