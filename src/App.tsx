import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CommandCenter from "./pages/CommandCenter";
import ActiveOrders from "./pages/ActiveOrders";
import OrderDetail from "./pages/OrderDetail";
import OrderPriorityMatrix from "./pages/OrderPriorityMatrix";
import CurrentPlan from "./pages/CurrentPlan";
import ScenarioSimulator from "./pages/ScenarioSimulator";
import ScenarioIntelligence from "./pages/ScenarioIntelligence";
import PlanComparison from "./pages/PlanComparison";
import FactoryView from "./pages/FactoryView";
import MultiPlantAllocation from "./pages/MultiPlantAllocation";
import MaterialAvailability from "./pages/MaterialAvailability";
import SupplierPerformance from "./pages/SupplierPerformance";
import DisruptionTracker from "./pages/DisruptionTracker";
import DemandForecast from "./pages/DemandForecast";
import DemandChangeLog from "./pages/DemandChangeLog";
import PullInPushOut from "./pages/PullInPushOut";
import ConnectedSystems from "./pages/ConnectedSystems";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<ActiveOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/priority-matrix" element={<OrderPriorityMatrix />} />
          <Route path="/production-plan" element={<CurrentPlan />} />
          <Route path="/scenario-intelligence" element={<ScenarioIntelligence />} />
          <Route path="/simulate" element={<ScenarioSimulator />} />
          <Route path="/plan-comparison" element={<PlanComparison />} />
          <Route path="/factory/pune" element={<FactoryView />} />
          <Route path="/factory/vadodara" element={<FactoryView />} />
          <Route path="/allocation" element={<MultiPlantAllocation />} />
          <Route path="/materials" element={<MaterialAvailability />} />
          <Route path="/suppliers" element={<SupplierPerformance />} />
          <Route path="/disruptions" element={<DisruptionTracker />} />
          <Route path="/demand-forecast" element={<DemandForecast />} />
          <Route path="/demand-changes" element={<DemandChangeLog />} />
          <Route path="/pull-in-push-out" element={<PullInPushOut />} />
          <Route path="/integrations" element={<ConnectedSystems />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
