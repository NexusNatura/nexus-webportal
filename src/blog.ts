/**
 * NEXUS-OS – Blog Router
 * tRPC procedures for blog posts stored in MySQL
 */
import { z } from "zod";
import { eq, desc, asc } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { blogPosts, InsertBlogPost } from "../../drizzle/schema";

// â”€â”€â”€ Seed data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SEED_POSTS: InsertBlogPost[] = [
  {
    slug: "nexus-os-eu-ai-act-ansvarsfull-ai",
    title: "Nexus-OS och EU AI Act: Varför ansvarsfull AI är vår konkurrensfördel",
    excerpt:
      "När EU:s AI-förordning träder i full kraft den 2 augusti 2026 kommer de flesta AI-bolag att behandla den som ett compliance-problem. Vi väljer att se den som en möjlighet att bygga förtroende – och en strukturell fördel gentemot aktörer som inte förbereder sig.",
    content: `## Bakgrund: En förordning som förändrar spelplanen

Den 2 augusti 2026 träder EU AI Act i full kraft för högrisk-AI-system. För Nexus-OS – en plattform som automatiserar bidragsansökningar, skapar digitala produktpass och identifierar greenwashing – innebär detta en direkt regulatorisk exponering.

Men vi ser det annorlunda. Medan konkurrenter panikartade försöker retroaktivt dokumentera sina system, har vi byggt Nexus-OS med ansvarsfullhet som arkitektonisk princip från dag ett.

## Vad EU AI Act faktiskt kräver av oss

Nexus-OS klassificeras som ett **högrisk-AI-system** enligt Bilaga III, punkt 5 (AI för tillgång till offentliga förmåner och tjänster) och punkt 8 (AI för rättstillämpning och rättsliga förfaranden, analogt med bidragsbedömning).

Det innebär konkret:

- **Artikel 9**: Riskhanteringssystem med kontinuerlig uppdatering
- **Artikel 10**: Datakvalitetsstandarder för tränings- och valideringsdata  
- **Artikel 13**: Transparensdokumentation tillgänglig för tillsynsmyndigheter
- **Artikel 14**: Mänsklig tillsyn (HITL) för alla beslut som påverkar individer
- **Artikel 50**: Tydlig märkning att användaren interagerar med ett AI-system

## Vår implementering: NIF-ramverket

Nexus Integrity Framework (NIF) är vår operativa svar på EU AI Act. Det bygger på tre pelare:

**1. HITL Operator Center** – Peter Johansson och godkända operatörer granskar alla AI-genererade bidragsrekommendationer och DPP-klassificeringar innan de levereras till kunder. Ingen automatiserad beslut utan mänsklig validering.

**2. GWD-Alpha Greenwashing Detector** – Vår transparensmodul flaggar automatiskt påståenden som inte uppfyller EU:s Green Claims Directive-krav, med konfidensgrad och källhänvisning.

**3. Riskregister och Misuse-scenarier** – Vi dokumenterar aktivt 12 identifierade risker och 8 missbruksscenarier, med mitigeringsåtgärder och statusspårning.

## Varför detta är en konkurrensfördel

Offentliga upphandlare och stora industriföretag börjar nu ställa krav på AI-leverantörer att visa EU AI Act-efterlevnad. De som kan presentera ett verifierat riskregister, HITL-dokumentation och transparensrapporter vinner upphandlingarna.

Vi är redo. Är dina leverantörer det?`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "AI & Reglering",
    tags: JSON.parse(JSON.stringify(["EU AI Act", "Ansvarsfull AI", "HITL", "Compliance", "NIF"])) as string[],
    readingTime: 7,
    featured: 1,
    publishedAt: new Date("2026-03-01"),
  },
  {
    slug: "espr-digitala-produktpass-2026",
    title: "ESPR och Digitala Produktpass: Vad tillverkare måste veta inför 2026",
    excerpt:
      "EU:s Ecodesign for Sustainable Products Regulation (ESPR) träder i kraft 2026 och kräver digitala produktpass för allt från textilier till elektronik. Här är en praktisk genomgång av vad det innebär för svenska tillverkare.",
    content: `## ESPR i korthet

EU-förordning 2024/1781 – Ecodesign for Sustainable Products Regulation – är den mest genomgripande produktlagstiftningen sedan RoHS. Den ersätter det gamla Ecodesign-direktivet och utökar kraven dramatiskt.

Kärnan är det **Digitala Produktpasset (DPP)**: en maskinläsbar datapunkt (QR-kod eller RFID) som länkar till strukturerad information om produktens hela livscykel.

## Tidslinje för svenska tillverkare

| Produktkategori | DPP-krav från |
|---|---|
| Textilier och kläder | 2026 |
| Möbler | 2027 |
| Elektronik och ICT | 2027 |
| Stål och aluminium | 2028 |
| Kemikalier och polymerer | 2028–2030 |
| Batterier (separat förordning) | 2027 |

## Vad ett DPP måste innehålla

Enligt ESPR Annex III ska ett produktpass inkludera:

1. **Produktidentifiering**: GTIN, serienummer, tillverkare, ursprungsland
2. **Materialsammansättning**: Kritiska råmaterial, farliga ämnen, återvunnet innehåll (%)
3. **Karbonfotavtryck**: kg COâ‚‚e per funktionell enhet, systemgräns, verifieringsmetod
4. **Reparerbarhet**: Reparerbarhetsindex (EU-skala 1–10), tillgång till reservdelar
5. **End-of-Life**: Demonteringsanvisningar, insamlingsschema, återvinnare

## Nexus-OS DPP-verktyget

Vår DPP-skapare guidar dig genom alla obligatoriska datapunkter, genererar JSON-LD-dokumentet i ESPR-kompatibelt format och skapar en QR-kod som länkar till ett publikt produktpass.

Dessutom integrerar vi med LCA-databaser (ecoinvent, Agribalyse) för automatisk karbonfotavtrycksberäkning baserat på din materialdeklaration.

Kontakta oss för en gratis pilotdemonstration.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    category: "Hållbarhet & Reglering",
    tags: JSON.parse(JSON.stringify(["ESPR", "DPP", "Digitalt Produktpass", "LCA", "EU-lag"])) as string[],
    readingTime: 6,
    featured: 1,
    publishedAt: new Date("2026-03-08"),
  },
  {
    slug: "greenwashing-avsloja-med-ai",
    title: "Greenwashing: Hur AI identifierar vilseledande hållbarhetspåståenden",
    excerpt:
      "EU:s Green Claims Directive kräver att hållbarhetspåståenden ska vara verifierbara och specifika. Vår GWD-Alpha-agent analyserar påståenden i realtid och flaggar de vanligaste greenwash-teknikerna.",
    content: `## Problemet med greenwashing

Enligt EU-kommissionens undersökning från 2021 är 42% av alla miljöpåståenden på den europeiska marknaden överdrivna, falska eller vilseledande. Green Claims Directive (2023/0085/COD) – som förväntas träda i kraft 2026 – sätter hård press på företag att bevisa sina påståenden.

## De vanligaste greenwash-teknikerna

**1. Vaga generaliseringar**
"Miljövänlig", "grön", "hållbar" utan specifikation. Kräver: konkret mätetal och jämförelsebas.

**2. Irrelevanta påståenden**
"CFC-fri" (CFCs är förbjudna sedan 1987). Kräver: påståendet måste vara relevant och meningsfullt.

**3. Dolda avvägningar**
"Tillverkad av återvunnet material" utan att nämna att produkten inte kan återvinnas. Kräver: fullständig livscykelanalys.

**4. Falsk certifiering**
Hemmagjorda certifieringssymboler utan tredjepartsverifiering. Kräver: ackrediterad certifieringsorgan.

**5. Överdrivna påståenden**
"100% koldioxidneutral" baserat på billiga offsetprojekt. Kräver: Science Based Targets-metodik.

## Hur GWD-Alpha fungerar

Vår Greenwashing Detection Agent analyserar påståenden mot:

- EU Green Claims Directive-kriterier
- ISO 14021 (Miljömärkningar och deklarationer)
- Science Based Targets initiative (SBTi) standarder
- GRI Sustainability Reporting Standards

Agenten returnerar:
- Identifierade greenwash-taktiker (lista)
- Bevisunderlag (vad saknas)
- Allvarlighetsgrad (KRITISK/HÖG/MEDEL/LÅG)
- AI-konfidensgrad (0–100%)
- Rekommendation till HITL-operatören

Alla flaggade påståenden granskas av Peter Johansson innan rapport levereras.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    category: "Greenwashing & Integritet",
    tags: JSON.parse(JSON.stringify(["Greenwashing", "Green Claims Directive", "GWD", "AI-analys", "Transparens"])) as string[],
    readingTime: 5,
    featured: 0,
    publishedAt: new Date("2026-03-12"),
  },
  {
    slug: "offentlig-upphandling-hallbarhetskrav",
    title: "Offentlig upphandling 2026: Nya hållbarhetskrav och hur du möter dem",
    excerpt:
      "LOU-ändringarna 2025 och EU:s direktiv om hållbar upphandling innebär att kommuner och regioner nu måste ställa livscykelkrav. Här är hur Nexus-OS hjälper leverantörer att kvalificera sig.",
    content: `## Upphandlingslandskapet förändras

Sedan 1 januari 2025 gäller nya hållbarhetskrav i Lagen om offentlig upphandling (LOU). Upphandlande myndigheter med en omsättning över 100 MSEK är skyldiga att inkludera livscykelkostnadsanalys (LCC) i sina utvärderingsmodeller.

Parallellt driver EU:s direktiv 2024/1275 (Green Public Procurement) på för att 50% av all offentlig upphandling ska uppfylla GPP-kriterierna senast 2027.

## Vad leverantörer behöver visa

För att kvalificera sig i hållbara upphandlingar behöver leverantörer typiskt:

| Krav | Vanlig standard | Nexus-OS-stöd |
|---|---|---|
| Koldioxidavtryck per produkt | ISO 14067 / EPD | DPP-verktyget |
| Miljöledningssystem | ISO 14001 / EMAS | Vägledning + dokumentation |
| Sociala krav | SA8000 / ILO-konventioner | Leverantörskedjeanalys |
| Cirkuläritet | EU Ecodesign-index | Reparerbarhetsanalys |
| Kemikalier | REACH / RoHS | Materialdeklaration |

## Bidragsmöjligheter för leverantörer

Att investera i hållbarhetsdokumentation är inte bara ett krav – det öppnar bidragsdörrar:

- **Vinnova Cirkulär ekonomi**: upp till 2 MSEK för cirkuläritetsprojekt
- **Klimatklivet**: 30–70% av investeringskostnad för klimatåtgärder
- **Energimyndigheten Industriklivet**: för energiintensiva industrier
- **Horisont Europa**: 2–5 MEUR för innovationsprojekt

Nexus-OS matchar automatiskt din profil mot alla relevanta program och genererar ansökningsutkast.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    category: "Upphandling & Affärsutveckling",
    tags: JSON.parse(JSON.stringify(["Offentlig upphandling", "LOU", "GPP", "Hållbarhet", "Bidrag"])) as string[],
    readingTime: 6,
    featured: 0,
    publishedAt: new Date("2026-03-15"),
  },
  {
    slug: "industriell-symbios-skaraborg",
    title: "Industriell symbios i Skaraborg: Hur avfallsströmmar blir råvaror",
    excerpt:
      "I Skaraborg finns en unik koncentration av tillverkande industri – från polymertillverkning till träförädling. Nexus-OS kartlägger hur lokala företags avfallsströmmar kan bli varandras råvaror och skapar en cirkulär industriell symbios.",
    content: `## Vad är industriell symbios?

Industriell symbios innebär att företag i ett geografiskt område utbyter material, energi, vatten och biprodukter på ett sätt som skapar ekonomiskt och miljömässigt värde för alla parter.

Det klassiska exemplet är Kalundborg i Danmark, där ett raffinaderi, ett kraftverk, en gipstillverkare och en farmaceutisk industri utbyter ånga, gips, kväve och slam i ett slutet system.

## Skaraborg – en naturlig symbiosregion

Med IDC West Sweden AB som nav och över 160 delägarföretag i Skaraborg finns en unik möjlighet. Nexus-OS har identifierat följande potentiella symbiosflöden:

| Leverantör | Avfall/Biprodukt | Mottagare | Värde |
|---|---|---|---|
| UW-ELAST AB | Polyuretanskrot | Återvinnare | Råmaterial |
| Moelven Töreboda | Sågspån och bark | Värmeverk | Biobränsle |
| ToWe Elektronik | PCB-avfall | Metallåtervinning | Ädelmetaller |
| CEJN AB | Metallspån | Gjuteri | Sekundärstål |
| OFFECCT AB | Textilrester | Isoleringstillverkare | Återvunnen fiber |

## Nexus-OS Symbiosmodul

Vår symbiosmodul:

1. **Kartlägger** alla material- och energiflöden i ditt företag
2. **Matchar** avfallsströmmar mot potentiella mottagare i regionen
3. **Beräknar** ekonomiskt värde och COâ‚‚-reduktion per symbiosflöde
4. **Genererar** avtal och logistikplan för symbiosutbyte
5. **Rapporterar** till EU:s Industrial Symbiosis Platform

Kontakta oss för en gratis symbiosanalys av ditt företag.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    category: "Cirkulär Ekonomi",
    tags: JSON.parse(JSON.stringify(["Industriell symbios", "Skaraborg", "Cirkulär ekonomi", "Avfallsflöden", "IDC"])) as string[],
    readingTime: 5,
    featured: 0,
    publishedAt: new Date("2026-03-20"),
  },
  {
    slug: "csddd-leverantorskedja-ansvar",
    title: "CSDDD: Hur svenska företag måste kartlägga sin leverantörskedja",
    excerpt:
      "Corporate Sustainability Due Diligence Directive (CSDDD) träder i kraft 2027 och kräver att stora företag kartlägger mänskliga rättigheter och miljörisker i sin leverantörskedja. Här är vad du behöver göra nu.",
    content: `## CSDDD – En ny standard för leverantörsansvar

EU-direktivet 2022/2464 (Corporate Sustainability Due Diligence Directive) är den mest omfattande leverantörskedja-lagstiftningen sedan Conflict Minerals Regulation. Den kräver att stora företag (250+ anställda eller 50+ MEUR omsättning) aktivt kartlägger och mitigerar risker för:

- Barnarbete och tvångsarbete
- Diskriminering och kränkningar av arbetsrätt
- Miljöskador (vattenföroreningar, avskogning, kemikalier)
- Korruption och mutor

## Tidslinje för implementering

| Företagsstorlek | Deadline för implementering |
|---|---|
| 5000+ anställda | 1 januari 2027 |
| 1000–4999 anställda | 1 januari 2028 |
| 250–999 anställda (finanssektor) | 1 januari 2028 |
| 250–999 anställda (övriga) | 1 januari 2029 |

## Vad CSDDD kräver av ditt företag

**1. Due Diligence Process**
- Kartlägg alla leverantörer och deras underleverantörer (minst 2 nivåer)
- Identifiera högriskländer och högriskbranscher
- Bedöm faktisk och potentiell påverkan på människor och miljö

**2. Mitigering och Åtgärdsplan**
- Etablera åtgärder för att förebygga eller lindra identifierade risker
- Dokumentera alla åtgärder och deras effektivitet
- Implementera gransknings- och kontrollmekanismer

**3. Transparens och Rapportering**
- Publicera en årlig CSDDD-rapport på din webbplats
- Rapportera till myndigheter vid allvarliga överträdelser
- Möjliggör whistleblower-kanaler för leverantörer

## Nexus-OS CSDDD-modul

Vår CSDDD-verktyg hjälper dig att:

1. **Kartlägga leverantörer** – Automatisk datainsamling från offentliga register, Dun & Bradstreet, och eget leverantörsregister
2. **Riskbedöma** – Jämför mot ILO-konventioner, UNGC-principer, och miljöindikatorer
3. **Generera rapporter** – Strukturerade CSDDD-rapporter i EU-format
4. **Övervaka** – Kontinuerlig uppdatering av leverantörsrisker och mitigering

Kontakta oss för en gratis CSDDD-readiness-bedömning.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "Leverantörsansvar & Etik",
    tags: JSON.parse(JSON.stringify(["CSDDD", "Leverantörskedja", "Due Diligence", "Mänskliga rättigheter", "Miljö"])) as string[],
    readingTime: 7,
    featured: 1,
    publishedAt: new Date("2026-03-25"),
  },
  {
    slug: "batteriforordningen-2023-1542",
    title: "Batteriförordningen 2023/1542: Vad tillverkare måste veta om batteripass",
    excerpt:
      "EU:s nya batteriförordning (2023/1542) träder i kraft 2027 och kräver digitala batteripass för alla batterier över 2 kWh. Här är en praktisk guide för tillverkare och återvinnare.",
    content: `## Batteriförordningen – En global standard

EU-förordning 2023/1542 ersätter det gamla batteridirektivet och implementerar UN-standarder för batterisäkerhet, hållbarhet och cirkuläritet. Den är redan adopterad av flera länder utanför EU, inklusive Schweiz, Norge och Förenade Arabemiraten.

## Vad är ett batteripass?

Ett batteripass är ett digitalt dokument (QR-kod eller RFID) som innehåller:

- **Batteriidentifiering**: Tillverkare, modell, serienummer, tillverkningsdatum
- **Kemisk sammansättning**: Litium, kobolt, nickel, mangan, bly (% per vikt)
- **Prestanda**: Energiinnehål (Wh), cykellivslängd, temperaturintervall
- **Miljöpåverkan**: COâ‚‚-fotavtryck, andel återvunnet material
- **Säkerhet**: Certifieringar, testrapporter, varningsmeddelanden
- **End-of-Life**: Demonteringsanvisningar, återvinnare-kontaktuppgifter

## Tidslinje för implementering

| Batterityp | Batteripass från |
|---|---|
| Batterier för elfordon | 1 juli 2027 |
| Industriella batterier (>2 kWh) | 1 juli 2027 |
| Portabla batterier | 1 januari 2028 |
| Bilbatterier | 1 januari 2028 |

## Nexus-OS BatteryPassport Builder

Vår BatteryPassport Builder guidar dig genom alla obligatoriska datapunkter och genererar EU-kompatibla batteripass. Funktioner:

1. **Kemisk analysintegration** – Importera från laboratorieresultat eller LCA-databaser
2. **COâ‚‚-beräkning** – Automatisk karbonfotavtrycksberäkning enligt PEF-metodik
3. **QR-kodgenerering** – Länka till ett publikt batteripass
4. **Överensstämmelserapport** – Dokumentation för myndigheter

Kontakta oss för en gratis batteripass-pilot.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    category: "Cirkulär Ekonomi & Batterier",
    tags: JSON.parse(JSON.stringify(["Batteriförordning", "2023/1542", "Batteripass", "Cirkuläritet", "Återvinning"])) as string[],
    readingTime: 6,
    featured: 1,
    publishedAt: new Date("2026-03-28"),
  },
  {
    slug: "hallbarhetsrapportering-esrs-csrd",
    title: "Hållbarhetsrapportering enligt ESRS och CSRD: En praktisk guide för svenska företag",
    excerpt:
      "Corporate Sustainability Reporting Directive (CSRD) och European Sustainability Reporting Standards (ESRS) förändrar hur företag rapporterar miljö- och samhällspåverkan. Här är vad du behöver veta för att komma igång.",
    content: `## CSRD och ESRS – En ny rapporteringsstandard

CSRD (Direktiv 2022/2464) kräver att stora företag rapporterar enligt European Sustainability Reporting Standards (ESRS) – en harmoniserad standard som ersätter GRI, SASB och TCFD.

Skillnaden från tidigare rapportering:
- **Tvingande**: Inte frivillig, utan lagstadgad
- **Dubbel väsentlighet**: Både hur miljö/samhälle påverkar företaget OCH hur företaget påverkar miljö/samhälle
- **Verifiering**: Extern revision krävs
- **Digitalt format**: XBRL-format för maskinläsning

## ESRS-ramverket: 12 standarder

| Standard | Fokusområde |
|---|---|
| E1 | Klimatförändringar |
| E2 | Föroreningar |
| E3 | Vatten och marina resurser |
| E4 | Biologisk mångfald |
| E5 | Resursanvändning och cirkuläritet |
| S1 | Egen arbetskraft |
| S2 | Arbetskraft i värdekedjan |
| S3 | Påverkade samhällen |
| S4 | Konsumenter och slutanvändare |
| G1 | Företagsstyrning |
| G2 | Affärsetik |
| G3 | Laglig överensstämmelse |

## Nexus-OS ESRS-rapportverktyg

Vår ESRS-modul hjälper dig att:

1. **Kartlägga väsentlighetsaspekter** – Genom stakeholder-intervjuer och värdekedjor
2. **Samla data** – Från dina befintliga system (ERP, HR, miljöledning)
3. **Beräkna indikatorer** – KPI:er enligt ESRS-metodiken
4. **Generera rapport** – I XBRL-format för myndighetsinlämning
5. **Verifiera** – Checklista för extern revisor

Kontakta oss för en gratis ESRS-readiness-bedömning.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "Hållbarhetsrapportering",
    tags: JSON.parse(JSON.stringify(["CSRD", "ESRS", "Hållbarhetsrapportering", "Väsentlighet", "Transparens"])) as string[],
    readingTime: 8,
    featured: 1,
    publishedAt: new Date("2026-04-01"),
  },
  {
    slug: "ai-och-hallbarhet-framtiden",
    title: "AI och hållbarhet: Hur artificiell intelligens accelererar EU:s gröna omställning",
    excerpt:
      "AI är inte bara ett verktyg för compliance – det är en möjliggörare för den cirkulära ekonomin. Nexus-OS visar hur AI kan automatisera hållbarhetsanalys, identifiera greenwashing i realtid och optimera leverantörskedjor för minimal miljöpåverkan.",
    content: `## AI som hållbarhetsmultiplikator

EU:s Green Deal och AI Act är inte motsatta – de är komplementära. AI kan accelerera övergången till en cirkulär ekonomi genom att:

1. **Automatisera datainsamling** – Från miljöledningssystem, leverantörer och offentliga register
2. **Identifiera mönster** – Greenwashing, miljörisker, cirkuläritetsmöjligheter
3. **Optimera flöden** – Logistik, materialåtervinning, energianvändning
4. **Prognostisera** – Framtida regelkrav, marknadsförändringar, risker

## Nexus-OS AI-moduler för hållbarhet

**GWD-Alpha (Greenwashing Detection)**
- Analyserar miljöpåståenden i realtid
- Flaggar påståenden som inte uppfyller Green Claims Directive
- Returnerar bevisunderlag och rekommendation

**DPP-Delta (Digital Product Pass Generator)**
- Genererar ESPR-kompatibla produktpass
- Beräknar karbonfotavtryck automatiskt
- Skapar QR-koder för konsumenttransparens

**Symbios-Gamma (Industrial Symbiosis Matcher)**
- Kartlägger avfallsströmmar i en region
- Matchar avfall mot potentiella mottagare
- Beräknar ekonomisk och miljömässig värde

**CSDDD-Analyzer**
- Kartlägger leverantörskedjor
- Bedömer mänskliga rättigheter och miljörisker
- Genererar mitigerings-åtgärdsplaner

## Framtiden: Autonoma hållbarhetssystem

Vi tror på ett framtida scenario där:

- **Realtids-compliance**: AI övervakar automatiskt att företag följer EU-regler
- **Prediktiv regulering**: AI förutser regeländringar och förbereder företag
- **Cirkulär ekonomi på automatik**: AI optimerar material- och energiflöden mellan företag
- **Transparens som standard**: Alla produkter har digitala pass med full livscykeldata

Det framtida företaget kommer inte att fråga "Hur gör vi oss kompatibla med reglerna?" utan "Hur använder vi AI för att bli bättre än reglerna kräver?"

Nexus-OS är byggt för den framtiden.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatör, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "AI & Hållbarhet",
    tags: JSON.parse(JSON.stringify(["AI", "Hållbarhet", "Cirkulär ekonomi", "Green Deal", "Framtid"])) as string[],
    readingTime: 9,
    featured: 1,
    publishedAt: new Date("2026-04-05"),
  },
];

