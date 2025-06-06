import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SchoolListing from "./pages/SchoolListing";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Login from "./pages/Login";
import Users from "./pages/dashboard/Users";

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
            
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            
            {/* Schools listing route */}
            <Route path="/schools" element={<SchoolListing />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Blackboard />} />
              <Route path="blackboard" element={<Blackboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inscriptions" element={<Inscriptions />} />
              <Route path="personnes" element={<Personnes />} />
              <Route path="users" element={<Users />} />
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
