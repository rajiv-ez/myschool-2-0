
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Folder, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfigurationClasse, DispositionClasse } from '@/types/configuration';

interface ConfigurationsListProps {
  configurations: ConfigurationClasse[];
  dispositions: DispositionClasse[];
  activeConfiguration?: ConfigurationClasse;
  activeDisposition?: DispositionClasse;
  onLoadConfiguration: (config: ConfigurationClasse) => void;
  onLoadDisposition: (disposition: DispositionClasse) => void;
  onDeleteConfiguration: (id: number) => void;
  onDeleteDisposition: (id: number) => void;
}

const ConfigurationsList: React.FC<ConfigurationsListProps> = ({
  configurations,
  dispositions,
  activeConfiguration,
  activeDisposition,
  onLoadConfiguration,
  onLoadDisposition,
  onDeleteConfiguration,
  onDeleteDisposition
}) => {
  const [isConfigTableOpen, setIsConfigTableOpen] = useState(false);
  const [isDispositionTableOpen, setIsDispositionTableOpen] = useState(false);

  const getCurrentDispositionsForActiveConfig = () => {
    if (!activeConfiguration) return [];
    return dispositions.filter(d => d.configuration === activeConfiguration.id);
  };

  return (
    <div className="space-y-6">
      {/* Configurations List */}
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
          {configurations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              Aucune configuration sauvegardée
            </p>
          ) : (
            <ScrollArea className="h-[200px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nom</TableHead>
                    <TableHead>Rangées</TableHead>
                    <TableHead>Lignes</TableHead>
                    <TableHead>Places</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configurations.map((config) => (
                    <TableRow key={config.id} className="h-8 text-sm">
                      <TableCell>{config.nom}</TableCell>
                      <TableCell>{config.nb_rangees}</TableCell>
                      <TableCell>{config.nb_lignes_par_rangee}</TableCell>
                      <TableCell>{config.nb_places_par_ligne}</TableCell>
                      <TableCell>
                        {config.est_actif && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onLoadConfiguration(config)}
                        >
                          Charger
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDeleteConfiguration(config.id)}
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

      {/* Dispositions List */}
      <Collapsible 
        open={isDispositionTableOpen} 
        onOpenChange={setIsDispositionTableOpen} 
        className="border rounded-md p-2"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Attributions existantes
            {activeConfiguration && ` pour "${activeConfiguration.nom}"`}
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isDispositionTableOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-2">
          {getCurrentDispositionsForActiveConfig().length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              {activeConfiguration 
                ? "Aucune attribution sauvegardée pour cette configuration"
                : "Aucune configuration active"
              }
            </p>
          ) : (
            <ScrollArea className="h-[200px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentDispositionsForActiveConfig().map((disposition) => (
                    <TableRow key={disposition.id} className="h-8 text-sm">
                      <TableCell>{disposition.nom}</TableCell>
                      <TableCell>{disposition.description || '-'}</TableCell>
                      <TableCell>
                        {disposition.est_active && (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle size={12} className="mr-1" />
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onLoadDisposition(disposition)}
                        >
                          Charger
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => onDeleteDisposition(disposition.id)}
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
    </div>
  );
};

export default ConfigurationsList;
