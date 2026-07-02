/**
 * NEXUS-OS â€“ Kursdata
 * Kurskatalogens statiska data: utbildningsvÃ¤gar och certifieringar
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
    subtitle: "FÃ¶rstÃ¥ EU:s ekodesignkrav",
    level: "NybÃ¶rjare",
    duration: "2 timmar",
    modules: 4,
    free: true,
    progress: 0,
    color: "emerald",
    icon: Leaf,
    description:
      "LÃ¤r dig grunderna i EU:s ESPR-fÃ¶rordning och vad den innebÃ¤r fÃ¶r ditt fÃ¶retag. Inga fÃ¶rkunskaper krÃ¤vs.",
    outcomes: [
      "FÃ¶rstÃ¥ ESPR-tidslinje 2026â€“2030",
      "Identifiera vilka produktkategorier som berÃ¶rs",
      "FÃ¶rstÃ¥ skillnaden mellan DPP och EPD",
      "Planera din compliance-resa",
    ],
    modules_list: [
      { title: "Vad Ã¤r ESPR och varfÃ¶r nu?", duration: "25 min", free: true },
      { title: "Produktkategorier och tidslinje", duration: "30 min", free: true },
      { title: "FrÃ¥n produkt till tjÃ¤nst â€“ affÃ¤rsmodellen", duration: "35 min", free: true },
      { title: "Din 90-dagarsplan", duration: "30 min", free: true },
    ],
  },
  {
    id: "dpp-creator",
    title: "DPP-skaparen",
    subtitle: "Bygg ditt fÃ¶rsta produktpass",
    level: "GrundlÃ¤ggande",
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
      "FÃ¶rstÃ¥ JSON-LD och EU-datastandard",
      "Publicera och dela ditt DPP",
    ],
    modules_list: [
      { title: "DPP-strukturen â€“ vad ska med?", duration: "35 min", free: false },
      { title: "LCA-data â€“ samla in rÃ¤tt information", duration: "40 min", free: false },
      { title: "Skapa DPP med Nexus-OS (hands-on)", duration: "45 min", free: false },
      { title: "Verifiera och publicera", duration: "30 min", free: false },
      { title: "UnderhÃ¥ll och uppdatering", duration: "30 min", free: false },
    ],
  },
  {
    id: "lca-master",
    title: "LCA-mÃ¤staren",
    subtitle: "Livscykelanalys i praktiken",
    level: "Avancerad",
    duration: "4 timmar",
    modules: 6,
    free: false,
    progress: 0,
    color: "purple",
    icon: BarChart3,
    description:
      "Djupkurs i livscykelanalys enligt ISO 14040/14044. LÃ¤r dig berÃ¤kna COâ‚‚, vatten och materialavtryck fÃ¶r dina produkter.",
    outcomes: [
      "GenomfÃ¶ra en fullstÃ¤ndig LCA-analys",
      "BerÃ¤kna Scope 1, 2 och 3-utslÃ¤pp",
      "Tolka och kommunicera LCA-resultat",
      "AnvÃ¤nda LCA fÃ¶r produktutveckling",
    ],
    modules_list: [
      { title: "LCA-metodiken â€“ ISO 14040 grunden", duration: "40 min", free: false },
      { title: "SystemgrÃ¤nser och funktionell enhet", duration: "35 min", free: false },
      { title: "Datainsamling och kvalitet", duration: "45 min", free: false },
      { title: "BerÃ¤kna COâ‚‚ och vatten", duration: "45 min", free: false },
      { title: "Tolka och kommunicera resultat", duration: "35 min", free: false },
      { title: "LCA i Nexus-OS (hands-on)", duration: "40 min", free: false },
    ],
  },
  {
    id: "grants-navigator",
    title: "Bidragsnavigatorn",
    subtitle: "Vinn EU-finansiering",
    level: "GrundlÃ¤ggande",
    duration: "2.5 timmar",
    modules: 4,
    free: false,
    progress: 0,
    color: "amber",
    icon: TrendingUp,
    description:
      "LÃ¤r dig skriva vinnande bidragsansÃ¶kningar till Vinnova, Almi, Klimatklivet och Horizon Europe. Med mallar och exempel.",
    outcomes: [
      "Identifiera rÃ¤tt finansieringsprogram",
      "Skriva en Ã¶vertygande projektbeskrivning",
      "Budgetera och planera ett bidragsprojekt",
      "AnvÃ¤nda NexusCore fÃ¶r ansÃ¶kningsgenerering",
    ],
    modules_list: [
      { title: "Finansieringslandskapet 2026", duration: "30 min", free: false },
      { title: "Vinnande ansÃ¶kningsstruktur", duration: "40 min", free: false },
      { title: "Budget och tidplan", duration: "35 min", free: false },
      { title: "NexusCore â€“ automatisera ansÃ¶kan", duration: "45 min", free: false },
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Certified ESPR Practitioner",
    abbr: "CEP",
    description: "Bevis pÃ¥ grundlÃ¤ggande kompetens i EU:s ESPR-fÃ¶rordning",
    requires: ["ESPR-grunden"],
    price: "IngÃ¥r i gratis-plan",
    color: "emerald",
  },
  {
    name: "Certified DPP Creator",
    abbr: "CDC",
    description: "Bevis pÃ¥ fÃ¶rmÃ¥ga att skapa EU-kompatibla Digitala Produktpass",
    requires: ["ESPR-grunden", "DPP-skaparen"],
    price: "499 kr",
    color: "blue",
  },
  {
    name: "Nexus Circular Excellence",
    abbr: "NCE",
    description:
      "FullstÃ¤ndig certifiering â€“ stÃ¤rker din ansÃ¶kan till Vinnova, Almi och EU-finansiering",
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

