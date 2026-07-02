import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Banknote,
  Search,
  Activity,
  Calendar,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Euro,
  Target,
  ArrowRight,
  TrendingUp,
  FileText,
  Clock,
  AlertCircle,
  Filter
} from "lucide-react";

type Opportunity = {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  category: string;
  tags: string[];
  status: string;
  description: string;
};

function formatSek(ore: number) {
  return `${(ore / 100).toLocaleString("sv-SE")} SEK`;
}

export default function Grants() {
  const { data: opportunities = [], isLoading } = trpc.opportunities.list.useQuery({});
  const [selectedGrant, setSelectedGrant] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState("discover");

  const { data: pwinResult, isLoading: pwinLoading, refetch } = trpc.opportunities.calculatePWin.useQuery(
    { opportunityId: selectedGrant?.id || 0 },
    { enabled: !!selectedGrant }
  );

  const HERO_IMG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full inline-block" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-background">
      {/* Premium Hero Banner */}
      <div className="relative h-64 overflow-hidden mb-8 border-b border-border/50 animate-in slide-in-from-top-4 duration-500">
        <img src={HERO_IMG} alt="EU Bidrag & Upphandlingar" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 flex items-center px-4 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-4">
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 px-3 py-1">
                Grant-as-a-Service (GaaS)
              </Badge>
              <Badge variant="outline" className="bg-background/50 backdrop-blur px-3 py-1">
                <Target className="w-3 h-3 mr-1" /> PWin AI-Analys
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              EU-Bidrag & Upphandlingar
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Låt våra AI-agenter skanna marknaden, matcha din företagsprofil mot öppen finansiering och skriva din nästa vinnande ansökan.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl animate-in fade-in duration-700 delay-150">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-end mb-6">
            <TabsList className="bg-muted/50 border border-border/50 backdrop-blur p-1 h-12">
              <TabsTrigger value="discover" className="text-sm px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <Search className="w-4 h-4 mr-2" /> Upptäck Bidrag
              </TabsTrigger>
              <TabsTrigger value="my-grants" className="text-sm px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <FileText className="w-4 h-4 mr-2" /> Mina Ansökningar
              </TabsTrigger>
            </TabsList>
            
            <Button variant="outline" className="gap-2 hidden md:flex">
              <Filter className="w-4 h-4" /> Filtrera
            </Button>
          </div>

          <TabsContent value="discover" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((grant: Opportunity, i: number) => (
                <Card 
                  key={grant.id} 
                  className="group border-border/50 bg-card/50 backdrop-blur shadow-sm hover:border-primary/50 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom-4 relative overflow-hidden"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                  onClick={() => {
                    setSelectedGrant(grant);
                    refetch();
                  }}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="bg-background border-border/50">
                        {grant.provider}
                      </Badge>
                      <Badge variant="secondary" className={`${grant.status === 'Öppen' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} border-none`}>
                        {grant.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{grant.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 h-10">{grant.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="text-xs text-muted-foreground mb-1">Finansiering</div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-primary" />
                          {grant.amount}
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="text-xs text-muted-foreground mb-1">Deadline</div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary" />
                          {grant.deadline}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {grant.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {t}
                        </span>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 bg-muted/10 flex justify-end items-center rounded-b-xl">
                    <div className="text-sm font-medium text-primary flex items-center gap-2 group-hover:underline">
                      Kör PWin-kalkylator <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-grants" className="mt-0">
            <Card className="border-border/50 bg-card/50 backdrop-blur shadow-sm p-12 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary opacity-80" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Inga aktiva ansökningar</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Välj ett bidrag under "Upptäck Bidrag" och låt våra Nexus-agenter skriva ett utkast åt dig.
              </p>
              <Button onClick={() => setActiveTab("discover")} className="gap-2">
                Hitta finansiering <Search className="w-4 h-4" />
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* PWin Calculator Modal */}
      {selectedGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedGrant(null)}>
          <Card className="w-full max-w-2xl bg-card border-border/50 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={() => setSelectedGrant(null)}>
              X
            </Button>
            
            <CardHeader className="pb-4">
              <Badge variant="outline" className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">
                <Activity className="w-3 h-3 mr-2" /> PWin AI-Analys
              </Badge>
              <CardTitle className="text-2xl">{selectedGrant.title}</CardTitle>
              <CardDescription className="text-base">{selectedGrant.provider} • {selectedGrant.amount}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-muted/30 border rounded-xl">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-background border shadow-inner shrink-0">
                  {pwinLoading ? (
                    <span className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl font-bold font-fraunces text-primary">{pwinResult?.score}</span>
                      <span className="text-sm font-bold text-primary">%</span>
                    </div>
                  )}
                  {/* Decorative circular ring */}
                  {!pwinLoading && (
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray={`${(pwinResult?.score || 0) * 2.89} 289`} className="text-primary" />
                    </svg>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-bold mb-1">Estimerad Vinstchans (PWin)</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Beräknad av vår GaaS-motor baserat på Nexus AI Consulting algoritmer och historisk data från {selectedGrant.provider}.
                  </p>
                </div>
              </div>

              {!pwinLoading && pwinResult && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Påverkande Faktorer</h4>
                  <div className="grid gap-2">
                    {pwinResult.factors.map((factor: string, idx: number) => {
                      const isPositive = factor.includes("+");
                      return (
                        <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${isPositive ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'}`}>
                          {isPositive ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                          <span className="text-sm font-medium">{factor}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-border/50 pt-6 flex justify-between items-center bg-muted/10 rounded-b-xl">
              <div>
                <div className="text-sm text-muted-foreground">Setup-avgift</div>
                <div className="text-xl font-bold">10 000 SEK <span className="text-xs font-normal text-muted-foreground">+ 10% Success Fee</span></div>
              </div>
              <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white" disabled={pwinLoading} onClick={() => {
                toast.success(`Agenterna börjar nu analysera och skriva utkast för ${selectedGrant.title}.`);
                setSelectedGrant(null);
                setActiveTab("my-grants");
              }}>
                Låt Agent Skriva Ansökan <CheckCircle2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
