
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  GridIcon,
  ListCheck,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Définition des groupes d'onglets
const tabGroups = [
  {
    id: 'students',
    label: 'Élèves',
    tabs: [
      { id: 'inscriptions', label: 'Inscriptions', icon: <UserPlus size={18} />, path: '/dashboard/inscriptions' },
      { id: 'personnes', label: 'Élèves & Tuteurs', icon: <Users size={18} />, path: '/dashboard/personnes' },
    ]
  },
  {
    id: 'school',
    label: 'École',
    tabs: [
      { id: 'infrastructure', label: 'Infrastructure', icon: <Building size={18} />, path: '/dashboard/infrastructure' },
      { id: 'academics', label: 'Académique', icon: <School size={18} />, path: '/dashboard/academics' },
      { id: 'education', label: 'Enseignement', icon: <FileText size={18} />, path: '/dashboard/education' },
    ]
  },
  {
    id: 'schedule',
    label: 'Agenda',
    tabs: [
      { id: 'calendar', label: 'Calendrier', icon: <Calendar size={18} />, path: '/dashboard/calendar' },
      { id: 'presence', label: 'Présences', icon: <Clock size={18} />, path: '/dashboard/presence' },
      { id: 'sessions', label: 'Sessions & Paliers', icon: <GridIcon size={18} />, path: '/dashboard/sessions' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    tabs: [
      { id: 'paiements', label: 'Paiements', icon: <CreditCard size={18} />, path: '/dashboard/paiements' },
      { id: 'mes-paiements', label: 'Mes Paiements', icon: <Wallet size={18} />, path: '/dashboard/mes-paiements' },
    ]
  },
  {
    id: 'notes',
    label: 'Notes',
    tabs: [
      { id: 'notes', label: 'Relevé des Notes', icon: <ListCheck size={18} />, path: '/dashboard/notes' },
      { id: 'bulletins', label: 'Bulletins', icon: <FileText size={18} />, path: '/dashboard/bulletins' },
    ]
  },
];

// Fusion de tous les onglets pour pouvoir y accéder facilement
const allTabs = tabGroups.flatMap(group => group.tabs);

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[2] || '';
  
  // Trouver le groupe actif et l'onglet actif
  const activeTab = allTabs.find(tab => location.pathname.includes(tab.id))?.id || 'inscriptions';
  const activeGroup = tabGroups.find(group => group.tabs.some(tab => tab.id === activeTab))?.id || 'students';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Mon École</h1>
          <p className="text-muted-foreground">Gérez votre établissement scolaire en toute simplicité</p>
        </div>
        
        <div className="mb-6 overflow-hidden">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabGroups.map((group) => (
              <DropdownMenu key={group.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant={activeGroup === group.id ? "default" : "outline"} className="flex items-center gap-2">
                    {group.label}
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {group.tabs.map((tab) => (
                    <DropdownMenuItem key={tab.id} asChild>
                      <Link to={tab.path} className="flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
          
          <div className="overflow-x-auto pb-3">
            <Tabs value={activeTab} className="w-full">
              <TabsList className="flex p-1 h-auto overflow-x-auto max-w-full">
                {tabGroups.find(group => group.id === activeGroup)?.tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex items-center gap-2 whitespace-nowrap"
                    asChild
                  >
                    <Link to={tab.path}>
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.substring(0, 1)}</span>
                    </Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardLayout;
