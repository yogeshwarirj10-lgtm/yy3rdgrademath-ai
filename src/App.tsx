import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Index from "./pages/Index";
import TopicQuiz from "./pages/TopicQuiz";
import ModelPaper from "./pages/ModelPaper";
import TokenUsage from "./pages/TokenUsage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/topics" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/topic/:slug" element={<ProtectedRoute><TopicQuiz /></ProtectedRoute>} />
          <Route path="/model-paper" element={<ProtectedRoute><ModelPaper /></ProtectedRoute>} />
          <Route path="/token-usage" element={<ProtectedRoute><TokenUsage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
