import { useEffect, useState } from 'react';
import { Succursale, Batiment, Salle } from '@/types/infrastructure';
import { infrastructureService } from '@/services/infrastructureService';

export function useInfrastructureData() {
  const [succursales, setSuccursales] = useState<Succursale[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial des données
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [s, b, sa] = await Promise.all([
        infrastructureService.getSuccursales(),
        infrastructureService.getBatiments(),
        infrastructureService.getSalles(),
      ]);
      if (s.fromApi) setSuccursales(s.data);
      if (b.fromApi) setBatiments(b.data);
      if (sa.fromApi) setSalles(sa.data);
      setIsLoading(false);
    })();
  }, []);

  const createSuccursale = async (data: Partial<Succursale>) => {
    const r = await infrastructureService.createSuccursale(data);
    if (r.fromApi) setSuccursales(prev => [...prev, r.data]);
    return r;
  };

  const updateSuccursale = async (id: number, data: Partial<Succursale>) => {
    const r = await infrastructureService.updateSuccursale(id, data);
    if (r.fromApi) setSuccursales(prev => prev.map(s => (s.id === id ? r.data : s)));
    return r;
  };

  const deleteSuccursale = async (id: number) => {
    await infrastructureService.deleteSuccursale(id);
    setSuccursales(prev => prev.filter(s => s.id !== id));
  };

  const createBatiment = async (data: Partial<Batiment>) => {
    const r = await infrastructureService.createBatiment(data);
    if (r.fromApi) setBatiments(prev => [...prev, r.data]);
    return r;
  };

  const updateBatiment = async (id: number, data: Partial<Batiment>) => {
    const r = await infrastructureService.updateBatiment(id, data);
    if (r.fromApi) setBatiments(prev => prev.map(b => (b.id === id ? r.data : b)));
    return r;
  };

  const deleteBatiment = async (id: number) => {
    await infrastructureService.deleteBatiment(id);
    setBatiments(prev => prev.filter(b => b.id !== id));
  };

  const createSalle = async (data: Partial<Salle>) => {
    const r = await infrastructureService.createSalle(data);
    if (r.fromApi) setSalles(prev => [...prev, r.data]);
    return r;
  };

  const updateSalle = async (id: number, data: Partial<Salle>) => {
    const r = await infrastructureService.updateSalle(id, data);
    if (r.fromApi) setSalles(prev => prev.map(s => (s.id === id ? r.data : s)));
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
    isLoading
  };
}
// Usage example in a component
// import { useInfrastructureData } from '@/hooks/useInfrastructureData';
// const { succursales, createSuccursale, updateSuccursale, deleteSuccursale, isLoading } = useInfrastructureData();
// return (
//   <div>
//     {isLoading ? <p>Loading...</p> : (
//       <ul>
//         {succursales.map(s => (
//           <li key={s.id}>
//             {s.name}
//             <button onClick={() => updateSuccursale(s.id, { name: 'Updated Name' })}>Update</button>
//             <button onClick={() => deleteSuccursale(s.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     )}
//     <button onClick={() => createSuccursale({ name: 'New Succursale' })}>Create Succursale</button>
//   </div>
