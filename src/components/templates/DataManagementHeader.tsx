
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Wifi, WifiOff } from 'lucide-react';

interface DataManagementHeaderProps {
  title: string;
  description: string;
  fromApi: boolean;
  createLabel: string;
  onCreateClick: () => void;
  onExportExcel: () => void;
  onImportExcel: () => void;
}

const DataManagementHeader: React.FC<DataManagementHeaderProps> = ({
  title,
  description,
  fromApi,
  createLabel,
  onCreateClick,
  onExportExcel,
  onImportExcel
}) => {
  return (
    <>
      <div className="flex flex-col items-end mb-3">
        <Badge variant={fromApi ? "default" : "secondary"} className="flex items-center gap-1">
          {fromApi ? (
            <>
              <Wifi size={12} />
              En ligne
            </>
          ) : (
            <>
              <WifiOff size={12} />
              Hors ligne
            </>
          )}
        </Badge>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
          <Button variant="outline" onClick={onImportExcel} className="flex items-center gap-2">
            <Upload size={16} />
            Importer Excel
          </Button>
          <Button variant="outline" onClick={onExportExcel} className="flex items-center gap-2">
            <Download size={16} />
            Exporter Excel
          </Button>
          <Button className="flex items-center gap-2" onClick={onCreateClick}>
            <Plus size={16} />
            {createLabel}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DataManagementHeader;
