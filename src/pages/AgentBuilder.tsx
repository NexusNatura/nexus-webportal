/**
 * AgentBuilder â€“ Nexus-OS
 * 5-step wizard for creating, configuring, EU AI Act-classifying and publishing agents
 * on the Nexus-OS Agent Marketplace.
 *
 * Steps:
 *  1. Grundinfo       â€“ name, slug, tagline, category, icon, color
 *  2. Kapabiliteter   â€“ description, capabilities, use cases, system prompt
 *  3. EU AI Act       â€“ AI-assisted risk classification (classifyRisk)
 *  4. PrissÃ¤ttning    â€“ pricing model, per-task price, monthly price
 *  5. FÃ¶rhandsvisning â€“ review all data, submit for review
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Bot,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Shield,
  DollarSign,
  Eye,
  Loader2,
  Plus,
  X,
  Zap,
  Search,
  Recycle,
  ShieldCheck,
  FileText,
  Palette,
  TrendingUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { getLoginUrl } from "@/const";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Category = "grants" | "compliance" | "dpp" | "symbiosis" | "design" | "circular";
type PricingModel = "per_task" | "monthly" | "both";
type RiskClass = "minimal" | "limited" | "high";
type SecurityLevel = "open" | "standard" | "high_a" | "high_b";

interface DraftData {
  name?: string;
  slug?: string;
  tagline?: string;
  category?: Category;
  iconName?: string;
  accentColor?: string;
  description?: string;
  capabilities?: string[];
  useCases?: string[];
  systemPrompt?: string;
  trainingNotes?: string;
  riskClass?: RiskClass;
  securityLevel?: SecurityLevel;
  aiJustification?: string;
  aiRelevantArticles?: string[];
  aiRecommendations?: string[];
  pricingModel?: PricingModel;
  pricePerTaskOre?: number;
  priceMonthlyOre?: number;
  benchmarkScore?: number;
  avgResponseTimeSec?: number;
}

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: "grants", label: "Bidrag & EU-finansiering", icon: <Search className="w-4 h-4" /> },
  { value: "compliance", label: "Regelefterlevnad", icon: <ShieldCheck className="w-4 h-4" /> },
  { value: "dpp", label: "Digitalt Produktpass", icon: <FileText className="w-4 h-4" /> },
  { value: "symbiosis", label: "Industriell Symbios", icon: <Recycle className="w-4 h-4" /> },
  { value: "design", label: "Design & UX", icon: <Palette className="w-4 h-4" /> },
  { value: "circular", label: "CirkulÃ¤r Ekonomi", icon: <TrendingUp className="w-4 h-4" /> },
];

const ICONS = [
  { name: "Bot", icon: <Bot className="w-5 h-5" /> },
  { name: "Search", icon: <Search className="w-5 h-5" /> },
  { name: "ShieldCheck", icon: <ShieldCheck className="w-5 h-5" /> },
  { name: "FileText", icon: <FileText className="w-5 h-5" /> },
  { name: "Recycle", icon: <Recycle className="w-5 h-5" /> },
  { name: "Palette", icon: <Palette className="w-5 h-5" /> },
  { name: "TrendingUp", icon: <TrendingUp className="w-5 h-5" /> },
  { name: "Zap", icon: <Zap className="w-5 h-5" /> },
  { name: "Sparkles", icon: <Sparkles className="w-5 h-5" /> },
];

const ACCENT_COLORS = [
  { value: "text-emerald-400", label: "GrÃ¶n", bg: "bg-emerald-400" },
  { value: "text-blue-400", label: "BlÃ¥", bg: "bg-blue-400" },
  { value: "text-amber-400", label: "Gul", bg: "bg-amber-400" },
  { value: "text-purple-400", label: "Lila", bg: "bg-purple-400" },
  { value: "text-teal-400", label: "Teal", bg: "bg-teal-400" },
  { value: "text-rose-400", label: "Rosa", bg: "bg-rose-400" },
  { value: "text-cyan-400", label: "Cyan", bg: "bg-cyan-400" },
  { value: "text-orange-400", label: "Orange", bg: "bg-orange-400" },
];

const RISK_LABELS: Record<RiskClass, { label: string; color: string; desc: string }> = {
  minimal: { label: "Minimal risk", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", desc: "Inga specifika EU AI Act-krav utÃ¶ver transparens." },
  limited: { label: "BegrÃ¤nsad risk", color: "text-amber-400 border-amber-400/30 bg-amber-400/10", desc: "KrÃ¤ver transparensdeklaration (Art. 50) och grundlÃ¤ggande dokumentation." },
  high: { label: "HÃ¶g risk", color: "text-rose-400 border-rose-400/30 bg-rose-400/10", desc: "KrÃ¤ver fullstÃ¤ndig riskbedÃ¶mning, DPIA, mÃ¤nsklig tillsyn (Art. 14) och CE-mÃ¤rkning." },
};

const SECURITY_LABELS: Record<SecurityLevel, string> = {
  open: "Ã–ppen (inga restriktioner)",
  standard: "Standard (grundlÃ¤ggande Ã¥tkomstkontroll)",
  high_a: "HÃ¶g A (autentisering + loggning)",
  high_b: "HÃ¶g B (fullstÃ¤ndig revision + HITL)",
};

const STEPS = [
  { id: 1, label: "Grundinfo", icon: <Bot className="w-4 h-4" /> },
  { id: 2, label: "Kapabiliteter", icon: <Sparkles className="w-4 h-4" /> },
  { id: 3, label: "EU AI Act", icon: <Shield className="w-4 h-4" /> },
  { id: 4, label: "PrissÃ¤ttning", icon: <DollarSign className="w-4 h-4" /> },
  { id: 5, label: "FÃ¶rhandsvisning", icon: <Eye className="w-4 h-4" /> },
];

// â”€â”€â”€ Helper: auto-generate slug â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/Ã¥/g, "a").replace(/Ã¤/g, "a").replace(/Ã¶/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function AgentBuilder() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [data, setData] = useState<DraftData>({
    iconName: "Bot",
    accentColor: "text-emerald-400",
    capabilities: [],
    useCases: [],
  });
  const [newCapability, setNewCapability] = useState("");
  const [newUseCase, setNewUseCase] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // tRPC mutations
  const createDraft = trpc.agents.createDraft.useMutation();
  const updateDraft = trpc.agents.updateDraft.useMutation();
  const classifyRisk = trpc.agents.classifyRisk.useMutation();
  const submitForReview = trpc.agents.submitForReview.useMutation();

  // Auto-create draft on mount (once user is loaded)
  useEffect(() => {
    if (!user || draftId) return;
    createDraft.mutate(undefined, {
      onSuccess: (res) => setDraftId(res.draftId),
      onError: () => toast.error("Kunde inte skapa utkast. FÃ¶rsÃ¶k igen."),
    });
  }, [user]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && data.name) {
      setData((prev) => ({ ...prev, slug: toSlug(data.name!) }));
    }
  }, [data.name, slugManuallyEdited]);

  const updateField = useCallback(<K extends keyof DraftData>(key: K, value: DraftData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveAndAdvance = async (nextStep: number) => {
    if (!draftId) return;
    try {
      await updateDraft.mutateAsync({ draftId, step: nextStep, data });
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Kunde inte spara steget.");
    }
  };

  const handleClassifyRisk = async () => {
    if (!data.name || !data.description || !data.category) {
      toast.error("Fyll i namn, beskrivning och kategori i steg 1 och 2 fÃ¶rst.");
      return;
    }
    try {
      const result = await classifyRisk.mutateAsync({
        name: data.name,
        description: data.description,
        capabilities: data.capabilities ?? [],
        category: data.category,
      });
      setData((prev) => ({
        ...prev,
        riskClass: result.riskClass,
        securityLevel: result.securityLevel,
        aiJustification: result.justification,
        aiRelevantArticles: result.relevantArticles,
        aiRecommendations: result.recommendations,
      }));
      toast.success("EU AI Act-klassificering klar!");
    } catch {
      toast.error("Klassificering misslyckades. FÃ¶rsÃ¶k igen.");
    }
  };

  const handleSubmit = async () => {
    if (!draftId) return;
    try {
      await updateDraft.mutateAsync({ draftId, step: 5, data });
      const result = await submitForReview.mutateAsync({ draftId });
      toast.success(`Agenten "${data.name}" har skickats in fÃ¶r granskning!`);
      navigate(`/agenter`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "InlÃ¤mning misslyckades.");
    }
  };

  // â”€â”€â”€ Auth guard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <Bot className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Logga in fÃ¶r att skapa agenter</h2>
            <p className="text-[oklch(0.65_0.02_240)] max-w-md">
              Du behÃ¶ver ett Nexus-OS-konto fÃ¶r att publicera agenter pÃ¥ marknaden.
            </p>
          </div>
          <Button
            className="bg-emerald-500 hover:bg-emerald-400 text-white"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Logga in
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[oklch(0.08_0.01_240)] py-8 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Skapa ny agent</h1>
                <p className="text-sm text-[oklch(0.55_0.02_240)]">Publicera pÃ¥ Nexus-OS Agentmarknaden</p>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    currentStep === step.id
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : currentStep > step.id
                      ? "text-emerald-400/70 cursor-pointer hover:text-emerald-400"
                      : "text-[oklch(0.45_0.02_240)] cursor-not-allowed"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.id}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[oklch(0.35_0.02_240)] mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* â”€â”€ STEP 1: Grundinfo â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {currentStep === 1 && (
            <Card className="bg-[oklch(0.12_0.01_240)] border-[oklch(0.2_0.02_240)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  Steg 1 â€“ Grundinformation
                </CardTitle>
                <p className="text-sm text-[oklch(0.55_0.02_240)]">
                  Definiera agentens identitet och kategori.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    Agentnamn <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    value={data.name ?? ""}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="t.ex. Grant-Gamma Pro"
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    Slug (URL-identifierare) <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    value={data.slug ?? ""}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }}
                    placeholder="grant-gamma-pro"
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white font-mono text-sm"
                  />
                  <p className="text-xs text-[oklch(0.45_0.02_240)] mt-1">
                    AnvÃ¤nds i URL: /agenter/{data.slug || "din-agent"}
                  </p>
                </div>

                {/* Tagline */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    Tagline <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    value={data.tagline ?? ""}
                    onChange={(e) => updateField("tagline", e.target.value)}
                    placeholder="En mening som beskriver vad agenten gÃ¶r"
                    maxLength={256}
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                  />
                  <p className="text-xs text-[oklch(0.45_0.02_240)] mt-1">{(data.tagline ?? "").length}/256</p>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-2 block">
                    Kategori <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => updateField("category", cat.value)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all text-left ${
                          data.category === cat.value
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.65_0.02_240)] hover:border-[oklch(0.3_0.02_240)]"
                        }`}
                      >
                        {cat.icon}
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-2 block">Ikon</label>
                  <div className="flex flex-wrap gap-2">
                    {ICONS.map((ic) => (
                      <button
                        key={ic.name}
                        onClick={() => updateField("iconName", ic.name)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                          data.iconName === ic.name
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.55_0.02_240)] hover:border-[oklch(0.3_0.02_240)]"
                        }`}
                        title={ic.name}
                      >
                        {ic.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent color */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-2 block">AccentfÃ¤rg</label>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField("accentColor", color.value)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          data.accentColor === color.value
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.55_0.02_240)]"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                        {color.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => {
                      if (!data.name || !data.slug || !data.tagline || !data.category) {
                        toast.error("Fyll i alla obligatoriska fÃ¤lt (*).");
                        return;
                      }
                      saveAndAdvance(2);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white gap-2"
                    disabled={updateDraft.isPending}
                  >
                    {updateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    NÃ¤sta steg <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* â”€â”€ STEP 2: Kapabiliteter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {currentStep === 2 && (
            <Card className="bg-[oklch(0.12_0.01_240)] border-[oklch(0.2_0.02_240)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Steg 2 â€“ Kapabiliteter & Systemprompt
                </CardTitle>
                <p className="text-sm text-[oklch(0.55_0.02_240)]">
                  Beskriv vad agenten kan gÃ¶ra och hur den Ã¤r konfigurerad.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    FullstÃ¤ndig beskrivning <span className="text-rose-400">*</span>
                  </label>
                  <Textarea
                    value={data.description ?? ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Beskriv vad agenten gÃ¶r, vilka problem den lÃ¶ser och fÃ¶r vem den Ã¤r avsedd..."
                    rows={4}
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white resize-none"
                  />
                </div>

                {/* Capabilities */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    Kapabiliteter
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newCapability}
                      onChange={(e) => setNewCapability(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newCapability.trim()) {
                          updateField("capabilities", [...(data.capabilities ?? []), newCapability.trim()]);
                          setNewCapability("");
                        }
                      }}
                      placeholder="t.ex. Riskklassificering"
                      className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (newCapability.trim()) {
                          updateField("capabilities", [...(data.capabilities ?? []), newCapability.trim()]);
                          setNewCapability("");
                        }
                      }}
                      className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(data.capabilities ?? []).map((cap, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-emerald-400/30 text-emerald-400 bg-emerald-400/5 gap-1 pr-1"
                      >
                        {cap}
                        <button
                          onClick={() =>
                            updateField(
                              "capabilities",
                              (data.capabilities ?? []).filter((_, j) => j !== i)
                            )
                          }
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Use cases */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    AnvÃ¤ndningsfall
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newUseCase}
                      onChange={(e) => setNewUseCase(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newUseCase.trim()) {
                          updateField("useCases", [...(data.useCases ?? []), newUseCase.trim()]);
                          setNewUseCase("");
                        }
                      }}
                      placeholder="t.ex. Teknikbolag med AI-produkter"
                      className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (newUseCase.trim()) {
                          updateField("useCases", [...(data.useCases ?? []), newUseCase.trim()]);
                          setNewUseCase("");
                        }
                      }}
                      className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(data.useCases ?? []).map((uc, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-blue-400/30 text-blue-400 bg-blue-400/5 gap-1 pr-1"
                      >
                        {uc}
                        <button
                          onClick={() =>
                            updateField(
                              "useCases",
                              (data.useCases ?? []).filter((_, j) => j !== i)
                            )
                          }
                          className="hover:text-rose-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* System prompt */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    Systemprompt
                    <span className="text-[oklch(0.45_0.02_240)] font-normal ml-2">(valfritt)</span>
                  </label>
                  <Textarea
                    value={data.systemPrompt ?? ""}
                    onChange={(e) => updateField("systemPrompt", e.target.value)}
                    placeholder="Du Ã¤r en expert pÃ¥... Din uppgift Ã¤r att... Du ska alltid..."
                    rows={5}
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-[oklch(0.45_0.02_240)] mt-1">
                    Systemprompt Ã¤r krypterad och visas aldrig fÃ¶r kÃ¶pare.
                  </p>
                </div>

                {/* Training notes */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                    TrÃ¤ningsanteckningar
                    <span className="text-[oklch(0.45_0.02_240)] font-normal ml-2">(valfritt)</span>
                  </label>
                  <Textarea
                    value={data.trainingNotes ?? ""}
                    onChange={(e) => updateField("trainingNotes", e.target.value)}
                    placeholder="Beskriv trÃ¤ningsdata, domÃ¤nkunskap, begrÃ¤nsningar..."
                    rows={3}
                    className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white resize-none"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Tillbaka
                  </Button>
                  <Button
                    onClick={() => {
                      if (!data.description) {
                        toast.error("LÃ¤gg till en beskrivning.");
                        return;
                      }
                      saveAndAdvance(3);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white gap-2"
                    disabled={updateDraft.isPending}
                  >
                    {updateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    NÃ¤sta steg <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* â”€â”€ STEP 3: EU AI Act â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {currentStep === 3 && (
            <Card className="bg-[oklch(0.12_0.01_240)] border-[oklch(0.2_0.02_240)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Steg 3 â€“ EU AI Act-klassificering
                </CardTitle>
                <p className="text-sm text-[oklch(0.55_0.02_240)]">
                  Alla agenter pÃ¥ Nexus-OS Ã¤r EU AI Act-kompatibla vid leverans.
                  LÃ¥t AI klassificera din agent automatiskt.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* AI classify button */}
                <div className="p-4 rounded-xl border border-blue-400/20 bg-blue-400/5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-400 mb-1">AI-assisterad klassificering</p>
                      <p className="text-xs text-[oklch(0.55_0.02_240)] mb-3">
                        Nexus-OS AI analyserar din agent mot EU AI Act (2024/1689) och fÃ¶reslÃ¥r
                        riskklass, sÃ¤kerhetsnivÃ¥ och relevanta artiklar.
                      </p>
                      <Button
                        onClick={handleClassifyRisk}
                        disabled={classifyRisk.isPending}
                        className="bg-blue-500 hover:bg-blue-400 text-white gap-2 text-sm"
                      >
                        {classifyRisk.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        {classifyRisk.isPending ? "Klassificerar..." : "Klassificera automatiskt"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* AI result */}
                {data.riskClass && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${RISK_LABELS[data.riskClass].color}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4" />
                        <span className="font-semibold text-sm">{RISK_LABELS[data.riskClass].label}</span>
                      </div>
                      <p className="text-xs opacity-80">{RISK_LABELS[data.riskClass].desc}</p>
                      {data.aiJustification && (
                        <p className="text-xs mt-2 opacity-70 italic">"{data.aiJustification}"</p>
                      )}
                    </div>

                    {data.aiRelevantArticles && data.aiRelevantArticles.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-[oklch(0.65_0.02_240)] mb-2">Relevanta artiklar:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {data.aiRelevantArticles.map((art, i) => (
                            <Badge key={i} variant="outline" className="border-blue-400/30 text-blue-400 bg-blue-400/5 text-xs">
                              {art}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {data.aiRecommendations && data.aiRecommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-[oklch(0.65_0.02_240)] mb-2">Rekommendationer:</p>
                        <ul className="space-y-1">
                          {data.aiRecommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[oklch(0.6_0.02_240)]">
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual override */}
                <div>
                  <p className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-3">
                    Manuell justering
                    <span className="text-[oklch(0.45_0.02_240)] font-normal ml-2">(valfritt)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[oklch(0.55_0.02_240)] mb-1.5 block">Riskklass</label>
                      <div className="space-y-1.5">
                        {(["minimal", "limited", "high"] as RiskClass[]).map((rc) => (
                          <button
                            key={rc}
                            onClick={() => updateField("riskClass", rc)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                              data.riskClass === rc
                                ? RISK_LABELS[rc].color
                                : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.55_0.02_240)]"
                            }`}
                          >
                            {data.riskClass === rc ? <Check className="w-3 h-3 flex-shrink-0" /> : <div className="w-3 h-3" />}
                            {RISK_LABELS[rc].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[oklch(0.55_0.02_240)] mb-1.5 block">SÃ¤kerhetsnivÃ¥</label>
                      <div className="space-y-1.5">
                        {(["open", "standard", "high_a", "high_b"] as SecurityLevel[]).map((sl) => (
                          <button
                            key={sl}
                            onClick={() => updateField("securityLevel", sl)}
                            className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border text-xs transition-all text-left ${
                              data.securityLevel === sl
                                ? "border-blue-400/40 bg-blue-400/10 text-blue-400"
                                : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.55_0.02_240)]"
                            }`}
                          >
                            {data.securityLevel === sl ? <Check className="w-3 h-3 flex-shrink-0 mt-0.5" /> : <div className="w-3 h-3" />}
                            {SECURITY_LABELS[sl]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Tillbaka
                  </Button>
                  <Button
                    onClick={() => {
                      if (!data.riskClass || !data.securityLevel) {
                        toast.error("Klassificera agenten (automatiskt eller manuellt) innan du fortsÃ¤tter.");
                        return;
                      }
                      saveAndAdvance(4);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white gap-2"
                    disabled={updateDraft.isPending}
                  >
                    {updateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    NÃ¤sta steg <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* â”€â”€ STEP 4: PrissÃ¤ttning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {currentStep === 4 && (
            <Card className="bg-[oklch(0.12_0.01_240)] border-[oklch(0.2_0.02_240)]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  Steg 4 â€“ PrissÃ¤ttning
                </CardTitle>
                <p className="text-sm text-[oklch(0.55_0.02_240)]">
                  VÃ¤lj prismodell och sÃ¤tt priser i SEK. Nexus-OS tar 20% provision.
                </p>
              </CardHeader>
              <CardContent className="space-y-5">

                {/* Pricing model */}
                <div>
                  <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-2 block">
                    Prismodell <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { value: "per_task", label: "Per uppgift", desc: "Kunden betalar per kÃ¶rning" },
                      { value: "monthly", label: "MÃ¥nadsabonnemang", desc: "ObegrÃ¤nsad anvÃ¤ndning" },
                      { value: "both", label: "BÃ¥da", desc: "Kunden vÃ¤ljer modell" },
                    ] as { value: PricingModel; label: string; desc: string }[]).map((pm) => (
                      <button
                        key={pm.value}
                        onClick={() => updateField("pricingModel", pm.value)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          data.pricingModel === pm.value
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                            : "border-[oklch(0.2_0.02_240)] bg-[oklch(0.15_0.01_240)] text-[oklch(0.55_0.02_240)] hover:border-[oklch(0.3_0.02_240)]"
                        }`}
                      >
                        <p className="font-medium text-sm mb-1">{pm.label}</p>
                        <p className="text-xs opacity-70">{pm.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-task price */}
                {(data.pricingModel === "per_task" || data.pricingModel === "both") && (
                  <div>
                    <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                      Pris per uppgift (SEK) <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={1}
                        value={data.pricePerTaskOre ? data.pricePerTaskOre / 100 : ""}
                        onChange={(e) =>
                          updateField("pricePerTaskOre", Math.round(parseFloat(e.target.value || "0") * 100))
                        }
                        placeholder="2500"
                        className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white max-w-[180px]"
                      />
                      <span className="text-sm text-[oklch(0.55_0.02_240)]">SEK</span>
                      {data.pricePerTaskOre ? (
                        <span className="text-xs text-[oklch(0.45_0.02_240)]">
                          Du fÃ¥r: {((data.pricePerTaskOre * 0.8) / 100).toFixed(0)} SEK
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Monthly price */}
                {(data.pricingModel === "monthly" || data.pricingModel === "both") && (
                  <div>
                    <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                      MÃ¥nadsabonnemang (SEK/mÃ¥n) <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={1}
                        value={data.priceMonthlyOre ? data.priceMonthlyOre / 100 : ""}
                        onChange={(e) =>
                          updateField("priceMonthlyOre", Math.round(parseFloat(e.target.value || "0") * 100))
                        }
                        placeholder="1200"
                        className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white max-w-[180px]"
                      />
                      <span className="text-sm text-[oklch(0.55_0.02_240)]">SEK/mÃ¥n</span>
                      {data.priceMonthlyOre ? (
                        <span className="text-xs text-[oklch(0.45_0.02_240)]">
                          Du fÃ¥r: {((data.priceMonthlyOre * 0.8) / 100).toFixed(0)} SEK/mÃ¥n
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Optional performance metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                      Benchmark-poÃ¤ng (0â€“100)
                      <span className="text-[oklch(0.45_0.02_240)] font-normal ml-1">(valfritt)</span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={data.benchmarkScore ?? ""}
                      onChange={(e) =>
                        updateField("benchmarkScore", parseInt(e.target.value || "0"))
                      }
                      placeholder="85"
                      className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[oklch(0.75_0.02_240)] mb-1.5 block">
                      Svarstid (sekunder)
                      <span className="text-[oklch(0.45_0.02_240)] font-normal ml-1">(valfritt)</span>
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={data.avgResponseTimeSec ?? ""}
                      onChange={(e) =>
                        updateField("avgResponseTimeSec", parseInt(e.target.value || "0"))
                      }
                      placeholder="30"
                      className="bg-[oklch(0.15_0.01_240)] border-[oklch(0.22_0.02_240)] text-white"
                    />
                  </div>
                </div>

                {/* Revenue info */}
                <div className="p-3 rounded-lg border border-amber-400/20 bg-amber-400/5 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[oklch(0.6_0.02_240)]">
                    Nexus-OS tar 20% provision pÃ¥ alla fÃ¶rsÃ¤ljningar. Utbetalning sker mÃ¥nadsvis via Stripe Connect.
                    Minimiutbetalning: 500 SEK.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" /> Tillbaka
                  </Button>
                  <Button
                    onClick={() => {
                      if (!data.pricingModel) {
                        toast.error("VÃ¤lj en prismodell.");
                        return;
                      }
                      if (
                        (data.pricingModel === "per_task" || data.pricingModel === "both") &&
                        !data.pricePerTaskOre
                      ) {
                        toast.error("Ange pris per uppgift.");
                        return;
                      }
                      if (
                        (data.pricingModel === "monthly" || data.pricingModel === "both") &&
                        !data.priceMonthlyOre
                      ) {
                        toast.error("Ange mÃ¥nadsabonnemangspris.");
                        return;
                      }
                      saveAndAdvance(5);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white gap-2"
                    disabled={updateDraft.isPending}
                  >
                    {updateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    FÃ¶rhandsvisning <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* â”€â”€ STEP 5: FÃ¶rhandsvisning â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {currentStep === 5 && (
            <div className="space-y-4">
              {/* Preview card */}
              <Card className="bg-[oklch(0.12_0.01_240)] border-[oklch(0.2_0.02_240)] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-400" />
                    Steg 5 â€“ FÃ¶rhandsvisning & Publicering
                  </CardTitle>
                  <p className="text-sm text-[oklch(0.55_0.02_240)]">
                    Granska din agent innan du skickar in fÃ¶r granskning. Nexus-OS-teamet godkÃ¤nner
                    agenter inom 24â€“48 timmar.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Agent preview card */}
                  <div className={`p-5 rounded-xl border border-[oklch(0.22_0.02_240)] bg-[oklch(0.1_0.01_240)]`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-[oklch(0.15_0.01_240)] border border-[oklch(0.22_0.02_240)] flex items-center justify-center flex-shrink-0 ${data.accentColor}`}>
                        <Bot className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-lg font-bold text-white">{data.name || "Agent-namn"}</h3>
                          {data.riskClass && (
                            <Badge variant="outline" className={`text-xs ${RISK_LABELS[data.riskClass].color}`}>
                              {RISK_LABELS[data.riskClass].label}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs border-amber-400/30 text-amber-400 bg-amber-400/5">
                            VÃ¤ntar pÃ¥ granskning
                          </Badge>
                        </div>
                        <p className="text-sm text-[oklch(0.6_0.02_240)] mb-3">{data.tagline || "Tagline"}</p>
                        <p className="text-sm text-[oklch(0.55_0.02_240)] line-clamp-3">{data.description}</p>
                      </div>
                    </div>

                    {(data.capabilities ?? []).length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-[oklch(0.45_0.02_240)] mb-2">Kapabiliteter:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(data.capabilities ?? []).slice(0, 6).map((cap, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-emerald-400/20 text-emerald-400/80">
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-[oklch(0.18_0.02_240)] flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-4 text-xs text-[oklch(0.5_0.02_240)]">
                        {data.pricePerTaskOre && (
                          <span className="font-semibold text-white">
                            {(data.pricePerTaskOre / 100).toLocaleString("sv-SE")} SEK/uppgift
                          </span>
                        )}
                        {data.priceMonthlyOre && (
                          <span className="font-semibold text-white">
                            {(data.priceMonthlyOre / 100).toLocaleString("sv-SE")} SEK/mÃ¥n
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[oklch(0.45_0.02_240)]">
                        Kategori: {CATEGORIES.find((c) => c.value === data.category)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Summary table */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Slug", value: data.slug },
                      { label: "Kategori", value: CATEGORIES.find((c) => c.value === data.category)?.label },
                      { label: "Riskklass", value: data.riskClass ? RISK_LABELS[data.riskClass].label : "â€“" },
                      { label: "SÃ¤kerhetsnivÃ¥", value: data.securityLevel ? SECURITY_LABELS[data.securityLevel] : "â€“" },
                      { label: "Prismodell", value: data.pricingModel },
                      { label: "Kapabiliteter", value: `${(data.capabilities ?? []).length} st` },
                      { label: "AnvÃ¤ndningsfall", value: `${(data.useCases ?? []).length} st` },
                      { label: "Systemprompt", value: data.systemPrompt ? "Ja (krypterad)" : "Nej" },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col gap-0.5">
                        <span className="text-xs text-[oklch(0.45_0.02_240)]">{row.label}</span>
                        <span className="text-sm text-white font-medium">{row.value ?? "â€“"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Warning */}
                  <div className="p-3 rounded-lg border border-amber-400/20 bg-amber-400/5 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[oklch(0.6_0.02_240)]">
                      NÃ¤r du skickar in agenten granskas den av Nexus-OS-teamet. Du fÃ¥r ett meddelande
                      nÃ¤r agenten Ã¤r godkÃ¤nd och publicerad pÃ¥ marknaden. Granskning tar 24â€“48 timmar.
                    </p>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(4)}
                      className="border-[oklch(0.22_0.02_240)] bg-transparent text-[oklch(0.65_0.02_240)] gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" /> Tillbaka
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={submitForReview.isPending}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white gap-2 px-6"
                    >
                      {submitForReview.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {submitForReview.isPending ? "Skickar in..." : "Skicka in fÃ¶r granskning"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

