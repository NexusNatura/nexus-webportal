/**
 * MisuseScenarios – EU AI Act Artikel 9.2b
 * Dokumentation och statusspårning av misuse-scenarier
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Eye,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
  Shield,
  Zap,
  AlertTriangle,
  TestTube,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";

const scenarioTypeLabel: Record<string, string> = {
  false_positive: "Falskt positivt",
  false_negative: "Falskt negativt",
  misuse_by_user: "Missbruk av användare",
  data_poisoning: "Datamanipulation",
  scope_creep: "Scope-utvidgning",
  over_reliance: "Övertillit till AI",
};

const scenarioTypeStyle: Record<string, string> = {
  false_positive: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  false_negative: "text-red-400 bg-red-500/10 border-red-500/30",
  misuse_by_user: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  data_poisoning: "text-red-400 bg-red-500/10 border-red-500/30",
  scope_creep: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  over_reliance: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const statusOptions = [
  { value: "identified", label: "Identifierad" },
  { value: "under_review", label: "Under granskning" },
  { value: "mitigated", label: "Mitigerad" },
  { value: "verified", label: "Verifierad" },
];

const statusStyle: Record<string, string> = {
  identified: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  under_review: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  mitigated: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  verified: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
};

const statusLabel: Record<string, string> = {
  identified: "Identifierad",
  under_review: "Under granskning",
  mitigated: "Mitigerad",
  verified: "Verifierad",
};

function RiskScore({ likelihood, consequence }: { likelihood: number; consequence: number }) {
  const score = likelihood * consequence;
  const color = score >= 16 ? "text-red-400" : score >= 9 ? "text-orange-400" : score >= 4 ? "text-amber-400" : "text-emerald-400";
  return (
    <span className={`text-xs font-mono font-bold ${color}`}>{score}</span>
  );
}

export default function MisuseScenarios() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const { data: scenarios = [], refetch } = trpc.compliance.misuse.list.useQuery();
  const updateStatus = trpc.compliance.misuse.updateStatus.useMutation();
  const seedMisuse = trpc.compliance.misuse.seed.useMutation();

  const handleStatusChange = async (scenarioId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ scenarioId, status: status as "identified" | "under_review" | "mitigated" | "verified" });
      await refetch();
      toast.success(`Status uppdaterad: ${scenarioId}`);
    } catch {
      toast.error("Kunde inte uppdatera status");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedMisuse.mutateAsync();
      await refetch();
      toast.success("3 fördefinierade misuse-scenarier inlästa");
    } catch {
      toast.error("Kunde inte läsa in seed-data");
    } finally {
      setSeeding(false);
    }
  };

  const sortedScenarios = [...scenarios].sort((a, b) => {
    const scoreA = a.likelihood * a.consequence;
    const scoreB = b.likelihood * b.consequence;
    return scoreB - scoreA;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0e14] text-slate-100 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/compliance">
            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Misuse-scenarier</h1>
            <p className="text-xs text-slate-400">EU AI Act Artikel 9.2b Â· {scenarios.length} scenarier dokumenterade</p>
          </div>
          <div className="ml-auto">
            {scenarios.length === 0 && (
              <Button
                onClick={handleSeed}
                disabled={seeding}
                size="sm"
                className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40"
                variant="outline"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Läs in fördefinierade scenarier
              </Button>
            )}
          </div>
        </div>

        {/* Förklaring */}
        <div className="flex items-start gap-2 p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg mb-6 mt-4">
          <Shield className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/70">
            Misuse-scenarier dokumenterar hur systemet kan missbrukas eller ge felaktiga utfall i enlighet med EU AI Act Artikel 9.2b.
            Varje scenario inkluderar utlösare, konsekvens, mitigeringsåtgärder och testprotokoll.
            Scenarierna är länkade till riskregistret för spårbarhet.
          </p>
        </div>

        {/* Scenariolista */}
        {sortedScenarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Eye className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400 mb-2">Inga misuse-scenarier dokumenterade ännu</p>
            <p className="text-sm text-slate-600">Klicka "Läs in fördefinierade scenarier" för att komma igång</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedScenarios.map(scenario => {
              const isExpanded = expandedId === scenario.scenarioId;
              return (
                <div
                  key={scenario.scenarioId}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden"
                >
                  {/* Huvud-rad */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : scenario.scenarioId)}
                  >
                    <div className="flex-shrink-0 w-16">
                      <span className="text-xs font-mono text-slate-500">{scenario.scenarioId}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{scenario.title}</p>
                      <p className="text-xs text-slate-500">{scenario.affectedModule}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-xs text-slate-500">
                        Risk: <RiskScore likelihood={scenario.likelihood} consequence={scenario.consequence} />
                      </div>
                      <Badge variant="outline" className={`text-xs border ${scenarioTypeStyle[scenario.scenarioType]}`}>
                        {scenarioTypeLabel[scenario.scenarioType]}
                      </Badge>
                      <Badge variant="outline" className={`text-xs border ${statusStyle[scenario.status]}`}>
                        {statusLabel[scenario.status]}
                      </Badge>
                      <select
                        value={scenario.status}
                        onChange={e => { e.stopPropagation(); handleStatusChange(scenario.scenarioId, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 cursor-pointer"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </div>

                  {/* Expanderad detalj */}
                  {isExpanded && (
                    <div className="border-t border-slate-700/50 p-4 bg-slate-900/40 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Utlösare</h4>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{scenario.trigger}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konsekvens</h4>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{scenario.impact}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mitigeringsåtgärder</h4>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{scenario.mitigationMeasures}</p>
                        </div>
                        <div className="space-y-3">
                          {scenario.detectionMethod && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detektionsmetod</h4>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">{scenario.detectionMethod}</p>
                            </div>
                          )}
                          {scenario.testingProtocol && (
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <TestTube className="w-3.5 h-3.5 text-purple-400" />
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Testprotokoll</h4>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">{scenario.testingProtocol}</p>
                            </div>
                          )}
                          <div className="flex gap-2 flex-wrap">
                            {scenario.linkedRiskId && (
                              <Badge variant="outline" className="text-xs border-orange-500/40 text-orange-400">
                                â†’ {scenario.linkedRiskId}
                              </Badge>
                            )}
                            {scenario.euAiActReference && (
                              <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400">
                                {scenario.euAiActReference}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

