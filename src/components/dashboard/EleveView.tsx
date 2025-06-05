
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';

const EleveView: React.FC = () => {
  const eleveData = {
    dernieresNotes: [
      { matiere: "Mathématiques", note: 16, coefficient: 4 },
      { matiere: "Français", note: 14, coefficient: 4 },
      { matiere: "Anglais", note: 18, coefficient: 3 },
      { matiere: "Histoire-Géo", note: 15, coefficient: 3 }
    ],
    paiementsRecents: [
      { date: "2024-05-15", montant: 85000, type: "Frais de scolarité Q2" }
    ],
    paiementsAVenir: [
      { date: "2024-07-15", montant: 85000, type: "Frais de scolarité Q3" }
    ],
    evenements: [
      { date: "2024-06-10", titre: "Réunion parents-professeurs" },
      { date: "2024-06-15", titre: "Examen de mathématiques" },
      { date: "2024-06-20", titre: "Sortie pédagogique" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes dernières notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eleveData.dernieresNotes.map((note, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium text-sm">{note.matiere}</p>
                    <p className="text-xs text-muted-foreground">Coef. {note.coefficient}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-lg ${note.note >= 16 ? 'text-green-600' : note.note >= 12 ? 'text-orange-600' : 'text-red-600'}`}>
                      {note.note}/20
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">À venir</h4>
                {eleveData.paiementsAVenir.map((paiement, index) => (
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
                {eleveData.paiementsRecents.map((paiement, index) => (
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
          <CardTitle>Mon calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eleveData.evenements.map((evenement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-myschool-gray-light rounded">
                <CalendarDays className="h-4 w-4 text-myschool-purple" />
                <div>
                  <p className="font-medium text-sm">{evenement.titre}</p>
                  <p className="text-xs text-muted-foreground">{evenement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EleveView;
