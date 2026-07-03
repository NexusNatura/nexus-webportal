/**
 * NEXUS-OS – Kursdata
 * Kurskatalogens statiska data: utbildningsvägar och certifieringar
 */

import { Leaf, FileText, BarChart3, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ModuleItem {
  title: string;
  duration: string;
  free: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  modules: number;
  free: boolean;
  progress: number;
  color: string;
  icon: LucideIcon;
  description: string;
  outcomes: string[];
  modules_list: ModuleItem[];
}

export interface Certification {
  name: string;
  abbr: string;
  description: string;
  requires: string[];
  price: string;
  color: string;
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "espr-foundation",
    title: "ESPR-grunden",
    subtitle: "Förstå EU:s ekodesignkrav",
    level: "Nybörjare",
    duration: "2 timmar",
    modules: 4,
    free: true,
    progress: 0,
    color: "emerald",
    icon: Leaf,
    description:
      "Lär dig grunderna i EU:s ESPR-förordning och vad den innebär för ditt företag. Inga förkunskaper krävs.",
    outcomes: [
      "Förstå ESPR-tidslinje 2026–2030",
      "Identifiera vilka produktkategorier som berörs",
      "Förstå skillnaden mellan DPP och EPD",
      "Planera din compliance-resa",
    ],
    modules_list: [
      { title: "Vad är ESPR och varför nu?", duration: "25 min", free: true },
      { title: "Produktkategorier och tidslinje", duration: "30 min", free: true },
      { title: "Från produkt till tjänst – affärsmodellen", duration: "35 min", free: true },
      { title: "Din 90-dagarsplan", duration: "30 min", free: true },
    ],
  },
  {
    id: "dpp-creator",
    title: "DPP-skaparen",
    subtitle: "Bygg ditt första produktpass",
    level: "Grundläggande",
    duration: "3 timmar",
    modules: 5,
    free: false,
    progress: 0,
    color: "blue",
    icon: FileText,
    description:
      "Praktisk kurs i att skapa ett EU-kompatibelt Digitalt Produktpass med Nexus-OS. Inkluderar mall och certifikat.",
    outcomes: [
      "Skapa ett komplett DPP med Nexus-OS",
      "Samla in och strukturera LCA-data",
      "Förstå JSON-LD och EU-datastandard",
      "Publicera och dela ditt DPP",
    ],
    modules_list: [
      { title: "DPP-strukturen – vad ska med?", duration: "35 min", free: false },
      { title: "LCA-data – samla in rätt information", duration: "40 min", free: false },
      { title: "Skapa DPP med Nexus-OS (hands-on)", duration: "45 min", free: false },
      { title: "Verifiera och publicera", duration: "30 min", free: false },
      { title: "Underhåll och uppdatering", duration: "30 min", free: false },
    ],
  },
  {
    id: "lca-master",
    title: "LCA-mästaren",
    subtitle: "Livscykelanalys i praktiken",
    level: "Avancerad",
    duration: "4 timmar",
    modules: 6,
    free: false,
    progress: 0,
    color: "purple",
    icon: BarChart3,
    description:
      "Djupkurs i livscykelanalys enligt ISO 14040/14044. Lär dig beräkna COâ‚‚, vatten och materialavtryck för dina produkter.",
    outcomes: [
      "Genomföra en fullständig LCA-analys",
      "Beräkna Scope 1, 2 och 3-utsläpp",
      "Tolka och kommunicera LCA-resultat",
      "Använda LCA för produktutveckling",
    ],
    modules_list: [
      { title: "LCA-metodiken – ISO 14040 grunden", duration: "40 min", free: false },
      { title: "Systemgränser och funktionell enhet", duration: "35 min", free: false },
      { title: "Datainsamling och kvalitet", duration: "45 min", free: false },
      { title: "Beräkna COâ‚‚ och vatten", duration: "45 min", free: false },
      { title: "Tolka och kommunicera resultat", duration: "35 min", free: false },
      { title: "LCA i Nexus-OS (hands-on)", duration: "40 min", free: false },
    ],
  },
  {
    id: "grants-navigator",
    title: "Bidragsnavigatorn",
    subtitle: "Vinn EU-finansiering",
    level: "Grundläggande",
    duration: "2.5 timmar",
    modules: 4,
    free: false,
    progress: 0,
    color: "amber",
    icon: TrendingUp,
    description:
      "Lär dig skriva vinnande bidragsansökningar till Vinnova, Almi, Klimatklivet och Horizon Europe. Med mallar och exempel.",
    outcomes: [
      "Identifiera rätt finansieringsprogram",
      "Skriva en övertygande projektbeskrivning",
      "Budgetera och planera ett bidragsprojekt",
      "Använda NexusCore för ansökningsgenerering",
    ],
    modules_list: [
      { title: "Finansieringslandskapet 2026", duration: "30 min", free: false },
      { title: "Vinnande ansökningsstruktur", duration: "40 min", free: false },
      { title: "Budget och tidplan", duration: "35 min", free: false },
      { title: "NexusCore – automatisera ansökan", duration: "45 min", free: false },
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Certified ESPR Practitioner",
    abbr: "CEP",
    description: "Bevis på grundläggande kompetens i EU:s ESPR-förordning",
    requires: ["ESPR-grunden"],
    price: "Ingår i gratis-plan",
    color: "emerald",
  },
  {
    name: "Certified DPP Creator",
    abbr: "CDC",
    description: "Bevis på förmåga att skapa EU-kompatibla Digitala Produktpass",
    requires: ["ESPR-grunden", "DPP-skaparen"],
    price: "499 kr",
    color: "blue",
  },
  {
    name: "Nexus Circular Excellence",
    abbr: "NCE",
    description:
      "Fullständig certifiering – stärker din ansökan till Vinnova, Almi och EU-finansiering",
    requires: ["Alla fyra kurser"],
    price: "1 499 kr",
    color: "copper",
  },
];

export const levelColor: Record<string, string> = {
  Nybörjare: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Grundläggande: "bg-blue-100 text-blue-700 border-blue-200",
  Avancerad: "bg-purple-100 text-purple-700 border-purple-200",
};

