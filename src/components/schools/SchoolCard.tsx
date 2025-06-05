
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { School } from '@/types/schools';

interface SchoolCardProps {
  school: School;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const latestResults = school.resultats_examens[0];

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-myschool-purple">{school.nom}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              {renderStars(school.note)}
              <span className="text-sm text-gray-600 ml-1">({school.note}/5)</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm">{school.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {school.images.length > 0 && (
          <div className="w-full h-32 bg-gray-200 rounded-md overflow-hidden">
            <img 
              src={school.images[0]} 
              alt={school.nom}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-myschool-purple" />
            <span>{school.nombre_eleves} élèves</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-myschool-purple" />
            <span>{school.telephone}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin size={16} className="text-myschool-purple" />
            <span className="text-xs">{school.adresse}</span>
          </div>
        </div>

        {latestResults && (
          <div className="bg-myschool-gray-light p-3 rounded-md">
            <h4 className="font-semibold text-sm mb-2">Résultats {latestResults.annee}</h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span>Taux de réussite:</span>
                <span className="font-semibold text-green-600">{latestResults.taux_reussite}%</span>
              </div>
              <div className="text-xs mt-1 space-y-1">
                <div className="flex justify-between">
                  <span>Très bien:</span>
                  <span>{latestResults.mentions.tres_bien}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Bien:</span>
                  <span>{latestResults.mentions.bien}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Passable:</span>
                  <span>{latestResults.mentions.passable}%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/dashboard">
            Accéder au tableau de bord
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchoolCard;
