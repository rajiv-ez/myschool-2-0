
import { useState, useMemo } from 'react';

export interface FilterConfig {
  searchFields: string[];
  filters?: {
    [key: string]: {
      type: 'select' | 'range';
      options?: { value: string; label: string }[];
      filterFunction?: (item: any, value: string) => boolean;
    };
  };
}

export function usePageFilters<T>(items: T[], config: FilterConfig) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => 
        config.searchFields.some(field => {
          const value = (item as any)[field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply custom filters
    if (config.filters) {
      Object.entries(selectedFilters).forEach(([filterKey, filterValue]) => {
        if (filterValue && filterValue !== 'all') {
          const filterConfig = config.filters![filterKey];
          if (filterConfig?.filterFunction) {
            result = result.filter(item => filterConfig.filterFunction!(item, filterValue));
          }
        }
      });
    }

    return result;
  }, [items, searchTerm, selectedFilters, config]);

  const updateFilter = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilters({});
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    updateFilter,
    resetFilters,
    filteredItems
  };
}
