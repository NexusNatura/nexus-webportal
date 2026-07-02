import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Search,
  FileText,
  Recycle,
  ShieldCheck,
  Bot,
  Star,
  Clock,
  Activity,
  ArrowRight,
  Sparkles,
  Zap,
  Hexagon,
  Target,
  Terminal,
  Settings,
  ShieldAlert,
  Server,
  Database
} from "lucide-react";

// Icon mapping
const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  FileText,
  Recycle,
  ShieldCheck,
  Bot,
  Hexagon,
  Sparkles,
};

type Agent = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pricingModel: string;
  pricePerTaskOre: number | null;
  priceMonthlyOre: number | null;
  riskClass: string;
  securityLevel: string;
  capabilities: string[] | null;
  benchmarkScore: number | null;
  avgResponseTimeSec: number | null;
  status: string;
  isOfficial: boolean;
  purchaseCount: number;
  iconName: string;
  accentColor: string;
  isEnterprise: boolean;
  agentType: string;
};

function formatSEK(ore: number | null | undefined, isEnterprise: boolean): string {
  if (isEnterprise) return "Offert (Enterprise)";
  if (!ore) return "-";
  return `${(ore / 100).toLocaleString("sv-SE")} SEK`;
}

// Circular SVG Metric component for KPIs
const CircularMetric = ({ value, label, color = "text-primary" }: { value: number, label: string, color?: string }) => {
  const dashArray = 289; 
  const dashOffset = dashArray - (dashArray * value) / 100;
  
  return (
    <div className="flex flex-col items-center justify-center relative w-20 h-20">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/20" />
        <circle 
          cx="50" cy="50" r="46" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeDasharray={dashArray} 
          strokeDashoffset={dashOffset} 
          className={color} 
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-foreground tracking-tight">{value}%</span>
      </div>
      <span className="absolute -bottom-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center w-full">{label}</span>
    </div>
  );
};

