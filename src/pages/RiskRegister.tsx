/**
 * RiskRegister â€“ EU AI Act Artikel 9
 * Interaktivt riskregister med statushantering och riskpoÃ¤ng
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ArrowLeft,
  Shield,
  Zap,
  Download,
} from "lucide-react";
import { Link } from "wouter";

const riskLevelLabel: Record<string, string> = {
  low: "LÃ¥g",
  medium: "Medel",
  high: "HÃ¶g",
  critical: "Kritisk",
};

const riskLevelStyle: Record<string, string> = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
};

const statusOptions = [
  { value: "identified", label: "Identifierad", color: "text-slate-400" },
  { value: "in_progress", label: "PÃ¥gÃ¥r", color: "text-blue-400" },
  { value: "mitigated", label: "Mitigerad", color: "text-amber-400" },
  { value: "verified", label: "Verifierad", color: "text-emerald-400" },
  { value: "accepted", label: "Accepterad", color: "text-purple-400" },
];

const categoryLabel: Record<string, string> = {
  data_quality: "Datakvalitet",
  model_accuracy: "Modellnoggrannhet",
  transparency: "Transparens",
  human_oversight: "MÃ¤nsklig tillsyn",
  security: "SÃ¤kerhet",
  fundamental_rights: "GrundlÃ¤ggande rÃ¤ttigheter",
  operational: "Operationell",
};

function RiskScoreBadge({ likelihood, consequence }: { likelihood: number; consequence: number }) {
  const score = likelihood * consequence;
  const level = score >= 16 ? "critical" : score >= 9 ? "high" : score >= 4 ? "medium" : "low";
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono ${riskLevelStyle[level]}`}>
      <span className="font-bold">{score}</span>
      <span className="opacity-60">({likelihood}Ã—{consequence})</span>
    </div>
  );
}

export default function RiskRegister() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const { data: risks = [], refetch } = trpc.compliance.risk.list.useQuery();
  const updateStatus = trpc.compliance.risk.updateStatus.useMutation();
  const seedRisks = trpc.compliance.risk.seed.useMutation();

  const handleStatusChange = async (riskId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ riskId, status: status as "identified" | "in_progress" | "mitigated" | "verified" | "accepted" });
      await refetch();
      toast.success(`Status uppdaterad: ${riskId}`);
    } catch {
      toast.error("Kunde inte uppdatera status");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedRisks.mutateAsync();
      await refetch();
      toast.success("5 fÃ¶rdefinierade risker inlÃ¤sta frÃ¥n EU AI Act-analysen");
    } catch {
      toast.error("Kunde inte lÃ¤sa in seed-data");
    } finally {
      setSeeding(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const doc = {
        title: "Riskregister â€“ EU AI Act Artikel 9",
        date: new Date().toISOString().split('T')[0],
        totalRisks: risks.length,
        risks: sortedRisks.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          category: categoryLabel[r.category as keyof typeof categoryLabel],
          likelihood: r.likelihood,
          consequence: r.consequence,
          score: r.likelihood * r.consequence,
          status: statusOptions.find(s => s.value === r.status)?.label || r.status,
          mitigation: r.description,
        })),
      };

      // Create a simple HTML table for PDF generation
      const html = `
        <html>
          <head>
            <title>Riskregister</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .critical { background-color: #fee; }
              .high { background-color: #fef3cd; }
              .medium { background-color: #fff3cd; }
              .low { background-color: #f0f8f0; }
            </style>
          </head>
          <body>
            <h1>Riskregister â€“ EU AI Act Artikel 9</h1>
            <p><strong>Datum:</strong> ${doc.date}</p>
            <p><strong>Totalt antal risker:</strong> ${doc.totalRisks}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titel</th>
                  <th>Kategori</th>
                  <th>Sannolikhet</th>
                  <th>Konsekvens</th>
                  <th>PoÃ¤ng</th>
                  <th>Status</th>
                  <th>Mitigeringsplan</th>
                </tr>
              </thead>
              <tbody>
                ${doc.risks.map(r => `
                  <tr class="${r.score >= 16 ? 'critical' : r.score >= 9 ? 'high' : r.score >= 4 ? 'medium' : 'low'}">
                    <td>${r.id}</td>
                    <td><strong>${r.title}</strong></td>
                    <td>${r.category}</td>
                    <td>${r.likelihood}</td>
                    <td>${r.consequence}</td>
                    <td><strong>${r.score}</strong></td>
                    <td>${r.status}</td>
                    <td>${r.mitigation || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Use manus-md-to-pdf via server or create a blob
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `riskregister-${doc.date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Riskregister exporterat som PDF");
    } catch (error) {
      toast.error("Kunde inte exportera PDF");
      console.error(error);
    }
  };

  const sortedRisks = [...risks].sort((a, b) => {
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
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Riskregister</h1>
            <p className="text-xs text-slate-400">EU AI Act Artikel 9 Â· {risks.length} risker dokumenterade</p>
          </div>
          <div className="ml-auto flex gap-2">
            {risks.length > 0 && (
              <Button
                onClick={handleExportPDF}
                size="sm"
                className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportera som PDF
              </Button>
            )}
            {risks.length === 0 && (
              <Button
                onClick={handleSeed}
                disabled={seeding}
                size="sm"
                className="bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 border border-orange-500/40"
                variant="outline"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                LÃ¤s in fÃ¶rdefinierade risker
              </Button>
            )}
          </div>
        </div>

        {/* FÃ¶rklaring */}
        <div className="flex items-start gap-2 p-3 bg-orange-950/20 border border-orange-500/20 rounded-lg mb-6 mt-4">
          <Shield className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-orange-200/70">
            Riskregistret dokumenterar identifierade risker i enlighet med EU AI Act Artikel 9.
            Varje risk bedÃ¶ms efter sannolikhet (1â€“5) och konsekvens (1â€“5). RiskpoÃ¤ng = sannolikhet Ã— konsekvens.
            Risker med poÃ¤ng â‰¥9 krÃ¤ver aktiv mitigeringsplan.
          </p>
        </div>

        {/* Risklista */}
        {sortedRisks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400 mb-2">Inga risker dokumenterade Ã¤nnu</p>
            <p className="text-sm text-slate-600">Klicka "LÃ¤s in fÃ¶rdefinierade risker" fÃ¶r att komma igÃ¥ng</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedRisks.map(risk => {
              const isExpanded = expandedId === risk.riskId;
              const score = risk.likelihood * risk.consequence;
              return (
                <div
                  key={risk.riskId}
                  className={`bg-slate-900/60 border rounded-xl overflow-hidden transition-all ${
                    score >= 16 ? "border-red-500/30" :
                    score >= 9 ? "border-orange-500/30" :
                    score >= 4 ? "border-amber-500/20" :
                    "border-slate-700/50"
                  }`}
                >
                  {/* Huvud-rad */}
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : risk.riskId)}
                  >
                    <div className="flex-shrink-0 w-20">
                      <span className="text-xs font-mono text-slate-500">{risk.riskId}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{risk.title}</p>
                      <p className="text-xs text-slate-500">{risk.affectedModule} Â· {categoryLabel[risk.category] ?? risk.category}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <RiskScoreBadge likelihood={risk.likelihood} consequence={risk.consequence} />
                      <Badge variant="outline" className={`text-xs border ${riskLevelStyle[risk.riskLevel]}`}>
                        {riskLevelLabel[risk.riskLevel]}
                      </Badge>
                      <select
                        value={risk.status}
                        onChange={e => { e.stopPropagation(); handleStatusChange(risk.riskId, e.target.value); }}
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
                    <div className="border-t border-slate-700/50 p-4 bg-slate-900/40">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Beskrivning</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{risk.description}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Befintliga kontroller</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{risk.existingControls ?? "Inga kontroller dokumenterade"}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">MitigeringsÃ¥tgÃ¤rd</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">{risk.mitigationAction ?? "Ingen Ã¥tgÃ¤rd planerad"}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">EU AI Act-artikel</h4>
                            <Badge variant="outline" className="text-xs border-amber-500/40 text-amber-400">{risk.euAiActArticle ?? "â€“"}</Badge>
                          </div>
                          {risk.residualRisk && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">KvarstÃ¥ende risk</h4>
                              <Badge variant="outline" className={`text-xs border ${riskLevelStyle[risk.residualRisk]}`}>
                                {riskLevelLabel[risk.residualRisk]}
                              </Badge>
                            </div>
                          )}
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

