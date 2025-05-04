
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-myschool-purple to-myschool-purple-dark bg-clip-text text-transparent">
              MySchool 2.0
            </span>
          </Link>
        </div>

        {/* Menu desktop */}
        <div className="hidden space-x-1 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/inscription">Inscription</Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Modules</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/emploi-du-temps" className="w-full">Emploi du temps</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notes" className="w-full">Notes et évaluations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/presences" className="w-full">Présences</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/paiements" className="w-full">Paiements</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/bibliotheque" className="w-full">Bibliothèque</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Offres</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/offres/starter" className="w-full">Starter</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/offres/medium" className="w-full">Medium</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/offres/premium" className="w-full">Premium</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" asChild>
            <Link to="/contact">Contact</Link>
          </Button>

          <Button asChild>
            <Link to="/connexion">Connexion</Link>
          </Button>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isMenuOpen ? 'hidden' : 'block'}`}>
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isMenuOpen ? 'block' : 'hidden'}`}>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="px-4 py-2 space-y-2 bg-white border-t md:hidden">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/inscription" onClick={() => setIsMenuOpen(false)}>Inscription</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/emploi-du-temps" onClick={() => setIsMenuOpen(false)}>Emploi du temps</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/notes" onClick={() => setIsMenuOpen(false)}>Notes et évaluations</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/presences" onClick={() => setIsMenuOpen(false)}>Présences</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/offres/starter" onClick={() => setIsMenuOpen(false)}>Offres Starter</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/offres/medium" onClick={() => setIsMenuOpen(false)}>Offres Medium</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/offres/premium" onClick={() => setIsMenuOpen(false)}>Offres Premium</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </Button>
          <Button className="w-full" asChild>
            <Link to="/connexion" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
