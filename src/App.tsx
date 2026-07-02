import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { trpc, trpcClient, queryClient } from "./lib/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Grants from "./pages/Grants";
import ProductPassport from "./pages/ProductPassport";
import Symbiosis from "./pages/Symbiosis";
import Terminal from "./pages/Terminal";
import About from "./pages/About";
import CompanyProfile from "./pages/CompanyProfile";
import TenderDiscovery from "./pages/TenderDiscovery";
import DataMarketplace from "./pages/DataMarketplace";
import CircularExcellence from "./pages/CircularExcellence";
import Pricing from "./pages/Pricing";
import Integrity from "./pages/Integrity";
import AgentDashboard from "./pages/AgentDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import ComplianceDashboard from "./pages/ComplianceDashboard";
import RiskRegister from "./pages/RiskRegister";
import MisuseScenarios from "./pages/MisuseScenarios";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BatteryPassportBuilder from "@/pages/BatteryPassportBuilder";
import AgentMarketplace from "@/pages/AgentMarketplace";
import AgentBuilder from "@/pages/AgentBuilder";
import AgentReview from "@/pages/AgentReview";
import AgentCommunity from "./pages/AgentCommunity";
import LogicPuzzle from "./pages/LogicPuzzle";
import CoursePage from "@/pages/CoursePage";
import LessonPage from "@/pages/LessonPage";
import CircularTools from "./pages/CircularTools";
import SmartForms from "./pages/SmartForms";
import WACoreLanding from "./pages/WACoreLanding";
import SalesEngine from "./pages/SalesEngine";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hitta-bidrag" component={Grants} />
      <Route path="/produktpass" component={ProductPassport} />
      <Route path="/symbios" component={Symbiosis} />
      <Route path="/terminal" component={Terminal} />
      <Route path="/om-oss" component={About} />
      <Route path="/foretagsprofil" component={CompanyProfile} />
      <Route path="/tender" component={TenderDiscovery} />
      <Route path="/datamarknadsplats" component={DataMarketplace} />
      <Route path="/excellens" component={CircularExcellence} />
      <Route path="/priser" component={Pricing} />
      <Route path="/sales" component={SalesEngine} />
      <Route path={"/integritet"} component={Integrity} />
      <Route path={"/agents/dashboard"} component={AgentDashboard} />
      <Route path={"/operator"} component={OperatorDashboard} />
      <Route path={"/operator/agent-review"} component={AgentReview} />
      <Route path={"/compliance"} component={ComplianceDashboard} />
      <Route path={"/compliance/riskregister"} component={RiskRegister} />
      <Route path={"/compliance/misuse"} component={MisuseScenarios} />
      <Route path={"/blogg"} component={Blog} />
      <Route path={"/blogg/:slug"} component={BlogPost} />
      <Route path={"/batteripass"} component={BatteryPassportBuilder} />
      <Route path={"/agenter"} component={AgentMarketplace} />
      <Route path={"/agenter/skapa"} component={AgentBuilder} />
      <Route path={"/agent-community"} component={AgentCommunity} />
      <Route path={"/agent-community/puzzle"} component={LogicPuzzle} />
      <Route path={"/agent-community/course/:slug"} component={CoursePage} />
      <Route path={"/agent-community/lesson/:courseSlug/:lessonId"} component={LessonPage} />
      <Route path={"/cirkulara-verktyg"} component={CircularTools} />
      <Route path={"/smarta-blanketter"} component={SmartForms} />
      <Route path={"/wa-core"} component={WACoreLanding} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;







