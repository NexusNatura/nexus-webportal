import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, XCircle, Search, Mail, ShieldCheck, FileSearch, ArrowRight, PlayCircle, RefreshCcw } from "lucide-react";
import confetti from "canvas-confetti";

type AgentNode = {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
};

const AVAILABLE_AGENTS: AgentNode[] = [
  { id: "scraper", name: "Web Scraper", role: "Datainsamling", icon: <Search className="w-5 h-5" />, color: "text-blue-500 bg-blue-500/10" },
  { id: "analyzer", name: "Legal LLM", role: "Regelverksanalys", icon: <ShieldCheck className="w-5 h-5" />, color: "text-purple-500 bg-purple-500/10" },
  { id: "email", name: "Email Sender", role: "Kommunikation", icon: <Mail className="w-5 h-5" />, color: "text-green-500 bg-green-500/10" },
  { id: "search", name: "Semantic Search", role: "Dokumentsök", icon: <FileSearch className="w-5 h-5" />, color: "text-amber-500 bg-amber-500/10" }
];

export default function LogicPuzzle() {
  const [selectedAgents, setSelectedAgents] = useState<AgentNode[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");

  const handleAgentClick = (agent: AgentNode) => {
    if (status !== "idle") return; // Låst efter körning
    
    if (selectedAgents.find(a => a.id === agent.id)) {
      // Remove if already selected
      setSelectedAgents(prev => prev.filter(a => a.id !== agent.id));
    } else if (selectedAgents.length < 3) {
      // Add if we have space
      setSelectedAgents(prev => [...prev, agent]);
    }
  };

  const runSimulation = () => {
    if (selectedAgents.length !== 3) {
      setStatus("error");
      setFeedback("Du måste välja exakt 3 agenter för arbetsflödet.");
      return;
    }

    // Rätt svar: Scraper -> Analyzer -> Email
    const isCorrect = 
      selectedAgents[0].id === "scraper" && 
      selectedAgents[1].id === "analyzer" && 
      selectedAgents[2].id === "email";

    if (isCorrect) {
      setStatus("success");
      setFeedback("Genialiskt! Arbetsflödet är perfekt designat. 50 XP intjänade!");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4FD1C5', '#F6E05E', '#9F7AEA']
      });
    } else {
      setStatus("error");
      // Basic hints
      if (selectedAgents[0].id !== "scraper") {
        setFeedback("Ledtråd: Hur ska du få tag på datan innan du kan analysera den?");
      } else if (selectedAgents[1].id !== "analyzer") {
        setFeedback("Ledtråd: Du behöver någon som förstår lagtexterna innan du skickar ut information.");
      } else {
        setFeedback("Ledtråd: Hur ska leverantörerna få veta vad som gäller?");
      }
    }
  };

  const resetPuzzle = () => {
    setSelectedAgents([]);
    setStatus("idle");
    setFeedback("");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl animate-in fade-in duration-500">
      <Link href="/agent-community">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Tillbaka till Community
        </Button>
      </Link>

      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-4 text-primary border-primary/30">Dagens Logikpussel</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Bygg EU-bevakaren</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Din kund vill automatiskt skanna EU-lagstiftning (ESPR) från webben, analysera vad det betyder för deras produkt, och meddela sin leverantörskedja om ändringar. Välj rätt agenter i rätt ordning för att lösa caset.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Välj Agenter */}
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Tillgängliga Agenter</CardTitle>
            <CardDescription>Klicka för att lägga till i ditt arbetsflöde</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {AVAILABLE_AGENTS.map((agent) => {
              const isSelected = selectedAgents.some(a => a.id === agent.id);
              return (
                <button
                  key={agent.id}
                  onClick={() => handleAgentClick(agent)}
                  className={`flex items-center p-3 rounded-xl border text-left transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(79,209,197,0.15)] scale-[0.98] opacity-50' 
                      : 'border-border/50 bg-background hover:border-primary/50 hover:shadow-md'
                  }`}
                  disabled={status !== "idle"}
                >
                  <div className={`p-2 rounded-lg mr-4 ${agent.color}`}>
                    {agent.icon}
                  </div>
                  <div>
                    <div className="font-medium">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.role}</div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Arbetsflödet */}
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Ditt Arbetsflöde</CardTitle>
            <CardDescription>Plats för 3 agenter</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-4 py-8">
            {[0, 1, 2].map((index) => {
              const agent = selectedAgents[index];
              return (
                <div key={index} className="relative flex flex-col items-center">
                  <div className={`w-full h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                    agent 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-dashed border-muted-foreground/30 bg-background/50'
                  }`}>
                    {agent ? (
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${agent.color}`}>
                          {agent.icon}
                        </div>
                        <span className="font-semibold">{agent.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/50 font-medium text-sm">Tom plats {index + 1}</span>
                    )}
                  </div>
                  {index < 2 && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground/30 my-2 absolute -bottom-7 z-10 rotate-90" />
                  )}
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {status === "idle" ? (
              <Button 
                className="w-full font-bold shadow-md" 
                size="lg"
                onClick={runSimulation}
                disabled={selectedAgents.length === 0}
              >
                <PlayCircle className="w-5 h-5 mr-2" /> Kör Simulering
              </Button>
            ) : (
              <div className="w-full space-y-3">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  status === "success" 
                    ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                  {status === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  <p className="text-sm font-medium leading-tight">{feedback}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={resetPuzzle}>
                  <RefreshCcw className="w-4 h-4 mr-2" /> Försök Igen
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
