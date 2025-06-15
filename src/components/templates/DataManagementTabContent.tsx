
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { TabConfig } from './DataManagementPage';
import { usePageFilters } from '@/hooks/usePageFilters';
import { usePagination } from '@/hooks/usePagination';
import PaginationControls from './PaginationControls';

interface DataManagementTabContentProps<T extends { id: number }> {
  tab: TabConfig<T>;
  onDetailsClick: (item: T) => void;
  onEditClick: (item: T) => void;
  onDeleteClick: (item: T) => void;
}

function DataManagementTabContent<T extends { id: number }>({
  tab,
  onDetailsClick,
  onEditClick,
  onDeleteClick
}: DataManagementTabContentProps<T>) {
  const filters = usePageFilters(tab.items, {
    searchFields: tab.searchFields,
    filters: tab.filters
  });

  const pagination = usePagination(filters.filteredItems, 10);

  return (
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
                      <Button variant="outline" size="icon" onClick={() => onDetailsClick(item)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onEditClick(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onDeleteClick(item)}>
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
        <PaginationControls pagination={pagination} />
      </CardFooter>
    </Card>
  );
}

export default DataManagementTabContent;
