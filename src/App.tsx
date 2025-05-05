
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Inscriptions from "./pages/dashboard/Inscriptions";
import Personnes from "./pages/dashboard/Personnes";
import Sessions from "./pages/dashboard/Sessions";
import Evenements from "./pages/dashboard/Evenements";
import Paiements from "./pages/dashboard/Paiements";
import MesPaiements from "./pages/dashboard/MesPaiements";
import Locaux from "./pages/dashboard/Locaux";
import Academics from "./pages/dashboard/Academics";
import Education from "./pages/dashboard/Education";
import Presence from "./pages/dashboard/Presence";
import Notes from "./pages/dashboard/Notes";
import ReleveNotes from "./pages/dashboard/ReleveNotes";
import Bulletins from "./pages/dashboard/Bulletins";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes principales */}
          <Route path="/" element={<Index />} />
          
          {/* Routes du Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Inscriptions />} />
            <Route path="inscriptions" element={<Inscriptions />} />
            <Route path="personnes" element={<Personnes />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="evenements" element={<Evenements />} />
            <Route path="locaux" element={<Locaux />} />
            <Route path="academics" element={<Academics />} />
            <Route path="education" element={<Education />} />
            <Route path="presence" element={<Presence />} />
            <Route path="notes" element={<Notes />} />
            <Route path="releve-notes" element={<ReleveNotes />} />
            <Route path="bulletins" element={<Bulletins />} />
            <Route path="paiements" element={<Paiements />} />
            <Route path="mes-paiements" element={<MesPaiements />} />
          </Route>
          
          {/* Routes à implémenter */}
          <Route path="/inscription" element={<NotFound />} />
          <Route path="/connexion" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          <Route path="/offres/:type" element={<NotFound />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
