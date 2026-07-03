/*
 * NEXUS-OS Company Profile Page – Personaliserad handlingsplan
 * Design: Nordic Sustainability Intelligence
 */

import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2, ArrowRight, CheckCircle2, Zap, FileText,
  Search, Recycle, Euro, Leaf, ChevronRight, Star
} from "lucide-react";

const industries = [
  "Tillverkning & Industri",
  "Hantverk & Design",
  "Reparation & Återbruk",
  "Livsmedel & Dryck",
  "Bygg & Fastighet",
  "Teknik & IT",
  "Handel & Logistik",
  "Utbildning & Tjänster",
];

const sizes = [
  { label: "Mikroföretag (1–9 anst.)", value: "micro" },
  { label: "Litet företag (10–49 anst.)", value: "small" },
  { label: "Medelstort företag (50–249 anst.)", value: "medium" },
  { label: "Startup (< 3 år)", value: "startup" },
];

const challenges = [
  { id: "espr", label: "EU:s ESPR/DPP-krav 2026", icon: FileText },
  { id: "co2", label: "Minska COâ‚‚-utsläpp", icon: Leaf },
  { id: "grants", label: "Hitta finansiering", icon: Euro },
  { id: "circular", label: "Cirkulär omställning", icon: Recycle },
  { id: "digital", label: "Digitalisering", icon: Zap },
  { id: "lca", label: "LCA & hållbarhetsrapport", icon: Star },
];

interface ProfileResult {
  grants: { name: string; match: number; amount: string }[];
  actions: string[];
  dppNeeded: boolean;
  urgency: "Hög" | "Medel" | "Låg";
}

function generateProfile(industry: string, size: string, selected: string[]): ProfileResult {
  const grants = [];
  const actions = [];

  if (selected.includes("espr") || selected.includes("circular")) {
    grants.push({ name: "Vinnova Cirkulära Produktflöden", match: 91, amount: "2–10 MSEK" });
    grants.push({ name: "Klimatklivet", match: 87, amount: "Upp till 2,5 MSEK" });
    actions.push("Skapa Digitalt Produktpass för era tre viktigaste produkter");
    actions.push("Genomför LCA-analys för att kartlägga COâ‚‚-fotavtryck");
  }
  if (selected.includes("grants") || size === "micro" || size === "startup") {
    grants.push({ name: "Almi Verifieringsmedel", match: 94, amount: "50–250 000 SEK" });
    actions.push("Boka möte med Almi Väst för verifieringsmedel (kostnadsfritt)");
  }
  if (selected.includes("co2")) {
    grants.push({ name: "Klimatklivet", match: 89, amount: "Upp till 2,5 MSEK" });
    actions.push("Dokumentera nuvarande energiförbrukning och utsläpp");
  }
  if (size === "startup") {
    grants.push({ name: "Vinnova Innovativa Startups", match: 85, amount: "300 000 SEK" });
    actions.push("Utforska finansieringsmöjligheter via Almi och Vinnova");
  }
  if (selected.includes("lca") || selected.includes("espr")) {
    actions.push("Kör: nexus 'generate dpp' i NexusCore Terminal");
  }
  actions.push("Kontakta Nexus-OS för en kostnadsfri genomgång av din handlingsplan");

  const uniqueGrants = grants.filter((g, i, arr) => arr.findIndex(x => x.name === g.name) === i);
  const urgency: "Hög" | "Medel" | "Låg" = selected.includes("espr") ? "Hög" : selected.length >= 3 ? "Medel" : "Låg";

  return {
    grants: uniqueGrants.slice(0, 4),
    actions: Array.from(new Set(actions)).slice(0, 5),
    dppNeeded: selected.includes("espr") || industry.includes("Tillverkning") || industry.includes("Hantverk"),
    urgency,
  };
}