// â”€â”€â”€ Router â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const blogRouter = router({
  /** List all blog posts, newest first */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        category: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const rows = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          excerpt: blogPosts.excerpt,
          author: blogPosts.author,
          authorRole: blogPosts.authorRole,
          coAuthor: blogPosts.coAuthor,
          coAuthorRole: blogPosts.coAuthorRole,
          category: blogPosts.category,
          tags: blogPosts.tags,
          readingTime: blogPosts.readingTime,
          featured: blogPosts.featured,
          publishedAt: blogPosts.publishedAt,
        })
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt))
        .limit(input?.limit ?? 20);
      return rows.map(r => ({ ...r, featured: r.featured === 1 }));
    }),

  /** Get a single post by slug */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const rows = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, input.slug))
        .limit(1);
      if (rows.length === 0) return null;
      const r = rows[0];
      return { ...r, featured: r.featured === 1 };
    }),

  /** Seed the database with initial blog posts (admin only) */
  seed: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Admin only");
    }
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    let seeded = 0;
    for (const post of SEED_POSTS) {
      try {
        await db.insert(blogPosts).values(post).onDuplicateKeyUpdate({
          set: { title: post.title, updatedAt: new Date() },
        });
        seeded++;
      } catch {
        // skip duplicates
      }
    }
    return { seeded };
  }),
});

