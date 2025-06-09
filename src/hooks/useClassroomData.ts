import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configurationService } from '@/services/configurationService';
import { academicService } from '@/services/academicService';
import { useToast } from '@/hooks/use-toast';
import { ConfigurationClasse, DispositionClasse, Place } from '@/types/configuration';
import { ClasseSession, Inscription } from '@/types/academic';

export const useClassroomData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch configurations
  const { data: configurationsResponse } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationService.getConfigurations(),
  });

  // Fetch dispositions
  const { data: dispositionsResponse } = useQuery({
    queryKey: ['dispositions'],
    queryFn: () => configurationService.getDispositions(),
  });

  // Fetch classe sessions
  const { data: classeSessionsResponse } = useQuery({
    queryKey: ['classe-sessions'],
    queryFn: academicService.getClasseSessions,
  });

  // Fetch inscriptions
  const { data: inscriptionsResponse } = useQuery({
    queryKey: ['inscriptions'],
    queryFn: academicService.getInscriptions,
  });

  const configurations = configurationsResponse?.data || [];
  const dispositions = dispositionsResponse?.data || [];
  const classeSessions = classeSessionsResponse?.data || [];
  const inscriptions = inscriptionsResponse?.data || [];

  // Get active configuration
  const activeConfiguration = configurations.find(config => config.est_actif);
  
  // Get active disposition
  const activeDisposition = dispositions.find(disp => disp.est_active);

  // Create configuration mutation
  const createConfigMutation = useMutation({
    mutationFn: configurationService.createConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      toast({
        title: "Configuration créée",
        description: "La configuration a été créée avec succès."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la configuration.",
        variant: "destructive"
      });
    }
  });

  // Activate configuration mutation
  const activateConfigMutation = useMutation({
    mutationFn: configurationService.setConfigurationActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
      queryClient.invalidateQueries({ queryKey: ['dispositions'] });
      toast({
        title: "Configuration activée",
        description: "La configuration a été activée avec succès."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'activation de la configuration.",
        variant: "destructive"
      });
    }
  });

  // Create disposition mutation
  const createDispositionMutation = useMutation({
    mutationFn: configurationService.createDisposition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositions'] });
      toast({
        title: "Attribution créée",
        description: "L'attribution a été créée avec succès."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'attribution.",
        variant: "destructive"
      });
    }
  });

  // Activate disposition mutation
  const activateDispositionMutation = useMutation({
    mutationFn: configurationService.setDispositionActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispositions'] });
      toast({
        title: "Attribution activée",
        description: "L'attribution a été activée avec succès."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'activation de l'attribution.",
        variant: "destructive"
      });
    }
  });

  // Get students for active classe session
  const getStudentsForActiveConfig = () => {
    if (!activeConfiguration) return [];
    
    return inscriptions
      .filter(inscription => inscription.classe_session === activeConfiguration.classe_session)
      .map(inscription => ({
        id: inscription.eleve,
        inscriptionId: inscription.id,
        name: `Élève ${inscription.eleve}` // TODO: Get actual student name from users service
      }));
  };

  return {
    configurations,
    dispositions,
    classeSessions,
    inscriptions,
    activeConfiguration,
    activeDisposition,
    createConfiguration: createConfigMutation.mutate,
    activateConfiguration: activateConfigMutation.mutate,
    createDisposition: createDispositionMutation.mutate,
    activateDisposition: activateDispositionMutation.mutate,
    getStudentsForActiveConfig,
    isLoading: createConfigMutation.isPending || activateConfigMutation.isPending ||
               createDispositionMutation.isPending || activateDispositionMutation.isPending
  };
};
