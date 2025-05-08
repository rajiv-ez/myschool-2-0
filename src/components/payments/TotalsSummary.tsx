
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign } from 'lucide-react';

interface TotalsSummaryProps {
  totalIn: number;
  totalOut: number;
}

const TotalsSummary: React.FC<TotalsSummaryProps> = ({ totalIn, totalOut }) => {
  const balance = totalIn - totalOut;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total des entrées</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalIn.toLocaleString()} FCFA</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total des sorties</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalOut.toLocaleString()} FCFA</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Solde</CardTitle>
          <CreditCard className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balance.toLocaleString()} FCFA
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalsSummary;
