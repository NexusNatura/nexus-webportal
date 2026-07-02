import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
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
import AgentCommunity from "@/pages/AgentCommunity";
import CoursePage from "@/pages/CoursePage";
import LessonPage from "@/pages/LessonPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/bidrag"} component={Grants} />
      <Route path={"/produktpass"} component={ProductPassport} />
      <Route path={"/symbios"} component={Symbiosis} />
      <Route path={"/terminal"} component={Terminal} />
      <Route path={"/om-oss"} component={About} />
      <Route path={"/foretag"} component={CompanyProfile} />
      <Route path={"/hitta-bidrag"} component={TenderDiscovery} />
      <Route path={"/datamarknad"} component={DataMarketplace} />
      <Route path={"/utbildning"} component={CircularExcellence} />
      <Route path={"/priser"} component={Pricing} />
      <Route path={"/integritet"} component={Integrity} />
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
      <Route path={"/agent-community/course/:slug"} component={CoursePage} />
      <Route path={"/agent-community/lesson/:courseSlug/:lessonId"} component={LessonPage} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;



