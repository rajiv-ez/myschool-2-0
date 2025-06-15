import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Filter, Edit, Trash2, Eye, Wifi, WifiOff, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { usePageFilters } from '@/hooks/usePageFilters';
import ExcelImportDialog from '@/components/excel/ExcelImportDialog';

export interface TabConfig<T> {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number }>;
  items: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  searchFields: string[];
  filters?: {
    [key: string]: {
      type: 'select' | 'range';
      placeholder: string;
      options?: { value: string; label: string }[];
      filterFunction?: (item: T, value: string) => boolean;
    };
  };
  form: React.ComponentType<any>;
  createLabel: string;
  exportFunction: (items: T[]) => void;
  importType: 'succursales' | 'batiments' | 'salles';
  onImport: (data: any[]) => Promise<void>;
}

export interface DataManagementPageProps<T extends { id: number }> {
  title: string;
  description: string;
  tabs: TabConfig<T>[];
  fromApi: boolean;
  additionalProps?: Record<string, any>;
}

function DataManagementPage<T extends { id: number }>({
  title,
  description,
  tabs,
  fromApi,
  additionalProps = {}
}: DataManagementPageProps<T>) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const currentTab = tabs.find(tab => tab.id === activeTab);
  
  const filters = usePageFilters(currentTab?.items || [], {
    searchFields: currentTab?.searchFields || [],
    filters: currentTab?.filters
  });

  const pagination = usePagination(filters.filteredItems, 10);

  const handleCreateClick = () => {
    setSelectedItem(null);
    setIsCreateModalOpen(true);
  };

  const handleEditClick = (item: T) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = (item: T) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: T) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      toast({
        title: 'Élément supprimé',
        description: 'L\'élément a été supprimé avec succès.',
      });
    }
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleExportExcel = () => {
    if (currentTab) {
      currentTab.exportFunction(filters.filteredItems);
      toast({
        title: 'Export Excel',
        description: 'Le fichier Excel a été téléchargé avec succès',
      });
    }
  };

  const handleImportExcel = () => {
    setIsImportModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    const isEdit = !!selectedItem;
    toast({ 
      title: `Élément ${isEdit ? 'mis à jour' : 'créé'}`, 
      description: `L'élément a été ${isEdit ? 'modifié' : 'créé'} avec succès.` 
    });
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleFormCancel = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const renderPaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      let startPage = Math.max(1, pagination.currentPage - Math.floor(showPages / 2));
      let endPage = Math.min(pagination.totalPages, startPage + showPages - 1);

      if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => pagination.goToPage(i)}
              isActive={pagination.currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      return pages;
    };

    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Affichage de {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} à{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} sur{' '}
            {pagination.totalItems} éléments
          </span>
          <Select value={pagination.itemsPerPage.toString()} onValueChange={(value) => pagination.setItemsPerPage(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => pagination.prevPage()}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext 
                onClick={() => pagination.nextPage()}
                className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  return (
    <div>
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
          <Button variant="outline" onClick={handleImportExcel} className="flex items-center gap-2">
            <Upload size={16} />
            Importer Excel
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="flex items-center gap-2">
            <Download size={16} />
            Exporter Excel
          </Button>
          <Button className="flex items-center gap-2" onClick={handleCreateClick}>
            <Plus size={16} />
            {currentTab?.createLabel}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid grid-cols-${tabs.length} mb-8`}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
              <Badge variant="outline" className="ml-1">
                {tab.items.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <tab.icon size={18} />
                    {tab.label}
                  </CardTitle>
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={`Rechercher ${tab.label.toLowerCase()}...`}
                        value={filters.searchTerm}
                        onChange={(e) => filters.setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    {tab.filters && Object.entries(tab.filters).map(([key, filterConfig]) => (
                      <Select 
                        key={key}
                        value={filters.selectedFilters[key] || 'all'} 
                        onValueChange={(value) => filters.updateFilter(key, value)}
                      >
                        <SelectTrigger className="w-full md:w-40">
                          <SelectValue placeholder={filterConfig.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          {filterConfig.options?.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}
                    <Button variant="outline" onClick={filters.resetFilters}>
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tab.columns.map(column => (
                          <TableHead key={column.key}>{column.label}</TableHead>
                        ))}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagination.currentItems.map((item) => (
                        <TableRow key={item.id}>
                          {tab.columns.map(column => (
                            <TableCell key={column.key}>
                              {column.render ? column.render(item) : (item as any)[column.key]}
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => handleDetailsClick(item)}>
                                <Eye size={16} />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                                <Edit size={16} />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                {renderPaginationControls()}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={() => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedItem(null);
      }}>
        <DialogContent className="md:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Modifier' : 'Créer'} {currentTab?.label.slice(0, -1)}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous
            </DialogDescription>
          </DialogHeader>
          {currentTab && (
            <currentTab.form
              isEditing={!!selectedItem}
              selectedItem={selectedItem}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              {...additionalProps}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">ID</p>
                <p>{selectedItem.id}</p>
              </div>
              {currentTab?.columns.map(column => (
                <div key={column.key} className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{column.label}</p>
                  <p>{column.render ? column.render(selectedItem) : (selectedItem as any)[column.key]}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>Fermer</Button>
            <Button onClick={() => {
              setIsDetailsModalOpen(false);
              handleEditClick(selectedItem!);
            }}>Modifier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'élément</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet élément ?
              Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Modal */}
      {currentTab && (
        <ExcelImportDialog
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          type={currentTab.importType}
          onImport={currentTab.onImport}
          {...additionalProps}
        />
      )}
    </div>
  );
}

export default DataManagementPage;
