
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Printer, X } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transactions: Transaction[];
  onPrint: () => void;
  dateRange: { start: string; end: string };
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  transactions,
  onPrint,
  dateRange
}) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="sticky top-0 z-10 bg-white px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              État financier
            </DialogTitle>
            <Button 
              onClick={onPrint} 
              className="flex items-center gap-2"
              variant="outline"
            >
              <Printer size={16} />
              <span>Imprimer</span>
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-10rem)] p-6">
          <div className="printable-content space-y-6">
            <div className="header text-center mb-8">
              <h1 className="text-2xl font-bold">État Financier</h1>
              <p className="text-muted-foreground">
                Période: {dateRange.start} à {dateRange.end}
              </p>
            </div>
            
            <div className="summary grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Entrées</h3>
                <p className="text-xl font-bold text-green-600">{totalIncome.toLocaleString()} FCFA</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Total Sorties</h3>
                <p className="text-xl font-bold text-red-600">{totalExpense.toLocaleString()} FCFA</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground">Solde</h3>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance.toLocaleString()} FCFA
                </p>
              </div>
            </div>
            
            <div className="transactions">
              <h2 className="text-lg font-semibold mb-4">Détail des transactions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2 bg-green-50 p-2 rounded">Entrées</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(t => t.type === 'income')
                        .map(transaction => (
                          <tr key={transaction.id} className="border-b">
                            <td className="p-2">{transaction.date}</td>
                            <td className="p-2">{transaction.description}</td>
                            <td className="p-2 text-right font-medium">
                              {transaction.amount.toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      <tr className="font-bold bg-green-50">
                        <td colSpan={2} className="p-2 text-right">Total Entrées:</td>
                        <td className="p-2 text-right">{totalIncome.toLocaleString()} FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2 bg-red-50 p-2 rounded">Sorties</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-right p-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions
                        .filter(t => t.type === 'expense')
                        .map(transaction => (
                          <tr key={transaction.id} className="border-b">
                            <td className="p-2">{transaction.date}</td>
                            <td className="p-2">{transaction.description}</td>
                            <td className="p-2 text-right font-medium">
                              {transaction.amount.toLocaleString()} FCFA
                            </td>
                          </tr>
                        ))}
                      <tr className="font-bold bg-red-50">
                        <td colSpan={2} className="p-2 text-right">Total Sorties:</td>
                        <td className="p-2 text-right">{totalExpense.toLocaleString()} FCFA</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-8 p-4 border-t">
                <div className="flex justify-between">
                  <h3 className="font-semibold">Solde final:</h3>
                  <p className={`font-bold text-lg ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {balance.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>
            
            <div className="footer text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
              <p>École Primaire Excellencia - Document généré le {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </ScrollArea>
        
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex items-center gap-2"
          >
            <X size={16} />
            <span>Fermer</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
