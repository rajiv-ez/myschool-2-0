
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const TuteurView: React.FC = () => {
  const tuteurData = {
    enfants: [
      { nom: "Jean Dupont", classe: "6ème A", dernieresNotes: [15, 18, 14, 16] },
      { nom: "Marie Dupont", classe: "3ème B", dernieresNotes: [17, 19, 15, 18] }
    ],
    pagementsRecents: [
      { date: "2024-05-15", montant: 85000, type: "Frais de scolarité Q2" },
      { date: "2024-04-20", montant: 25000, type: "Frais de transport" }
    ],
    paiementsAVenir: [
      { date: "2024-07-15", montant: 85000, type: "Frais de scolarité Q3" }
    ],
    evenements: [
      { date: "2024-06-10", titre: "Réunion parents-professeurs", classe: "6ème A" },
      { date: "2024-06-15", titre: "Examen de mathématiques", classe: "3ème B" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes enfants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tuteurData.enfants.map((enfant, index) => (
                <div key={index} className="border-l-4 border-myschool-purple pl-4">
                  <h4 className="font-semibold">{enfant.nom}</h4>
                  <p className="text-sm text-muted-foreground">{enfant.classe}</p>
                  <div className="flex gap-2 mt-2">
                    {enfant.dernieresNotes.map((note, noteIndex) => (
                      <span key={noteIndex} className="bg-myschool-purple-soft text-myschool-purple px-2 py-1 rounded text-xs">
                        {note}/20
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">À venir</h4>
                {tuteurData.paiementsAVenir.map((paiement, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{paiement.type}</p>
                      <p className="text-xs text-muted-foreground">{paiement.date}</p>
                    </div>
                    <span className="font-bold text-red-600">{paiement.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Récents</h4>
                {tuteurData.pagementsRecents.map((paiement, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{paiement.type}</p>
                      <p className="text-xs text-muted-foreground">{paiement.date}</p>
                    </div>
                    <span className="font-bold text-green-600">{paiement.montant.toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendrier familial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tuteurData.evenements.map((evenement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-myschool-gray-light rounded">
                <CalendarDays className="h-4 w-4 text-myschool-purple" />
                <div>
                  <p className="font-medium text-sm">{evenement.titre}</p>
                  <p className="text-xs text-muted-foreground">{evenement.date} - {evenement.classe}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TuteurView;
