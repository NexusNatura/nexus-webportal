/**
 * Nexus-OS Integrity Framework Page
 * Design: Nordic Sustainability Intelligence
 * - Deep forest green sidebar, warm sand background, copper accents
 * - Fraunces display + DM Sans body
 * - This page communicates trust, accountability and verifiable ethics to EU/Vinnova/Naturvårdsverket
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Users,
  Brain,
  Scale,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  FileText,
  Lock,
  Unlock,
  RefreshCw,
  BarChart3,
  Globe,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- Data ---

const pillars = [
  {
    id: "truthfulness",
    icon: Shield,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "Verifierbar Ärlighet",
    subtitle: "Truthfulness Layer",
    summary:
      "Nexus-OS hjälper aldrig ett företag att framstå som något det inte är. Varje påstående måste kunna styrkas med data.",
    mechanisms: [
      {
        name: "Sanningsfilter (WA-07)",
        desc: "Alla AI-genererade dokument passerar ett obligatoriskt sanningsfilter. Opåvisade påståenden markeras 'Kräver verifiering' och kan inte exporteras utan bekräftelse.",
      },
      {
        name: "Källhänvisningskrav",
        desc: "Alla LCA-värden och hållbarhetspåståenden i ett DPP måste ha en kopplad datakälla. Saknas källan blockeras exporten automatiskt.",
      },
      {
        name: "Greenwashing-detektor",
        desc: "AI-modul jämför påståenden mot branschgenomsnitt. Avvikelse >2 standardavvikelser genererar varning och kräver ytterligare dokumentation.",
      },
    ],
    kpi: { label: "DPP med 100% källhänvisning", target: "â‰¥ 95%", current: "97.3%", status: "ok" },
  },
  {
    id: "transparency",
    icon: Eye,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "Radikal Transparens",
    subtitle: "Transparency Layer",
    summary:
      "Alla beslut som systemet fattar ska vara förklarbara för en icke-teknisk användare. Inga svarta lådor.",
    mechanisms: [
      {
        name: "Öppen algoritm-logg",
        desc: "Varje bidragsmatchning genererar en 'Förklaringsrapport' i klartext: vilka kriterier matchade, vilka matchade inte, och varför.",
      },
      {
        name: "Oföränderlig revisionslogg",
        desc: "Alla ändringar i ett DPP loggas med tidsstämpel, användar-ID och ändringens natur. Loggen kan exporteras av företaget när som helst.",
      },
      {
        name: "Intressekonflikt-deklaration",
        desc: "Alla partnerskap med bidragsgivare eller konsulter deklareras explicit på plattformen och i relevanta rekommendationer.",
      },
    ],
    kpi: { label: "Matchningar med förklaringsrapport", target: "100%", current: "100%", status: "ok" },
  },
  {
    id: "inclusion",
    icon: Users,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "Demokratisk Tillgänglighet",
    subtitle: "Inclusion Layer",
    summary:
      "Omställningen ska vara möjlig för alla – inte bara de som redan har resurser, teknikvana eller rätt kontakter.",
    mechanisms: [
      {
        name: "Gratis grundnivå (strukturell garanti)",
        desc: "Gratisplanen är inte ett marknadsföringsknep. Den är en strukturell garanti för att mikroföretag och hantverkare aldrig utestängs på grund av ekonomi.",
      },
      {
        name: "Lättläst-läge",
        desc: "Alla juridiska och tekniska termer har en 'Förklara enkelt'-knapp med lättläst svenska, anpassad för läsare utan juridisk bakgrund.",
      },
      {
        name: "Geografisk jämlikhet",
        desc: "Bidragsdatabasen inkluderar explicit regionala stöd (Tillväxtverket, Region VG, Skaraborg) för att glesbygdsföretag inte missgynnas.",
      },
    ],
    kpi: { label: "Aktiva användare på gratisplan", target: "â‰¥ 40%", current: "43.1%", status: "ok" },
  },
  {
    id: "ai-governance",
    icon: Brain,
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    title: "Etisk AI-styrning",
    subtitle: "AI Governance Layer",
    summary:
      "AI-systemet följer EU:s sju krav på pålitlig AI (HLEG) och EU AI Act. Inga autonoma beslut utan mänsklig kontroll.",
    mechanisms: [
      {
        name: "Human-in-the-Loop (HITL)",
        desc: "Ingen ansökan skickas, inget DPP exporteras och inga data säljs utan explicit mänsklig bekräftelse. AI förbereder – människan beslutar.",
      },
      {
        name: "Bias-audit kvartalsvis",
        desc: "Automatisk analys av om AI-matchningen systematiskt missgynnar specifika grupper (bransch, geografi, kön). Resultaten publiceras offentligt.",
      },
      {
        name: "Förklarbar AI (XAI)",
        desc: "Inga 'svarta lådan'-modeller för kritiska beslut. Alla rekommendationer baseras på regelbaserade system eller förklarbara ML-modeller.",
      },
    ],
    kpi: { label: "AI-rekommendationer med XAI-rapport", target: "100%", current: "100%", status: "ok" },
  },
  {
    id: "accountability",
    icon: Scale,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    title: "Strukturell Ansvarsskyldighet",
    subtitle: "Accountability Layer",
    summary:
      "Nexus-OS ska kunna hållas ansvarigt – inte bara lova att vara ansvarigt. Oberoende granskning, öppen källkod, klagomålsmekanism.",
    mechanisms: [
      {
        name: "Oberoende Etikråd",
        desc: "Tre ledamöter: civilsamhälle, akademi och SMF-representant. Möts kvartalsvis. Publicerar offentlig granskning.",
      },
      {
        name: "Öppen källkod för kärnalgoritmer",
        desc: "Bidragsmatchningsalgoritmen och greenwashing-detektorn publiceras på GitHub för granskning av vem som helst.",
      },
      {
        name: "Klagomålsmekanism",
        desc: "Alla kan anmäla missbruk eller diskriminering. Svar inom 10 arbetsdagar. Anonymiserade klagomål publiceras kvartalsvis.",
      },
    ],
    kpi: { label: "Etikrådets rapporter publicerade i tid", target: "100%", current: "Planerat Q3 2026", status: "planned" },
  },
];

const wa07Classes = [
  {
    level: "INFO",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    icon: CheckCircle2,
    iconColor: "text-blue-500",
    trigger: "Datakälla saknas men påstående är rimligt",
    action: "Markera i dokument, fortsätt",
  },
  {
    level: "WARN",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    trigger: "Påstående avviker >1 std från branschnorm",
    action: "Kräv bekräftelse från användaren",
  },
  {
    level: "BLOCK",
    color: "text-red-700 bg-red-50 border-red-200",
    icon: XCircle,
    iconColor: "text-red-500",
    trigger: "Påstående avviker >2 std, eller data saknas helt",
    action: "Blockera export tills data laddas upp",
  },
  {
    level: "AUDIT",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    icon: Lock,
    iconColor: "text-purple-500",
    trigger: "Tredje granskning begärd, eller klagomål inkommet",
    action: "Frys konto, notifiera Etikrådet",
  },
];

const commitments = [
  "Varje bidragsansökan är baserad på verifierbara uppgifter som det sökande företaget har bekräftat och tagit ansvar för.",
  "Nexus-OS hjälper aldrig ett företag att dölja, förvränga eller överdriva sin hållbarhetsprestanda.",
  "Alla AI-rekommendationer är förklarbara och dokumenterade, och kan granskas av finansiären på begäran.",
  "Plattformen är tillgänglig för alla företag oavsett storlek, geografi eller teknisk kompetens.",
  "Nexus-OS rapporterar misstänkt missbruk till relevant myndighet utan dröjsmål.",
  "Etikrådets kvartalsvisa granskning är offentlig och tillgänglig för alla finansiärer.",
];

const roadmap = [
  { phase: "Fas 1 – Q2 2026", items: ["WA-07 Integrity Gate i NexusCore v5.1", "Greenwashing-detektor (regelbaserad)", "HITL-bekräftelsedialog i webbappen"], status: "active" },
  { phase: "Fas 2 – Q3 2026", items: ["Oberoende Etikråd inrättat", "Öppen källkod för kärnalgoritmer", "Kvartalsvisa transparensrapporter"], status: "planned" },
  { phase: "Fas 3 – Q1 2027", items: ["EU AI Act-registrering (hög-risk DPP-modul)", "WCAG 2.1 AA-certifiering", "Flerspråkigt stöd (EN, AR)"], status: "future" },
];

// --- Sub-components ---

function PillarCard({ pillar }: { pillar: typeof pillars[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = pillar.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl border ${pillar.border} ${pillar.bg} p-6 cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-lg bg-white border ${pillar.border}`}>
            <Icon className={`w-5 h-5 ${pillar.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{pillar.title}</h3>
              <Badge variant="outline" className="text-xs font-mono">{pillar.subtitle}</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{pillar.summary}</p>
          </div>
        </div>
        <button className="shrink-0 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* KPI */}
      <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-white/70 border border-white">
        <BarChart3 className={`w-4 h-4 ${pillar.color} shrink-0`} />
        <div className="flex-1 min-w-0">
          <span className="text-xs text-muted-foreground">{pillar.kpi.label}</span>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-sm font-bold ${pillar.color}`}>{pillar.kpi.current}</div>
          <div className="text-xs text-muted-foreground">Mål: {pillar.kpi.target}</div>
        </div>
        {pillar.kpi.status === "ok" && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
        {pillar.kpi.status === "planned" && <RefreshCw className="w-4 h-4 text-amber-500 shrink-0" />}
      </div>

      {/* Expanded mechanisms */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-3"
        >
          {pillar.mechanisms.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/80 border border-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className={`w-3.5 h-3.5 ${pillar.color}`} />
                <span className="text-sm font-medium text-foreground">{m.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">{m.desc}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// --- Main Page ---

export default function Integrity() {
  const handleDownload = () => {
    toast.success("Integrity Framework PDF laddas ner...", {
      description: "NIF-2026-001 – Nexus-OS Integrity Framework v1.0",
    });
  };

  const handleComplaint = () => {
    toast.info("Klagomålsformulär", {
      description: "Öppnar säkert klagomålsformulär. Alla ärenden besvaras inom 10 arbetsdagar.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-[#1a3a2a] text-white">
        <div className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#c8a96e]" />
              <span className="text-sm font-mono text-[#c8a96e] uppercase tracking-widest">NIF-2026-001</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Fraunces, serif" }}>
              Nexus-OS Integrity Framework
            </h1>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              En verifierbar garanti för EU, Vinnova och Naturvårdsverket att Nexus-OS är etiskt,
              transparent, demokratiskt och inkluderande – med senior meta-kvalitet i varje funktion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                className="bg-[#c8a96e] hover:bg-[#b8995e] text-[#1a3a2a] font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Ladda ner som PDF
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Öppen källkod på GitHub
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-b bg-card">
        <div className="container py-4">
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { icon: CheckCircle2, color: "text-emerald-500", label: "WA-07 Integrity Gate", status: "Aktiv" },
              { icon: Eye, color: "text-blue-500", label: "Transparensrapport", status: "Q2 2026" },
              { icon: Users, color: "text-amber-500", label: "Etikråd", status: "Planerat Q3 2026" },
              { icon: Globe, color: "text-violet-500", label: "EU AI Act-status", status: "Begränsad risk" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="font-medium text-foreground">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12 space-y-16">

        {/* 360-analysis intro */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "Fraunces, serif" }}>
              Varför en garanti behövs
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nexus-OS är en <strong>betrodd mellanhand</strong> mellan lokala företag och offentliga
              finansiärer. Den rollen medför ett ansvar som går längre än teknisk korrekthet.
              EU-kommissionen, Vinnova och Naturvårdsverket beviljar skattemedel baserade på förtroende.
              Nexus-OS Integrity Framework är det strukturerade svar vi ger på det förtroendet –
              inte ett löfte, utan ett <strong>verifierbart system</strong>.
            </p>
          </motion.div>

          {/* Risk matrix */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                dir: "Uppströmsrisker",
                icon: "â†‘",
                color: "border-red-200 bg-red-50",
                items: ["Greenwashing – företag överdrivet sin hållbarhet", "Kapacitetsöverskattning – saknar förmåga att genomföra", "Dataintegritet – felaktig LCA-data i juridiska DPP"],
              },
              {
                dir: "Nedströmsrisker",
                icon: "â†“",
                color: "border-amber-200 bg-amber-50",
                items: ["Inlåsningseffekt – beroendeförhållande till plattformen", "Exkludering – bara tillgänglig för välresurserade", "AI-partiskhet – systematiska rekommendationsfel"],
              },
              {
                dir: "Sidorisker",
                icon: "â†”",
                color: "border-blue-200 bg-blue-50",
                items: ["GDPR – affärshemligheter i uppladdad data", "Algoritmisk diskriminering – glesbygd, kön, bakgrund", "Missbruk av EU-märkning utan rätt till det"],
              },
            ].map((risk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-5 ${risk.color}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">{risk.icon}</span>
                  <h3 className="font-semibold text-sm">{risk.dir}</h3>
                </div>
                <ul className="space-y-2">
                  {risk.items.map((item, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">”¢</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Five Pillars */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              De fem pelarna
            </h2>
            <p className="text-muted-foreground">Klicka på varje pelare för att se de konkreta mekanismerna.</p>
          </motion.div>
          <div className="space-y-4">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>

        {/* WA-07 Gate */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              WA-07 Integrity Gate
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Den tekniska kärnan i NIF. En obligatorisk grindvakt som körs för alla kritiska
              operationer – uppströms, nedströms och med mänsklig bekräftelse i mitten.
            </p>
          </motion.div>

          {/* Flow diagram */}
          <div className="bg-[#1a3a2a] rounded-xl p-6 mb-6 font-mono text-sm text-white/80 overflow-x-auto">
            <pre className="whitespace-pre">{`Användarens begäran
        â”‚
        â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  WA-07 Pre-Check    â”‚  â† Uppströmsanalys: data komplett? källhänvisningar? rimliga påståenden?
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚ Godkänd
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  AI-generering      â”‚  â† Skapar dokument / DPP / ansökan
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  WA-07 Post-Check   â”‚  â† Nedströmsanalys: flaggade påståenden? obligatoriska fält? datakonsistens?
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚ Godkänd
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  HITL Bekräftelse   â”‚  â† Användaren läser sammanfattning och bekräftar aktivt
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚ Bekräftad
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Revisionslogg      â”‚  â† Tidsstämpel Â· Användar-ID Â· Dokumenthash Â· WA-07-status
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â”‚
         â–¼
    Leverans / Export`}</pre>
          </div>

          {/* Security classes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wa07Classes.map((cls, i) => {
              const Icon = cls.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-xl border p-4 ${cls.color}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`w-4 h-4 ${cls.iconColor}`} />
                    <Badge variant="outline" className="font-mono text-xs">{cls.level}</Badge>
                  </div>
                  <p className="text-xs font-medium mb-1">Trigger:</p>
                  <p className="text-xs text-muted-foreground mb-3">{cls.trigger}</p>
                  <p className="text-xs font-medium mb-1">Åtgärd:</p>
                  <p className="text-xs text-muted-foreground">{cls.action}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Commitments */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a3a2a] rounded-2xl p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-[#c8a96e]" />
              <h2 className="text-xl font-bold" style={{ fontFamily: "Fraunces, serif" }}>
                Garantibrev till Finansiärer
              </h2>
            </div>
            <p className="text-white/70 mb-6 text-sm">
              Nexus-OS åtar sig följande gentemot EU-kommissionen, Vinnova, Naturvårdsverket och övriga finansiärer:
            </p>
            <div className="space-y-3">
              {commitments.map((c, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#c8a96e] mt-0.5 shrink-0" />
                  <p className="text-sm text-white/90 leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap gap-3">
              <Button
                onClick={handleDownload}
                className="bg-[#c8a96e] hover:bg-[#b8995e] text-[#1a3a2a] font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Ladda ner garantibrev (PDF)
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Roadmap */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              Implementeringsplan
            </h2>
            <p className="text-muted-foreground">Stegvis implementering för att säkerställa kvalitet i varje fas.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-5 ${
                  phase.status === "active"
                    ? "border-emerald-200 bg-emerald-50"
                    : phase.status === "planned"
                    ? "border-amber-200 bg-amber-50"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">{phase.phase}</h3>
                  <Badge
                    variant="outline"
                    className={
                      phase.status === "active"
                        ? "border-emerald-400 text-emerald-700"
                        : phase.status === "planned"
                        ? "border-amber-400 text-amber-700"
                        : "border-muted text-muted-foreground"
                    }
                  >
                    {phase.status === "active" ? "Pågår" : phase.status === "planned" ? "Planerat" : "Framtid"}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      {phase.status === "active" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      ) : phase.status === "planned" ? (
                        <RefreshCw className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Complaint mechanism */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Klagomålsmekanism</h3>
                <p className="text-sm text-muted-foreground max-w-lg">
                  Har du sett något som inte stämmer? Misstänker du missbruk, felaktig data eller
                  diskriminering? Alla kan anmäla – anonymt om du önskar. Svar garanteras inom
                  10 arbetsdagar.
                </p>
              </div>
            </div>
            <Button
              onClick={handleComplaint}
              variant="outline"
              className="shrink-0"
            >
              Anmäl ett ärende
            </Button>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

