import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AITransparencyBanner from "@/components/AITransparencyBanner";
import BlogCarousel from "@/components/BlogCarousel";
import { useState } from "react";
import {
  ArrowRight,
  FileText,
  Search,
  Recycle,
  Terminal,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  Euro,
  Building2,
  Factory,
  Handshake,
  ChevronRight,
  Coins,
  BarChart3,
  Leaf,
  Bot,
  Cpu,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

// Clean, Apple-like placeholder images or keep existing but with soft shadows
const HERO_IMG = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop";
const DPP_IMG = "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop";
const GRANTS_IMG = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop";
const SYMBIOSIS_IMG = "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop";

const stats = [
  { value: "2026", label: "ESPR träder i kraft", icon: Clock },
  { value: "€400K", label: "Max Erasmus+ bidrag", icon: Euro },
  { value: "89%", label: "CO2-reduktion (pilot)", icon: TrendingUp },
  { value: "100+", label: "EU-program kartlagda", icon: CheckCircle2 },
];

const features = [
  {
    href: "/bidrag",
    img: GRANTS_IMG,
    badge: "AI-matchning",
    title: "EU Bidragsspecialist",
    desc: "Senior AI-agent som kartlägger alla relevanta EU-, Vinnova- och Almi-program för ditt företag. Genererar färdiga ansökningsutkast automatiskt.",
    cta: "Hitta bidrag",
    icon: Search,
  },
  {
    href: "/produktpass",
    img: DPP_IMG,
    badge: "ESPR 2026",
    title: "Digitalt Produktpass",
    desc: "Skapa, förvalta och monetarisera EU-kompatibla DPP:er med inbyggd LCA-analys. Sälj din produktdata som en resurs till producenter och återvinnare.",
    cta: "Skapa produktpass",
    icon: FileText,
  },
  {
    href: "/symbios",
    img: SYMBIOSIS_IMG,
    badge: "Lokalt nätverk",
    title: "Industriell Symbios",
    desc: "Identifiera hur lokala företags avfallsströmmar kan bli varandras resurser. AI-driven analys av Skaraborg-regionens cirkulära potential.",
    cta: "Skanna flöden",
    icon: Recycle,
  },
  {
    href: "/cirkulara-verktyg",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
    badge: "Kalkylator",
    title: "Cirkulära Verktyg",
    desc: "Beräkna Material Circularity Indicator (MCI) och se exakt hur mycket koldioxidutsläpp du kan spara genom att införa cirkulära produktionsmetoder.",
    cta: "Räkna ut CO2e",
    icon: Factory,
  },
  {
    href: "/smarta-blanketter",
    img: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=800&auto=format&fit=crop",
    badge: "Auto-fill AI",
    title: "Intelligenta Blanketter",
    desc: "Sluta slösa tid på byråkrati. Vår AI läser av företagets data och fyller automatiskt i komplexa EU- och myndighetsblanketter åt dig.",
    cta: "Testa Blanketter",
    icon: ShieldCheck,
  },
];

const agentShowcase = [
  {
    slug: "grant-gamma-pro",
    name: "Grant-Gamma Pro",
    tagline: "Senior EU-bidragsspecialist",
    desc: "Kartlägger 100+ EU-program och skriver färdiga ansökningsutkast automatiskt.",
    icon: Search,
    riskClass: "Begränsad risk",
    price: "2 500 kr/uppdrag",
    benchmarkScore: 91,
  },
  {
    slug: "dpp-omega",
    name: "DPP-Omega",
    tagline: "ESPR 2026-kompatibla produktpass",
    desc: "Genererar EU-kompatibla digitala produktpass med inbyggd LCA-analys på under 20 sekunder.",
    icon: FileText,
    riskClass: "Minimal risk",
    price: "890 kr/uppdrag",
    benchmarkScore: 94,
  },
  {
    slug: "compliance-kappa",
    name: "Compliance-Kappa",
    tagline: "EU AI Act Art. 9 & 50",
    desc: "Bygger riskregister, misuse-scenarier och DPIA-dokumentation inför 1 juni 2026.",
    icon: ShieldCheck,
    riskClass: "Hög risk (granskad)",
    price: "3 500 kr/uppdrag",
    benchmarkScore: 88,
  },
];

const segments = [
  {
    id: "smf",
    icon: Building2,
    label: "Lokala SMF",
    tagline: "Från compliance-kostnad till konkurrensfördel",
    problem: "EU:s ESPR-krav 2026 innebär att du måste dokumentera materialinnehåll, CO2-avtryck och reparerbarhet för varje produkt – annars kan du inte sälja på EU-marknaden.",
    value: [
      { icon: Search, text: "AI matchar ditt företag mot 100+ bidragsprogram och skriver ansökningsutkast automatiskt" },
      { icon: FileText, text: "Generera EU-kompatibla DPP på minuter istället för månader" },
      { icon: TrendingUp, text: "Pantolin-piloten: 89% CO2-reduktion, 18% premieprissättning – compliance lönar sig" },
    ],
    cta: "Hitta dina bidrag",
    href: "/bidrag",
    proof: "Pilotkund: Pantolin Smycken, Skaraborg",
  },
  {
    id: "industri",
    icon: Factory,
    label: "Producenter & Industri",
    tagline: "Köp LCA-data direkt från källan",
    problem: "Producentansvar kräver verifierad data om materialinnehåll och återvinningsgrad. Idag samlas denna data in manuellt, med hög kostnad och låg tillförlitlighet.",
    value: [
      { icon: BarChart3, text: "Köp verifierad LCA-data direkt från DPP-banken – spårbar till produktnivå" },
      { icon: Recycle, text: "Identifiera materialflöden för industriell symbios i din region" },
      { icon: Shield, text: "Alla data är EU-kompatibla och blockchain-verifierade" },
    ],
    cta: "Utforska datamarknaden",
    href: "/datamarknad",
    proof: "Marknadsöppning: ESPR gäller batterier & textilier från 2026",
  },
  {
    id: "partner",
    icon: Handshake,
    label: "Finansiärer & Partners",
    tagline: "Investera i infrastrukturen för EU:s gröna omställning",
    problem: "EU:s gröna omställning kräver ny digital infrastruktur. Idag saknas en neutral, lokal plattform som hjälper SMF att möta ESPR-kraven och samtidigt skapar värde av den data som genereras.",
    value: [
      { icon: Coins, text: "Tre bevisade intäktsströmmar: SaaS, data brokerage och utbildning" },
      { icon: TrendingUp, text: "Adresserbar marknad: 500 000+ SMF i Sverige berörs av ESPR-krav" },
      { icon: Leaf, text: "Mätbar klimatpåverkan i varje investerad krona – rapporteringsklart" },
    ],
    cta: "Kontakta oss",
    href: "/om-oss",
    proof: "Säker: Almi-verifiering, Vinnova-konsortium, Sådd-investering",
  },
];

function BusinessModelSection() {
  const [active, setActive] = useState("smf");
  const seg = segments.find((s) => s.id === active)!;
  const Icon = seg.icon;

  return (
    <div className="bg-background rounded-3xl p-8 lg:p-12 border border-border shadow-sm">
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-10 bg-muted/50 p-1.5 rounded-2xl w-fit">
        {segments.map((s) => {
          const TabIcon = s.icon;
          const isActive = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Icon className="w-3.5 h-3.5" />
            {seg.label}
          </div>
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
            {seg.tagline}
          </h3>
          <div className="p-6 bg-muted/50 rounded-2xl border border-border/50 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30" />
            <p className="text-muted-foreground leading-relaxed">
              {seg.problem}
            </p>
          </div>
          <Link href={seg.href}>
            <Button className="rounded-full px-8 h-12 shadow-sm gap-2">
              {seg.cta} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {seg.value.map((v, i) => {
            const VIcon = v.icon;
            return (
              <div key={i} className="flex gap-4 p-5 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="mt-0.5 bg-primary/10 p-2.5 rounded-xl text-primary h-fit">
                  <VIcon className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-foreground/90 leading-relaxed">
                  {v.text}
                </div>
              </div>
            );
          })}
          <div className="mt-6 flex items-center gap-2 text-sm text-primary font-medium px-2">
            <CheckCircle2 className="w-4 h-4" />
            {seg.proof}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <AITransparencyBanner />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle blur background */}
        <div className="absolute inset-0 bg-background/50 z-10 backdrop-blur-3xl" />
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Hero" className="w-full h-full object-cover opacity-10" />
        </div>
        
        {/* Apple-like soft gradient orb */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px] z-0" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px] z-0" />

        <div className="container relative z-20 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-sm font-medium text-foreground mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            Välkommen till framtidens infrastruktur
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-foreground mb-8 leading-[1.1]">
            EU Intelligence <br />
            <span className="text-muted-foreground">för cirkulär ekonomi</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Automatisera din compliance, säkra dina EU-bidrag och skapa nya intäkter genom digitala produktpass och AI-agenter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/agenter">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-sm gap-2">
                Utforska Agentmarknaden <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/om-oss">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base bg-background/50 backdrop-blur-sm gap-2">
                Läs mer om Nexus-OS <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Carousel Section */}
      <section className="container mx-auto max-w-6xl relative z-10 -mt-12 mb-16">
        <BlogCarousel />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Ett system, oändliga möjligheter</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Våra kärnmoduler hjälper dig att navigera det nya europeiska landskapet med säkerhet och lönsamhet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Link key={i} href={f.href}>
                  <div className="group h-full bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors" />
                      <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border shadow-sm">
                          {f.badge}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{f.desc}</p>
                      <div className="flex items-center text-primary text-sm font-medium mt-auto group-hover:translate-x-1 transition-transform">
                        {f.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agents Marketplace Preview */}
      <section className="py-24 bg-muted/30 border-t border-border/50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
                <Bot className="w-4 h-4" /> AI Agentmarknaden
              </div>
              <h2 className="text-4xl font-semibold tracking-tight text-foreground">Hyr in digital kompetens</h2>
              <p className="text-muted-foreground mt-4 text-lg">Specialiserade agenter och tvillingar som automatiserar dina tyngsta compliance-processer.</p>
            </div>
            <Link href="/agenter">
              <Button variant="outline" className="rounded-full bg-background shadow-sm">
                Se hela marknaden <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agentShowcase.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.slug} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="bg-background border border-border px-3 py-1 rounded-full text-xs font-medium text-muted-foreground flex items-center gap-1.5 shadow-sm">
                      <Activity className="w-3.5 h-3.5 text-primary" /> {agent.benchmarkScore}% KPI
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{agent.name}</h3>
                  <div className="text-sm text-primary font-medium mb-3">{agent.tagline}</div>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{agent.desc}</p>
                  
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{agent.riskClass}</span>
                    <span className="font-semibold text-foreground">{agent.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Model Section */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight mb-4">Värde för hela det cirkulära ekosystemet</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">NEXUS-OS är designat för att koppla ihop småföretag, industri och investerare i en gemensam plattform för framtiden.</p>
          </div>
          
          <BusinessModelSection />
        </div>
      </section>
    </div>
  );
}

// Inline Activity component
function Activity(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
