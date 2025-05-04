
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-myschool-gray-dark text-white">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">MySchool 2.0</h3>
            <p className="text-myschool-gray-light">
              Plateforme de digitalisation des établissements scolaires au Gabon.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-myschool-purple transition">Accueil</Link>
              </li>
              <li>
                <Link to="/inscription" className="hover:text-myschool-purple transition">Inscription</Link>
              </li>
              <li>
                <Link to="/offres" className="hover:text-myschool-purple transition">Nos Offres</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-myschool-purple transition">Contactez-nous</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Modules</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/emploi-du-temps" className="hover:text-myschool-purple transition">Emploi du temps</Link>
              </li>
              <li>
                <Link to="/notes" className="hover:text-myschool-purple transition">Notes et évaluations</Link>
              </li>
              <li>
                <Link to="/bibliotheque" className="hover:text-myschool-purple transition">Bibliothèque en ligne</Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-myschool-purple transition">Communication</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="space-y-2">
              <li>Libreville, Gabon</li>
              <li>info@myschool.ga</li>
              <li>+241 XX XX XX XX</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} MySchool 2.0. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
