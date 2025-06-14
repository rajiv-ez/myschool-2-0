
import { useEffect, useState } from 'react';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';
import { infrastructureService } from '@/services/infrastructureService';

export function useInfrastructureData() {
  const [succursales, setSuccursales] = useState<Succursale[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [s, b, sa] = await Promise.all([
        infrastructureService.getSuccursales(),
        infrastructureService.getBatiments(),
        infrastructureService.getSalles(),
      ]);
      
      setSuccursales(s.data);
      setBatiments(b.data);
      setSalles(sa.data);
      
      // Set the overall API status based on any successful API call
      setFromApi(s.fromApi || b.fromApi || sa.fromApi);
      
      setIsLoading(false);
    })();
  }, []);

  const createSuccursale = async (data: Partial<Succursale>) => {
    const r = await infrastructureService.createSuccursale(data);
    setSuccursales(prev => [...prev, r.data]);
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const updateSuccursale = async (id: number, data: Partial<Succursale>) => {
    const r = await infrastructureService.updateSuccursale(id, data);
    setSuccursales(prev => prev.map(s => (s.id === id ? r.data : s)));
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const deleteSuccursale = async (id: number) => {
    await infrastructureService.deleteSuccursale(id);
    setSuccursales(prev => prev.filter(s => s.id !== id));
  };

  const createBatiment = async (data: Partial<Batiment>) => {
    const r = await infrastructureService.createBatiment(data);
    setBatiments(prev => [...prev, r.data]);
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const updateBatiment = async (id: number, data: Partial<Batiment>) => {
    const r = await infrastructureService.updateBatiment(id, data);
    setBatiments(prev => prev.map(b => (b.id === id ? r.data : b)));
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const deleteBatiment = async (id: number) => {
    await infrastructureService.deleteBatiment(id);
    setBatiments(prev => prev.filter(b => b.id !== id));
  };

  const createSalle = async (data: Partial<Salle>) => {
    const r = await infrastructureService.createSalle(data);
    setSalles(prev => [...prev, r.data]);
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const updateSalle = async (id: number, data: Partial<Salle>) => {
    const r = await infrastructureService.updateSalle(id, data);
    setSalles(prev => prev.map(s => (s.id === id ? r.data : s)));
    if (r.fromApi) setFromApi(true);
    return r;
  };

  const deleteSalle = async (id: number) => {
    await infrastructureService.deleteSalle(id);
    setSalles(prev => prev.filter(s => s.id !== id));
  };

  return {
    succursales, createSuccursale, updateSuccursale, deleteSuccursale,
    batiments, createBatiment, updateBatiment, deleteBatiment,
    salles, createSalle, updateSalle, deleteSalle,
    isLoading,
    fromApi
  };
}
