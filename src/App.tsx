import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Gemeenten from "./pages/Gemeenten";
import Commercieel from "./pages/Commercieel";
import Spaarsystemen from "./pages/Spaarsystemen";
import Spaarprogramma from "./pages/Spaarprogramma";
import Klantcases from "./pages/Klantcases";
import Support from "./pages/Support";
import OverOns from "./pages/OverOns";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import KlantcaseCreator from "./pages/KlantcaseCreator";
import KlantcaseDetail from "./pages/KlantcaseDetail";
import PagesAdmin from "./pages/admin/PagesAdmin";
import PageEditor from "./pages/admin/PageEditor";
import BuiltinPageEditor from "./pages/admin/BuiltinPageEditor";
import CustomPage from "./pages/CustomPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gemeenten" element={<Gemeenten />} />
            <Route path="/commercieel" element={<Commercieel />} />
            <Route path="/spaarsystemen" element={<Spaarsystemen />} />
            <Route path="/spaarprogramma" element={<Spaarprogramma />} />
            <Route path="/klantcases" element={<Klantcases />} />
            <Route path="/klantcases/nieuw" element={<KlantcaseCreator />} />
            <Route path="/klantcases/:id" element={<KlantcaseDetail />} />
            <Route path="/support" element={<Support />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/pages" element={<PagesAdmin />} />
            <Route path="/admin/pages/:id/edit" element={<PageEditor />} />
            <Route path="/admin/pages/builtin/:pageKey" element={<BuiltinPageEditor />} />
            <Route path="/p/:slug" element={<CustomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
