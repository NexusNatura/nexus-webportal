/**
 * NEXUS-OS â€“ Utbildningsmoduler: LektionsinnehÃ¥ll
 * Strukturerat kursinnehÃ¥ll med nyckelbegrepp, quiz och praktiska Ã¶vningar
 */
import { DPP_LESSONS } from "./dppLessons";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number; // index
  explanation: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
}

export interface LessonContent {
  id: string;
  courseId: string;
  moduleIndex: number;
  title: string;
  duration: string;
  free: boolean;
  intro: string;
  sections: {
    heading: string;
    body: string;
    highlight?: string; // pull-quote or key stat
  }[];
  keyConcepts: KeyConcept[];
  quiz: QuizQuestion[];
  practicalTip: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// KURS 1: ESPR-GRUNDEN
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const LESSON_CONTENT: LessonContent[] = [
  {
    id: "espr-foundation-0",
    courseId: "espr-foundation",
    moduleIndex: 0,
    title: "Vad Ã¤r ESPR och varfÃ¶r nu?",
    duration: "25 min",
    free: true,
    intro:
      "EU:s fÃ¶rordning om ekodesign fÃ¶r hÃ¥llbara produkter (ESPR) Ã¤r den mest omfattande produktregleringen i EU:s historia. Den ersÃ¤tter det gamla Ekodesigndirektivet och skapar ett nytt ramverk som pÃ¥verkar i princip alla fysiska produkter som sÃ¤ljs i EU. Denna lektion ger dig den grundlÃ¤ggande fÃ¶rstÃ¥elsen du behÃ¶ver.",
    sections: [
      {
        heading: "FrÃ¥n direktiv till fÃ¶rordning",
        body:
          "Det gamla Ekodesigndirektivet (2009/125/EG) fokuserade nÃ¤stan uteslutande pÃ¥ energieffektivitet hos energirelaterade produkter. ESPR (EU 2024/1781) Ã¤r en fÃ¶rordning â€“ inte ett direktiv â€“ vilket innebÃ¤r att den gÃ¤ller direkt i alla EU:s medlemsstater utan att behÃ¶va implementeras i nationell lagstiftning. Det Ã¤r en avgÃ¶rande skillnad som gÃ¶r regelverket snabbare och mer enhetligt.",
        highlight: "ESPR trÃ¤der i kraft 2026 och pÃ¥verkar uppskattningsvis 30+ produktkategorier de fÃ¶rsta Ã¥ren.",
      },
      {
        heading: "De tre pelarna i ESPR",
        body:
          "ESPR vilar pÃ¥ tre sammankopplade pelare. Den fÃ¶rsta Ã¤r Ekodesignkrav â€“ minimikrav pÃ¥ produkters hÃ¥llbarhet, reparerbarhet, Ã¥tervinningsbarhet och energieffektivitet. Den andra Ã¤r Det Digitala Produktpasset (DPP) â€“ ett digitalt identitetskort fÃ¶r varje produkt som samlar all miljÃ¶relevant information. Den tredje Ã¤r MarknadsÃ¶vervakning â€“ stÃ¤rkta mekanismer fÃ¶r att sÃ¤kerstÃ¤lla att reglerna efterlevs, inklusive ett EU-register fÃ¶r DPP:er.",
      },
      {
        heading: "Tidslinje och prioriterade produktkategorier",
        body:
          "Kommissionen har publicerat en arbetsplan fÃ¶r 2024â€“2030. De fÃ¶rsta produktkategorierna som regleras Ã¤r textilier (2026), elektronik och ICT-produkter (2026â€“2027), mÃ¶bler (2027), stÃ¥l och cement (2027â€“2028) samt kemikalier och batterier (lÃ¶pande). Varje kategori fÃ¥r sina egna delegerade akter med specifika krav.",
        highlight: "Textilier och elektronik Ã¤r de tvÃ¥ kategorier som berÃ¶rs allra fÃ¶rst â€“ 2026.",
      },
      {
        heading: "VarfÃ¶r det Ã¤r en mÃ¶jlighet, inte bara en bÃ¶rda",
        body:
          "FÃ¶retag som proaktivt anpassar sig till ESPR kan vinna konkurrensfÃ¶rdelar pÃ¥ flera sÃ¤tt: tillgÃ¥ng till EU:s grÃ¶na offentliga upphandling (GPP), stÃ¤rkta mÃ¶jligheter till EU-finansiering (Horizon Europe, Life+), differentiering mot konkurrenter som Ã¤nnu inte anpassat sig, och mÃ¶jligheten att sÃ¤lja produktdata via DPP-ekosystemet som en ny intÃ¤ktsstrÃ¶m.",
      },
    ],
    keyConcepts: [
      { term: "ESPR", definition: "Ecodesign for Sustainable Products Regulation (EU 2024/1781) â€“ EU:s ramfÃ¶rordning fÃ¶r hÃ¥llbara produkter." },
      { term: "DPP", definition: "Digitalt Produktpass â€“ ett digitalt dokument som samlar all miljÃ¶- och hÃ¥llbarhetsinformation om en specifik produkt." },
      { term: "Delegerad akt", definition: "En kompletterande rÃ¤ttsakt som Kommissionen antar fÃ¶r att specificera ESPR-krav fÃ¶r en viss produktkategori." },
      { term: "GPP", definition: "Green Public Procurement â€“ EU:s krav pÃ¥ att offentliga upphandlingar ska prioritera hÃ¥llbara produkter." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad Ã¤r den viktigaste juridiska skillnaden mellan det gamla Ekodesigndirektivet och ESPR?",
        options: [
          "ESPR gÃ¤ller bara fÃ¶r energiprodukter",
          "ESPR Ã¤r en fÃ¶rordning och gÃ¤ller direkt i alla EU-lÃ¤nder utan nationell implementering",
          "ESPR Ã¤r frivillig fÃ¶r fÃ¶retag utanfÃ¶r EU",
          "ESPR ersÃ¤tter bara den svenska miljÃ¶balken",
        ],
        correct: 1,
        explanation: "En EU-fÃ¶rordning gÃ¤ller direkt i alla medlemsstater, till skillnad frÃ¥n ett direktiv som mÃ¥ste implementeras i nationell lagstiftning. Det gÃ¶r ESPR snabbare och mer enhetligt.",
      },
      {
        id: "q2",
        question: "Vilka produktkategorier berÃ¶rs ALLRA FÃ–RST av ESPR (2026)?",
        options: [
          "StÃ¥l och cement",
          "MÃ¶bler och byggmaterial",
          "Textilier och elektronik/ICT",
          "Kemikalier och batterier",
        ],
        correct: 2,
        explanation: "Textilier och elektronik/ICT-produkter Ã¤r de tvÃ¥ prioriterade kategorierna i Kommissionens arbetsplan 2024â€“2030 och regleras frÃ¥n 2026.",
      },
      {
        id: "q3",
        question: "Vilket av fÃ¶ljande Ã¤r INTE en av ESPR:s tre pelare?",
        options: [
          "Ekodesignkrav",
          "Digitalt Produktpass (DPP)",
          "Koldioxidskatt pÃ¥ importprodukter",
          "MarknadsÃ¶vervakning",
        ],
        correct: 2,
        explanation: "Koldioxidskatt pÃ¥ importprodukter hÃ¶r till CBAM (Carbon Border Adjustment Mechanism), inte ESPR. ESPR:s tre pelare Ã¤r Ekodesignkrav, DPP och MarknadsÃ¶vervakning.",
      },
    ],
    practicalTip:
      "Kontrollera om dina produkter tillhÃ¶r textil- eller elektroniksektorn. Om ja, bÃ¶rja kartlÃ¤gga din leverantÃ¶rskedja redan nu â€“ DPP-kraven krÃ¤ver data frÃ¥n hela vÃ¤rdekedjan, och det tar tid att samla in.",
  },
  {
    id: "espr-foundation-1",
    courseId: "espr-foundation",
    moduleIndex: 1,
    title: "Produktkategorier och tidslinje",
    duration: "30 min",
    free: true,
    intro:
      "ESPR tÃ¤cker ett brett spektrum av produktkategorier med en fasad implementeringsplan fram till 2030. Att fÃ¶rstÃ¥ vilka kategorier som berÃ¶rs och nÃ¤r Ã¤r avgÃ¶rande fÃ¶r din compliance-planering.",
    sections: [
      {
        heading: "Arbetsplanen 2024â€“2030",
        body:
          "Kommissionen har publicerat en prioriterad arbetsplan som delar in produktkategorier i tre vÃ¥gor. FÃ¶rsta vÃ¥gen (2026) inkluderar textilier, elektronik och ICT. Andra vÃ¥gen (2027) inkluderar mÃ¶bler, jÃ¤rn, stÃ¥l och aluminium. Tredje vÃ¥gen (2028â€“2030) tÃ¤cker kemikalier, plaster, bygg- och konstruktionsprodukter samt livsmedelsrelaterade fÃ¶rpackningar.",
        highlight: "Mer Ã¤n 30 produktkategorier kommer att regleras under ESPR:s fÃ¶rsta fas.",
      },
      {
        heading: "Hur delegerade akter fungerar",
        body:
          "FÃ¶r varje produktkategori antar Kommissionen en delegerad akt som specificerar de exakta kraven. Processen inkluderar konsultation med industrin, en konsekvensanalys och ett remissfÃ¶rfarande. FÃ¶retag har normalt 18â€“36 mÃ¥nader pÃ¥ sig att anpassa sig efter att en delegerad akt publicerats i EU:s officiella tidning.",
      },
      {
        heading: "Minimiprestandakrav (MPR)",
        body:
          "Varje delegerad akt faststÃ¤ller minimiprestandakrav (MPR) fÃ¶r produktens hÃ¥llbarhet, reparerbarhet, Ã¥tervinningsbarhet och energieffektivitet. Produkter som inte uppfyller MPR fÃ¥r inte sÃ¤ljas pÃ¥ EU-marknaden. Kraven Ã¤r produktspecifika â€“ en textilprodukt har helt andra MPR Ã¤n en smartphone.",
      },
      {
        heading: "Kopplingen till offentlig upphandling",
        body:
          "ESPR Ã¤r direkt kopplad till EU:s Green Public Procurement (GPP)-kriterier. Offentliga upphandlare i EU â€“ kommuner, regioner, statliga myndigheter â€“ Ã¤r skyldiga att prioritera produkter som uppfyller ESPR-kraven. Det Ã¶ppnar en stor marknad fÃ¶r certifierade hÃ¥llbara produkter.",
        highlight: "EU:s offentliga upphandling uppgÃ¥r till ca 2 biljoner euro per Ã¥r.",
      },
    ],
    keyConcepts: [
      { term: "MPR", definition: "Minimiprestandakrav â€“ de lÃ¤gsta tillÃ¥tna prestanda en produkt mÃ¥ste ha fÃ¶r att fÃ¥ sÃ¤ljas pÃ¥ EU-marknaden." },
      { term: "Delegerad akt", definition: "Produktspecifik fÃ¶rordning som Kommissionen antar under ESPR-ramverket med detaljerade krav." },
      { term: "Arbetsplan", definition: "Kommissionens publicerade plan fÃ¶r vilka produktkategorier som regleras och nÃ¤r." },
      { term: "VÃ¥g 1/2/3", definition: "Informella termer fÃ¶r de tre faserna i ESPR-implementeringen: 2026, 2027 och 2028â€“2030." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Hur lÃ¥ng tid har fÃ¶retag normalt pÃ¥ sig att anpassa sig efter att en delegerad akt publicerats?",
        options: ["6â€“12 mÃ¥nader", "18â€“36 mÃ¥nader", "5 Ã¥r", "Ingen tidsgrÃ¤ns"],
        correct: 1,
        explanation: "Normalt ges 18â€“36 mÃ¥nader fÃ¶r anpassning efter publicering i EU:s officiella tidning, men det varierar per produktkategori och delegerad akt.",
      },
      {
        id: "q2",
        question: "Vilken produktkategori ingÃ¥r i ESPR:s ANDRA vÃ¥g (ca 2027)?",
        options: ["Textilier", "Elektronik och ICT", "MÃ¶bler och stÃ¥l", "LivsmedelsfÃ¶rpackningar"],
        correct: 2,
        explanation: "MÃ¶bler samt jÃ¤rn, stÃ¥l och aluminium ingÃ¥r i andra vÃ¥gen runt 2027. Textilier och elektronik Ã¤r i fÃ¶rsta vÃ¥gen (2026).",
      },
      {
        id: "q3",
        question: "Vad innebÃ¤r GPP i ESPR-sammanhang?",
        options: [
          "Global Product Passport â€“ ett internationellt produktpass",
          "Green Public Procurement â€“ offentlig upphandling som prioriterar hÃ¥llbara produkter",
          "General Performance Protocol â€“ ett testprotokoll fÃ¶r produkter",
          "Greenhouse Gas Prevention Program",
        ],
        correct: 1,
        explanation: "GPP (Green Public Procurement) innebÃ¤r att offentliga upphandlare Ã¤r skyldiga att prioritera produkter som uppfyller ESPR-kraven, vilket Ã¶ppnar en marknad vÃ¤rd ca 2 biljoner euro per Ã¥r.",
      },
    ],
    practicalTip:
      "Ladda ner Kommissionens officiella ESPR-arbetsplan frÃ¥n EUR-Lex och markera de kategorier som berÃ¶r ditt fÃ¶retag. Skapa en intern compliance-kalender med deadlines baserade pÃ¥ delegerade akter.",
  },
  {
    id: "espr-foundation-2",
    courseId: "espr-foundation",
    moduleIndex: 2,
    title: "FrÃ¥n produkt till tjÃ¤nst â€“ affÃ¤rsmodellen",
    duration: "35 min",
    free: true,
    intro:
      "ESPR driver en fundamental fÃ¶rÃ¤ndring i hur fÃ¶retag tÃ¤nker kring sina produkter â€“ frÃ¥n linjÃ¤r fÃ¶rsÃ¤ljning till cirkulÃ¤ra affÃ¤rsmodeller. Denna lektion utforskar de nya affÃ¤rsmÃ¶jligheterna som uppstÃ¥r.",
    sections: [
      {
        heading: "Product-as-a-Service (PaaS)",
        body:
          "ESPR:s krav pÃ¥ reparerbarhet och lÃ¥ng livslÃ¤ngd gynnar Product-as-a-Service-modeller dÃ¤r kunden betalar fÃ¶r anvÃ¤ndning snarare Ã¤n Ã¤gande. Tillverkaren behÃ¥ller Ã¤garskapet och har ekonomiska incitament att designa produkter som hÃ¥ller lÃ¤nge och Ã¤r lÃ¤tta att underhÃ¥lla. Exempel: Michelin sÃ¤ljer 'kilometer' istÃ¤llet fÃ¶r dÃ¤ck till lastbilsflottor.",
        highlight: "PaaS-marknaden fÃ¶rvÃ¤ntas vÃ¤xa till 1,2 biljoner USD globalt till 2030.",
      },
      {
        heading: "DPP som intÃ¤ktsstrÃ¶m",
        body:
          "Det Digitala Produktpasset skapar en ny typ av tillgÃ¥ng: produktdata. Tillverkare kan sÃ¤lja anonymiserad aggregerad data om produktprestanda, materialsammansÃ¤ttning och livscykel till Ã¥tervinnare, forskare och producenter av sekundÃ¤rmaterial. Nexus-OS Data Marketplace Ã¤r designad fÃ¶r just detta Ã¤ndamÃ¥l.",
      },
      {
        heading: "CirkulÃ¤r design som konkurrensfÃ¶rdel",
        body:
          "FÃ¶retag som designar produkter fÃ¶r demontering, reparation och Ã¥tervinning kan ta ut ett 'cirkulÃ¤rt premium' pÃ¥ marknaden. Studier visar att konsumenter Ã¤r villiga att betala 5â€“15% mer fÃ¶r produkter med dokumenterad hÃ¥llbarhet. DPP:et Ã¤r beviset som mÃ¶jliggÃ¶r detta premium.",
      },
      {
        heading: "Industriell symbios och materialbanker",
        body:
          "ESPR uppmuntrar industriell symbios â€“ dÃ¤r ett fÃ¶retags avfall blir ett annat fÃ¶retags rÃ¥material. DPP:et mÃ¶jliggÃ¶r detta genom att dokumentera materialsammansÃ¤ttning i detalj. Nexus-OS Symbios-modul matchar automatiskt avfallsstrÃ¶mmar med potentiella mottagare i Skaraborg-regionen.",
      },
    ],
    keyConcepts: [
      { term: "PaaS", definition: "Product-as-a-Service â€“ affÃ¤rsmodell dÃ¤r kunden betalar fÃ¶r anvÃ¤ndning av en produkt istÃ¤llet fÃ¶r att Ã¤ga den." },
      { term: "CirkulÃ¤rt premium", definition: "Det mervÃ¤rde (och merpris) som dokumenterad hÃ¥llbarhet skapar pÃ¥ marknaden." },
      { term: "Industriell symbios", definition: "Samarbete dÃ¤r ett fÃ¶retags avfall eller biprodukt anvÃ¤nds som rÃ¥material av ett annat fÃ¶retag." },
      { term: "Materialbank", definition: "Register Ã¶ver materialsammansÃ¤ttning i befintliga produkter som mÃ¶jliggÃ¶r framtida Ã¥tervinning." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad Ã¤r kÃ¤rnan i en Product-as-a-Service (PaaS) affÃ¤rsmodell?",
        options: [
          "Kunden kÃ¶per produkten och Ã¤ger den permanent",
          "Kunden betalar fÃ¶r anvÃ¤ndning, tillverkaren behÃ¥ller Ã¤garskapet",
          "Produkten Ã¤r gratis men tjÃ¤nsten kostar",
          "Tillverkaren hyr ut fabriken till kunden",
        ],
        correct: 1,
        explanation: "I PaaS betalar kunden fÃ¶r anvÃ¤ndning (t.ex. per timme, kilometer eller output) medan tillverkaren behÃ¥ller Ã¤garskapet. Det ger tillverkaren incitament att designa hÃ¥llbara, lÃ¤ttreparerade produkter.",
      },
      {
        id: "q2",
        question: "Hur kan DPP-data bli en intÃ¤ktsstrÃ¶m?",
        options: [
          "Genom att sÃ¤lja DPP-certifikat till konkurrenter",
          "Genom att sÃ¤lja anonymiserad produktdata till Ã¥tervinnare och sekundÃ¤rmaterialproducenter",
          "Genom att debitera EU-kommissionen fÃ¶r varje DPP som skapas",
          "DPP-data kan inte generera intÃ¤kter",
        ],
        correct: 1,
        explanation: "Aggregerad, anonymiserad data om materialsammansÃ¤ttning och produktprestanda Ã¤r vÃ¤rdefull fÃ¶r Ã¥tervinnare, forskare och producenter av sekundÃ¤rmaterial â€“ en ny intÃ¤ktsstrÃ¶m som DPP mÃ¶jliggÃ¶r.",
      },
      {
        id: "q3",
        question: "Hur mycket mer Ã¤r konsumenter typiskt villiga att betala fÃ¶r dokumenterat hÃ¥llbara produkter?",
        options: ["0â€“1%", "5â€“15%", "30â€“50%", "Konsumenter betalar inte mer"],
        correct: 1,
        explanation: "Studier visar att konsumenter Ã¤r villiga att betala 5â€“15% mer fÃ¶r produkter med dokumenterad hÃ¥llbarhet. DPP:et fungerar som det trovÃ¤rdiga beviset som mÃ¶jliggÃ¶r detta 'cirkulÃ¤ra premium'.",
      },
    ],
    practicalTip:
      "Analysera din nuvarande affÃ¤rsmodell: finns det delar av din produkt eller dess data som kan paketeras som en tjÃ¤nst? BÃ¶rja med att kartlÃ¤gga vilka aktÃ¶rer i din vÃ¤rdekedja som skulle kunna betala fÃ¶r din produktdata.",
  },
  {
    id: "espr-foundation-3",
    courseId: "espr-foundation",
    moduleIndex: 3,
    title: "Din 90-dagarsplan",
    duration: "30 min",
    free: true,
    intro:
      "Kunskap utan handling Ã¤r vÃ¤rdelÃ¶s. Denna avslutande lektion ger dig ett konkret ramverk fÃ¶r att omsÃ¤tta ESPR-kunskapen i praktiska steg under de kommande 90 dagarna.",
    sections: [
      {
        heading: "Dag 1â€“30: KartlÃ¤ggning",
        body:
          "BÃ¶rja med att kartlÃ¤gga din nuvarande situation. Vilka produktkategorier sÃ¤ljer du? Vilka berÃ¶rs av ESPR och nÃ¤r? Vilka data har du redan tillgÃ¤ngliga om dina produkters materialsammansÃ¤ttning, energifÃ¶rbrukning och livslÃ¤ngd? GenomfÃ¶r en gap-analys mot de fÃ¶rvÃ¤ntade MPR-kraven fÃ¶r din kategori.",
        highlight: "MÃ¥l: En komplett lista Ã¶ver berÃ¶rda produkter och en gap-analys mot ESPR-krav.",
      },
      {
        heading: "Dag 31â€“60: Prioritering och planering",
        body:
          "Baserat pÃ¥ kartlÃ¤ggningen, prioritera vilka produkter och processer som krÃ¤ver stÃ¶rst fÃ¶rÃ¤ndring. Identifiera leverantÃ¶rer som behÃ¶ver leverera data fÃ¶r DPP:et. UndersÃ¶k finansieringsmÃ¶jligheter â€“ Vinnova, Klimatklivet och Almi har alla program fÃ¶r cirkulÃ¤r omstÃ¤llning. Nexus-OS bidragsmatchning kan hjÃ¤lpa dig hitta rÃ¤tt program.",
      },
      {
        heading: "Dag 61â€“90: Pilotimplementering",
        body:
          "VÃ¤lj en produkt eller produktlinje fÃ¶r ett pilotprojekt. Skapa ett fÃ¶rsta DPP-utkast med Nexus-OS. Testa processen fÃ¶r datainsamling frÃ¥n leverantÃ¶rer. Dokumentera lÃ¤rdomar och bygg en skalbar process fÃ¶r resten av produktportfÃ¶ljen.",
        highlight: "MÃ¥l: Ett fungerande pilot-DPP och en dokumenterad process fÃ¶r skalning.",
      },
      {
        heading: "Resurser och nÃ¤sta steg",
        body:
          "Nexus-OS erbjuder tre verktyg som direkt stÃ¶der din 90-dagarsplan: DPP-skaparen fÃ¶r att bygga ditt produktpass, Bidragsnavigatorn fÃ¶r att hitta finansiering fÃ¶r omstÃ¤llningen, och Symbios-modulen fÃ¶r att identifiera lokala samarbetspartners. NÃ¤sta kurs â€“ DPP-skaparen â€“ ger dig den praktiska kompetensen att genomfÃ¶ra pilotimplementeringen.",
      },
    ],
    keyConcepts: [
      { term: "Gap-analys", definition: "Systematisk jÃ¤mfÃ¶relse mellan nulÃ¤ge och Ã¶nskat lÃ¤ge (ESPR-krav) fÃ¶r att identifiera vad som behÃ¶ver fÃ¶rÃ¤ndras." },
      { term: "MPR", definition: "Minimiprestandakrav â€“ de specifika krav din produkt mÃ¥ste uppfylla under ESPR." },
      { term: "Pilotimplementering", definition: "Att testa en ny process i liten skala fÃ¶r att lÃ¤ra sig och optimera innan full utrullning." },
      { term: "Skalbar process", definition: "En process som kan appliceras pÃ¥ fler produkter/enheter utan proportionellt Ã¶kad arbetsinsats." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad Ã¤r det primÃ¤ra mÃ¥let under de fÃ¶rsta 30 dagarna i 90-dagarsplanen?",
        options: [
          "Skapa ett komplett DPP fÃ¶r alla produkter",
          "SÃ¶ka EU-bidrag",
          "KartlÃ¤ggning och gap-analys mot ESPR-krav",
          "Byta affÃ¤rsmodell till PaaS",
        ],
        correct: 2,
        explanation: "De fÃ¶rsta 30 dagarna handlar om att fÃ¶rstÃ¥ nulÃ¤get: vilka produkter berÃ¶rs, vilken data finns, och vad Ã¤r gapet mot ESPR-kraven. Utan denna kartlÃ¤ggning Ã¤r det svÃ¥rt att prioritera rÃ¤tt.",
      },
      {
        id: "q2",
        question: "VarfÃ¶r Ã¤r det viktigt att involvera leverantÃ¶rer tidigt i ESPR-processen?",
        options: [
          "LeverantÃ¶rer mÃ¥ste betala fÃ¶r ditt DPP",
          "DPP krÃ¤ver data frÃ¥n hela vÃ¤rdekedjan, inklusive leverantÃ¶rers material och processer",
          "EU krÃ¤ver att leverantÃ¶rer signerar ESPR-avtal",
          "LeverantÃ¶rer kan ta Ã¶ver compliance-ansvaret",
        ],
        correct: 1,
        explanation: "DPP:et krÃ¤ver data om hela produktens livscykel, inklusive rÃ¥material och tillverkningsprocesser hos leverantÃ¶rer. Att samla in denna data tar tid och krÃ¤ver leverantÃ¶rernas samarbete.",
      },
      {
        id: "q3",
        question: "Vad Ã¤r syftet med en pilotimplementering (dag 61â€“90)?",
        options: [
          "Att lansera produkten pÃ¥ EU-marknaden",
          "Att testa processen i liten skala, lÃ¤ra sig och bygga en skalbar process",
          "Att certifiera hela produktportfÃ¶ljen",
          "Att avsluta ESPR-arbetet",
        ],
        correct: 1,
        explanation: "En pilot lÃ¥ter dig testa och optimera processen fÃ¶r datainsamling, DPP-skapande och verifiering pÃ¥ en produkt innan du skalar upp till hela portfÃ¶ljen. Det minskar risk och Ã¶kar effektiviteten.",
      },
    ],
    practicalTip:
      "Skapa en enkel Excel-tabell med dina produkter i raderna och ESPR-krav i kolumnerna. Markera rÃ¶tt (ej uppfyllt), gult (delvis) och grÃ¶nt (uppfyllt). Det Ã¤r din gap-analys â€“ och startpunkten fÃ¶r din 90-dagarsplan.",
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // KURS 2: DPP-SKAPAREN (modul 0 som preview)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-0",
    courseId: "dpp-creator",
    moduleIndex: 0,
    title: "DPP-strukturen â€“ vad ska med?",
    duration: "35 min",
    free: false,
    intro:
      "Det Digitala Produktpasset Ã¤r mer Ã¤n ett dokument â€“ det Ã¤r ett standardiserat digitalt identitetskort fÃ¶r din produkt. Denna lektion gÃ¥r igenom den tekniska strukturen och vilka datapunkter som Ã¤r obligatoriska.",
    sections: [
      {
        heading: "DPP:ets grundstruktur",
        body:
          "Ett DPP bestÃ¥r av tre lager: Identifieringslager (unik produktidentifierare, GTIN, batch/serienummer), Datapunkter (material, energi, koldioxid, reparerbarhet, Ã¥tervinningsbarhet) och LÃ¤nkstruktur (QR-kod eller RFID som pekar till ett EU-register). Strukturen Ã¤r baserad pÃ¥ GS1-standarder och EU:s EPCIS-format.",
        highlight: "Varje DPP mÃ¥ste ha en unik identifierare och vara registrerat i EU:s centrala DPP-register.",
      },
      {
        heading: "Obligatoriska vs. frivilliga datapunkter",
        body:
          "Varje delegerad akt specificerar vilka datapunkter som Ã¤r obligatoriska fÃ¶r den produktkategorin. Generellt Ã¤r materialsammansÃ¤ttning, koldioxidavtryck (Scope 1+2), reparerbarhetsindex och Ã¥tervinningsbarhet obligatoriska. Frivilliga datapunkter som Scope 3-utslÃ¤pp och sociala indikatorer kan lÃ¤ggas till fÃ¶r att stÃ¤rka produktens marknadsposition.",
      },
      {
        heading: "JSON-LD och lÃ¤nkad data",
        body:
          "DPP:er lagras som JSON-LD (JavaScript Object Notation for Linked Data) â€“ ett format som gÃ¶r data maskinlÃ¤sbar och lÃ¤nkbar. Du behÃ¶ver inte kunna programmera fÃ¶r att skapa ett DPP med Nexus-OS, men det hjÃ¤lper att fÃ¶rstÃ¥ grundkonceptet: varje datapunkt har en unik URI som gÃ¶r den universellt fÃ¶rstÃ¥elig.",
      },
    ],
    keyConcepts: [
      { term: "JSON-LD", definition: "JavaScript Object Notation for Linked Data â€“ standardformat fÃ¶r DPP-data som gÃ¶r den maskinlÃ¤sbar och lÃ¤nkbar." },
      { term: "GTIN", definition: "Global Trade Item Number â€“ standardiserad produktidentifierare (streckkod/EAN)." },
      { term: "Reparerbarhetsindex", definition: "EU-standardiserat mÃ¥tt (0â€“10) pÃ¥ hur lÃ¤tt en produkt Ã¤r att reparera." },
      { term: "EPCIS", definition: "Electronic Product Code Information Services â€“ EU-standard fÃ¶r spÃ¥rbarhet i leverantÃ¶rskedjor." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilka tre lager bestÃ¥r ett DPP av?",
        options: [
          "Certifikat, rapport och faktura",
          "Identifieringslager, datapunkter och lÃ¤nkstruktur",
          "Produktbeskrivning, pris och garanti",
          "Tillverkare, distributÃ¶r och Ã¥terfÃ¶rsÃ¤ljare",
        ],
        correct: 1,
        explanation: "DPP:ets tre lager Ã¤r: Identifieringslager (unik ID), Datapunkter (miljÃ¶data) och LÃ¤nkstruktur (QR/RFID till EU-register).",
      },
      {
        id: "q2",
        question: "Vilket dataformat anvÃ¤nds fÃ¶r att lagra DPP-data?",
        options: ["PDF", "Excel/CSV", "JSON-LD", "Word-dokument"],
        correct: 2,
        explanation: "JSON-LD (JavaScript Object Notation for Linked Data) Ã¤r standardformatet fÃ¶r DPP-data. Det gÃ¶r datan maskinlÃ¤sbar, lÃ¤nkbar och universellt fÃ¶rstÃ¥elig.",
      },
      {
        id: "q3",
        question: "Vad mÃ¤ter reparerbarhetsindex?",
        options: [
          "Hur mycket produkten kostar att reparera",
          "EU-standardiserat mÃ¥tt (0â€“10) pÃ¥ hur lÃ¤tt en produkt Ã¤r att reparera",
          "Antalet gÃ¥nger en produkt kan repareras",
          "TillgÃ¥ngen pÃ¥ reservdelar pÃ¥ marknaden",
        ],
        correct: 1,
        explanation: "Reparerbarhetsindex Ã¤r ett EU-standardiserat mÃ¥tt frÃ¥n 0 till 10 som mÃ¤ter hur lÃ¤tt en produkt Ã¤r att reparera, baserat pÃ¥ faktorer som tillgÃ¥ng till reservdelar, dokumentation och demonterbarhet.",
      },
    ],
    practicalTip:
      "BÃ¶rja med att samla in GTIN-numren fÃ¶r dina produkter och kartlÃ¤gga materialsammansÃ¤ttningen fÃ¶r din mest sÃ¥lda produkt. Det Ã¤r de tvÃ¥ datapunkter som krÃ¤ver mest fÃ¶rarbete.",
  },
];

// Merge all course lessons
const ALL_LESSONS: LessonContent[] = [...LESSON_CONTENT, ...DPP_LESSONS];

export function getLessonContent(courseId: string, moduleIndex: number): LessonContent | undefined {
  return ALL_LESSONS.find(l => l.courseId === courseId && l.moduleIndex === moduleIndex);
}

export function getCourseLessons(courseId: string): LessonContent[] {
  return ALL_LESSONS.filter(l => l.courseId === courseId).sort((a, b) => a.moduleIndex - b.moduleIndex);
}

