import React, { useEffect, useRef, useState } from 'react';
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
  UserCog,
  Settings,
  Layout,
  Package,
  ChevronRight,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Interface pour les onglets
interface DashboardTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Récupérer le type de disposition depuis localStorage avec 'tabs' comme valeur par défaut
  const [layoutType, setLayoutType] = useState<'tabs' | 'sidebar'>('tabs');
  
  useEffect(() => {
    const storedSettings = localStorage.getItem('appSettings');
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      // Use tabs as default if not specified
      setLayoutType(parsedSettings.layoutType || 'tabs');
    }
  }, []);
  
  const tabs: DashboardTab[] = [
    { id: 'blackboard', label: 'Tableau d\'annonces', icon: <MessageSquare size={18} />, path: '/dashboard/blackboard' },
    { id: 'inscriptions', label: 'Inscriptions', icon: <UserPlus size={18} />, path: '/dashboard/inscriptions' },
    { id: 'personnes', label: 'Élèves & Tuteurs', icon: <Users size={18} />, path: '/dashboard/personnes' },
    { id: 'sessions', label: 'Sessions & Paliers', icon: <Calendar size={18} />, path: '/dashboard/sessions' },
    { id: 'evenements', label: 'Événements', icon: <CalendarDays size={18} />, path: '/dashboard/evenements' },
    { id: 'evenements2', label: 'Événements (v2)', icon: <CalendarDays size={18} />, path: '/dashboard/evenements2' },
    { id: 'locaux', label: 'Locaux', icon: <Building size={18} />, path: '/dashboard/locaux' },
    { id: 'classroom-config', label: 'Configuration Classe', icon: <Layout size={18} />, path: '/dashboard/classroom-config' },
    { id: 'academics', label: 'Structure Académique', icon: <School size={18} />, path: '/dashboard/academics' },
    { id: 'education', label: 'Enseignement', icon: <BookOpen size={18} />, path: '/dashboard/education' },
    { id: 'presence', label: 'Présences', icon: <ClipboardCheck size={18} />, path: '/dashboard/presence' },
    { id: 'notes', label: 'Notes', icon: <Layers size={18} />, path: '/dashboard/notes' },
    { id: 'releve-notes', label: 'Relevés de Notes', icon: <FileText size={18} />, path: '/dashboard/releve-notes' },
    { id: 'bulletins', label: 'Bulletins', icon: <ListOrdered size={18} />, path: '/dashboard/bulletins' },
    { id: 'archives', label: 'Archives', icon: <ArchiveIcon size={18} />, path: '/dashboard/archives' },
    { id: 'bibliotheque', label: 'Bibliothèque', icon: <BookOpenText size={18} />, path: '/dashboard/bibliotheque' },
    { id: 'rh', label: 'Ressources Humaines', icon: <UserCog size={18} />, path: '/dashboard/rh' },
    { id: 'gestion-ressources', label: 'Moyens Généraux', icon: <Package size={18} />, path: '/dashboard/gestion-ressources' },
    { id: 'paiements', label: 'Paiements', icon: <CreditCard size={18} />, path: '/dashboard/paiements' },
    { id: 'mes-paiements', label: 'Mes Paiements', icon: <Wallet size={18} />, path: '/dashboard/mes-paiements' },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={18} />, path: '/dashboard/settings' }
  ];
  
  const activeTab = tabs.find(tab => location.pathname.includes(tab.id))?.id || 'blackboard';

  useEffect(() => {
    const activeTabEl = document.querySelector(`[data-tab-id='${activeTab}']`);
    if (scrollRef.current && activeTabEl && layoutType === 'tabs') {
      const parent = scrollRef.current;
      const tabRect = (activeTabEl as HTMLElement).getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const scrollLeft = tabRect.left - parentRect.left + parent.scrollLeft - 16;
      parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab, layoutType]);

  // Rendu de la barre latérale
  const renderSidebar = () => {
    return (
      <div className={cn(
        "h-[calc(100vh-64px)] flex-shrink-0 border-r bg-background transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex justify-end p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="space-y-1 p-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start", 
                  isSidebarCollapsed ? "px-2" : "px-3"
                )}
                asChild
              >
                <Link to={tab.path} className="flex items-center gap-2">
                  {tab.icon}
                  {!isSidebarCollapsed && <span>{tab.label}</span>}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-grow">
        {layoutType === 'sidebar' && renderSidebar()}
        
        <div className={cn(
          "container mx-auto px-4 py-6 flex-grow",
          layoutType === 'sidebar' && !isMobile && (isSidebarCollapsed ? "ml-16" : "ml-64")
        )}>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Mon École</h1>
            <p className="text-muted-foreground">Gérez votre établissement scolaire en toute simplicité</p>
          </div>

          {layoutType === 'tabs' && (
            <div className="w-full mb-6 overflow-x-auto" ref={scrollRef}>
              <Tabs value={activeTab} className="w-max">
                <TabsList className="flex space-x-2">
                  {tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex items-center gap-2 whitespace-nowrap"
                      asChild
                      data-tab-id={tab.id}
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
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[600px] max-h-[calc(100vh-220px)] overflow-auto">
            <div className="h-full w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