export default function AgentMarketplace() {
  const [, navigate] = useLocation();
  const { data: agents = [], isLoading } = trpc.agents.list.useQuery();
  const installMutation = trpc.agents.install.useMutation();
  
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // A sleek, subtle placeholder image instead of the dark neon one
  const HERO_IMG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-primary/50 animate-spin opacity-70" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <Bot className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <p className="mt-4 text-muted-foreground font-medium text-sm tracking-widest uppercase">Laddar Nätverk...</p>
      </div>
    );
  }

  const filteredAgents = activeTab === "all" ? agents : agents.filter((a: Agent) => a.agentType === activeTab);

  const handleInstall = async (agent: Agent) => {
    try {
      await installMutation.mutateAsync();
      toast.success(`${agent.name} har installerats!`);
      setSelectedAgent(null);
    } catch (err) {
      toast.error("Installationen misslyckades.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      {/* Premium Hero Banner (Apple-style) */}
      <div className="relative h-[40vh] min-h-[350px] overflow-hidden bg-muted/30 border-b border-border">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Agent Marketplace" className="w-full h-full object-cover opacity-20 mix-blend-multiply dark:mix-blend-luminosity dark:opacity-10" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-center px-6 md:px-12 max-w-7xl mx-auto pt-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-foreground text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <Zap className="w-3.5 h-3.5 text-primary" />
              NEXUS-OS Arkitektur
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-4 text-foreground drop-shadow-sm animate-in fade-in slide-in-from-bottom-6">
              AgentNätverk & Digitala Tvillingar
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8">
              Autonoma AI-agenter och kryptografiskt säkrade Digitala Tvillingar. 
              Skala upp din verksamhet genom självoptimerande maskinell intelligens och cirkulär data.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-[-2rem] relative z-10">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-background/80 backdrop-blur-xl border border-border shadow-sm p-1 h-14 w-full md:w-auto inline-flex rounded-2xl">
            <TabsTrigger value="all" className="text-sm px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all font-medium">
              Alla System
            </TabsTrigger>
            <TabsTrigger value="ai-agent" className="text-sm px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all font-medium">
              <Bot className="w-4 h-4 mr-2" /> AI Agenter
            </TabsTrigger>
            <TabsTrigger value="digital-twin" className="text-sm px-8 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all font-medium">
              <Database className="w-4 h-4 mr-2" /> Digitala Tvillingar
            </TabsTrigger>
          </TabsList>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent: Agent, i: number) => {
              const Icon = ICON_MAP[agent.iconName] || Bot;
              return (
                <Card 
                  key={agent.id} 
                  className={`bg-card border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 group hover:shadow-lg cursor-pointer rounded-3xl animate-in fade-in slide-in-from-bottom-8`}
                  style={{ animationDelay: `${i * 100}ms` }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardHeader className="pb-4 relative bg-muted/10 border-b border-border/30">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`p-3 rounded-2xl bg-background border border-border shadow-sm group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-6 h-6 ${agent.accentColor}`} />
                      </div>
                      <Badge variant="outline" className="font-medium uppercase text-[10px] tracking-wider bg-background shadow-sm">
                        {agent.agentType === 'ai-agent' ? 'Autonom Agent' : 'Digital Tvilling'}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl font-semibold tracking-tight text-foreground relative z-10">
                      {agent.name}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-muted-foreground relative z-10">
                      {agent.tagline}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 pb-6 relative z-10">
                    <div className="flex justify-between items-center bg-muted/30 border border-border rounded-2xl p-4 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Modell</span>
                        <span className="font-medium text-sm flex items-center gap-1.5 text-foreground">
                          {agent.pricingModel === 'monthly' && <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                          {agent.pricingModel === 'per_task' && <Activity className="w-3.5 h-3.5 text-muted-foreground" />}
                          {agent.pricingModel === 'enterprise' && <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />}
                          {agent.pricingModel === 'monthly' ? 'Abonnemang' : agent.pricingModel === 'per_task' ? 'Per uppdrag' : 'Enterprise'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Kostnad</span>
                        <span className="font-semibold text-primary">
                          {formatSEK(agent.pricingModel === 'monthly' ? agent.priceMonthlyOre : agent.pricePerTaskOre, agent.isEnterprise)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-around items-end pt-2 pb-6 border-b border-border/50 mb-4">
                       <CircularMetric value={agent.benchmarkScore || 0} label="Prestanda" color={agent.accentColor} />
                       <div className="flex flex-col items-center gap-2 mb-1">
                          <div className="text-2xl font-semibold tracking-tight text-foreground">{agent.avgResponseTimeSec}s</div>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Svarstid</span>
                       </div>
                    </div>

                    <div className="space-y-2.5 mt-4">
                      {agent.capabilities?.slice(0, 3).map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Tabs>
      </div>

      {/* Intelligent Form / Purchase Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md" onClick={() => setSelectedAgent(null)} />
          <Card className="relative w-full max-w-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] rounded-3xl">
            <CardHeader className="pb-4 border-b border-border bg-muted/10">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  <div className={`p-4 rounded-2xl bg-background border border-border shadow-sm`}>
                    {(() => {
                      const Icon = ICON_MAP[selectedAgent.iconName] || Bot;
                      return <Icon className={`w-8 h-8 ${selectedAgent.accentColor}`} />;
                    })()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-semibold tracking-tight">{selectedAgent.name}</CardTitle>
                    <CardDescription className="text-base mt-1 font-medium">{selectedAgent.tagline}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAgent(null)} className="shrink-0 rounded-full hover:bg-muted">
                  <XIcon className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="py-6 overflow-y-auto">
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2 text-foreground">Systembeskrivning</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedAgent.description}</p>
              </div>

              <div className="bg-muted/30 border border-border rounded-3xl p-6 mb-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold uppercase text-sm tracking-wider text-foreground">Konfiguration (Intelligent Blankett)</h3>
                </div>
                
                <div className="space-y-5">
                  <p className="text-sm text-muted-foreground font-medium">Vänligen specificera dina krav så att plattformen kan provisionera rätt instans för dig.</p>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Mål-infrastruktur</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="justify-start bg-background hover:bg-muted hover:text-foreground shadow-sm rounded-xl border-border">Cloud (Delad)</Button>
                      <Button variant="outline" className="justify-start bg-background hover:bg-muted hover:text-foreground shadow-sm rounded-xl border-border">On-Prem (Isolerad)</Button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-semibold text-foreground">Välj integrationsgrad</label>
                    <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-shadow">
                      <option>Endast API (REST/GraphQL)</option>
                      <option>Full Dashboard Integration</option>
                      <option>Slack/Teams Bot</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-border rounded-2xl p-4 bg-background shadow-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Säkerhetsklass</div>
                  <div className="font-semibold flex items-center gap-2 text-foreground">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    {selectedAgent.securityLevel.toUpperCase()}
                  </div>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-background shadow-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Driftsättning</div>
                  <div className="font-semibold flex items-center gap-2 text-foreground">
                    <Server className="w-4 h-4 text-primary" />
                    Omedelbar
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-5 border-t border-border bg-muted/10 flex justify-between items-center rounded-b-3xl">
              <div>
                <div className="text-sm text-muted-foreground font-semibold">Uppskattad Kostnad</div>
                <div className="text-2xl font-semibold tracking-tight text-foreground">
                  {formatSEK(selectedAgent.pricingModel === 'monthly' ? selectedAgent.priceMonthlyOre : selectedAgent.pricePerTaskOre, selectedAgent.isEnterprise)}
                  {!selectedAgent.isEnterprise && <span className="text-sm text-muted-foreground font-medium"> / {selectedAgent.pricingModel === 'monthly' ? 'månad' : 'uppdrag'}</span>}
                </div>
              </div>
              <Button 
                onClick={() => handleInstall(selectedAgent)}
                disabled={installMutation.isPending}
                className="gap-2 px-8 rounded-full shadow-sm"
              >
                {installMutation.isPending ? "Installerar..." : "Slutför & Installera"}
                <Terminal className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

// Quick inline component for X icon since it was missed in imports
function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
