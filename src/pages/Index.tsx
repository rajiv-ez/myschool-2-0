
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Blackboard from '@/components/home/Blackboard';
import SchoolNotice from '@/components/home/SchoolNotice';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-myschool-purple-dark text-white py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-myschool-purple-dark to-myschool-purple opacity-90 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Bienvenue sur MySchool 2.0
                </h1>
                <p className="text-lg mb-8 text-myschool-gray-light">
                  La plateforme numérique de gestion scolaire moderne et intuitive pour les établissements scolaires au Gabon.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link to="/inscription">S'inscrire</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/connexion">Se connecter</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="École numérique" 
                  className="rounded-lg shadow-lg border-4 border-white animate-float"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tableau noir avec notifications */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Tableau d'annonces</h2>
          <Blackboard className="mb-12">
            <div className="chalk-text text-2xl md:text-4xl font-chalk text-center mb-8">
              Actualités de l'école
            </div>
            <div className="chalk-line mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Les notices sont légèrement inclinées avec une animation au survol */}
              <div className="relative transform transition-transform">
                <SchoolNotice 
                  title="Rentrée scolaire" 
                  content="La rentrée scolaire est prévue pour le 15 septembre 2024."
                  date="01/08/2024"
                  color="blue"
                />
              </div>
              <div className="relative transform transition-transform -rotate-1">
                <SchoolNotice 
                  title="Réunion des parents" 
                  content="Une réunion des parents d'élèves se tiendra le 10 septembre à 18h."
                  date="05/08/2024"
                  color="purple"
                />
              </div>
              <div className="relative transform transition-transform rotate-2">
                <SchoolNotice 
                  title="Fournitures scolaires" 
                  content="Les listes des fournitures scolaires sont disponibles sur le portail."
                  date="15/07/2024"
                  color="orange"
                />
              </div>
            </div>
          </Blackboard>
        </section>

        {/* Fonctionnalités */}
        <section className="bg-myschool-gray-light py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Nos modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Inscription</h3>
                <p className="text-myschool-gray-dark">
                  Gérez les inscriptions et réinscriptions de vos élèves en quelques clics.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Emploi du temps</h3>
                <p className="text-myschool-gray-dark">
                  Créez et partagez facilement les emplois du temps des classes et des enseignants.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                    <circle cx="17" cy="7" r="5"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Notes et évaluations</h3>
                <p className="text-myschool-gray-dark">
                  Gérez les notes et créez des bulletins scolaires personnalisés.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <path d="M2 12h10"></path>
                    <path d="M9 4v16"></path>
                    <path d="M14 9v2"></path>
                    <path d="M14 4v2"></path>
                    <path d="M14 14v2"></path>
                    <path d="M14 19v2"></path>
                    <path d="M22 12h-8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Présences</h3>
                <p className="text-myschool-gray-dark">
                  Suivez la présence des élèves et générez des statistiques détaillées.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <path d="M12 2v20"></path>
                    <path d="m17 5-5-3-5 3"></path>
                    <path d="m17 19-5 3-5-3"></path>
                    <path d="M12 11v2"></path>
                    <path d="M12 7v2"></path>
                    <path d="M12 15v2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Paiements</h3>
                <p className="text-myschool-gray-dark">
                  Gérez les frais de scolarité et suivez l'état des paiements.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="w-12 h-12 bg-myschool-purple-soft flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-myschool-purple">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Communication</h3>
                <p className="text-myschool-gray-dark">
                  Facilitez la communication entre le personnel, les élèves et les parents.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Offres */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Nos offres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="bg-myschool-blue-soft p-6">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <p className="text-2xl font-bold">50 000 FCFA<span className="text-sm font-normal">/mois</span></p>
                <p className="text-sm text-gray-600">Pour les petites écoles</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Jusqu'à 200 élèves
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    1 succursale
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Modules de base
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/offres/starter">En savoir plus</Link>
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden border-myschool-purple shadow-lg transition-transform hover:transform hover:scale-105">
              <div className="bg-myschool-purple text-white p-6 relative">
                <div className="absolute top-0 right-0 bg-myschool-orange text-white text-xs px-2 py-1 rounded-bl">
                  Populaire
                </div>
                <h3 className="text-xl font-bold mb-2">Medium</h3>
                <p className="text-2xl font-bold">100 000 FCFA<span className="text-sm font-normal">/mois</span></p>
                <p className="text-sm opacity-80">Pour les écoles en croissance</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Jusqu'à 500 élèves
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    3 succursales
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Tous les modules
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link to="/offres/medium">En savoir plus</Link>
                </Button>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="bg-myschool-purple-soft p-6">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-2xl font-bold">200 000 FCFA<span className="text-sm font-normal">/mois</span></p>
                <p className="text-sm text-gray-600">Pour les grands établissements</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Élèves illimités
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Succursales illimitées
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-green-500">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Support dédié 24/7
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/offres/premium">En savoir plus</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-myschool-purple py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à digitaliser votre école?</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Rejoignez MySchool 2.0 aujourd'hui et transformez votre expérience scolaire avec notre plateforme complète et intuitive.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/inscription">Commencer maintenant</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
