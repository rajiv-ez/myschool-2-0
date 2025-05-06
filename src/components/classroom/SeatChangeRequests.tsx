
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SeatChangeRequest } from '@/pages/dashboard/ClassroomConfig';

interface SeatChangeRequestsProps {
  requests: SeatChangeRequest[];
  onRequestAction: (requestId: number, action: 'approve' | 'reject') => void;
}

const SeatChangeRequests: React.FC<SeatChangeRequestsProps> = ({ 
  requests,
  onRequestAction
}) => {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="font-medium text-lg mb-1">Aucune demande en attente</h3>
        <p className="text-gray-600 max-w-md">
          Il n'y a actuellement aucune demande de changement de place en attente de traitement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">
        Demandes de changement de place ({requests.length})
      </h3>
      
      <div className="grid gap-4">
        {requests.map(request => (
          <div 
            key={request.id} 
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{request.studentName}</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    En attente
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  Demandé le {format(request.requestDate, "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
                
                <div className="bg-gray-50 p-3 rounded-md border text-sm mt-2">
                  <p className="font-medium mb-1">Motif de la demande:</p>
                  <p>{request.reason}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 min-w-[180px] self-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onRequestAction(request.id, 'reject')}
                >
                  <X className="mr-1 h-4 w-4" />
                  Refuser
                </Button>
                <Button 
                  size="sm"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => onRequestAction(request.id, 'approve')}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Accepter
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatChangeRequests;
