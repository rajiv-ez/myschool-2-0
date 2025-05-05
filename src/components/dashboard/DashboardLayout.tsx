
import React from 'react';
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
  CalendarDays
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  const isMobile = useIsMobile();
  
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
    { id: 'paiements', label: 'Paiements', icon: <CreditCard size={18} />, path: '/dashboard/paiements' },
    { id: 'mes-paiements', label: 'Mes Paiements', icon: <Wallet size={18} />, path: '/dashboard/mes-paiements' }
  ];
  
  const activeTab = tabs.find(tab => location.pathname.includes(tab.id))?.id || 'inscriptions';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Mon École</h1>
          <p className="text-muted-foreground">Gérez votre établissement scolaire en toute simplicité</p>
        </div>
        
        <ScrollArea className="w-full mb-6" type="always">
          <div className="pb-3">
            <Tabs value={activeTab} className="w-full">
              <TabsList className={`w-full flex-nowrap flex justify-start ${isMobile ? 'overflow-x-auto' : ''}`}>
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
        </ScrollArea>
        
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
