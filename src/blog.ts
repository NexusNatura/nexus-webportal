/**
 * NEXUS-OS â€“ Blog Router
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
    title: "Nexus-OS och EU AI Act: VarfÃ¶r ansvarsfull AI Ã¤r vÃ¥r konkurrensfÃ¶rdel",
    excerpt:
      "NÃ¤r EU:s AI-fÃ¶rordning trÃ¤der i full kraft den 2 augusti 2026 kommer de flesta AI-bolag att behandla den som ett compliance-problem. Vi vÃ¤ljer att se den som en mÃ¶jlighet att bygga fÃ¶rtroende â€“ och en strukturell fÃ¶rdel gentemot aktÃ¶rer som inte fÃ¶rbereder sig.",
    content: `## Bakgrund: En fÃ¶rordning som fÃ¶rÃ¤ndrar spelplanen

Den 2 augusti 2026 trÃ¤der EU AI Act i full kraft fÃ¶r hÃ¶grisk-AI-system. FÃ¶r Nexus-OS â€“ en plattform som automatiserar bidragsansÃ¶kningar, skapar digitala produktpass och identifierar greenwashing â€“ innebÃ¤r detta en direkt regulatorisk exponering.

Men vi ser det annorlunda. Medan konkurrenter panikartade fÃ¶rsÃ¶ker retroaktivt dokumentera sina system, har vi byggt Nexus-OS med ansvarsfullhet som arkitektonisk princip frÃ¥n dag ett.

## Vad EU AI Act faktiskt krÃ¤ver av oss

Nexus-OS klassificeras som ett **hÃ¶grisk-AI-system** enligt Bilaga III, punkt 5 (AI fÃ¶r tillgÃ¥ng till offentliga fÃ¶rmÃ¥ner och tjÃ¤nster) och punkt 8 (AI fÃ¶r rÃ¤ttstillÃ¤mpning och rÃ¤ttsliga fÃ¶rfaranden, analogt med bidragsbedÃ¶mning).

Det innebÃ¤r konkret:

- **Artikel 9**: Riskhanteringssystem med kontinuerlig uppdatering
- **Artikel 10**: Datakvalitetsstandarder fÃ¶r trÃ¤nings- och valideringsdata  
- **Artikel 13**: Transparensdokumentation tillgÃ¤nglig fÃ¶r tillsynsmyndigheter
- **Artikel 14**: MÃ¤nsklig tillsyn (HITL) fÃ¶r alla beslut som pÃ¥verkar individer
- **Artikel 50**: Tydlig mÃ¤rkning att anvÃ¤ndaren interagerar med ett AI-system

## VÃ¥r implementering: NIF-ramverket

Nexus Integrity Framework (NIF) Ã¤r vÃ¥r operativa svar pÃ¥ EU AI Act. Det bygger pÃ¥ tre pelare:

**1. HITL Operator Center** â€“ Peter Johansson och godkÃ¤nda operatÃ¶rer granskar alla AI-genererade bidragsrekommendationer och DPP-klassificeringar innan de levereras till kunder. Ingen automatiserad beslut utan mÃ¤nsklig validering.

**2. GWD-Alpha Greenwashing Detector** â€“ VÃ¥r transparensmodul flaggar automatiskt pÃ¥stÃ¥enden som inte uppfyller EU:s Green Claims Directive-krav, med konfidensgrad och kÃ¤llhÃ¤nvisning.

**3. Riskregister och Misuse-scenarier** â€“ Vi dokumenterar aktivt 12 identifierade risker och 8 missbruksscenarier, med mitigeringsÃ¥tgÃ¤rder och statusspÃ¥rning.

## VarfÃ¶r detta Ã¤r en konkurrensfÃ¶rdel

Offentliga upphandlare och stora industrifÃ¶retag bÃ¶rjar nu stÃ¤lla krav pÃ¥ AI-leverantÃ¶rer att visa EU AI Act-efterlevnad. De som kan presentera ett verifierat riskregister, HITL-dokumentation och transparensrapporter vinner upphandlingarna.

Vi Ã¤r redo. Ã„r dina leverantÃ¶rer det?`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
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
    title: "ESPR och Digitala Produktpass: Vad tillverkare mÃ¥ste veta infÃ¶r 2026",
    excerpt:
      "EU:s Ecodesign for Sustainable Products Regulation (ESPR) trÃ¤der i kraft 2026 och krÃ¤ver digitala produktpass fÃ¶r allt frÃ¥n textilier till elektronik. HÃ¤r Ã¤r en praktisk genomgÃ¥ng av vad det innebÃ¤r fÃ¶r svenska tillverkare.",
    content: `## ESPR i korthet

EU-fÃ¶rordning 2024/1781 â€“ Ecodesign for Sustainable Products Regulation â€“ Ã¤r den mest genomgripande produktlagstiftningen sedan RoHS. Den ersÃ¤tter det gamla Ecodesign-direktivet och utÃ¶kar kraven dramatiskt.

KÃ¤rnan Ã¤r det **Digitala Produktpasset (DPP)**: en maskinlÃ¤sbar datapunkt (QR-kod eller RFID) som lÃ¤nkar till strukturerad information om produktens hela livscykel.

## Tidslinje fÃ¶r svenska tillverkare

| Produktkategori | DPP-krav frÃ¥n |
|---|---|
| Textilier och klÃ¤der | 2026 |
| MÃ¶bler | 2027 |
| Elektronik och ICT | 2027 |
| StÃ¥l och aluminium | 2028 |
| Kemikalier och polymerer | 2028â€“2030 |
| Batterier (separat fÃ¶rordning) | 2027 |

## Vad ett DPP mÃ¥ste innehÃ¥lla

Enligt ESPR Annex III ska ett produktpass inkludera:

1. **Produktidentifiering**: GTIN, serienummer, tillverkare, ursprungsland
2. **MaterialsammansÃ¤ttning**: Kritiska rÃ¥material, farliga Ã¤mnen, Ã¥tervunnet innehÃ¥ll (%)
3. **Karbonfotavtryck**: kg COâ‚‚e per funktionell enhet, systemgrÃ¤ns, verifieringsmetod
4. **Reparerbarhet**: Reparerbarhetsindex (EU-skala 1â€“10), tillgÃ¥ng till reservdelar
5. **End-of-Life**: Demonteringsanvisningar, insamlingsschema, Ã¥tervinnare

## Nexus-OS DPP-verktyget

VÃ¥r DPP-skapare guidar dig genom alla obligatoriska datapunkter, genererar JSON-LD-dokumentet i ESPR-kompatibelt format och skapar en QR-kod som lÃ¤nkar till ett publikt produktpass.

Dessutom integrerar vi med LCA-databaser (ecoinvent, Agribalyse) fÃ¶r automatisk karbonfotavtrycksberÃ¤kning baserat pÃ¥ din materialdeklaration.

Kontakta oss fÃ¶r en gratis pilotdemonstration.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    category: "HÃ¥llbarhet & Reglering",
    tags: JSON.parse(JSON.stringify(["ESPR", "DPP", "Digitalt Produktpass", "LCA", "EU-lag"])) as string[],
    readingTime: 6,
    featured: 1,
    publishedAt: new Date("2026-03-08"),
  },
  {
    slug: "greenwashing-avsloja-med-ai",
    title: "Greenwashing: Hur AI identifierar vilseledande hÃ¥llbarhetspÃ¥stÃ¥enden",
    excerpt:
      "EU:s Green Claims Directive krÃ¤ver att hÃ¥llbarhetspÃ¥stÃ¥enden ska vara verifierbara och specifika. VÃ¥r GWD-Alpha-agent analyserar pÃ¥stÃ¥enden i realtid och flaggar de vanligaste greenwash-teknikerna.",
    content: `## Problemet med greenwashing

Enligt EU-kommissionens undersÃ¶kning frÃ¥n 2021 Ã¤r 42% av alla miljÃ¶pÃ¥stÃ¥enden pÃ¥ den europeiska marknaden Ã¶verdrivna, falska eller vilseledande. Green Claims Directive (2023/0085/COD) â€“ som fÃ¶rvÃ¤ntas trÃ¤da i kraft 2026 â€“ sÃ¤tter hÃ¥rd press pÃ¥ fÃ¶retag att bevisa sina pÃ¥stÃ¥enden.

## De vanligaste greenwash-teknikerna

**1. Vaga generaliseringar**
"MiljÃ¶vÃ¤nlig", "grÃ¶n", "hÃ¥llbar" utan specifikation. KrÃ¤ver: konkret mÃ¤tetal och jÃ¤mfÃ¶relsebas.

**2. Irrelevanta pÃ¥stÃ¥enden**
"CFC-fri" (CFCs Ã¤r fÃ¶rbjudna sedan 1987). KrÃ¤ver: pÃ¥stÃ¥endet mÃ¥ste vara relevant och meningsfullt.

**3. Dolda avvÃ¤gningar**
"Tillverkad av Ã¥tervunnet material" utan att nÃ¤mna att produkten inte kan Ã¥tervinnas. KrÃ¤ver: fullstÃ¤ndig livscykelanalys.

**4. Falsk certifiering**
Hemmagjorda certifieringssymboler utan tredjepartsverifiering. KrÃ¤ver: ackrediterad certifieringsorgan.

**5. Ã–verdrivna pÃ¥stÃ¥enden**
"100% koldioxidneutral" baserat pÃ¥ billiga offsetprojekt. KrÃ¤ver: Science Based Targets-metodik.

## Hur GWD-Alpha fungerar

VÃ¥r Greenwashing Detection Agent analyserar pÃ¥stÃ¥enden mot:

- EU Green Claims Directive-kriterier
- ISO 14021 (MiljÃ¶mÃ¤rkningar och deklarationer)
- Science Based Targets initiative (SBTi) standarder
- GRI Sustainability Reporting Standards

Agenten returnerar:
- Identifierade greenwash-taktiker (lista)
- Bevisunderlag (vad saknas)
- Allvarlighetsgrad (KRITISK/HÃ–G/MEDEL/LÃ…G)
- AI-konfidensgrad (0â€“100%)
- Rekommendation till HITL-operatÃ¶ren

Alla flaggade pÃ¥stÃ¥enden granskas av Peter Johansson innan rapport levereras.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    category: "Greenwashing & Integritet",
    tags: JSON.parse(JSON.stringify(["Greenwashing", "Green Claims Directive", "GWD", "AI-analys", "Transparens"])) as string[],
    readingTime: 5,
    featured: 0,
    publishedAt: new Date("2026-03-12"),
  },
  {
    slug: "offentlig-upphandling-hallbarhetskrav",
    title: "Offentlig upphandling 2026: Nya hÃ¥llbarhetskrav och hur du mÃ¶ter dem",
    excerpt:
      "LOU-Ã¤ndringarna 2025 och EU:s direktiv om hÃ¥llbar upphandling innebÃ¤r att kommuner och regioner nu mÃ¥ste stÃ¤lla livscykelkrav. HÃ¤r Ã¤r hur Nexus-OS hjÃ¤lper leverantÃ¶rer att kvalificera sig.",
    content: `## Upphandlingslandskapet fÃ¶rÃ¤ndras

Sedan 1 januari 2025 gÃ¤ller nya hÃ¥llbarhetskrav i Lagen om offentlig upphandling (LOU). Upphandlande myndigheter med en omsÃ¤ttning Ã¶ver 100 MSEK Ã¤r skyldiga att inkludera livscykelkostnadsanalys (LCC) i sina utvÃ¤rderingsmodeller.

Parallellt driver EU:s direktiv 2024/1275 (Green Public Procurement) pÃ¥ fÃ¶r att 50% av all offentlig upphandling ska uppfylla GPP-kriterierna senast 2027.

## Vad leverantÃ¶rer behÃ¶ver visa

FÃ¶r att kvalificera sig i hÃ¥llbara upphandlingar behÃ¶ver leverantÃ¶rer typiskt:

| Krav | Vanlig standard | Nexus-OS-stÃ¶d |
|---|---|---|
| Koldioxidavtryck per produkt | ISO 14067 / EPD | DPP-verktyget |
| MiljÃ¶ledningssystem | ISO 14001 / EMAS | VÃ¤gledning + dokumentation |
| Sociala krav | SA8000 / ILO-konventioner | LeverantÃ¶rskedjeanalys |
| CirkulÃ¤ritet | EU Ecodesign-index | Reparerbarhetsanalys |
| Kemikalier | REACH / RoHS | Materialdeklaration |

## BidragsmÃ¶jligheter fÃ¶r leverantÃ¶rer

Att investera i hÃ¥llbarhetsdokumentation Ã¤r inte bara ett krav â€“ det Ã¶ppnar bidragsdÃ¶rrar:

- **Vinnova CirkulÃ¤r ekonomi**: upp till 2 MSEK fÃ¶r cirkulÃ¤ritetsprojekt
- **Klimatklivet**: 30â€“70% av investeringskostnad fÃ¶r klimatÃ¥tgÃ¤rder
- **Energimyndigheten Industriklivet**: fÃ¶r energiintensiva industrier
- **Horisont Europa**: 2â€“5 MEUR fÃ¶r innovationsprojekt

Nexus-OS matchar automatiskt din profil mot alla relevanta program och genererar ansÃ¶kningsutkast.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    category: "Upphandling & AffÃ¤rsutveckling",
    tags: JSON.parse(JSON.stringify(["Offentlig upphandling", "LOU", "GPP", "HÃ¥llbarhet", "Bidrag"])) as string[],
    readingTime: 6,
    featured: 0,
    publishedAt: new Date("2026-03-15"),
  },
  {
    slug: "industriell-symbios-skaraborg",
    title: "Industriell symbios i Skaraborg: Hur avfallsstrÃ¶mmar blir rÃ¥varor",
    excerpt:
      "I Skaraborg finns en unik koncentration av tillverkande industri â€“ frÃ¥n polymertillverkning till trÃ¤fÃ¶rÃ¤dling. Nexus-OS kartlÃ¤gger hur lokala fÃ¶retags avfallsstrÃ¶mmar kan bli varandras rÃ¥varor och skapar en cirkulÃ¤r industriell symbios.",
    content: `## Vad Ã¤r industriell symbios?

Industriell symbios innebÃ¤r att fÃ¶retag i ett geografiskt omrÃ¥de utbyter material, energi, vatten och biprodukter pÃ¥ ett sÃ¤tt som skapar ekonomiskt och miljÃ¶mÃ¤ssigt vÃ¤rde fÃ¶r alla parter.

Det klassiska exemplet Ã¤r Kalundborg i Danmark, dÃ¤r ett raffinaderi, ett kraftverk, en gipstillverkare och en farmaceutisk industri utbyter Ã¥nga, gips, kvÃ¤ve och slam i ett slutet system.

## Skaraborg â€“ en naturlig symbiosregion

Med IDC West Sweden AB som nav och Ã¶ver 160 delÃ¤garfÃ¶retag i Skaraborg finns en unik mÃ¶jlighet. Nexus-OS har identifierat fÃ¶ljande potentiella symbiosflÃ¶den:

| LeverantÃ¶r | Avfall/Biprodukt | Mottagare | VÃ¤rde |
|---|---|---|---|
| UW-ELAST AB | Polyuretanskrot | Ã…tervinnare | RÃ¥material |
| Moelven TÃ¶reboda | SÃ¥gspÃ¥n och bark | VÃ¤rmeverk | BiobrÃ¤nsle |
| ToWe Elektronik | PCB-avfall | MetallÃ¥tervinning | Ã„delmetaller |
| CEJN AB | MetallspÃ¥n | Gjuteri | SekundÃ¤rstÃ¥l |
| OFFECCT AB | Textilrester | Isoleringstillverkare | Ã…tervunnen fiber |

## Nexus-OS Symbiosmodul

VÃ¥r symbiosmodul:

1. **KartlÃ¤gger** alla material- och energiflÃ¶den i ditt fÃ¶retag
2. **Matchar** avfallsstrÃ¶mmar mot potentiella mottagare i regionen
3. **BerÃ¤knar** ekonomiskt vÃ¤rde och COâ‚‚-reduktion per symbiosflÃ¶de
4. **Genererar** avtal och logistikplan fÃ¶r symbiosutbyte
5. **Rapporterar** till EU:s Industrial Symbiosis Platform

Kontakta oss fÃ¶r en gratis symbiosanalys av ditt fÃ¶retag.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    category: "CirkulÃ¤r Ekonomi",
    tags: JSON.parse(JSON.stringify(["Industriell symbios", "Skaraborg", "CirkulÃ¤r ekonomi", "AvfallsflÃ¶den", "IDC"])) as string[],
    readingTime: 5,
    featured: 0,
    publishedAt: new Date("2026-03-20"),
  },
  {
    slug: "csddd-leverantorskedja-ansvar",
    title: "CSDDD: Hur svenska fÃ¶retag mÃ¥ste kartlÃ¤gga sin leverantÃ¶rskedja",
    excerpt:
      "Corporate Sustainability Due Diligence Directive (CSDDD) trÃ¤der i kraft 2027 och krÃ¤ver att stora fÃ¶retag kartlÃ¤gger mÃ¤nskliga rÃ¤ttigheter och miljÃ¶risker i sin leverantÃ¶rskedja. HÃ¤r Ã¤r vad du behÃ¶ver gÃ¶ra nu.",
    content: `## CSDDD â€“ En ny standard fÃ¶r leverantÃ¶rsansvar

EU-direktivet 2022/2464 (Corporate Sustainability Due Diligence Directive) Ã¤r den mest omfattande leverantÃ¶rskedja-lagstiftningen sedan Conflict Minerals Regulation. Den krÃ¤ver att stora fÃ¶retag (250+ anstÃ¤llda eller 50+ MEUR omsÃ¤ttning) aktivt kartlÃ¤gger och mitigerar risker fÃ¶r:

- Barnarbete och tvÃ¥ngsarbete
- Diskriminering och krÃ¤nkningar av arbetsrÃ¤tt
- MiljÃ¶skador (vattenfÃ¶roreningar, avskogning, kemikalier)
- Korruption och mutor

## Tidslinje fÃ¶r implementering

| FÃ¶retagsstorlek | Deadline fÃ¶r implementering |
|---|---|
| 5000+ anstÃ¤llda | 1 januari 2027 |
| 1000â€“4999 anstÃ¤llda | 1 januari 2028 |
| 250â€“999 anstÃ¤llda (finanssektor) | 1 januari 2028 |
| 250â€“999 anstÃ¤llda (Ã¶vriga) | 1 januari 2029 |

## Vad CSDDD krÃ¤ver av ditt fÃ¶retag

**1. Due Diligence Process**
- KartlÃ¤gg alla leverantÃ¶rer och deras underleverantÃ¶rer (minst 2 nivÃ¥er)
- Identifiera hÃ¶grisklÃ¤nder och hÃ¶griskbranscher
- BedÃ¶m faktisk och potentiell pÃ¥verkan pÃ¥ mÃ¤nniskor och miljÃ¶

**2. Mitigering och Ã…tgÃ¤rdsplan**
- Etablera Ã¥tgÃ¤rder fÃ¶r att fÃ¶rebygga eller lindra identifierade risker
- Dokumentera alla Ã¥tgÃ¤rder och deras effektivitet
- Implementera gransknings- och kontrollmekanismer

**3. Transparens och Rapportering**
- Publicera en Ã¥rlig CSDDD-rapport pÃ¥ din webbplats
- Rapportera till myndigheter vid allvarliga Ã¶vertrÃ¤delser
- MÃ¶jliggÃ¶r whistleblower-kanaler fÃ¶r leverantÃ¶rer

## Nexus-OS CSDDD-modul

VÃ¥r CSDDD-verktyg hjÃ¤lper dig att:

1. **KartlÃ¤gga leverantÃ¶rer** â€“ Automatisk datainsamling frÃ¥n offentliga register, Dun & Bradstreet, och eget leverantÃ¶rsregister
2. **RiskbedÃ¶ma** â€“ JÃ¤mfÃ¶r mot ILO-konventioner, UNGC-principer, och miljÃ¶indikatorer
3. **Generera rapporter** â€“ Strukturerade CSDDD-rapporter i EU-format
4. **Ã–vervaka** â€“ Kontinuerlig uppdatering av leverantÃ¶rsrisker och mitigering

Kontakta oss fÃ¶r en gratis CSDDD-readiness-bedÃ¶mning.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "LeverantÃ¶rsansvar & Etik",
    tags: JSON.parse(JSON.stringify(["CSDDD", "LeverantÃ¶rskedja", "Due Diligence", "MÃ¤nskliga rÃ¤ttigheter", "MiljÃ¶"])) as string[],
    readingTime: 7,
    featured: 1,
    publishedAt: new Date("2026-03-25"),
  },
  {
    slug: "batteriforordningen-2023-1542",
    title: "BatterifÃ¶rordningen 2023/1542: Vad tillverkare mÃ¥ste veta om batteripass",
    excerpt:
      "EU:s nya batterifÃ¶rordning (2023/1542) trÃ¤der i kraft 2027 och krÃ¤ver digitala batteripass fÃ¶r alla batterier Ã¶ver 2 kWh. HÃ¤r Ã¤r en praktisk guide fÃ¶r tillverkare och Ã¥tervinnare.",
    content: `## BatterifÃ¶rordningen â€“ En global standard

EU-fÃ¶rordning 2023/1542 ersÃ¤tter det gamla batteridirektivet och implementerar UN-standarder fÃ¶r batterisÃ¤kerhet, hÃ¥llbarhet och cirkulÃ¤ritet. Den Ã¤r redan adopterad av flera lÃ¤nder utanfÃ¶r EU, inklusive Schweiz, Norge och FÃ¶renade Arabemiraten.

## Vad Ã¤r ett batteripass?

Ett batteripass Ã¤r ett digitalt dokument (QR-kod eller RFID) som innehÃ¥ller:

- **Batteriidentifiering**: Tillverkare, modell, serienummer, tillverkningsdatum
- **Kemisk sammansÃ¤ttning**: Litium, kobolt, nickel, mangan, bly (% per vikt)
- **Prestanda**: EnergiinnehÃ¥l (Wh), cykellivslÃ¤ngd, temperaturintervall
- **MiljÃ¶pÃ¥verkan**: COâ‚‚-fotavtryck, andel Ã¥tervunnet material
- **SÃ¤kerhet**: Certifieringar, testrapporter, varningsmeddelanden
- **End-of-Life**: Demonteringsanvisningar, Ã¥tervinnare-kontaktuppgifter

## Tidslinje fÃ¶r implementering

| Batterityp | Batteripass frÃ¥n |
|---|---|
| Batterier fÃ¶r elfordon | 1 juli 2027 |
| Industriella batterier (>2 kWh) | 1 juli 2027 |
| Portabla batterier | 1 januari 2028 |
| Bilbatterier | 1 januari 2028 |

## Nexus-OS BatteryPassport Builder

VÃ¥r BatteryPassport Builder guidar dig genom alla obligatoriska datapunkter och genererar EU-kompatibla batteripass. Funktioner:

1. **Kemisk analysintegration** â€“ Importera frÃ¥n laboratorieresultat eller LCA-databaser
2. **COâ‚‚-berÃ¤kning** â€“ Automatisk karbonfotavtrycksberÃ¤kning enligt PEF-metodik
3. **QR-kodgenerering** â€“ LÃ¤nka till ett publikt batteripass
4. **Ã–verensstÃ¤mmelserapport** â€“ Dokumentation fÃ¶r myndigheter

Kontakta oss fÃ¶r en gratis batteripass-pilot.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    category: "CirkulÃ¤r Ekonomi & Batterier",
    tags: JSON.parse(JSON.stringify(["BatterifÃ¶rordning", "2023/1542", "Batteripass", "CirkulÃ¤ritet", "Ã…tervinning"])) as string[],
    readingTime: 6,
    featured: 1,
    publishedAt: new Date("2026-03-28"),
  },
  {
    slug: "hallbarhetsrapportering-esrs-csrd",
    title: "HÃ¥llbarhetsrapportering enligt ESRS och CSRD: En praktisk guide fÃ¶r svenska fÃ¶retag",
    excerpt:
      "Corporate Sustainability Reporting Directive (CSRD) och European Sustainability Reporting Standards (ESRS) fÃ¶rÃ¤ndrar hur fÃ¶retag rapporterar miljÃ¶- och samhÃ¤llspÃ¥verkan. HÃ¤r Ã¤r vad du behÃ¶ver veta fÃ¶r att komma igÃ¥ng.",
    content: `## CSRD och ESRS â€“ En ny rapporteringsstandard

CSRD (Direktiv 2022/2464) krÃ¤ver att stora fÃ¶retag rapporterar enligt European Sustainability Reporting Standards (ESRS) â€“ en harmoniserad standard som ersÃ¤tter GRI, SASB och TCFD.

Skillnaden frÃ¥n tidigare rapportering:
- **Tvingande**: Inte frivillig, utan lagstadgad
- **Dubbel vÃ¤sentlighet**: BÃ¥de hur miljÃ¶/samhÃ¤lle pÃ¥verkar fÃ¶retaget OCH hur fÃ¶retaget pÃ¥verkar miljÃ¶/samhÃ¤lle
- **Verifiering**: Extern revision krÃ¤vs
- **Digitalt format**: XBRL-format fÃ¶r maskinlÃ¤sning

## ESRS-ramverket: 12 standarder

| Standard | FokusomrÃ¥de |
|---|---|
| E1 | KlimatfÃ¶rÃ¤ndringar |
| E2 | FÃ¶roreningar |
| E3 | Vatten och marina resurser |
| E4 | Biologisk mÃ¥ngfald |
| E5 | ResursanvÃ¤ndning och cirkulÃ¤ritet |
| S1 | Egen arbetskraft |
| S2 | Arbetskraft i vÃ¤rdekedjan |
| S3 | PÃ¥verkade samhÃ¤llen |
| S4 | Konsumenter och slutanvÃ¤ndare |
| G1 | FÃ¶retagsstyrning |
| G2 | AffÃ¤rsetik |
| G3 | Laglig Ã¶verensstÃ¤mmelse |

## Nexus-OS ESRS-rapportverktyg

VÃ¥r ESRS-modul hjÃ¤lper dig att:

1. **KartlÃ¤gga vÃ¤sentlighetsaspekter** â€“ Genom stakeholder-intervjuer och vÃ¤rdekedjor
2. **Samla data** â€“ FrÃ¥n dina befintliga system (ERP, HR, miljÃ¶ledning)
3. **BerÃ¤kna indikatorer** â€“ KPI:er enligt ESRS-metodiken
4. **Generera rapport** â€“ I XBRL-format fÃ¶r myndighetsinlÃ¤mning
5. **Verifiera** â€“ Checklista fÃ¶r extern revisor

Kontakta oss fÃ¶r en gratis ESRS-readiness-bedÃ¶mning.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "HÃ¥llbarhetsrapportering",
    tags: JSON.parse(JSON.stringify(["CSRD", "ESRS", "HÃ¥llbarhetsrapportering", "VÃ¤sentlighet", "Transparens"])) as string[],
    readingTime: 8,
    featured: 1,
    publishedAt: new Date("2026-04-01"),
  },
  {
    slug: "ai-och-hallbarhet-framtiden",
    title: "AI och hÃ¥llbarhet: Hur artificiell intelligens accelererar EU:s grÃ¶na omstÃ¤llning",
    excerpt:
      "AI Ã¤r inte bara ett verktyg fÃ¶r compliance â€“ det Ã¤r en mÃ¶jliggÃ¶rare fÃ¶r den cirkulÃ¤ra ekonomin. Nexus-OS visar hur AI kan automatisera hÃ¥llbarhetsanalys, identifiera greenwashing i realtid och optimera leverantÃ¶rskedjor fÃ¶r minimal miljÃ¶pÃ¥verkan.",
    content: `## AI som hÃ¥llbarhetsmultiplikator

EU:s Green Deal och AI Act Ã¤r inte motsatta â€“ de Ã¤r komplementÃ¤ra. AI kan accelerera Ã¶vergÃ¥ngen till en cirkulÃ¤r ekonomi genom att:

1. **Automatisera datainsamling** â€“ FrÃ¥n miljÃ¶ledningssystem, leverantÃ¶rer och offentliga register
2. **Identifiera mÃ¶nster** â€“ Greenwashing, miljÃ¶risker, cirkulÃ¤ritetsmÃ¶jligheter
3. **Optimera flÃ¶den** â€“ Logistik, materialÃ¥tervinning, energianvÃ¤ndning
4. **Prognostisera** â€“ Framtida regelkrav, marknadsfÃ¶rÃ¤ndringar, risker

## Nexus-OS AI-moduler fÃ¶r hÃ¥llbarhet

**GWD-Alpha (Greenwashing Detection)**
- Analyserar miljÃ¶pÃ¥stÃ¥enden i realtid
- Flaggar pÃ¥stÃ¥enden som inte uppfyller Green Claims Directive
- Returnerar bevisunderlag och rekommendation

**DPP-Delta (Digital Product Pass Generator)**
- Genererar ESPR-kompatibla produktpass
- BerÃ¤knar karbonfotavtryck automatiskt
- Skapar QR-koder fÃ¶r konsumenttransparens

**Symbios-Gamma (Industrial Symbiosis Matcher)**
- KartlÃ¤gger avfallsstrÃ¶mmar i en region
- Matchar avfall mot potentiella mottagare
- BerÃ¤knar ekonomisk och miljÃ¶mÃ¤ssig vÃ¤rde

**CSDDD-Analyzer**
- KartlÃ¤gger leverantÃ¶rskedjor
- BedÃ¶mer mÃ¤nskliga rÃ¤ttigheter och miljÃ¶risker
- Genererar mitigerings-Ã¥tgÃ¤rdsplaner

## Framtiden: Autonoma hÃ¥llbarhetssystem

Vi tror pÃ¥ ett framtida scenario dÃ¤r:

- **Realtids-compliance**: AI Ã¶vervakar automatiskt att fÃ¶retag fÃ¶ljer EU-regler
- **Prediktiv regulering**: AI fÃ¶rutser regelÃ¤ndringar och fÃ¶rbereder fÃ¶retag
- **CirkulÃ¤r ekonomi pÃ¥ automatik**: AI optimerar material- och energiflÃ¶den mellan fÃ¶retag
- **Transparens som standard**: Alla produkter har digitala pass med full livscykeldata

Det framtida fÃ¶retaget kommer inte att frÃ¥ga "Hur gÃ¶r vi oss kompatibla med reglerna?" utan "Hur anvÃ¤nder vi AI fÃ¶r att bli bÃ¤ttre Ã¤n reglerna krÃ¤ver?"

Nexus-OS Ã¤r byggt fÃ¶r den framtiden.`,
    author: "Peter Johansson",
    authorRole: "Grundare & HITL-operatÃ¶r, Nexus-OS",
    coAuthor: "Manus AI",
    coAuthorRole: "AI-assistent & Analysmotor",
    category: "AI & HÃ¥llbarhet",
    tags: JSON.parse(JSON.stringify(["AI", "HÃ¥llbarhet", "CirkulÃ¤r ekonomi", "Green Deal", "Framtid"])) as string[],
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

