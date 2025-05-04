
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Routes à implémenter */}
          <Route path="/inscription" element={<NotFound />} />
          <Route path="/connexion" element={<NotFound />} />
          <Route path="/emploi-du-temps" element={<NotFound />} />
          <Route path="/notes" element={<NotFound />} />
          <Route path="/presences" element={<NotFound />} />
          <Route path="/paiements" element={<NotFound />} />
          <Route path="/bibliotheque" element={<NotFound />} />
          <Route path="/offres/:type" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
