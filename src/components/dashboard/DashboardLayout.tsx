
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
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
  FileText,
  Clock,
  GridIcon
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  
  const tabs = [
    { id: 'inscriptions', label: 'Inscriptions', icon: <UserPlus size={18} />, path: '/dashboard/inscriptions' },
    { id: 'personnes', label: 'Élèves & Tuteurs', icon: <Users size={18} />, path: '/dashboard/personnes' },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Building size={18} />, path: '/dashboard/infrastructure' },
    { id: 'academics', label: 'Académique', icon: <School size={18} />, path: '/dashboard/academics' },
    { id: 'education', label: 'Enseignement', icon: <FileText size={18} />, path: '/dashboard/education' },
    { id: 'calendar', label: 'Calendrier', icon: <Calendar size={18} />, path: '/dashboard/calendar' },
    { id: 'presence', label: 'Présences', icon: <Clock size={18} />, path: '/dashboard/presence' },
    { id: 'sessions', label: 'Sessions & Paliers', icon: <GridIcon size={18} />, path: '/dashboard/sessions' },
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
        
        <Tabs value={activeTab} className="mb-6">
          <TabsList className="w-full overflow-x-auto flex-nowrap flex justify-start max-w-full">
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2"
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
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
