
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  readExcelFile, 
  validateSuccursalesImport, 
  validateBatimentsImport, 
  validateSallesImport,
  validateInscriptionsImport,
  validateSessionsImport,
  validateNiveauxImport,
  validateDomainesImport,
  validateElevesImport,
  validateTuteursImport,
  validateFraisImport,
  validatePaiementsImport,
  validateDepensesImport,
  generateSuccursalesTemplate,
  generateBatimentsTemplate,
  generateSallesTemplate,
  generateInscriptionsTemplate,
  generateSessionsTemplate,
  generateNiveauxTemplate,
  generateDomainessTemplate,
  generateElevesTemplate,
  generateTuteursTemplate,
  generateFraisTemplate,
  generatePaiementsTemplate,
  generateDepensesTemplate
} from '@/utils/excelUtils';
import { Succursale, Batiment } from '@/types/infrastructure';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'succursales' | 'batiments' | 'salles' | 'inscriptions' | 'eleves' | 'tuteurs' | 'frais' | 'paiements' | 'depenses';
  onImport: (data: any[]) => Promise<void>;
  succursales?: Succursale[];
  batiments?: Batiment[];
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({
  open,
  onOpenChange,
  type,
  onImport,
  succursales = [],
  batiments = []
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    data?: any[];
  } | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFile(null);
      setValidationResult(null);
      setIsProcessing(false);
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValidationResult(null);
    }
  };

  const handleValidateFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await readExcelFile(file);
      
      let result;
      switch (type) {
        case 'succursales':
          result = validateSuccursalesImport(data);
          break;
        case 'batiments':
          result = validateBatimentsImport(data, succursales);
          break;
        case 'salles':
          result = validateSallesImport(data, batiments);
          break;
        case 'inscriptions':
          result = validateInscriptionsImport(data);
          break;
        case 'eleves':
          result = validateElevesImport(data);
          break;
        case 'tuteurs':
          result = validateTuteursImport(data);
          break;
        case 'frais':
          result = validateFraisImport(data);
          break;
        case 'paiements':
          result = validatePaiementsImport(data);
          break;
        case 'depenses':
          result = validateDepensesImport(data);
          break;
        default:
          result = validateSuccursalesImport(data);
          break;
      }

      setValidationResult(result);
      
      if (result.isValid) {
        toast({
          title: 'Validation réussie',
          description: `${result.data?.length} enregistrements valides trouvés`,
        });
      } else {
        toast({
          title: 'Erreurs de validation',
          description: `${result.errors.length} erreur(s) trouvée(s)`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de lire le fichier Excel',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.isValid || !validationResult.data) return;

    setIsProcessing(true);
    try {
      await onImport(validationResult.data);
      toast({
        title: 'Import réussi',
        description: `${validationResult.data.length} enregistrement(s) importé(s)`,
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erreur d\'import',
        description: 'Une erreur est survenue lors de l\'import',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    switch (type) {
      case 'succursales':
        generateSuccursalesTemplate();
        break;
      case 'batiments':
        generateBatimentsTemplate();
        break;
      case 'salles':
        generateSallesTemplate();
        break;
      case 'inscriptions':
        generateInscriptionsTemplate();
        break;
      case 'eleves':
        generateElevesTemplate();
        break;
      case 'tuteurs':
        generateTuteursTemplate();
        break;
      case 'frais':
        generateFraisTemplate();
        break;
      case 'paiements':
        generatePaiementsTemplate();
        break;
      case 'depenses':
        generateDepensesTemplate();
        break;
      default:
        generateSuccursalesTemplate();
        break;
    }
    
    toast({
      title: 'Template téléchargé',
      description: 'Le fichier template a été téléchargé',
    });
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'succursales': return 'Succursales';
      case 'batiments': return 'Bâtiments';
      case 'salles': return 'Salles';
      case 'inscriptions': return 'Inscriptions';
      case 'eleves': return 'Élèves';
      case 'tuteurs': return 'Tuteurs';
      case 'frais': return 'Frais Scolaires';
      case 'paiements': return 'Paiements';
      case 'depenses': return 'Dépenses';
      default: return 'Données';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importer {getTypeLabel()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="w-full flex items-center gap-2"
            >
              <Download size={16} />
              Télécharger le template Excel
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Sélectionner un fichier Excel
            </label>
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
            />
          </div>

          {file && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Fichier sélectionné: {file.name}
              </p>
              <Button
                onClick={handleValidateFile}
                disabled={isProcessing}
                className="w-full flex items-center gap-2"
              >
                <Upload size={16} />
                {isProcessing ? 'Validation...' : 'Valider le fichier'}
              </Button>
            </div>
          )}

          {validationResult && (
            <div className="space-y-2">
              {validationResult.isValid ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Validation réussie! {validationResult.data?.length} enregistrement(s) prêt(s) à être importé(s).
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="space-y-1">
                      <p className="font-medium">Erreurs de validation:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {validationResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {validationResult.errors.length > 5 && (
                          <li>... et {validationResult.errors.length - 5} autre(s) erreur(s)</li>
                        )}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          {validationResult?.isValid && (
            <Button
              onClick={handleImport}
              disabled={isProcessing}
            >
              {isProcessing ? 'Import...' : 'Importer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;
