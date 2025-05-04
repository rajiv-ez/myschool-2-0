
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Home, LayoutDashboard, MessageSquare, LogIn } from 'lucide-react';

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
            <Link to="/" className="flex items-center gap-1">
              <Home size={18} />
              Accueil
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <LayoutDashboard size={18} />
              Mon École
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/contact" className="flex items-center gap-1">
              <MessageSquare size={18} />
              Contact
            </Link>
          </Button>

          <Button asChild>
            <Link to="/connexion" className="flex items-center gap-1">
              <LogIn size={18} />
              Connexion
            </Link>
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
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Home className="mr-2" size={18} />
              Accueil
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              <LayoutDashboard className="mr-2" size={18} />
              Mon École
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              <MessageSquare className="mr-2" size={18} />
              Contact
            </Link>
          </Button>
          <Button className="w-full" asChild>
            <Link to="/connexion" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="mr-2" size={18} />
              Connexion
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
