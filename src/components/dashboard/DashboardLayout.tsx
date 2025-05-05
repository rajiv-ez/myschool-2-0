
import React, { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  UserPlus, 
  Users, 
  Calendar, 
  CreditCard, 
  Wallet,
  Building,
  School,
  BookOpen,
  ClipboardCheck,
  Layers,
  CalendarDays,
  FileText,
  ListOrdered,
  ArchiveIcon,
  BookOpenText,
  UserCog
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const tabs = [
    { id: 'inscriptions', label: 'Inscriptions', icon: <UserPlus size={18} />, path: '/dashboard/inscriptions' },
    { id: 'personnes', label: 'Élèves & Tuteurs', icon: <Users size={18} />, path: '/dashboard/personnes' },
    { id: 'sessions', label: 'Sessions & Paliers', icon: <Calendar size={18} />, path: '/dashboard/sessions' },
    { id: 'evenements', label: 'Événements', icon: <CalendarDays size={18} />, path: '/dashboard/evenements' },
    { id: 'locaux', label: 'Locaux', icon: <Building size={18} />, path: '/dashboard/locaux' },
    { id: 'academics', label: 'Structure Académique', icon: <School size={18} />, path: '/dashboard/academics' },
    { id: 'education', label: 'Enseignement', icon: <BookOpen size={18} />, path: '/dashboard/education' },
    { id: 'presence', label: 'Présences', icon: <ClipboardCheck size={18} />, path: '/dashboard/presence' },
    { id: 'notes', label: 'Notes', icon: <Layers size={18} />, path: '/dashboard/notes' },
    { id: 'releve-notes', label: 'Relevés de Notes', icon: <FileText size={18} />, path: '/dashboard/releve-notes' },
    { id: 'bulletins', label: 'Bulletins', icon: <ListOrdered size={18} />, path: '/dashboard/bulletins' },
    { id: 'archives', label: 'Archives', icon: <ArchiveIcon size={18} />, path: '/dashboard/archives' },
    { id: 'bibliotheque', label: 'Bibliothèque', icon: <BookOpenText size={18} />, path: '/dashboard/bibliotheque' },
    { id: 'rh', label: 'Ressources Humaines', icon: <UserCog size={18} />, path: '/dashboard/rh' },
    { id: 'paiements', label: 'Paiements', icon: <CreditCard size={18} />, path: '/dashboard/paiements' },
    { id: 'mes-paiements', label: 'Mes Paiements', icon: <Wallet size={18} />, path: '/dashboard/mes-paiements' }
  ];
  
  const activeTab = tabs.find(tab => location.pathname.includes(tab.id))?.id || 'inscriptions';

  // Faire défiler jusqu'à l'onglet actif au chargement
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-state="active"]`);
      if (activeElement) {
        const container = scrollRef.current;
        const scrollLeft = activeElement.getBoundingClientRect().left - 
                          container.getBoundingClientRect().left - 
                          (container.clientWidth - (activeElement as HTMLElement).offsetWidth) / 2;
        
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Mon École</h1>
          <p className="text-muted-foreground">Gérez votre établissement scolaire en toute simplicité</p>
        </div>
        
        <div className="mb-6 w-full overflow-x-auto pb-3" ref={scrollRef}>
          <Tabs value={activeTab} className="w-full">
            <TabsList className={`w-full flex-nowrap flex justify-start ${isMobile ? 'min-w-max' : ''}`}>
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 whitespace-nowrap"
                  asChild
                >
                  <Link to={tab.path}>
                    {tab.icon}
                    {tab.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <ScrollArea className="h-full w-full" type="auto">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
