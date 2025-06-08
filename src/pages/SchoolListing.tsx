
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SchoolCard from '@/components/schools/SchoolCard';
import SchoolSearch from '@/components/schools/SchoolSearch';
import { School } from '@/types/schools';

const SchoolListing: React.FC = () => {
  const allSchools: School[] = [
    {
      id: 1,
      nom: "Complexe Scolaire Le Guide de nos Enfants",
      description: "Un établissement d'excellence offrant une éducation de qualité du préscolaire au lycée.",
      subdomain: "csleguide",
      note: 5,
      images: ["/placeholder.svg"],
      resultats_examens: [
        {
          annee: "2023-2024",
          taux_reussite: 95,
          mentions: {
            passable: 25,
            bien: 45,
            tres_bien: 30
          }
        }
      ],
      adresse: "Quartier Nzeng-Ayong, Libreville",
      telephone: "+241 01 23 45 67",
      email: "contact@csleguide.ga",
      nombre_eleves: 450
    },
    {
      id: 2,
      nom: "École Internationale de Libreville",
      description: "École bilingue proposant le curriculum français et anglais avec des programmes d'excellence.",
      subdomain: "eilbreville",
      note: 4,
      images: ["/placeholder.svg"],
      resultats_examens: [
        {
          annee: "2023-2024",
          taux_reussite: 88,
          mentions: {
            passable: 35,
            bien: 40,
            tres_bien: 25
          }
        }
      ],
      adresse: "Quartier Glass, Libreville",
      telephone: "+241 01 34 56 78",
      email: "info@eil.ga",
      nombre_eleves: 320
    },
    {
      id: 3,
      nom: "Collège Saint-Paul",
      description: "Établissement catholique reconnu pour son encadrement et ses valeurs éducatives fortes.",
      subdomain: "saintpaul",
      note: 4,
      images: ["/placeholder.svg"],
      resultats_examens: [
        {
          annee: "2023-2024",
          taux_reussite: 92,
          mentions: {
            passable: 30,
            bien: 42,
            tres_bien: 28
          }
        }
      ],
      adresse: "Quartier Louis, Libreville",
      telephone: "+241 01 45 67 89",
      email: "secretariat@saintpaul.ga",
      nombre_eleves: 280
    },
    {
      id: 4,
      nom: "Institut Technique Gabonais",
      description: "Formation technique et professionnelle de haut niveau avec équipements modernes.",
      subdomain: "itgabon",
      note: 3,
      images: ["/placeholder.svg"],
      resultats_examens: [
        {
          annee: "2023-2024",
          taux_reussite: 85,
          mentions: {
            passable: 40,
            bien: 35,
            tres_bien: 25
          }
        }
      ],
      adresse: "Zone Industrielle d'Oloumi, Libreville",
      telephone: "+241 01 56 78 90",
      email: "admission@itg.ga",
      nombre_eleves: 180
    }
  ];

  const [filteredSchools, setFilteredSchools] = useState<School[]>(allSchools);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-myschool-purple-dark text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Nos Écoles Partenaires
              </h1>
              <p className="text-lg text-myschool-gray-light max-w-2xl mx-auto">
                Découvrez les établissements scolaires qui font confiance à MySchool 2.0 
                pour leur gestion administrative et pédagogique.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <SchoolSearch schools={allSchools} onFilter={setFilteredSchools} />
          </div>
        </section>

        {/* Schools Grid */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            {filteredSchools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSchools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Aucune école ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-myschool-gray-light py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Votre école souhaite nous rejoindre ?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Rejoignez notre réseau d'établissements partenaires et bénéficiez 
              de notre plateforme de gestion scolaire innovante.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-myschool-purple text-white px-6 py-3 rounded-lg hover:bg-myschool-purple-dark transition">
                Demander une démo
              </button>
              <button className="border border-myschool-purple text-myschool-purple px-6 py-3 rounded-lg hover:bg-myschool-purple hover:text-white transition">
                En savoir plus
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SchoolListing;
