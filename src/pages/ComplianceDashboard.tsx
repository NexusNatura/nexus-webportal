/**
 * ComplianceDashboard – EU AI Act Efterlevnadsstatus
 * Ger en samlad vy över efterlevnadsstatus mot 2 aug 2026
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  RefreshCw,
  Download,
  BarChart3,
  Eye,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

// Deadline: 2 aug 2026
const DEADLINE = new Date("2026-08-02T00:00:00Z");

function getDaysUntilDeadline() {
  const now = new Date();
  const diff = DEADLINE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const riskLevelColor: Record<string, string> = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
};

const statusColor: Record<string, string> = {
  identified: "text-slate-400 bg-slate-500/10 border-slate-500/30",
  in_progress: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  mitigated: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  verified: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  accepted: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  under_review: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const statusLabel: Record<string, string> = {
  identified: "Identifierad",
  in_progress: "Pågår",
  mitigated: "Mitigerad",
  verified: "Verifierad",
  accepted: "Accepterad",
  under_review: "Under granskning",
};

// Milstolpar mot 2 aug 2026
const MILESTONES = [
  { date: "1 jun 2026", label: "AI-transparensbanner live", done: true, article: "Art. 50" },
  { date: "1 jun 2026", label: "Riskregister upprättat", done: true, article: "Art. 9" },
  { date: "15 jun 2026", label: "Misuse-scenarier dokumenterade", done: true, article: "Art. 9.2b" },
  { date: "1 jul 2026", label: "Systemarkitektur + datadokumentation", done: false, article: "Art. 11" },
  { date: "1 jul 2026", label: "Övervakningsplan (post-market)", done: false, article: "Art. 72" },
  { date: "15 jul 2026", label: "Testprotokoll genomfört", done: false, article: "Art. 9.7" },
  { date: "2 aug 2026", label: "EU-databasregistrering (om högrisk)", done: false, article: "Art. 49" },
];

// Riskmatris – 5x5 heatmap
function RiskHeatmap({ risks }: { risks: { likelihood: number; consequence: number; riskId: string }[] }) {
  const cells: Record<string, string[]> = {};
  risks.forEach(r => {
    const key = `${r.likelihood}-${r.consequence}`;
    if (!cells[key]) cells[key] = [];
    cells[key].push(r.riskId);
  });

  const getCellColor = (l: number, c: number) => {
    const score = l * c;
    if (score >= 16) return "bg-red-500/40 border-red-500/50";
    if (score >= 9) return "bg-orange-500/30 border-orange-500/40";
    if (score >= 4) return "bg-amber-500/20 border-amber-500/30";
    return "bg-emerald-500/10 border-emerald-500/20";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-slate-300">Riskmatris (Sannolikhet Ã— Konsekvens)</span>
      </div>
      <div className="relative">
        {/* Y-axel */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pr-2">
          {[5, 4, 3, 2, 1].map(l => (
            <span key={l} className="text-[10px] text-slate-500 w-4 text-right">{l}</span>
          ))}
        </div>
        {/* Grid */}
        <div className="ml-6 grid grid-cols-5 gap-1">
          {[5, 4, 3, 2, 1].map(l =>
            [1, 2, 3, 4, 5].map(c => {
              const key = `${l}-${c}`;
              const ids = cells[key] ?? [];
              return (
                <div
                  key={key}
                  className={`h-10 rounded border flex items-center justify-center text-[10px] font-mono ${getCellColor(l, c)}`}
                  title={ids.join(", ")}
                >
                  {ids.length > 0 && (
                    <span className="text-white font-bold">{ids.length}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
        {/* X-axel */}
        <div className="ml-6 grid grid-cols-5 gap-1 mt-1">
          {[1, 2, 3, 4, 5].map(c => (
            <span key={c} className="text-[10px] text-slate-500 text-center">{c}</span>
          ))}
        </div>
        <div className="ml-6 text-[10px] text-slate-500 text-center mt-1">Konsekvens â†’</div>
      </div>
      <div className="flex gap-3 mt-2">
        {[
          { color: "bg-emerald-500/20", label: "Låg (1–3)" },
          { color: "bg-amber-500/20", label: "Medel (4–8)" },
          { color: "bg-orange-500/30", label: "Hög (9–15)" },
          { color: "bg-red-500/40", label: "Kritisk (16–25)" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${item.color}`} />
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComplianceDashboard() {
  const [seeding, setSeeding] = useState(false);
  const { data: summary, refetch } = trpc.compliance.summary.useQuery();
  const seedRisks = trpc.compliance.risk.seed.useMutation();
  const seedMisuse = trpc.compliance.misuse.seed.useMutation();

  const daysLeft = getDaysUntilDeadline();
  const completedMilestones = MILESTONES.filter(m => m.done).length;
  const complianceProgress = Math.round((completedMilestones / MILESTONES.length) * 100);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedRisks.mutateAsync();
      await seedMisuse.mutateAsync();
      await refetch();
      toast.success("Fördefinierade risker och misuse-scenarier inlästa");
    } catch {
      toast.error("Kunde inte läsa in seed-data");
    } finally {
      setSeeding(false);
    }
  };

  const hasData = (summary?.totalRisks ?? 0) > 0;

  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0e14] text-slate-100 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">EU AI Act Efterlevnad</h1>
                <p className="text-sm text-slate-400">NexusCore v3.0 Â· Begränsad Risk (Art. 50)</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!hasData && (
              <Button
                onClick={handleSeed}
                disabled={seeding}
                size="sm"
                className="bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40"
                variant="outline"
              >
                {seeding ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                Läs in fördefinierade risker
              </Button>
            )}
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-400 hover:text-slate-200">
              <Download className="w-4 h-4 mr-2" />
              Exportera rapport
            </Button>
          </div>
        </div>

        {/* KPI-rad */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Dagar till deadline",
              value: daysLeft.toString(),
              sub: "2 aug 2026",
              icon: Clock,
              color: daysLeft < 30 ? "text-red-400" : daysLeft < 90 ? "text-amber-400" : "text-emerald-400",
              border: daysLeft < 30 ? "border-red-500/30" : daysLeft < 90 ? "border-amber-500/30" : "border-emerald-500/30",
            },
            {
              label: "Efterlevnadsstatus",
              value: `${complianceProgress}%`,
              sub: `${completedMilestones}/${MILESTONES.length} milstolpar`,
              icon: CheckCircle2,
              color: "text-cyan-400",
              border: "border-cyan-500/30",
            },
            {
              label: "Öppna risker",
              value: (summary?.criticalRisks ?? 0).toString(),
              sub: `${summary?.totalRisks ?? 0} totalt`,
              icon: AlertTriangle,
              color: (summary?.criticalRisks ?? 0) > 0 ? "text-orange-400" : "text-emerald-400",
              border: (summary?.criticalRisks ?? 0) > 0 ? "border-orange-500/30" : "border-emerald-500/30",
            },
            {
              label: "Öppna misuse-scenarier",
              value: (summary?.openMisuse ?? 0).toString(),
              sub: `${summary?.misuse?.length ?? 0} totalt`,
              icon: Eye,
              color: (summary?.openMisuse ?? 0) > 0 ? "text-amber-400" : "text-emerald-400",
              border: (summary?.openMisuse ?? 0) > 0 ? "border-amber-500/30" : "border-emerald-500/30",
            },
          ].map(kpi => (
            <div key={kpi.label} className={`bg-slate-900/60 border ${kpi.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{kpi.label}</span>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`text-3xl font-bold font-mono ${kpi.color}`}>{kpi.value}</div>
              <div className="text-xs text-slate-500 mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Milstolpar */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-semibold text-slate-200">Milstolpar mot 2 aug 2026</h2>
              </div>
              <span className="text-xs text-slate-500">{complianceProgress}% klart</span>
            </div>
            <Progress value={complianceProgress} className="h-1.5 mb-4 bg-slate-800" />
            <div className="space-y-2">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${m.done ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-slate-800/40 border border-slate-700/30"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? "bg-emerald-500/20" : "bg-slate-700/50"}`}>
                    {m.done
                      ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      : <Clock className="w-3 h-3 text-slate-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${m.done ? "text-emerald-300" : "text-slate-400"}`}>{m.label}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-500 px-1.5 py-0">
                      {m.article}
                    </Badge>
                    <span className="text-[10px] text-slate-600">{m.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Riskmatris */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
            {hasData && summary?.risks ? (
              <RiskHeatmap risks={summary.risks} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <BarChart3 className="w-8 h-8 text-slate-600 mb-3" />
                <p className="text-sm text-slate-500">Inga risker inlästa ännu</p>
                <p className="text-xs text-slate-600 mt-1">Klicka "Läs in fördefinierade risker"</p>
              </div>
            )}
          </div>
        </div>

        {/* Snabblänkar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              href: "/compliance/riskregister",
              icon: AlertTriangle,
              title: "Riskregister",
              desc: `${summary?.totalRisks ?? 0} risker dokumenterade Â· Artikel 9`,
              color: "text-orange-400",
              border: "border-orange-500/20 hover:border-orange-500/40",
            },
            {
              href: "/compliance/misuse",
              icon: Eye,
              title: "Misuse-scenarier",
              desc: `${summary?.misuse?.length ?? 0} scenarier Â· Artikel 9.2b`,
              color: "text-amber-400",
              border: "border-amber-500/20 hover:border-amber-500/40",
            },
            {
              href: "/operator",
              icon: Shield,
              title: "AI-transparensbanner",
              desc: "Live i Operator Dashboard Â· Artikel 50",
              color: "text-emerald-400",
              border: "border-emerald-500/20 hover:border-emerald-500/40",
            },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <div className={`bg-slate-900/60 border ${item.border} rounded-xl p-4 cursor-pointer transition-all group`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <div>
                      <div className="text-sm font-medium text-slate-200">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

