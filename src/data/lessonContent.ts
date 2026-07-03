/**
 * NEXUS-OS – Utbildningsmoduler: Lektionsinnehåll
 * Strukturerat kursinnehåll med nyckelbegrepp, quiz och praktiska övningar
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
    title: "Vad är ESPR och varför nu?",
    duration: "25 min",
    free: true,
    intro:
      "EU:s förordning om ekodesign för hållbara produkter (ESPR) är den mest omfattande produktregleringen i EU:s historia. Den ersätter det gamla Ekodesigndirektivet och skapar ett nytt ramverk som påverkar i princip alla fysiska produkter som säljs i EU. Denna lektion ger dig den grundläggande förståelsen du behöver.",
    sections: [
      {
        heading: "Från direktiv till förordning",
        body:
          "Det gamla Ekodesigndirektivet (2009/125/EG) fokuserade nästan uteslutande på energieffektivitet hos energirelaterade produkter. ESPR (EU 2024/1781) är en förordning – inte ett direktiv – vilket innebär att den gäller direkt i alla EU:s medlemsstater utan att behöva implementeras i nationell lagstiftning. Det är en avgörande skillnad som gör regelverket snabbare och mer enhetligt.",
        highlight: "ESPR träder i kraft 2026 och påverkar uppskattningsvis 30+ produktkategorier de första åren.",
      },
      {
        heading: "De tre pelarna i ESPR",
        body:
          "ESPR vilar på tre sammankopplade pelare. Den första är Ekodesignkrav – minimikrav på produkters hållbarhet, reparerbarhet, återvinningsbarhet och energieffektivitet. Den andra är Det Digitala Produktpasset (DPP) – ett digitalt identitetskort för varje produkt som samlar all miljörelevant information. Den tredje är Marknadsövervakning – stärkta mekanismer för att säkerställa att reglerna efterlevs, inklusive ett EU-register för DPP:er.",
      },
      {
        heading: "Tidslinje och prioriterade produktkategorier",
        body:
          "Kommissionen har publicerat en arbetsplan för 2024–2030. De första produktkategorierna som regleras är textilier (2026), elektronik och ICT-produkter (2026–2027), möbler (2027), stål och cement (2027–2028) samt kemikalier och batterier (löpande). Varje kategori får sina egna delegerade akter med specifika krav.",
        highlight: "Textilier och elektronik är de två kategorier som berörs allra först – 2026.",
      },
      {
        heading: "Varför det är en möjlighet, inte bara en börda",
        body:
          "Företag som proaktivt anpassar sig till ESPR kan vinna konkurrensfördelar på flera sätt: tillgång till EU:s gröna offentliga upphandling (GPP), stärkta möjligheter till EU-finansiering (Horizon Europe, Life+), differentiering mot konkurrenter som ännu inte anpassat sig, och möjligheten att sälja produktdata via DPP-ekosystemet som en ny intäktsström.",
      },
    ],
    keyConcepts: [
      { term: "ESPR", definition: "Ecodesign for Sustainable Products Regulation (EU 2024/1781) – EU:s ramförordning för hållbara produkter." },
      { term: "DPP", definition: "Digitalt Produktpass – ett digitalt dokument som samlar all miljö- och hållbarhetsinformation om en specifik produkt." },
      { term: "Delegerad akt", definition: "En kompletterande rättsakt som Kommissionen antar för att specificera ESPR-krav för en viss produktkategori." },
      { term: "GPP", definition: "Green Public Procurement – EU:s krav på att offentliga upphandlingar ska prioritera hållbara produkter." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad är den viktigaste juridiska skillnaden mellan det gamla Ekodesigndirektivet och ESPR?",
        options: [
          "ESPR gäller bara för energiprodukter",
          "ESPR är en förordning och gäller direkt i alla EU-länder utan nationell implementering",
          "ESPR är frivillig för företag utanför EU",
          "ESPR ersätter bara den svenska miljöbalken",
        ],
        correct: 1,
        explanation: "En EU-förordning gäller direkt i alla medlemsstater, till skillnad från ett direktiv som måste implementeras i nationell lagstiftning. Det gör ESPR snabbare och mer enhetligt.",
      },
      {
        id: "q2",
        question: "Vilka produktkategorier berörs ALLRA FÖRST av ESPR (2026)?",
        options: [
          "Stål och cement",
          "Möbler och byggmaterial",
          "Textilier och elektronik/ICT",
          "Kemikalier och batterier",
        ],
        correct: 2,
        explanation: "Textilier och elektronik/ICT-produkter är de två prioriterade kategorierna i Kommissionens arbetsplan 2024–2030 och regleras från 2026.",
      },
      {
        id: "q3",
        question: "Vilket av följande är INTE en av ESPR:s tre pelare?",
        options: [
          "Ekodesignkrav",
          "Digitalt Produktpass (DPP)",
          "Koldioxidskatt på importprodukter",
          "Marknadsövervakning",
        ],
        correct: 2,
        explanation: "Koldioxidskatt på importprodukter hör till CBAM (Carbon Border Adjustment Mechanism), inte ESPR. ESPR:s tre pelare är Ekodesignkrav, DPP och Marknadsövervakning.",
      },
    ],
    practicalTip:
      "Kontrollera om dina produkter tillhör textil- eller elektroniksektorn. Om ja, börja kartlägga din leverantörskedja redan nu – DPP-kraven kräver data från hela värdekedjan, och det tar tid att samla in.",
  },
  {
    id: "espr-foundation-1",
    courseId: "espr-foundation",
    moduleIndex: 1,
    title: "Produktkategorier och tidslinje",
    duration: "30 min",
    free: true,
    intro:
      "ESPR täcker ett brett spektrum av produktkategorier med en fasad implementeringsplan fram till 2030. Att förstå vilka kategorier som berörs och när är avgörande för din compliance-planering.",
    sections: [
      {
        heading: "Arbetsplanen 2024–2030",
        body:
          "Kommissionen har publicerat en prioriterad arbetsplan som delar in produktkategorier i tre vågor. Första vågen (2026) inkluderar textilier, elektronik och ICT. Andra vågen (2027) inkluderar möbler, järn, stål och aluminium. Tredje vågen (2028–2030) täcker kemikalier, plaster, bygg- och konstruktionsprodukter samt livsmedelsrelaterade förpackningar.",
        highlight: "Mer än 30 produktkategorier kommer att regleras under ESPR:s första fas.",
      },
      {
        heading: "Hur delegerade akter fungerar",
        body:
          "För varje produktkategori antar Kommissionen en delegerad akt som specificerar de exakta kraven. Processen inkluderar konsultation med industrin, en konsekvensanalys och ett remissförfarande. Företag har normalt 18–36 månader på sig att anpassa sig efter att en delegerad akt publicerats i EU:s officiella tidning.",
      },
      {
        heading: "Minimiprestandakrav (MPR)",
        body:
          "Varje delegerad akt fastställer minimiprestandakrav (MPR) för produktens hållbarhet, reparerbarhet, återvinningsbarhet och energieffektivitet. Produkter som inte uppfyller MPR får inte säljas på EU-marknaden. Kraven är produktspecifika – en textilprodukt har helt andra MPR än en smartphone.",
      },
      {
        heading: "Kopplingen till offentlig upphandling",
        body:
          "ESPR är direkt kopplad till EU:s Green Public Procurement (GPP)-kriterier. Offentliga upphandlare i EU – kommuner, regioner, statliga myndigheter – är skyldiga att prioritera produkter som uppfyller ESPR-kraven. Det öppnar en stor marknad för certifierade hållbara produkter.",
        highlight: "EU:s offentliga upphandling uppgår till ca 2 biljoner euro per år.",
      },
    ],
    keyConcepts: [
      { term: "MPR", definition: "Minimiprestandakrav – de lägsta tillåtna prestanda en produkt måste ha för att få säljas på EU-marknaden." },
      { term: "Delegerad akt", definition: "Produktspecifik förordning som Kommissionen antar under ESPR-ramverket med detaljerade krav." },
      { term: "Arbetsplan", definition: "Kommissionens publicerade plan för vilka produktkategorier som regleras och när." },
      { term: "Våg 1/2/3", definition: "Informella termer för de tre faserna i ESPR-implementeringen: 2026, 2027 och 2028–2030." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Hur lång tid har företag normalt på sig att anpassa sig efter att en delegerad akt publicerats?",
        options: ["6–12 månader", "18–36 månader", "5 år", "Ingen tidsgräns"],
        correct: 1,
        explanation: "Normalt ges 18–36 månader för anpassning efter publicering i EU:s officiella tidning, men det varierar per produktkategori och delegerad akt.",
      },
      {
        id: "q2",
        question: "Vilken produktkategori ingår i ESPR:s ANDRA våg (ca 2027)?",
        options: ["Textilier", "Elektronik och ICT", "Möbler och stål", "Livsmedelsförpackningar"],
        correct: 2,
        explanation: "Möbler samt järn, stål och aluminium ingår i andra vågen runt 2027. Textilier och elektronik är i första vågen (2026).",
      },
      {
        id: "q3",
        question: "Vad innebär GPP i ESPR-sammanhang?",
        options: [
          "Global Product Passport – ett internationellt produktpass",
          "Green Public Procurement – offentlig upphandling som prioriterar hållbara produkter",
          "General Performance Protocol – ett testprotokoll för produkter",
          "Greenhouse Gas Prevention Program",
        ],
        correct: 1,
        explanation: "GPP (Green Public Procurement) innebär att offentliga upphandlare är skyldiga att prioritera produkter som uppfyller ESPR-kraven, vilket öppnar en marknad värd ca 2 biljoner euro per år.",
      },
    ],
    practicalTip:
      "Ladda ner Kommissionens officiella ESPR-arbetsplan från EUR-Lex och markera de kategorier som berör ditt företag. Skapa en intern compliance-kalender med deadlines baserade på delegerade akter.",
  },
  {
    id: "espr-foundation-2",
    courseId: "espr-foundation",
    moduleIndex: 2,
    title: "Från produkt till tjänst – affärsmodellen",
    duration: "35 min",
    free: true,
    intro:
      "ESPR driver en fundamental förändring i hur företag tänker kring sina produkter – från linjär försäljning till cirkulära affärsmodeller. Denna lektion utforskar de nya affärsmöjligheterna som uppstår.",
    sections: [
      {
        heading: "Product-as-a-Service (PaaS)",
        body:
          "ESPR:s krav på reparerbarhet och lång livslängd gynnar Product-as-a-Service-modeller där kunden betalar för användning snarare än ägande. Tillverkaren behåller ägarskapet och har ekonomiska incitament att designa produkter som håller länge och är lätta att underhålla. Exempel: Michelin säljer 'kilometer' istället för däck till lastbilsflottor.",
        highlight: "PaaS-marknaden förväntas växa till 1,2 biljoner USD globalt till 2030.",
      },
      {
        heading: "DPP som intäktsström",
        body:
          "Det Digitala Produktpasset skapar en ny typ av tillgång: produktdata. Tillverkare kan sälja anonymiserad aggregerad data om produktprestanda, materialsammansättning och livscykel till återvinnare, forskare och producenter av sekundärmaterial. Nexus-OS Data Marketplace är designad för just detta ändamål.",
      },
      {
        heading: "Cirkulär design som konkurrensfördel",
        body:
          "Företag som designar produkter för demontering, reparation och återvinning kan ta ut ett 'cirkulärt premium' på marknaden. Studier visar att konsumenter är villiga att betala 5–15% mer för produkter med dokumenterad hållbarhet. DPP:et är beviset som möjliggör detta premium.",
      },
      {
        heading: "Industriell symbios och materialbanker",
        body:
          "ESPR uppmuntrar industriell symbios – där ett företags avfall blir ett annat företags råmaterial. DPP:et möjliggör detta genom att dokumentera materialsammansättning i detalj. Nexus-OS Symbios-modul matchar automatiskt avfallsströmmar med potentiella mottagare i Skaraborg-regionen.",
      },
    ],
    keyConcepts: [
      { term: "PaaS", definition: "Product-as-a-Service – affärsmodell där kunden betalar för användning av en produkt istället för att äga den." },
      { term: "Cirkulärt premium", definition: "Det mervärde (och merpris) som dokumenterad hållbarhet skapar på marknaden." },
      { term: "Industriell symbios", definition: "Samarbete där ett företags avfall eller biprodukt används som råmaterial av ett annat företag." },
      { term: "Materialbank", definition: "Register över materialsammansättning i befintliga produkter som möjliggör framtida återvinning." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad är kärnan i en Product-as-a-Service (PaaS) affärsmodell?",
        options: [
          "Kunden köper produkten och äger den permanent",
          "Kunden betalar för användning, tillverkaren behåller ägarskapet",
          "Produkten är gratis men tjänsten kostar",
          "Tillverkaren hyr ut fabriken till kunden",
        ],
        correct: 1,
        explanation: "I PaaS betalar kunden för användning (t.ex. per timme, kilometer eller output) medan tillverkaren behåller ägarskapet. Det ger tillverkaren incitament att designa hållbara, lättreparerade produkter.",
      },
      {
        id: "q2",
        question: "Hur kan DPP-data bli en intäktsström?",
        options: [
          "Genom att sälja DPP-certifikat till konkurrenter",
          "Genom att sälja anonymiserad produktdata till återvinnare och sekundärmaterialproducenter",
          "Genom att debitera EU-kommissionen för varje DPP som skapas",
          "DPP-data kan inte generera intäkter",
        ],
        correct: 1,
        explanation: "Aggregerad, anonymiserad data om materialsammansättning och produktprestanda är värdefull för återvinnare, forskare och producenter av sekundärmaterial – en ny intäktsström som DPP möjliggör.",
      },
      {
        id: "q3",
        question: "Hur mycket mer är konsumenter typiskt villiga att betala för dokumenterat hållbara produkter?",
        options: ["0–1%", "5–15%", "30–50%", "Konsumenter betalar inte mer"],
        correct: 1,
        explanation: "Studier visar att konsumenter är villiga att betala 5–15% mer för produkter med dokumenterad hållbarhet. DPP:et fungerar som det trovärdiga beviset som möjliggör detta 'cirkulära premium'.",
      },
    ],
    practicalTip:
      "Analysera din nuvarande affärsmodell: finns det delar av din produkt eller dess data som kan paketeras som en tjänst? Börja med att kartlägga vilka aktörer i din värdekedja som skulle kunna betala för din produktdata.",
  },
  {
    id: "espr-foundation-3",
    courseId: "espr-foundation",
    moduleIndex: 3,
    title: "Din 90-dagarsplan",
    duration: "30 min",
    free: true,
    intro:
      "Kunskap utan handling är värdelös. Denna avslutande lektion ger dig ett konkret ramverk för att omsätta ESPR-kunskapen i praktiska steg under de kommande 90 dagarna.",
    sections: [
      {
        heading: "Dag 1–30: Kartläggning",
        body:
          "Börja med att kartlägga din nuvarande situation. Vilka produktkategorier säljer du? Vilka berörs av ESPR och när? Vilka data har du redan tillgängliga om dina produkters materialsammansättning, energiförbrukning och livslängd? Genomför en gap-analys mot de förväntade MPR-kraven för din kategori.",
        highlight: "Mål: En komplett lista över berörda produkter och en gap-analys mot ESPR-krav.",
      },
      {
        heading: "Dag 31–60: Prioritering och planering",
        body:
          "Baserat på kartläggningen, prioritera vilka produkter och processer som kräver störst förändring. Identifiera leverantörer som behöver leverera data för DPP:et. Undersök finansieringsmöjligheter – Vinnova, Klimatklivet och Almi har alla program för cirkulär omställning. Nexus-OS bidragsmatchning kan hjälpa dig hitta rätt program.",
      },
      {
        heading: "Dag 61–90: Pilotimplementering",
        body:
          "Välj en produkt eller produktlinje för ett pilotprojekt. Skapa ett första DPP-utkast med Nexus-OS. Testa processen för datainsamling från leverantörer. Dokumentera lärdomar och bygg en skalbar process för resten av produktportföljen.",
        highlight: "Mål: Ett fungerande pilot-DPP och en dokumenterad process för skalning.",
      },
      {
        heading: "Resurser och nästa steg",
        body:
          "Nexus-OS erbjuder tre verktyg som direkt stöder din 90-dagarsplan: DPP-skaparen för att bygga ditt produktpass, Bidragsnavigatorn för att hitta finansiering för omställningen, och Symbios-modulen för att identifiera lokala samarbetspartners. Nästa kurs – DPP-skaparen – ger dig den praktiska kompetensen att genomföra pilotimplementeringen.",
      },
    ],
    keyConcepts: [
      { term: "Gap-analys", definition: "Systematisk jämförelse mellan nuläge och önskat läge (ESPR-krav) för att identifiera vad som behöver förändras." },
      { term: "MPR", definition: "Minimiprestandakrav – de specifika krav din produkt måste uppfylla under ESPR." },
      { term: "Pilotimplementering", definition: "Att testa en ny process i liten skala för att lära sig och optimera innan full utrullning." },
      { term: "Skalbar process", definition: "En process som kan appliceras på fler produkter/enheter utan proportionellt ökad arbetsinsats." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad är det primära målet under de första 30 dagarna i 90-dagarsplanen?",
        options: [
          "Skapa ett komplett DPP för alla produkter",
          "Söka EU-bidrag",
          "Kartläggning och gap-analys mot ESPR-krav",
          "Byta affärsmodell till PaaS",
        ],
        correct: 2,
        explanation: "De första 30 dagarna handlar om att förstå nuläget: vilka produkter berörs, vilken data finns, och vad är gapet mot ESPR-kraven. Utan denna kartläggning är det svårt att prioritera rätt.",
      },
      {
        id: "q2",
        question: "Varför är det viktigt att involvera leverantörer tidigt i ESPR-processen?",
        options: [
          "Leverantörer måste betala för ditt DPP",
          "DPP kräver data från hela värdekedjan, inklusive leverantörers material och processer",
          "EU kräver att leverantörer signerar ESPR-avtal",
          "Leverantörer kan ta över compliance-ansvaret",
        ],
        correct: 1,
        explanation: "DPP:et kräver data om hela produktens livscykel, inklusive råmaterial och tillverkningsprocesser hos leverantörer. Att samla in denna data tar tid och kräver leverantörernas samarbete.",
      },
      {
        id: "q3",
        question: "Vad är syftet med en pilotimplementering (dag 61–90)?",
        options: [
          "Att lansera produkten på EU-marknaden",
          "Att testa processen i liten skala, lära sig och bygga en skalbar process",
          "Att certifiera hela produktportföljen",
          "Att avsluta ESPR-arbetet",
        ],
        correct: 1,
        explanation: "En pilot låter dig testa och optimera processen för datainsamling, DPP-skapande och verifiering på en produkt innan du skalar upp till hela portföljen. Det minskar risk och ökar effektiviteten.",
      },
    ],
    practicalTip:
      "Skapa en enkel Excel-tabell med dina produkter i raderna och ESPR-krav i kolumnerna. Markera rött (ej uppfyllt), gult (delvis) och grönt (uppfyllt). Det är din gap-analys – och startpunkten för din 90-dagarsplan.",
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // KURS 2: DPP-SKAPAREN (modul 0 som preview)
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-0",
    courseId: "dpp-creator",
    moduleIndex: 0,
    title: "DPP-strukturen – vad ska med?",
    duration: "35 min",
    free: false,
    intro:
      "Det Digitala Produktpasset är mer än ett dokument – det är ett standardiserat digitalt identitetskort för din produkt. Denna lektion går igenom den tekniska strukturen och vilka datapunkter som är obligatoriska.",
    sections: [
      {
        heading: "DPP:ets grundstruktur",
        body:
          "Ett DPP består av tre lager: Identifieringslager (unik produktidentifierare, GTIN, batch/serienummer), Datapunkter (material, energi, koldioxid, reparerbarhet, återvinningsbarhet) och Länkstruktur (QR-kod eller RFID som pekar till ett EU-register). Strukturen är baserad på GS1-standarder och EU:s EPCIS-format.",
        highlight: "Varje DPP måste ha en unik identifierare och vara registrerat i EU:s centrala DPP-register.",
      },
      {
        heading: "Obligatoriska vs. frivilliga datapunkter",
        body:
          "Varje delegerad akt specificerar vilka datapunkter som är obligatoriska för den produktkategorin. Generellt är materialsammansättning, koldioxidavtryck (Scope 1+2), reparerbarhetsindex och återvinningsbarhet obligatoriska. Frivilliga datapunkter som Scope 3-utsläpp och sociala indikatorer kan läggas till för att stärka produktens marknadsposition.",
      },
      {
        heading: "JSON-LD och länkad data",
        body:
          "DPP:er lagras som JSON-LD (JavaScript Object Notation for Linked Data) – ett format som gör data maskinläsbar och länkbar. Du behöver inte kunna programmera för att skapa ett DPP med Nexus-OS, men det hjälper att förstå grundkonceptet: varje datapunkt har en unik URI som gör den universellt förståelig.",
      },
    ],
    keyConcepts: [
      { term: "JSON-LD", definition: "JavaScript Object Notation for Linked Data – standardformat för DPP-data som gör den maskinläsbar och länkbar." },
      { term: "GTIN", definition: "Global Trade Item Number – standardiserad produktidentifierare (streckkod/EAN)." },
      { term: "Reparerbarhetsindex", definition: "EU-standardiserat mått (0–10) på hur lätt en produkt är att reparera." },
      { term: "EPCIS", definition: "Electronic Product Code Information Services – EU-standard för spårbarhet i leverantörskedjor." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilka tre lager består ett DPP av?",
        options: [
          "Certifikat, rapport och faktura",
          "Identifieringslager, datapunkter och länkstruktur",
          "Produktbeskrivning, pris och garanti",
          "Tillverkare, distributör och återförsäljare",
        ],
        correct: 1,
        explanation: "DPP:ets tre lager är: Identifieringslager (unik ID), Datapunkter (miljödata) och Länkstruktur (QR/RFID till EU-register).",
      },
      {
        id: "q2",
        question: "Vilket dataformat används för att lagra DPP-data?",
        options: ["PDF", "Excel/CSV", "JSON-LD", "Word-dokument"],
        correct: 2,
        explanation: "JSON-LD (JavaScript Object Notation for Linked Data) är standardformatet för DPP-data. Det gör datan maskinläsbar, länkbar och universellt förståelig.",
      },
      {
        id: "q3",
        question: "Vad mäter reparerbarhetsindex?",
        options: [
          "Hur mycket produkten kostar att reparera",
          "EU-standardiserat mått (0–10) på hur lätt en produkt är att reparera",
          "Antalet gånger en produkt kan repareras",
          "Tillgången på reservdelar på marknaden",
        ],
        correct: 1,
        explanation: "Reparerbarhetsindex är ett EU-standardiserat mått från 0 till 10 som mäter hur lätt en produkt är att reparera, baserat på faktorer som tillgång till reservdelar, dokumentation och demonterbarhet.",
      },
    ],
    practicalTip:
      "Börja med att samla in GTIN-numren för dina produkter och kartlägga materialsammansättningen för din mest sålda produkt. Det är de två datapunkter som kräver mest förarbete.",
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

