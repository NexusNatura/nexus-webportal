/**
 * AgentReview.tsx — Admin-granskningspanel för Nexus-OS Agentmarknaden
 * Tillgänglig på /operator/agent-review (kräver admin-roll)
 * Design: Cyberpunk Terminal / Dark Ops Intelligence Center
 */

import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  Eye,
  Shield,
  Tag,
  Zap,
  Star,
  RefreshCw,
  User,
  FileText,
  Code,
  DollarSign,
} from "lucide-react";

// â”€â”€â”€ Risk class badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, { label: string; color: string }> = {
    minimal: { label: "Minimal risk", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
    limited: { label: "Begränsad risk", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30" },
    high: { label: "Hög risk", color: "text-red-400 bg-red-400/10 border-red-400/30" },
  };
  const r = map[risk] ?? { label: risk, color: "text-gray-400 bg-gray-400/10 border-gray-400/30" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${r.color}`}>
      <Shield className="w-3 h-3" />
      {r.label}
    </span>
  );
}

// â”€â”€â”€ Category badge â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CategoryBadge({ cat }: { cat: string }) {
  const map: Record<string, string> = {
    grants: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    compliance: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    dpp: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    symbiosis: "text-teal-400 bg-teal-400/10 border-teal-400/30",
    design: "text-pink-400 bg-pink-400/10 border-pink-400/30",
    circular: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  };
  const color = map[cat] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Tag className="w-3 h-3" />
      {cat}
    </span>
  );
}

// â”€â”€â”€ Agent detail panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AgentDetailPanel({ agent, onClose, onApprove, onReject, isApproving, isRejecting }: {
  agent: NonNullable<ReturnType<typeof useAgentList>[number]>;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const capabilities = Array.isArray(agent.capabilities) ? agent.capabilities as string[] : [];
  const useCases = Array.isArray(agent.useCases) ? agent.useCases as string[] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
        style={{ background: "#0a0e14", borderColor: "#00ff9d33" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#00ff9d22" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#00ff9d15" }}>
              <Bot className="w-5 h-5" style={{ color: "#00ff9d" }} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">{agent.name}</h2>
              <p className="text-xs" style={{ color: "#00ff9d80" }}>/{agent.slug}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <RiskBadge risk={agent.riskClass} />
            <CategoryBadge cat={agent.category} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border text-gray-400 bg-gray-400/10 border-gray-400/30">
              <Shield className="w-3 h-3" />
              {agent.securityLevel}
            </span>
          </div>

          {/* Tagline */}
          <div>
            <p className="text-sm text-gray-300 italic">"{agent.tagline}"</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00ff9d80" }}>
              <FileText className="w-3 h-3 inline mr-1" />Beskrivning
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">{agent.description}</p>
          </div>

          {/* Capabilities */}
          {capabilities.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00ff9d80" }}>
                <Zap className="w-3 h-3 inline mr-1" />Kapabiliteter
              </h3>
              <div className="flex flex-wrap gap-2">
                {capabilities.map((cap) => (
                  <span key={cap} className="px-2 py-1 rounded-lg text-xs text-gray-300 border border-white/10 bg-white/5">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Use cases */}
          {useCases.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00ff9d80" }}>
                <Star className="w-3 h-3 inline mr-1" />Användningsfall
              </h3>
              <ul className="space-y-1">
                {useCases.map((uc) => (
                  <li key={uc} className="text-sm text-gray-300 flex items-start gap-2">
                    <span style={{ color: "#00ff9d" }}>”º</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* System prompt preview */}
          {agent.systemPrompt && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00ff9d80" }}>
                <Code className="w-3 h-3 inline mr-1" />System-prompt (förhandsgranskning)
              </h3>
              <div
                className="rounded-lg p-3 text-xs font-mono text-gray-400 max-h-32 overflow-y-auto"
                style={{ background: "#0d1117", border: "1px solid #ffffff15" }}
              >
                {agent.systemPrompt.slice(0, 500)}{agent.systemPrompt.length > 500 ? "..." : ""}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#00ff9d80" }}>
              <DollarSign className="w-3 h-3 inline mr-1" />Prissättning
            </h3>
            <div className="flex gap-4">
              {agent.pricePerTaskOre && (
                <div className="text-sm text-gray-300">
                  Per uppgift: <span className="text-white font-semibold">{(agent.pricePerTaskOre / 100).toLocaleString("sv-SE")} SEK</span>
                </div>
              )}
              {agent.priceMonthlyOre && (
                <div className="text-sm text-gray-300">
                  Månadsvis: <span className="text-white font-semibold">{(agent.priceMonthlyOre / 100).toLocaleString("sv-SE")} SEK/mån</span>
                </div>
              )}
            </div>
          </div>

          {/* Creator info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3 h-3" />
            Skapad av användare #{agent.creatorId ?? "Nexus-OS"} Â· {new Date(agent.createdAt).toLocaleDateString("sv-SE")}
          </div>
        </div>

        {/* Action footer */}
        <div className="p-6 border-t space-y-3" style={{ borderColor: "#00ff9d22" }}>
          {!showRejectForm ? (
            <div className="flex gap-3">
              <Button
                className="flex-1 font-semibold"
                disabled={isApproving}
                style={{ background: "#00ff9d", color: "#0a0e14" }}
                onClick={onApprove}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isApproving ? "Godkänner..." : "Godkänn & Publicera"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-semibold"
                disabled={isRejecting}
                style={{ borderColor: "#ff3b5c", color: "#ff3b5c", background: "transparent" }}
                onClick={() => setShowRejectForm(true)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Avvisa
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                className="w-full rounded-lg p-3 text-sm text-gray-300 resize-none"
                style={{ background: "#0d1117", border: "1px solid #ff3b5c40", outline: "none" }}
                placeholder="Anledning till avvisning (valfritt)..."
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  className="flex-1 font-semibold"
                  disabled={isRejecting}
                  style={{ background: "#ff3b5c", color: "white" }}
                  onClick={() => onReject(rejectReason || undefined)}
                >
                  {isRejecting ? "Avvisar..." : "Bekräfta avvisning"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: "#ffffff20", color: "#aaa", background: "transparent" }}
                  onClick={() => setShowRejectForm(false)}
                >
                  Avbryt
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Type helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type AgentItem = {
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
  capabilities: unknown;
  useCases: unknown;
  benchmarkScore: number | null;
  avgResponseTimeSec: number | null;
  status: string;
  isOfficial: boolean;
  purchaseCount: number;
  iconName: string;
  accentColor: string;
  creatorId: number | null;
  systemPrompt: string | null;
  trainingNotes: string | null;
  reviewStatus: string;
  createdAt: Date;
  updatedAt: Date;
};

function useAgentList() {
  return [] as AgentItem[];
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AgentReview() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedAgent, setSelectedAgent] = useState<AgentItem | null>(null);

  const { data: pendingAgents = [], refetch, isLoading } = trpc.agents.listPending.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  const approveMutation = trpc.agents.publishAgent.useMutation({
    onSuccess: () => {
      toast.success("âœ… Agenten har godkänts och publicerats på marknadsplatsen!");
      setSelectedAgent(null);
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const rejectMutation = trpc.agents.rejectAgent.useMutation({
    onSuccess: () => {
      toast.success("Agenten har avvisats.");
      setSelectedAgent(null);
      refetch();
    },
    onError: (err: any) => toast.error(err.message),
  });

  // Auth guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e14" }}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "#00ff9d" }} />
          <p className="text-gray-400">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e14" }}>
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: "#ff3b5c" }} />
          <h1 className="text-2xl font-bold text-white mb-2">Åtkomst nekad</h1>
          <p className="text-gray-400 mb-6">Den här sidan kräver administratörsbehörighet.</p>
          <Link href="/operator">
            <Button style={{ background: "#00ff9d", color: "#0a0e14" }}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Tillbaka till Operator
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0e14", color: "#e0e6f0" }}>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: "#00ff9d22", background: "#0d1117" }}>
        <div className="flex items-center gap-4">
          <Link href="/operator">
            <button className="flex items-center gap-1 text-sm transition-colors hover:text-white" style={{ color: "#00ff9d80" }}>
              <ChevronLeft className="w-4 h-4" />
              Operator
            </button>
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" style={{ color: "#00ff9d" }} />
            <h1 className="font-bold text-white">Agent-granskningspanel</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{ borderColor: "#ffb80040", color: "#ffb800", background: "#ffb80010" }}
          >
            <Clock className="w-3 h-3" />
            {pendingAgents.length} väntar granskning
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "#00ff9d80" }}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Väntar granskning", value: pendingAgents.length, color: "#ffb800", icon: Clock },
            { label: "Granskade idag", value: 0, color: "#00ff9d", icon: CheckCircle2 },
            { label: "Avvisade totalt", value: 0, color: "#ff3b5c", icon: XCircle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl p-4 border"
              style={{ background: "#0d1117", borderColor: "#ffffff10" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{label}</span>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Agent queue */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: "#00ff9d" }} />
            <h2 className="font-bold text-white">Granskningskö</h2>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: "#00ff9d" }} />
              <p className="text-gray-400">Hämtar agenter...</p>
            </div>
          ) : pendingAgents.length === 0 ? (
            <div
              className="rounded-2xl border p-12 text-center"
              style={{ background: "#0d1117", borderColor: "#ffffff10" }}
            >
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "#00ff9d" }} />
              <h3 className="text-lg font-bold text-white mb-2">Granskningskön är tom</h3>
              <p className="text-gray-400 text-sm">
                Inga agenter väntar på granskning just nu. Bra jobbat!
              </p>
              <p className="text-gray-500 text-xs mt-3">
                Nya agenter visas här när användare skickar in dem via AgentBuilder.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(pendingAgents as AgentItem[]).map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-xl border p-5 transition-all duration-200 hover:border-opacity-50 cursor-pointer"
                  style={{ background: "#0d1117", borderColor: "#ffffff15" }}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "#00ff9d15", border: "1px solid #00ff9d30" }}
                      >
                        <Bot className="w-5 h-5" style={{ color: "#00ff9d" }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-white">{agent.name}</h3>
                          <span className="text-xs text-gray-500">/{agent.slug}</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{agent.tagline}</p>
                        <div className="flex flex-wrap gap-2">
                          <RiskBadge risk={agent.riskClass} />
                          <CategoryBadge cat={agent.category} />
                          {agent.pricePerTaskOre && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border text-gray-400 bg-gray-400/10 border-gray-400/30">
                              {(agent.pricePerTaskOre / 100).toLocaleString("sv-SE")} SEK/uppgift
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border"
                        style={{ borderColor: "#ffb80040", color: "#ffb800", background: "#ffb80010" }}
                      >
                        <Clock className="w-3 h-3" />
                        Väntar
                      </div>
                      <Button
                        size="sm"
                        className="text-xs font-semibold"
                        style={{ background: "#00ff9d20", color: "#00ff9d", border: "1px solid #00ff9d40" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAgent(agent);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Granska
                      </Button>
                    </div>
                  </div>

                  {/* Submitted date */}
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-gray-600" style={{ borderColor: "#ffffff08" }}>
                    <User className="w-3 h-3" />
                    Inlämnad {new Date(agent.createdAt).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" })}
                    {agent.creatorId && ` Â· Skapad av användare #${agent.creatorId}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EU AI Act compliance note */}
        <div
          className="mt-8 rounded-xl border p-4 flex items-start gap-3"
          style={{ background: "#0d1117", borderColor: "#00ff9d22" }}
        >
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#00ff9d" }} />
          <div>
            <p className="text-sm font-semibold text-white mb-1">EU AI Act – Artikel 14 (HITL)</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Alla agenter som publiceras på Nexus-OS Agentmarknaden granskas manuellt av en HITL-operatör
              (Human-in-the-Loop) i enlighet med EU AI Act Artikel 14. Granskningen inkluderar riskklassificering,
              systempromptkontroll och verifiering av att agenten uppfyller Nexus-OS säkerhetspolicyer.
            </p>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedAgent && (
        <AgentDetailPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onApprove={() => approveMutation.mutate({ agentId: selectedAgent.id })}
          onReject={(reason) => rejectMutation.mutate({ agentId: selectedAgent.id, reason })}
          isApproving={approveMutation.isPending}
          isRejecting={rejectMutation.isPending}
        />
      )}
    </div>
  );
}

