import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { initializePushNotifications, requestWebNotificationPermission } from "@/services/pushNotifications";
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import FindDoctor from "./pages/FindDoctor";
import Chat from "./pages/Chat";
import DietPlanPage from "./pages/DietPlanPage";
import PersonalityTestPage from "./pages/PersonalityTestPage";
import PersonalDiagnosis from "./pages/PersonalDiagnosis";
import Install from "./pages/Install";
import Community from "./pages/Community";
import Gym from "./pages/Gym";
import UserProfile from "./pages/UserProfile";
import SettingsPage from "./pages/Settings";
import NutritionGoals from "./pages/NutritionGoals";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import { TermsGate } from "@/components/TermsGate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize push notifications
const initNotifications = async () => {
  await initializePushNotifications();
  await requestWebNotificationPermission();
};

initNotifications();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <TermsGate />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/find-doctor" element={<FindDoctor />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/diet-plan" element={<DietPlanPage />} />
                <Route path="/personality-test" element={<PersonalityTestPage />} />
                <Route path="/personal-diagnosis" element={<PersonalDiagnosis />} />
                <Route path="/install" element={<Install />} />
                <Route path="/community" element={<Community />} />
                <Route path="/gym" element={<Gym />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/nutrition-goals" element={<NutritionGoals />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:slug" element={<ArticleDetail />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
