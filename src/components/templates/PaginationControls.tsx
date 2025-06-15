
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { PaginationResult } from '@/hooks/usePagination';

interface PaginationControlsProps {
  pagination: PaginationResult<any>;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ pagination }) => {
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

export default PaginationControls;
