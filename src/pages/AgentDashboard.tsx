import React, { useState } from "react";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Play, Search, Activity, Loader2, Database, Clock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AgentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // tRPC Queries
  const { data: memories, isLoading: loadingMemories, refetch: refetchMemories } = trpc.ai.getMemories.useQuery(undefined, {
    enabled: !hasSearched,
    refetchInterval: 5000 
  });
  
  const { data: searchResults, isLoading: loadingSearch, refetch: executeSearch } = trpc.ai.searchMemories.useQuery(
    { query: searchQuery }, 
    { enabled: false }
  );

  const { data: jobs, isLoading: loadingJobs, refetch: refetchJobs } = trpc.ai.getJobs.useQuery(undefined, {
    refetchInterval: 2000
  });

  const { data: pendingMemories, isLoading: loadingPending, refetch: refetchPending } = trpc.ai.getPendingMemories.useQuery(undefined, {
    refetchInterval: 5000
  });

  const enqueueJob = trpc.ai.enqueueJob.useMutation({ onSuccess: () => refetchJobs() });
  
  const approveMemory = trpc.ai.approveMemory.useMutation({ 
    onSuccess: () => { refetchPending(); refetchMemories(); } 
  });
  
  const rejectMemory = trpc.ai.rejectMemory.useMutation({ 
    onSuccess: () => { refetchPending(); } 
  });

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    executeSearch();
  };

  const displayedMemories = hasSearched ? searchResults : memories;

  return (
    <div className="container mx-auto py-10 px-4 md:px-8 space-y-8 animate-in fade-in zoom-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            System 2: Agent Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Övervaka agenternas Långtidsminne, Reflector-kö och Asynkrona Jobb.
          </p>
        </div>
      </div>

      {/* Reflector-Driven Consolidation Queue */}
      <Card className="border-amber-500/30 shadow-md backdrop-blur-sm bg-amber-950/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="h-5 w-5" />
            Reflector-Kö (Godkännande krävs)
          </CardTitle>
          <CardDescription>
            Granska och godkänn agenternas nya insikter innan de sparas i Vektor-minnet permanent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loadingPending ? (
              <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-amber-500/50" /></div>
            ) : pendingMemories && pendingMemories.length > 0 ? (
              pendingMemories.map((mem: any) => (
                <div key={mem.id} className="p-4 rounded-lg bg-background border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-500 border-amber-500/20 mb-2">
                      {mem.agentName || mem.agent_name || 'Agent'} - PENDING
                    </Badge>
                    <p className="text-sm font-medium leading-relaxed">{mem.content}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-500"
                      onClick={() => approveMemory.mutate({ id: mem.id })}
                      disabled={approveMemory.isPending || rejectMemory.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Godkänn
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-500/50 hover:bg-red-500/20 text-red-500"
                      onClick={() => rejectMemory.mutate({ id: mem.id })}
                      disabled={approveMemory.isPending || rejectMemory.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Förkasta
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-muted-foreground text-sm flex flex-col items-center border border-dashed border-border/50 rounded-lg">
                <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                Inga insikter väntar på godkännande. Du är ikapp!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Vänster: Långtidsminne (Vector Search) */}
        <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              Långtidsminne (Godkända)
            </CardTitle>
            <CardDescription>
              Agenternas verifierade semantiska kunskapsbas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="flex space-x-2">
              <Input 
                placeholder="Sök i minnet med Cosine Similarity..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Sök
              </Button>
              {hasSearched && (
                <Button onClick={() => { setSearchQuery(""); setHasSearched(false); }} variant="ghost">
                  Återställ
                </Button>
              )}
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loadingMemories || loadingSearch ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : displayedMemories && displayedMemories.length > 0 ? (
                displayedMemories.map((mem: any, i: number) => (
                  <div key={mem.id || i} className="p-4 rounded-lg bg-background/60 border border-border/50 flex flex-col gap-2 transition-all hover:border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {mem.agentName || mem.agent_name || 'Agent'}
                      </Badge>
                      {mem.score !== undefined && (
                        <span className="text-xs text-muted-foreground font-mono">
                          Relevans: {(mem.score * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{mem.content}</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-2">
                      <Database className="h-3 w-3" />
                      <span>Vector {mem.id ? `#${mem.id}` : 'Simulated'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm">
                  Inga godkända minnen hittades.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Höger: Asynkrona Jobb-kön */}
        <Card className="border-border/50 shadow-sm backdrop-blur-sm bg-card/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Asynkrona Jobb
                </CardTitle>
                <CardDescription>
                  Bakgrunds-kö för Deep Research.
                </CardDescription>
              </div>
              <Button onClick={() => enqueueJob.mutate()} disabled={enqueueJob.isPending} className="bg-blue-600 hover:bg-blue-700">
                {enqueueJob.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Kör Deep Research
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loadingJobs ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : jobs && jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <div key={job.id} className="p-4 rounded-lg bg-background/60 border border-border/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">#{job.id}</span>
                        <span className="text-sm font-semibold">{job.jobType || job.job_type}</span>
                      </div>
                      <Badge variant={job.status === 'COMPLETED' ? 'default' : job.status === 'PROCESSING' ? 'secondary' : 'outline'} 
                             className={job.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 
                                        job.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400 animate-pulse hover:bg-blue-500/30' : ''}>
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="bg-black/20 p-2 rounded text-xs font-mono text-muted-foreground overflow-x-auto">
                      {JSON.stringify(job.payload)}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Skapad: {new Date(job.createdAt || job.created_at).toLocaleTimeString()}</span>
                      </div>
                      {job.completedAt && (
                        <span>Klar: {new Date(job.completedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm flex flex-col items-center">
                  <Activity className="h-8 w-8 mb-2 opacity-20" />
                  Kön är tom. Redo för nya uppdrag!
                </div>
              )}
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