export default function CompanyProfile() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const [generating, setGenerating] = useState(false);

  const toggleChallenge = (id: string) => {
    setSelectedChallenges(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    if (!companyName || !industry || !size) {
      toast.error("Fyll i alla fält innan du fortsätter");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setResult(generateProfile(industry, size, selectedChallenges));
      setGenerating(false);
      setStep(4);
    }, 1800);
  };

  return (
    <Layout title="Företagsprofil" subtitle="Generera din personaliserade handlingsplan">
      <div className="bg-white border-b border-border px-4 lg:px-8 py-5">
        <div className="flex items-center gap-2 max-w-2xl">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s
                    ? "bg-[oklch(0.28_0.08_155)] text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 4 && <div className={`h-px w-8 ${step > s ? "bg-[oklch(0.28_0.08_155)]" : "bg-border"}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {step === 1 && "Grundinformation"}
            {step === 2 && "Storlek & Bransch"}
            {step === 3 && "Utmaningar"}
            {step === 4 && "Din handlingsplan"}
          </span>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {step === 1 && (
          <div className="animate-fade-in-up">
            <div className="nexus-section-divider mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Berätta om ditt företag
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Nexus-OS analyserar din situation och genererar en personaliserad handlingsplan med rätt bidrag och åtgärder.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Företagsnamn</label>
                <input
                  type="text"
                  placeholder="t.ex. Reparatörn KB"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[oklch(0.28_0.08_155_/_0.30)] focus:border-[oklch(0.28_0.08_155)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ort / Region</label>
                <input
                  type="text"
                  placeholder="t.ex. Töreboda, Skaraborg"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[oklch(0.28_0.08_155_/_0.30)] focus:border-[oklch(0.28_0.08_155)]"
                />
              </div>
            </div>
            <Button
              className="mt-6 bg-[oklch(0.28_0.08_155)] text-white gap-2"
              onClick={() => { if (companyName) setStep(2); else toast.error("Ange företagsnamn"); }}
            >
              Fortsätt <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up">
            <div className="nexus-section-divider mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Bransch och storlek
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">Välj det som bäst beskriver {companyName}.</p>

            <div className="mb-5">
              <label className="block text-sm font-medium text-foreground mb-3">Bransch</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`px-3 py-2.5 rounded-lg text-sm text-left border transition-all ${
                      industry === ind
                        ? "bg-[oklch(0.28_0.08_155)] text-white border-[oklch(0.28_0.08_155)]"
                        : "border-border text-foreground hover:border-[oklch(0.28_0.08_155_/_0.40)] hover:bg-[oklch(0.28_0.08_155_/_0.05)]"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">Företagsstorlek</label>
              <div className="space-y-2">
                {sizes.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSize(s.value)}
                    className={`w-full px-4 py-3 rounded-lg text-sm text-left border transition-all flex items-center gap-3 ${
                      size === s.value
                        ? "bg-[oklch(0.28_0.08_155)] text-white border-[oklch(0.28_0.08_155)]"
                        : "border-border text-foreground hover:border-[oklch(0.28_0.08_155_/_0.40)] hover:bg-[oklch(0.28_0.08_155_/_0.05)]"
                    }`}
                  >
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Tillbaka</Button>
              <Button
                className="bg-[oklch(0.28_0.08_155)] text-white gap-2"
                onClick={() => { if (industry && size) setStep(3); else toast.error("Välj bransch och storlek"); }}
              >
                Fortsätt <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in-up">
            <div className="nexus-section-divider mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              Vilka är era utmaningar?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">Välj alla som stämmer – ju fler, desto mer träffsäker handlingsplan.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {challenges.map(c => {
                const Icon = c.icon;
                const isSelected = selectedChallenges.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChallenge(c.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "bg-[oklch(0.28_0.08_155)] text-white border-[oklch(0.28_0.08_155)] shadow-md"
                        : "border-border text-foreground hover:border-[oklch(0.28_0.08_155_/_0.40)] hover:bg-[oklch(0.28_0.08_155_/_0.05)]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-white" : "text-[oklch(0.28_0.08_155)]"}`} />
                    <div className="text-sm font-medium">{c.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Tillbaka</Button>
              <Button
                className="bg-[oklch(0.62_0.12_55)] text-white gap-2"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>Analyserar med AI...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Generera handlingsplan</>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[oklch(0.28_0.08_155)] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>
                  Handlingsplan för {companyName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    result.urgency === "Hög" ? "bg-red-100 text-red-700" :
                    result.urgency === "Medel" ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    Prioritet: {result.urgency}
                  </span>
                  {result.dppNeeded && (
                    <span className="nexus-badge-copper">DPP krävs 2026</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended grants */}
            <div className="nexus-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-[oklch(0.28_0.08_155)]" />
                <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>
                  Rekommenderade bidrag
                </h3>
              </div>
              <div className="space-y-3">
                {result.grants.map((g, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.28_0.08_155_/_0.08)] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[oklch(0.28_0.08_155)]" style={{ fontFamily: "'Fraunces', serif" }}>{g.match}%</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{g.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Euro className="w-3 h-3" />{g.amount}
                      </div>
                    </div>
                    <div className="nexus-progress-bar w-20">
                      <div className="nexus-progress-fill" style={{ width: `${g.match}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action steps */}
            <div className="nexus-card p-5 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-5 h-5 text-[oklch(0.62_0.12_55)]" />
                <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Fraunces', serif" }}>
                  Nästa 30 dagar
                </h3>
              </div>
              <ol className="space-y-3">
                {result.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[oklch(0.62_0.12_55)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-sm text-foreground">{action}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-[oklch(0.28_0.08_155)] text-white gap-2"
                onClick={() => {
                  toast.success("Handlingsplan exporterad!", {
                    description: "Öppna NexusCore Terminal och kör: nexus 'scan bidrag' -Profil '" + companyName + "'",
                  });
                }}
              >
                <FileText className="w-4 h-4" />
                Exportera plan
              </Button>
              <Button
                variant="outline"
                onClick={() => { setStep(1); setResult(null); setCompanyName(""); setIndustry(""); setSize(""); setSelectedChallenges([]); }}
              >
                Ny analys
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

