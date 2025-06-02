
import { useState, useEffect } from 'react';
import { ApiResponse } from '../services/api';
import { useToast } from './use-toast';

interface UseApiWithFallbackOptions {
  showToastOnFallback?: boolean;
  autoRefetch?: boolean;
  refetchInterval?: number;
}

export function useApiWithFallback<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  options: UseApiWithFallbackOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromApi, setFromApi] = useState(false);
  const { toast } = useToast();

  const {
    showToastOnFallback = true,
    autoRefetch = false,
    refetchInterval = 30000, // 30 secondes
  } = options;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      setData(response.data);
      setFromApi(response.fromApi);

      if (!response.fromApi && showToastOnFallback) {
        toast({
          title: "Mode hors ligne",
          description: "Connexion API indisponible, données locales affichées",
          variant: "default"
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  useEffect(() => {
    if (autoRefetch && fromApi) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefetch, refetchInterval, fromApi]);

  return {
    data,
    loading,
    error,
    fromApi,
    refetch: fetchData,
  };
}
