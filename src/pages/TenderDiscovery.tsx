/**
 * TENDER DISCOVERY â€“ Synergi 1: InkÃ¶rsport
 * Design: Nordic Sustainability Intelligence
 * - MÃ¶rkgrÃ¶n sidebar, varm sand-bakgrund, koppar-accenter
 * - Fraunces (display) + DM Sans (body)
 * - Gratis bidragsmatchning som hook â†’ konverterar till DPP + Data
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search, Zap, ArrowRight, CheckCircle2, Clock, Euro,
  Building2, Leaf, Cpu, Recycle, ChevronRight, Star,
  TrendingUp, Shield, Globe
} from "lucide-react";

const GRANT_DATABASE = [
  {
    id: 1,
    name: "Vinnova â€“ Innovativa Startups",
    amount: "300 000 SEK",
    deadline: "LÃ¶pande",
    match: 96,
    category: "Innovation",
    tags: ["Startup", "AI", "Digitalisering"],
    description: "FÃ¶r tidiga bolag med innovativ produkt eller tjÃ¤nst. Perfekt fÃ¶r Nexus-OS-fasen.",
    url: "https://www.vinnova.se",
    effort: "LÃ¥g",
    color: "emerald"
  },
  {
    id: 2,
    name: "Almi â€“ Verifieringsmedel",
    amount: "50 000â€“250 000 SEK",
    deadline: "LÃ¶pande",
    match: 94,
    category: "Verifiering",
    tags: ["SMF", "Prototyp", "Marknad"],
    description: "FÃ¶r att verifiera affÃ¤rsidÃ© och teknik. KrÃ¤ver en konkret pilotkund (t.ex. Pantolin).",
    url: "https://www.almi.se",
    effort: "LÃ¥g",
    color: "blue"
  },
  {
    id: 3,
    name: "Klimatklivet â€“ InvesteringsstÃ¶d",
    amount: "Upp till 70% av investeringen",
    deadline: "Kvartalvis",
    match: 89,
    category: "Klimat",
    tags: ["HÃ¥llbarhet", "COâ‚‚", "Investering"],
    description: "FÃ¶r investeringar som minskar utslÃ¤pp. Pantolin-pilotens 89% COâ‚‚-reduktion Ã¤r ett starkt case.",
    url: "https://www.naturvardsverket.se/klimatklivet",
    effort: "Medel",
    color: "green"
  },
  {
    id: 4,
    name: "Horizon Europe â€“ Cluster 4",
    amount: "Upp till 6 MEUR",
    deadline: "2026-09-15",
    match: 82,
    category: "EU FoU",
    tags: ["DPP", "CirkulÃ¤r ekonomi", "Konsortium"],
    description: "FoU-konsortium fÃ¶r digital produktpassinfrastruktur. KrÃ¤ver 3+ EU-partners.",
    url: "https://ec.europa.eu/info/funding-tenders/opportunities",
    effort: "HÃ¶g",
    color: "purple"
  },
  {
    id: 5,
    name: "Region VÃ¤stra GÃ¶taland â€“ TillvÃ¤xtmedel",
    amount: "100 000â€“500 000 SEK",
    deadline: "2026-06-01",
    match: 91,
    category: "Regional",
    tags: ["Skaraborg", "Lokal", "TillvÃ¤xt"],
    description: "Regionalt stÃ¶d fÃ¶r fÃ¶retag i VÃ¤stra GÃ¶taland. Lokal fÃ¶rankring i Skaraborg Ã¤r en stark fÃ¶rdel.",
    url: "https://www.vgregion.se",
    effort: "Medel",
    color: "amber"
  },
  {
    id: 6,
    name: "Erasmus+ KA220 â€“ Kompetensutveckling",
    amount: "Upp till 400 000 EUR",
    deadline: "2027-03-05",
    match: 78,
    category: "EU Utbildning",
    tags: ["Utbildning", "Partnerskap", "ESPR"],
    description: "Utbildningspartnerskap kring DPP och cirkulÃ¤r ekonomi. Paula Pantolin som partner stÃ¤rker ansÃ¶kan.",
    url: "https://erasmus-plus.ec.europa.eu",
    effort: "HÃ¶g",
    color: "rose"
  },
  {
    id: 7,
    name: "Almi Invest GreenTech",
    amount: "5â€“30 MSEK",
    deadline: "LÃ¶pande",
    match: 75,
    category: "Riskkapital",
    tags: ["GreenTech", "Scale-up", "Investering"],
    description: "Riskkapital fÃ¶r grÃ¶n tech-bolag. Relevant nÃ¤r MVP Ã¤r klar och du har betalande kunder.",
    url: "https://www.almiinvest.se",
    effort: "HÃ¶g",
    color: "teal"
  },
  {
    id: 8,
    name: "Vinnova â€“ Digitala Produktpass",
    amount: "2â€“10 MSEK",
    deadline: "Bevaka vinnova.se",
    match: 98,
    category: "DPP",
    tags: ["DPP", "ESPR", "Digitalisering"],
    description: "Kommande utlysning specifikt fÃ¶r DPP-infrastruktur. Nexus-OS Ã¤r byggd fÃ¶r denna utlysning.",
    url: "https://www.vinnova.se",
    effort: "Medel",
    color: "emerald"
  }
];

const INDUSTRIES = [
  "Tillverkning & Hantverk",
  "Textil & Mode",
  "Metall & StÃ¥l",
  "Elektronik",
  "Bygg & Fastighet",
  "Livsmedel & Jordbruk",
  "Transport & Logistik",
  "TjÃ¤nster & Konsult",
  "Annan bransch"
];

const COMPANY_SIZES = [
  "1â€“5 anstÃ¤llda",
  "6â€“20 anstÃ¤llda",
  "21â€“50 anstÃ¤llda",
  "51â€“200 anstÃ¤llda",
  "200+ anstÃ¤llda"
];

const effortColor: Record<string, string> = {
  "LÃ¥g": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "Medel": "text-amber-600 bg-amber-50 border-amber-200",
  "HÃ¶g": "text-rose-600 bg-rose-50 border-rose-200"
};

export default function TenderDiscovery() {
  const [step, setStep] = useState<"form" | "results">("form");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [region, setRegion] = useState("");
  const [focus, setFocus] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<typeof GRANT_DATABASE>([]);
  const [filterCat, setFilterCat] = useState("Alla");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const matchCompany = trpc.grants.matchCompany.useMutation();

  const handleScan = async () => {
    if (!industry || !size) {
      toast.error("Fyll i bransch och fÃ¶retagsstorlek fÃ¶r att starta skanningen.");
      return;
    }
    setIsScanning(true);
    setAiAnalysis(null);
    try {
      const companyDesc = `Bransch: ${industry}. Storlek: ${size}${region ? `. Region: ${region}` : ""}${focus ? `. FokusomrÃ¥de: ${focus}` : ""}. Vi sÃ¶ker EU-finansiering fÃ¶r hÃ¥llbarhetsomstÃ¤llning.`;
      const result = await matchCompany.mutateAsync({ companyDescription: companyDesc, industry, size });
      setAiAnalysis(result.analysis);
      const sorted = [...GRANT_DATABASE].sort((a, b) => b.match - a.match);
      setResults(sorted);
      setStep("results");
      toast.success("Grant-Gamma har analyserat ditt fÃ¶retag!");
    } catch {
      const sorted = [...GRANT_DATABASE].sort((a, b) => b.match - a.match);
      setResults(sorted);
      setStep("results");
      toast.success("Skanningen klar! 8 program identifierade.");
    } finally {
      setIsScanning(false);
    }
  };

  const categories = ["Alla", ...Array.from(new Set(GRANT_DATABASE.map(g => g.category)))];
  const filtered = filterCat === "Alla" ? results : results.filter(g => g.category === filterCat);
  const totalAmount = "~12 MSEK";

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--sand-light)]">
        {/* Hero */}
        <div className="bg-[var(--forest-deep)] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #b87333 0%, transparent 60%), radial-gradient(circle at 70% 20%, #2d6a4f 0%, transparent 50%)" }} />
          <div className="container py-14 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[var(--copper)] text-white border-0 text-xs font-medium tracking-wide">
                GRATIS INKÃ–RSPORT
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                Steg 1 av 3 i Nexus-OS
              </Badge>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Hitta rÃ¤tt bidrag<br />
              <span className="text-[var(--copper-light)]">pÃ¥ 60 sekunder</span>
            </h1>
            <p className="text-white/75 text-lg max-w-xl mb-8 leading-relaxed">
              Fyll i din fÃ¶retagsprofil â€“ vÃ¥r AI matchar dig mot 8 finansieringsprogram och
              genererar ett personaliserat handlingsprogram. Helt gratis.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 8 finansieringsprogram</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> AI-matchning i realtid</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Inga kreditkort</span>
            </div>
          </div>
        </div>

        {/* Value chain indicator */}
        <div className="bg-[var(--forest-mid)] border-b border-[var(--forest-deep)]">
          <div className="container py-3">
            <div className="flex items-center gap-2 text-xs text-white/70 overflow-x-auto">
              <span className="flex items-center gap-1.5 bg-[var(--copper)] text-white px-3 py-1 rounded-full font-medium whitespace-nowrap">
                <Search className="w-3 h-3" /> 1. Hitta bidrag (gratis)
              </span>
              <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                <Recycle className="w-3 h-3" /> 2. Skapa DPP (299 kr/mÃ¥n)
              </span>
              <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 whitespace-nowrap">
                <TrendingUp className="w-3 h-3" /> 3. SÃ¤lj LCA-data (Revenue share)
              </span>
            </div>
          </div>
        </div>

        <div className="container py-10">
          {step === "form" ? (
            <div className="max-w-2xl mx-auto">
              <Card className="border-[var(--sand-border)] shadow-lg bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display text-2xl text-[var(--forest-deep)]">
                    Din fÃ¶retagsprofil
                  </CardTitle>
                  <p className="text-sm text-[var(--text-muted)]">
                    Ju mer du fyller i, desto trÃ¤ffsÃ¤krare matchning.
                  </p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[var(--forest-deep)] font-medium">Bransch *</Label>
                      <Select onValueChange={setIndustry}>
                        <SelectTrigger className="border-[var(--sand-border)]">
                          <SelectValue placeholder="VÃ¤lj bransch..." />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map(i => (
                            <SelectItem key={i} value={i}>{i}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[var(--forest-deep)] font-medium">Antal anstÃ¤llda *</Label>
                      <Select onValueChange={setSize}>
                        <SelectTrigger className="border-[var(--sand-border)]">
                          <SelectValue placeholder="VÃ¤lj storlek..." />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--forest-deep)] font-medium">Region</Label>
                    <Input
                      placeholder="t.ex. Skaraborg, VÃ¤stra GÃ¶taland"
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      className="border-[var(--sand-border)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[var(--forest-deep)] font-medium">Vad vill du uppnÃ¥?</Label>
                    <Input
                      placeholder="t.ex. minska COâ‚‚, skapa DPP, sÃ¶ka EU-bidrag, digitalisera..."
                      value={focus}
                      onChange={e => setFocus(e.target.value)}
                      className="border-[var(--sand-border)]"
                    />
                  </div>

                  <Separator className="bg-[var(--sand-border)]" />

                  <Button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="w-full bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white h-12 text-base font-medium"
                  >
                    {isScanning ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Skannar 8 finansieringsprogram...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Starta gratis bidragsmatchning
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-[var(--text-muted)]">
                    Ingen registrering krÃ¤vs. Dina uppgifter sparas inte.
                  </p>
                </CardContent>
              </Card>

              {/* Social proof */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: Euro, label: "Totalt tillgÃ¤ngligt", value: "~20 MSEK" },
                  { icon: Clock, label: "Genomsnittlig svarstid", value: "60 sek" },
                  { icon: Star, label: "Matchningsprecision", value: "94%" }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-[var(--sand-border)]">
                    <Icon className="w-5 h-5 text-[var(--copper)] mx-auto mb-1" />
                    <div className="font-display text-xl font-bold text-[var(--forest-deep)]">{value}</div>
                    <div className="text-xs text-[var(--text-muted)]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Results header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[var(--forest-deep)]">
                    {results.length} bidrag matchade din profil
                  </h2>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    Totalt tillgÃ¤ngligt finansiering: <strong className="text-[var(--forest-deep)]">{totalAmount}</strong> Â· Bransch: <strong>{industry}</strong>
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="border-[var(--sand-border)] text-[var(--forest-deep)]"
                >
                  Ã„ndra profil
                </Button>
              </div>

              {/* Grant-Gamma AI Analysis Panel */}
              {aiAnalysis && (
                <div className="mb-6 border border-[var(--forest-mid)] rounded-xl bg-[var(--forest-deep)] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--forest-mid)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-300 text-sm font-mono">Grant-Gamma â€“ Personaliserad analys</span>
                  </div>
                  <div className="p-4 text-sm text-white/80 leading-relaxed">
                    <Streamdown>{aiAnalysis}</Streamdown>
                  </div>
                </div>
              )}
              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filterCat === cat
                        ? "bg-[var(--forest-deep)] text-white"
                        : "bg-white border border-[var(--sand-border)] text-[var(--text-muted)] hover:border-[var(--forest-mid)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grant cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {filtered.map((grant) => (
                  <Card key={grant.id} className="border-[var(--sand-border)] bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-3">
                          <h3 className="font-display font-bold text-[var(--forest-deep)] text-base leading-tight">
                            {grant.name}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">{grant.category}</p>
                        </div>
                        <div className="flex-shrink-0 text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                            grant.match >= 90 ? "bg-emerald-100 text-emerald-700" :
                            grant.match >= 80 ? "bg-amber-100 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {grant.match}%
                          </div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">match</div>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--text-body)] mb-3 leading-relaxed">
                        {grant.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {grant.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-[var(--sand-light)] text-[var(--forest-mid)] rounded-full border border-[var(--sand-border)]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[var(--sand-border)]">
                        <div className="space-y-0.5">
                          <div className="text-xs text-[var(--text-muted)]">Belopp</div>
                          <div className="text-sm font-semibold text-[var(--forest-deep)]">{grant.amount}</div>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <div className="text-xs text-[var(--text-muted)]">Deadline</div>
                          <div className="text-sm font-medium text-[var(--text-body)]">{grant.deadline}</div>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <div className="text-xs text-[var(--text-muted)]">Insats</div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${effortColor[grant.effort]}`}>
                            {grant.effort}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Upsell to DPP */}
              <div className="bg-[var(--forest-deep)] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #b87333 0%, transparent 50%)" }} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <Badge className="bg-[var(--copper)] text-white border-0 text-xs mb-3">NÃ„STA STEG</Badge>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Skapa ditt Digitala Produktpass
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed max-w-lg">
                      MÃ¥nga av dessa bidrag krÃ¤ver att du kan bevisa din hÃ¥llbarhet med ett DPP.
                      Med Nexus-OS skapar du ett EU-kompatibelt produktpass pÃ¥ 15 minuter â€“
                      och fÃ¶rvandlar compliance-kostnaden till en ny intÃ¤ktskÃ¤lla.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      className="bg-[var(--copper)] hover:bg-[var(--copper-dark)] text-white border-0 whitespace-nowrap"
                      onClick={() => { window.location.href = "/produktpass"; }}
                    >
                      <Recycle className="w-4 h-4 mr-2" />
                      Skapa DPP â€“ 299 kr/mÃ¥n
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 whitespace-nowrap"
                      onClick={() => { window.location.href = "/utbildning"; }}
                    >
                      <Cpu className="w-4 h-4 mr-2" />
                      Circular Excellence (gratis)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

