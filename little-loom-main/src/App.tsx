import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/DashboardHome";
import GamesHub from "./pages/GamesHub";
import RightsRescue from "./pages/games/RightsRescue";
import RightsDetective from "./pages/games/RightsDetective";
import RightsCity from "./pages/games/RightsCity";
import RightsQuiz from "./pages/games/RightsQuiz";
import RightsRunner from "./pages/games/RightsRunner";
import Achievements from "./pages/Achievements";
import LearnRights from "./pages/LearnRights";
import RightDetail from "./pages/RightDetail";
import LegalAwareness from "./pages/LegalAwareness";
import LegalAwarenessDetail from "./pages/LegalAwarenessDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import "./i18n/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
              <Route path="/games" element={<DashboardLayout><GamesHub /></DashboardLayout>} />
              <Route path="/games/rights-rescue" element={<DashboardLayout><RightsRescue /></DashboardLayout>} />
              <Route path="/games/rights-detective" element={<DashboardLayout><RightsDetective /></DashboardLayout>} />
              <Route path="/games/rights-city" element={<DashboardLayout><RightsCity /></DashboardLayout>} />
              <Route path="/games/rights-quiz" element={<DashboardLayout><RightsQuiz /></DashboardLayout>} />
              <Route path="/games/rights-runner" element={<DashboardLayout><RightsRunner /></DashboardLayout>} />
              <Route path="/achievements" element={<DashboardLayout><Achievements /></DashboardLayout>} />
              <Route path="/learn" element={<DashboardLayout><LearnRights /></DashboardLayout>} />
              <Route path="/learn/:id" element={<DashboardLayout><RightDetail /></DashboardLayout>} />
              <Route path="/awareness" element={<DashboardLayout><LegalAwareness /></DashboardLayout>} />
              <Route path="/awareness/:id" element={<DashboardLayout><LegalAwarenessDetail /></DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
