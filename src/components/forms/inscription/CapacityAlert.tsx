
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface CapacityAlertProps {
  capacityError: string;
}

const CapacityAlert: React.FC<CapacityAlertProps> = ({ capacityError }) => {
  if (!capacityError) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {capacityError}
      </AlertDescription>
    </Alert>
  );
};

export default CapacityAlert;
