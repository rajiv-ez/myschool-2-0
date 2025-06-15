
import { useState, useEffect } from 'react';

export interface DataManagerConfig<T> {
  fetchData: () => Promise<{ data: T[]; fromApi: boolean }>;
  createItem: (data: Partial<T>) => Promise<{ data: T; fromApi: boolean }>;
  updateItem: (id: number, data: Partial<T>) => Promise<{ data: T; fromApi: boolean }>;
  deleteItem: (id: number) => Promise<void>;
}

export function useDataManager<T extends { id: number }>(config: DataManagerConfig<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const result = await config.fetchData();
      setItems(result.data);
      setFromApi(result.fromApi);
      setIsLoading(false);
    })();
  }, []);

  const createItem = async (data: Partial<T>) => {
    const result = await config.createItem(data);
    setItems(prev => [...prev, result.data]);
    if (result.fromApi) setFromApi(true);
    return result;
  };

  const updateItem = async (id: number, data: Partial<T>) => {
    const result = await config.updateItem(id, data);
    setItems(prev => prev.map(item => (item.id === id ? result.data : item)));
    if (result.fromApi) setFromApi(true);
    return result;
  };

  const deleteItem = async (id: number) => {
    await config.deleteItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items,
    createItem,
    updateItem,
    deleteItem,
    isLoading,
    fromApi
  };
}
