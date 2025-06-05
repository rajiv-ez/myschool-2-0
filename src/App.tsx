
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SchoolListing from "./pages/SchoolListing";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import Inscriptions from "./pages/dashboard/Inscriptions";
import Personnes from "./pages/dashboard/Personnes";
import Sessions from "./pages/dashboard/Sessions";
import Evenements from "./pages/dashboard/Evenements";
import Evenements2 from "./pages/dashboard/Evenements2";
import Locaux from "./pages/dashboard/Locaux";
import ClassroomConfig from "./pages/dashboard/ClassroomConfig";
import Academics from "./pages/dashboard/Academics";
import Education from "./pages/dashboard/Education";
import Presence from "./pages/dashboard/Presence";
import Notes from "./pages/dashboard/Notes";
import ReleveNotes from "./pages/dashboard/ReleveNotes";
import Bulletins from "./pages/dashboard/Bulletins";
import Archives from "./pages/dashboard/Archives";
import Bibliotheque from "./pages/dashboard/Bibliotheque";
import RH from "./pages/dashboard/RH";
import GestionRessources from "./pages/dashboard/GestionRessources";
import Paiements from "./pages/dashboard/Paiements";
import MesPaiements from "./pages/dashboard/MesPaiements";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main route */}
            <Route path="/" element={<Index />} />
            
            {/* Schools listing route */}
            <Route path="/schools" element={<SchoolListing />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="inscriptions" element={<Inscriptions />} />
              <Route path="personnes" element={<Personnes />} />
              <Route path="sessions" element={<Sessions />} />
              <Route path="evenements" element={<Evenements />} />
              <Route path="evenements2" element={<Evenements2 />} />
              <Route path="locaux" element={<Locaux />} />
              <Route path="classroom-config" element={<ClassroomConfig />} />
              <Route path="academics" element={<Academics />} />
              <Route path="education" element={<Education />} />
              <Route path="presence" element={<Presence />} />
              <Route path="notes" element={<Notes />} />
              <Route path="releve-notes" element={<ReleveNotes />} />
              <Route path="bulletins" element={<Bulletins />} />
              <Route path="archives" element={<Archives />} />
              <Route path="bibliotheque" element={<Bibliotheque />} />
              <Route path="rh" element={<RH />} />
              <Route path="gestion-ressources" element={<GestionRessources />} />
              <Route path="paiements" element={<Paiements />} />
              <Route path="mes-paiements" element={<MesPaiements />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
