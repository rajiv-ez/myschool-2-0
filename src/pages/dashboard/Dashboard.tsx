
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  GraduationCap,
  DollarSign,
  CalendarDays,
  FileText,
  Award
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('staff');

  // Données mockées
  const staffStats = {
    totalEleves: 1250,
    nouveauxEleves: 45,
    paiementsEnCours: 85000,
    evenementsAVenir: 8,
    tauxReussite: 92
  };

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

  const renderStaffView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.totalEleves}</div>
            <p className="text-xs text-muted-foreground">
              +{staffStats.nouveauxEleves} nouveaux cette session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paiements en cours</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.paiementsEnCours.toLocaleString()} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Collectés ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements à venir</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.evenementsAVenir}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.tauxReussite}%</div>
            <p className="text-xs text-muted-foreground">
              Session en cours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des notes</CardTitle>
            <CardDescription>Moyenne générale par trimestre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Graphique des notes (à implémenter avec Recharts)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Événements récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-myschool-purple" />
                <div>
                  <p className="text-sm font-medium">Réunion pédagogique</p>
                  <p className="text-xs text-muted-foreground">Hier, 14h00</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-myschool-purple" />
                <div>
                  <p className="text-sm font-medium">Publication bulletins Q2</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTuteurView = () => (
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

  const renderEleveView = () => (
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre espace scolaire</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'staff' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('staff')}
          >
            <GraduationCap className="w-4 h-4 mr-1" />
            Staff
          </Button>
          <Button 
            variant={activeView === 'tuteur' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('tuteur')}
          >
            <Users className="w-4 h-4 mr-1" />
            Tuteur
          </Button>
          <Button 
            variant={activeView === 'eleve' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveView('eleve')}
          >
            <Award className="w-4 h-4 mr-1" />
            Élève
          </Button>
        </div>
      </div>

      {activeView === 'staff' && renderStaffView()}
      {activeView === 'tuteur' && renderTuteurView()}
      {activeView === 'eleve' && renderEleveView()}
    </div>
  );
};

export default Dashboard;
