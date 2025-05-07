
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RejectModalProps {
  motifRefus: string;
  setMotifRefus: React.Dispatch<React.SetStateAction<string>>;
  onReject: () => void;
  onClose: () => void;
}

const RejectModal: React.FC<RejectModalProps> = ({
  motifRefus,
  setMotifRefus,
  onReject,
  onClose
}) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Refuser la demande</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div>
          <Label htmlFor="motifRefus" className="mb-2 block">
            Motif du refus*
          </Label>
          <Textarea
            id="motifRefus"
            value={motifRefus}
            onChange={(e) => setMotifRefus(e.target.value)}
            placeholder="Veuillez indiquer la raison du refus..."
            className="resize-none"
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Ce motif sera visible par le demandeur dans sa notification.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="destructive" onClick={onReject}>
          Confirmer le refus
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default RejectModal;
