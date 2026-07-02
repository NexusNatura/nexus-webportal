/**
 * Pricing.tsx â€” Nexus-OS PrissÃ¤ttning
 * Design: Nordic Sustainability Intelligence
 * - Dark forest green (#1a3a2a) sidebar, warm sand (#f5f0e8) background, copper (#b87333) accents
 * - Fraunces (display) + DM Sans (body)
 * - Three plans: Gratis / SMF / Enterprise
 * - Feature comparison table + FAQ + CTA
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  CheckCircle2,
  XCircle,
  Minus,
  Zap,
  Building2,
  Factory,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Clock,
} from "lucide-react";

// â”€â”€â”€ Plan definitions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const plans = [
  {
    id: "gratis",
    name: "Gratis",
    tagline: "Kom igÃ¥ng utan kostnad",
    price: "0",
    period: "fÃ¶r alltid",
    color: "oklch(0.40 0.04 155)",
    bg: "oklch(0.97 0.005 155)",
    border: "oklch(0.88 0.01 155)",
    buttonVariant: "outline" as const,
    buttonStyle: { borderColor: "oklch(0.40 0.04 155)", color: "oklch(0.40 0.04 155)" },
    badge: null,
    icon: Zap,
    target: "Enskilda hantverkare & nyfikna",
    cta: "Starta gratis",
    href: "/hitta-bidrag",
    highlights: [
      "3 bidragsmatchningar/mÃ¥n",
      "1 DPP-utkast/mÃ¥n",
      "GrundlÃ¤ggande LCA-rapport",
    ],
  },
  {
    id: "smf",
    name: "SMF",
    tagline: "FÃ¶r lokala fÃ¶retag i omstÃ¤llning",
    price: "299",
    period: "per mÃ¥nad",
    color: "oklch(0.28 0.08 155)",
    bg: "oklch(0.28 0.08 155)",
    border: "oklch(0.28 0.08 155)",
    buttonVariant: "default" as const,
    buttonStyle: { background: "oklch(0.28 0.08 155)", color: "white" },
    badge: "Mest populÃ¤r",
    icon: Building2,
    target: "SMF med 1â€“50 anstÃ¤llda",
    cta: "VÃ¤lj SMF-plan",
    href: "/om-oss",
    highlights: [
      "ObegrÃ¤nsad bidragsmatchning",
      "10 DPP/mÃ¥n med full JSON-LD",
      "LCA-analys + COâ‚‚-rapport",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Full kraft fÃ¶r industri & kommuner",
    price: "1 499",
    period: "per mÃ¥nad",
    color: "oklch(0.62 0.12 55)",
    bg: "oklch(0.97 0.005 155)",
    border: "oklch(0.62 0.12 55 / 0.40)",
    buttonVariant: "outline" as const,
    buttonStyle: { borderColor: "oklch(0.62 0.12 55)", color: "oklch(0.50 0.12 55)" },
    badge: "Kontakta oss",
    icon: Factory,
    target: "Industri, kommuner & konsortier",
    cta: "Kontakta fÃ¶r offert",
    href: "/om-oss",
    highlights: [
      "ObegrÃ¤nsade DPP + API-Ã¥tkomst",
      "Datamarknadsplats: sÃ¤lj LCA-data",
      "Dedikerad onboarding & SLA",
    ],
  },
];

// â”€â”€â”€ Feature comparison table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type FeatureValue = boolean | string | null;

interface Feature {
  category: string;
  name: string;
  tooltip?: string;
  gratis: FeatureValue;
  smf: FeatureValue;
  enterprise: FeatureValue;
}

const features: Feature[] = [
  // BidragssÃ¶kning
  { category: "BidragssÃ¶kning", name: "Bidragsmatchning (AI)", gratis: "3/mÃ¥n", smf: "ObegrÃ¤nsad", enterprise: "ObegrÃ¤nsad" },
  { category: "BidragssÃ¶kning", name: "Antal EU-program i databasen", gratis: "30+", smf: "100+", enterprise: "150+" },
  { category: "BidragssÃ¶kning", name: "Automatiska ansÃ¶kningsutkast", gratis: false, smf: true, enterprise: true },
  { category: "BidragssÃ¶kning", name: "Vinnova & Almi-integration", gratis: false, smf: true, enterprise: true },
  { category: "BidragssÃ¶kning", name: "Erasmus+ KA220-generator", gratis: false, smf: true, enterprise: true },
  { category: "BidragssÃ¶kning", name: "Bevakningsnotiser (nya utlysningar)", gratis: false, smf: true, enterprise: true },

  // Digitalt Produktpass
  { category: "Digitalt Produktpass (DPP)", name: "DPP-generering", gratis: "1/mÃ¥n", smf: "10/mÃ¥n", enterprise: "ObegrÃ¤nsad" },
  { category: "Digitalt Produktpass (DPP)", name: "EU-kompatibel JSON-LD", gratis: false, smf: true, enterprise: true },
  { category: "Digitalt Produktpass (DPP)", name: "QR-kod & delningslÃ¤nk", gratis: false, smf: true, enterprise: true },
  { category: "Digitalt Produktpass (DPP)", name: "Blockchain-verifiering", gratis: false, smf: false, enterprise: true },
  { category: "Digitalt Produktpass (DPP)", name: "API-Ã¥tkomst (REST)", gratis: false, smf: false, enterprise: true },
  { category: "Digitalt Produktpass (DPP)", name: "Bulk-import (CSV/Excel)", gratis: false, smf: false, enterprise: true },

  // LCA & HÃ¥llbarhet
  { category: "LCA & HÃ¥llbarhet", name: "GrundlÃ¤ggande LCA-rapport", gratis: true, smf: true, enterprise: true },
  { category: "LCA & HÃ¥llbarhet", name: "COâ‚‚-avtryck per produkt", gratis: "Estimat", smf: "Verifierat", enterprise: "Certifierat" },
  { category: "LCA & HÃ¥llbarhet", name: "MaterialflÃ¶desanalys", gratis: false, smf: true, enterprise: true },
  { category: "LCA & HÃ¥llbarhet", name: "Industriell symbios-scan", gratis: false, smf: true, enterprise: true },
  { category: "LCA & HÃ¥llbarhet", name: "DPIA (GDPR-konsekvensbedÃ¶mning)", gratis: false, smf: true, enterprise: true },

  // Datamarknaden
  { category: "Datamarknaden", name: "KÃ¶p LCA-data frÃ¥n andra", gratis: false, smf: false, enterprise: true },
  { category: "Datamarknaden", name: "SÃ¤lj din LCA-data (70% intÃ¤kt)", gratis: false, smf: false, enterprise: true },
  { category: "Datamarknaden", name: "Producentansvar-rapporter", gratis: false, smf: false, enterprise: true },

  // Utbildning
  { category: "Circular Excellence", name: "TillgÃ¥ng till gratis introduktionskurs", gratis: true, smf: true, enterprise: true },
  { category: "Circular Excellence", name: "FullstÃ¤ndiga kurser (ESPR, AI Act)", gratis: false, smf: "Rabatt 20%", enterprise: "Inkluderat" },
  { category: "Circular Excellence", name: "Certifieringsprov", gratis: false, smf: "KÃ¶p separat", enterprise: "Inkluderat" },

  // Support & SLA
  { category: "Support & SLA", name: "Community-support", gratis: true, smf: true, enterprise: true },
  { category: "Support & SLA", name: "E-postsupport", gratis: false, smf: true, enterprise: true },
  { category: "Support & SLA", name: "Prioriterad support (SLA 4h)", gratis: false, smf: false, enterprise: true },
  { category: "Support & SLA", name: "Dedikerad onboarding", gratis: false, smf: false, enterprise: true },
  { category: "Support & SLA", name: "NexusCore PowerShell-modul", gratis: true, smf: true, enterprise: true },
];

// â”€â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const faqs = [
  {
    q: "Vad ingÃ¥r i gratisplanen?",
    a: "Gratisplanen ger dig 3 bidragsmatchningar och 1 DPP-utkast per mÃ¥nad, plus tillgÃ¥ng till NexusCore PowerShell-modulen och introduktionskursen. Det Ã¤r mer Ã¤n tillrÃ¤ckligt fÃ¶r att utvÃ¤rdera om plattformen passar ditt fÃ¶retag.",
  },
  {
    q: "Kan jag uppgradera nÃ¤r som helst?",
    a: "Ja, du kan uppgradera eller nedgradera din plan nÃ¤r som helst. Uppgradering trÃ¤der i kraft omedelbart. Nedgradering trÃ¤der i kraft vid nÃ¤sta faktureringsperiod.",
  },
  {
    q: "Vad Ã¤r skillnaden mellan SMF och Enterprise fÃ¶r DPP?",
    a: "SMF-planen ger 10 DPP per mÃ¥nad med full JSON-LD och QR-kod. Enterprise-planen Ã¤r obegrÃ¤nsad och lÃ¤gger till blockchain-verifiering, API-Ã¥tkomst och bulk-import â€“ nÃ¶dvÃ¤ndigt fÃ¶r fÃ¶retag med mÃ¥nga produkter eller som vill integrera DPP i sina egna system.",
  },
  {
    q: "Hur fungerar datamarknaden fÃ¶r Enterprise-kunder?",
    a: "Enterprise-kunder kan lista sin LCA-data pÃ¥ datamarknaden och sÃ¤lja den till producenter och Ã¥tervinnare. Nexus-OS tar 30% av transaktionsvÃ¤rdet â€“ du behÃ¥ller 70%. All data Ã¤r anonymiserad och GDPR-kompatibel.",
  },
  {
    q: "Ã„r EU-kompatibiliteten garanterad?",
    a: "Alla DPP som genereras pÃ¥ SMF- och Enterprise-planen fÃ¶ljer ESPR-fÃ¶rordningens tekniska specifikationer (EU 2024/1781) och anvÃ¤nder JSON-LD-formatet som EU-kommissionen krÃ¤ver. Vi uppdaterar mallen automatiskt nÃ¤r regelverket Ã¤ndras.",
  },
  {
    q: "Kan jag anvÃ¤nda plattformen utan att kÃ¶pa en plan?",
    a: "Ja. Gratisplanen Ã¤r permanent gratis â€“ inget kreditkort krÃ¤vs. NexusCore PowerShell-modulen Ã¤r alltid gratis att ladda ner och anvÃ¤nda lokalt.",
  },
];

// â”€â”€â”€ Helper components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) return <CheckCircle2 className="w-5 h-5 mx-auto" style={{ color: "oklch(0.28 0.08 155)" }} />;
  if (value === false) return <XCircle className="w-5 h-5 mx-auto text-muted-foreground/30" />;
  if (value === null) return <Minus className="w-4 h-4 mx-auto text-muted-foreground/40" />;
  return <span className="text-xs font-medium text-center block leading-tight">{value}</span>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-xl overflow-hidden transition-all duration-200"
      style={{ borderColor: open ? "oklch(0.28 0.08 155 / 0.30)" : "oklch(0.88 0.01 155)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscription_success") === "1") {
      const plan = params.get("plan") ?? "smf";
      toast.success(`âœ… Grattis! Din ${plan.toUpperCase()}-prenumeration Ã¤r nu aktiv.`, { duration: 8000 });
      // Clean URL
      window.history.replaceState({}, "", "/prissattning");
    } else if (params.get("subscription_cancelled") === "1") {
      toast.info("Betalningen avbrÃ¶ts. Du kan fÃ¶rsÃ¶ka igen nÃ¤r du Ã¤r redo.");
      window.history.replaceState({}, "", "/prissattning");
    }
  }, [location]);

  const createCheckout = trpc.pricing.createSubscriptionCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (err) => {
      toast.error(err.message ?? "Kunde inte starta betalningen. FÃ¶rsÃ¶k igen.");
    },
  });

  const notifyOwnerMutation = trpc.system.notifyOwner.useMutation();

  const handlePlanClick = (planId: string) => {
    if (planId === "gratis") return; // Link handles it
    if (planId === "enterprise") {
      notifyOwnerMutation.mutate({
        title: "Enterprise-fÃ¶rfrÃ¥gan frÃ¥n prissidan",
        content: `En anvÃ¤ndare Ã¤r intresserad av Enterprise-planen.\nAnvÃ¤ndare: ${user?.name ?? user?.email ?? "Ej inloggad"}\nTid: ${new Date().toLocaleString("sv-SE")}`,
      });
      toast.success("âœ‰ï¸ Vi har tagit emot din fÃ¶rfrÃ¥gan! Peter kontaktar dig inom 24 timmar.", { duration: 6000 });
      return;
    }
    if (planId === "smf") {
      if (!isAuthenticated) {
        toast.info("Logga in fÃ¶rst fÃ¶r att vÃ¤lja SMF-planen.");
        setTimeout(() => { window.location.href = getLoginUrl(); }, 1500);
        return;
      }
      createCheckout.mutate({ plan: "smf", origin: window.location.origin });
    }
  };

  const yearlyDiscount = 0.17; // 2 mÃ¥nader gratis

  const displayPrice = (base: string) => {
    if (base === "0") return "0";
    const num = parseInt(base.replace(/\s/g, ""), 10);
    if (billing === "yearly") return Math.round(num * (1 - yearlyDiscount)).toLocaleString("sv-SE");
    return num.toLocaleString("sv-SE");
  };

  // Group features by category
  const categories = Array.from(new Set(features.map((f) => f.category)));

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="border-b border-border bg-[oklch(0.97_0.005_155)]">
          <div className="container py-14">
            <div className="nexus-section-divider mb-4" />
            <h1
              className="text-4xl font-bold text-foreground mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Enkel, transparent prissÃ¤ttning
            </h1>
            <p className="text-muted-foreground max-w-xl mb-8 text-lg">
              VÃ¤lj den plan som passar ditt fÃ¶retag. Uppgradera nÃ¤r du vÃ¤xer â€“ nedgradera nÃ¤r du vill.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-border bg-background">
              <button
                onClick={() => setBilling("monthly")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: billing === "monthly" ? "oklch(0.28 0.08 155)" : "transparent",
                  color: billing === "monthly" ? "white" : "oklch(0.40 0.04 155)",
                }}
              >
                MÃ¥nadsvis
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  background: billing === "yearly" ? "oklch(0.28 0.08 155)" : "transparent",
                  color: billing === "yearly" ? "white" : "oklch(0.40 0.04 155)",
                }}
              >
                Ã…rsvis
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    background: billing === "yearly" ? "oklch(0.62 0.12 55 / 0.25)" : "oklch(0.62 0.12 55 / 0.15)",
                    color: "oklch(0.50 0.12 55)",
                  }}
                >
                  âˆ’17%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="container py-12">

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isPopular = plan.id === "smf";
              return (
                <div
                  key={plan.id}
                  className="relative rounded-2xl border overflow-hidden flex flex-col"
                  style={{
                    background: isPopular ? plan.bg : "white",
                    borderColor: plan.border,
                    boxShadow: isPopular ? `0 8px 32px ${plan.color.replace(")", " / 0.20)")}` : "0 2px 8px oklch(0 0 0 / 0.06)",
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{
                        background: isPopular ? "oklch(0.62 0.12 55 / 0.20)" : "oklch(0.62 0.12 55 / 0.12)",
                        color: "oklch(0.50 0.12 55)",
                      }}
                    >
                      {isPopular && <Star className="w-3 h-3" />}
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-7 flex-1">
                    {/* Icon + name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                          background: isPopular ? "oklch(1 0 0 / 0.12)" : `${plan.color.replace(")", " / 0.10)")}`,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: isPopular ? "white" : plan.color }}
                        />
                      </div>
                      <div>
                        <h2
                          className="text-xl font-bold"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            color: isPopular ? "white" : "oklch(0.20 0.01 155)",
                          }}
                        >
                          {plan.name}
                        </h2>
                        <p
                          className="text-xs"
                          style={{ color: isPopular ? "oklch(1 0 0 / 0.65)" : "oklch(0.55 0.02 155)" }}
                        >
                          {plan.target}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span
                          className="text-4xl font-bold"
                          style={{
                            fontFamily: "'Fraunces', serif",
                            color: isPopular ? "white" : "oklch(0.20 0.01 155)",
                          }}
                        >
                          {displayPrice(plan.price)}
                        </span>
                        {plan.price !== "0" && (
                          <span
                            className="text-sm mb-1.5"
                            style={{ color: isPopular ? "oklch(1 0 0 / 0.65)" : "oklch(0.55 0.02 155)" }}
                          >
                            kr/{billing === "yearly" ? "mÃ¥n*" : "mÃ¥n"}
                          </span>
                        )}
                        {plan.price === "0" && (
                          <span
                            className="text-sm mb-1.5"
                            style={{ color: isPopular ? "oklch(1 0 0 / 0.65)" : "oklch(0.55 0.02 155)" }}
                          >
                            kr
                          </span>
                        )}
                      </div>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: isPopular ? "oklch(1 0 0 / 0.55)" : "oklch(0.60 0.02 155)" }}
                      >
                        {billing === "yearly" && plan.price !== "0"
                          ? `Faktureras ${Math.round(parseInt(plan.price.replace(/\s/g, ""), 10) * (1 - yearlyDiscount) * 12).toLocaleString("sv-SE")} kr/Ã¥r`
                          : plan.period}
                      </p>
                    </div>

                    {/* Tagline */}
                    <p
                      className="text-sm mb-5 leading-relaxed"
                      style={{ color: isPopular ? "oklch(1 0 0 / 0.75)" : "oklch(0.45 0.02 155)" }}
                    >
                      {plan.tagline}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-2.5 mb-6">
                      {plan.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: isPopular ? "oklch(0.75 0.10 155)" : plan.color }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: isPopular ? "oklch(1 0 0 / 0.85)" : "oklch(0.35 0.02 155)" }}
                          >
                            {h}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-7 pb-7">
                    {plan.id === "gratis" ? (
                      <Link href={plan.href}>
                        <Button
                          className="w-full font-semibold"
                          variant={plan.buttonVariant}
                          style={plan.buttonStyle}
                        >
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        className="w-full font-semibold"
                        variant={plan.buttonVariant}
                        disabled={createCheckout.isPending && plan.id === "smf"}
                        style={
                          isPopular
                            ? { background: "white", color: plan.color, border: "none" }
                            : plan.buttonStyle
                        }
                        onClick={() => handlePlanClick(plan.id)}
                      >
                        {createCheckout.isPending && plan.id === "smf"
                          ? "Laddar..."
                          : plan.cta}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {billing === "yearly" && (
            <p className="text-xs text-muted-foreground text-center -mt-10 mb-12">
              * Ã…rsvis fakturering. Priset visas som mÃ¥nadssnitt. Bindningstid 12 mÃ¥nader.
            </p>
          )}

          {/* Feature comparison table */}
          <div className="mb-16">
            <div className="nexus-section-divider mb-4" />
            <h2
              className="text-2xl font-bold text-foreground mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              FullstÃ¤ndig funktionsjÃ¤mfÃ¶relse
            </h2>

            <div className="rounded-2xl border border-border overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_100px_100px_100px] bg-muted/40 border-b border-border">
                <div className="px-5 py-4 text-sm font-semibold text-muted-foreground">Funktion</div>
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="py-4 text-center text-sm font-bold"
                    style={{ color: p.id === "smf" ? "oklch(0.28 0.08 155)" : "oklch(0.35 0.02 155)" }}
                  >
                    {p.name}
                  </div>
                ))}
              </div>

              {/* Table body */}
              {categories.map((cat, catIdx) => (
                <div key={cat}>
                  {/* Category header */}
                  <div
                    className="grid grid-cols-[1fr_100px_100px_100px] border-b border-border"
                    style={{ background: "oklch(0.28 0.08 155 / 0.04)" }}
                  >
                    <div className="px-5 py-2.5 col-span-4">
                      <span
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "oklch(0.28 0.08 155)" }}
                      >
                        {cat}
                      </span>
                    </div>
                  </div>

                  {/* Feature rows */}
                  {features
                    .filter((f) => f.category === cat)
                    .map((feat, i, arr) => (
                      <div
                        key={feat.name}
                        className={`grid grid-cols-[1fr_100px_100px_100px] ${
                          i < arr.length - 1 || catIdx < categories.length - 1
                            ? "border-b border-border/50"
                            : ""
                        } hover:bg-muted/20 transition-colors`}
                      >
                        <div className="px-5 py-3 flex items-center gap-2">
                          <span className="text-sm text-foreground">{feat.name}</span>
                          {feat.tooltip && (
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                          )}
                        </div>
                        <div className="py-3 flex items-center justify-center">
                          <FeatureCell value={feat.gratis} />
                        </div>
                        <div
                          className="py-3 flex items-center justify-center"
                          style={{ background: "oklch(0.28 0.08 155 / 0.04)" }}
                        >
                          <FeatureCell value={feat.smf} />
                        </div>
                        <div className="py-3 flex items-center justify-center">
                          <FeatureCell value={feat.enterprise} />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: Shield,
                title: "GDPR-kompatibel",
                desc: "All data lagras inom EU. DPIA ingÃ¥r i SMF- och Enterprise-planerna.",
                color: "oklch(0.28 0.08 155)",
              },
              {
                icon: Clock,
                title: "Ingen bindningstid (mÃ¥nadsvis)",
                desc: "Avsluta nÃ¤r du vill. Ã…rsplanen ger 2 mÃ¥nader gratis men krÃ¤ver 12 mÃ¥naders bindning.",
                color: "oklch(0.62 0.12 55)",
              },
              {
                icon: Zap,
                title: "Alltid uppdaterad",
                desc: "DPP-mallarna uppdateras automatiskt nÃ¤r EU-kommissionen Ã¤ndrar ESPR-specifikationerna.",
                color: "oklch(0.28 0.08 155)",
              },
            ].map((b) => {
              const BIcon = b.icon;
              return (
                <div key={b.title} className="nexus-card p-5 flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${b.color.replace(")", " / 0.10)")}` }}
                  >
                    <BIcon className="w-4.5 h-4.5" style={{ color: b.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">{b.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <div className="nexus-section-divider mb-4" />
            <h2
              className="text-2xl font-bold text-foreground mb-8"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Vanliga frÃ¥gor
            </h2>
            <div className="space-y-3 max-w-3xl">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="rounded-2xl p-10 text-center"
            style={{ background: "oklch(0.28 0.08 155)", color: "white" }}
          >
            <h2
              className="text-3xl font-bold mb-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Redo att bÃ¶rja?
            </h2>
            <p className="text-white/75 mb-7 max-w-md mx-auto">
              Starta gratis idag â€“ inget kreditkort krÃ¤vs. Uppgradera nÃ¤r ditt fÃ¶retag Ã¤r redo fÃ¶r nÃ¤sta steg.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/hitta-bidrag">
                <Button
                  className="font-semibold px-6"
                  style={{ background: "white", color: "oklch(0.28 0.08 155)" }}
                >
                  Starta gratis
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/om-oss">
                <Button
                  variant="outline"
                  className="font-semibold px-6"
                  style={{ borderColor: "oklch(1 0 0 / 0.35)", color: "white", background: "transparent" }}
                >
                  Kontakta oss
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

