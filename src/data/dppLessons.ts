/**
 * NEXUS-OS – DPP-skaparen: Fem praktiska lektioner
 * Hands-on kursinnehåll kopplat till Nexus-OS DPP-verktyget (/produktpass)
 */

import type { LessonContent } from "./lessonContent";

export const DPP_LESSONS: LessonContent[] = [
  // â”€â”€â”€ LEKTION 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-0",
    courseId: "dpp-creator",
    moduleIndex: 0,
    title: "DPP-strukturen – vad ska med?",
    duration: "35 min",
    free: false,
    intro:
      "Det Digitala Produktpasset är mer än ett dokument – det är ett standardiserat digitalt identitetskort för din produkt. Denna lektion går igenom den tekniska strukturen, vilka datapunkter som är obligatoriska, och hur Nexus-OS DPP-verktyget är byggt för att guida dig genom hela processen.",
    sections: [
      {
        heading: "DPP:ets tre lager",
        body:
          "Ett DPP består av tre sammankopplade lager. Det första är Identifieringslagret som innehåller en unik produktidentifierare (UUID), GTIN/EAN-streckkod, batch- och serienummer samt tillverkningsdatum och -plats. Det andra lagret är Datapunkterna – den faktiska miljöinformationen: materialsammansättning, koldioxidavtryck (Scope 1+2), reparerbarhetsindex, återvinningsbarhet och förväntad livslängd. Det tredje lagret är Länkstrukturen – en QR-kod eller NFC-tagg som pekar till ett registrerat DPP i EU:s centrala register.",
        highlight: "Varje DPP måste ha en globalt unik identifierare och vara registrerat i EU:s DPP-register senast 2026.",
      },
      {
        heading: "Obligatoriska vs. frivilliga datapunkter",
        body:
          "Varje produktkategori har sin egen uppsättning obligatoriska datapunkter definierade i den delegerade akten. För textilier är materialsammansättning, land för primär tillverkning och reparerbarhetsindex obligatoriska. För elektronik tillkommer batterikapacitet, energieffektivitetsklass och tillgång till reservdelar. Frivilliga datapunkter – som Scope 3-utsläpp, sociala indikatorer och cirkulärt innehåll – kan läggas till för att stärka produktens marknadsposition och trovärdighet.",
      },
      {
        heading: "JSON-LD och EU-datastandard",
        body:
          "DPP-data lagras och utbyts i formatet JSON-LD (JavaScript Object Notation for Linked Data). Det är ett W3C-standardformat som gör varje datapunkt maskinläsbar och länkbar via en unik URI. Nexus-OS genererar automatiskt korrekt JSON-LD när du fyller i DPP-formuläret – du behöver inte kunna programmera. Det är ändå värdefullt att förstå strukturen för att kunna verifiera att din data är korrekt.",
        highlight: "Nexus-OS genererar automatiskt EU-kompatibel JSON-LD – du fyller i formuläret, systemet sköter formateringen.",
      },
      {
        heading: "Övning 1: Öppna DPP-verktyget",
        body:
          "Navigera nu till Nexus-OS DPP-verktyget via menyn (Produktpass â†’ Skapa nytt DPP). Du ser ett formulär med fyra sektioner: Produktidentifiering, Materialdata, Miljöprestanda och Länkstruktur. Titta igenom alla fält innan du börjar fylla i. Notera vilka fält som är markerade som obligatoriska (röd asterisk) och vilka som är frivilliga. I nästa lektion börjar vi fylla i formuläret med riktig data.",
      },
    ],
    keyConcepts: [
      { term: "JSON-LD", definition: "JavaScript Object Notation for Linked Data – W3C-standardformat för DPP-data som gör varje datapunkt maskinläsbar och universellt förståelig." },
      { term: "UUID", definition: "Universally Unique Identifier – en globalt unik alfanumerisk kod som identifierar ett specifikt DPP-dokument." },
      { term: "GTIN", definition: "Global Trade Item Number – standardiserad produktidentifierare (EAN-streckkod) som används i hela leverantörskedjan." },
      { term: "Reparerbarhetsindex", definition: "EU-standardiserat mått (0–10) på hur lätt en produkt är att reparera, baserat på tillgång till reservdelar, dokumentation och demonterbarhet." },
      { term: "EPCIS", definition: "Electronic Product Code Information Services – EU-standard för spårbarhet och datautbyte i leverantörskedjor." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilka tre lager utgör ett komplett DPP?",
        options: [
          "Certifikat, rapport och faktura",
          "Identifieringslager, datapunkter och länkstruktur",
          "Produktbeskrivning, pris och garanti",
          "Tillverkare, distributör och återförsäljare",
        ],
        correct: 1,
        explanation: "DPP:ets tre lager är Identifieringslagret (unik ID och produktinfo), Datapunkterna (miljödata) och Länkstrukturen (QR/NFC till EU-register).",
      },
      {
        id: "q2",
        question: "Vilket dataformat används för att lagra och utbyta DPP-data?",
        options: ["PDF", "Excel/CSV", "JSON-LD", "Word-dokument"],
        correct: 2,
        explanation: "JSON-LD (JavaScript Object Notation for Linked Data) är W3C-standarden för DPP-data. Nexus-OS genererar automatiskt korrekt JSON-LD från formulärdata.",
      },
      {
        id: "q3",
        question: "Vad avgör vilka datapunkter som är OBLIGATORISKA för ett specifikt DPP?",
        options: [
          "Tillverkarens egna val",
          "EU-kommissionens generella riktlinjer",
          "Den produktkategorispecifika delegerade akten",
          "Nexus-OS plattformens standardinställningar",
        ],
        correct: 2,
        explanation: "Varje produktkategori regleras av en specifik delegerad akt som exakt specificerar vilka datapunkter som är obligatoriska. Textilier har andra krav än elektronik.",
      },
    ],
    practicalTip:
      "Öppna Nexus-OS DPP-verktyget (Produktpass â†’ Skapa nytt DPP) och titta igenom alla formulärfält. Gör en lista på vilka data du behöver samla in för din pilotprodukt. Det är din checklista för lektion 2.",
  },

  // â”€â”€â”€ LEKTION 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-1",
    courseId: "dpp-creator",
    moduleIndex: 1,
    title: "LCA-data – samla in rätt information",
    duration: "40 min",
    free: false,
    intro:
      "Det svåraste med att skapa ett DPP är inte tekniken – det är datainsamlingen. Denna lektion ger dig ett systematiskt ramverk för att samla in LCA-data (livscykelanalysdata) från din leverantörskedja, och visar hur du fyller i Nexus-OS materialformulär med verklig data.",
    sections: [
      {
        heading: "Fyra datakällor för LCA",
        body:
          "LCA-data för ett DPP kommer från fyra primära källor. Primärdata är den mest exakta: mätningar direkt från din tillverkningsprocess (energiförbrukning, vattenanvändning, avfall). Leverantörsdata är information om råmaterial och komponenter som dina leverantörer tillhandahåller. Branschdatabaser som Ecoinvent, GaBi och ELCD innehåller genomsnittsvärden för tusentals material och processer. Slutligen finns EPD:er (Environmental Product Declarations) – tredjeparts-verifierade miljödeklarationer från leverantörer.",
        highlight: "Primärdata ger det mest exakta DPP:et. Branschdatabaser är acceptabla för en första version.",
      },
      {
        heading: "Materialsammansättning – steg för steg",
        body:
          "Börja med att lista alla material i din produkt och deras procentuella vikt. Nexus-OS materialformulär har fält för upp till 20 material. För varje material anger du: materialnamn (standardiserat enligt CAS-nummer om möjligt), vikt i gram eller procent, om det är återvunnet material (och hur stor andel), och ursprungsland. En t-shirt kan exempelvis bestå av 60% bomull (Indien), 35% polyester (återvunnet, Kina) och 5% elastan (Tyskland).",
      },
      {
        heading: "Koldioxidavtryck – Scope 1, 2 och 3",
        body:
          "DPP:et kräver koldioxidavtryck uppdelat på Scope 1 (direkta utsläpp från din produktion), Scope 2 (indirekta utsläpp från köpt energi) och Scope 3 (alla övriga utsläpp i värdekedjan – råmaterial, transport, användning, avfallshantering). För ett första DPP är Scope 1+2 obligatoriska; Scope 3 är frivilligt men starkt rekommenderat. Nexus-OS beräknar automatiskt ett totalt COâ‚‚-värde i kg COâ‚‚e per produkt.",
        highlight: "Scope 3 utgör typiskt 70–90% av ett produkts totala koldioxidavtryck.",
      },
      {
        heading: "Övning 2: Fyll i materialformuläret",
        body:
          "Öppna Nexus-OS DPP-verktyget och välj din pilotprodukt. Gå till sektionen 'Materialdata' och fyll i de tre viktigaste materialen med deras procentuella vikt. Om du inte har exakta data, använd branschdatabasens standardvärden (klicka på 'Hämta branschvärde' bredvid varje fält). Spara ett utkast och notera vilka fält som fortfarande saknar data – det är din insamlingslista för leverantörsdialog.",
      },
    ],
    keyConcepts: [
      { term: "LCA", definition: "Life Cycle Assessment (Livscykelanalys) – systematisk metod för att kvantifiera miljöpåverkan från en produkts hela livscykel." },
      { term: "Scope 1/2/3", definition: "GHG Protocol-klassificering av koldioxidutsläpp: Scope 1 = direkta, Scope 2 = köpt energi, Scope 3 = hela värdekedjan." },
      { term: "EPD", definition: "Environmental Product Declaration – tredjeparts-verifierad miljödeklaration enligt ISO 14025 och EN 15804." },
      { term: "Ecoinvent", definition: "Världens mest använda LCA-databas med data för 18 000+ processer och material." },
      { term: "CAS-nummer", definition: "Chemical Abstracts Service-nummer – globalt unikt ID för kemiska ämnen, används för att standardisera materialnamn i DPP." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilken datakälla ger det mest exakta LCA-resultatet för ett DPP?",
        options: [
          "Branschdatabaser som Ecoinvent",
          "Primärdata från din egen tillverkningsprocess",
          "Leverantörernas marknadsföringsmaterial",
          "EU-kommissionens standardvärden",
        ],
        correct: 1,
        explanation: "Primärdata – mätningar direkt från din tillverkningsprocess – ger det mest exakta och trovärdiga DPP:et. Branschdatabaser är acceptabla för en första version men bör ersättas med primärdata när möjligt.",
      },
      {
        id: "q2",
        question: "Vad ingår i Scope 3-utsläpp?",
        options: [
          "Direkta utsläpp från din fabrik",
          "Utsläpp från köpt el och värme",
          "Utsläpp från råmaterial, transport, användning och avfallshantering",
          "Utsläpp från konkurrenters produkter",
        ],
        correct: 2,
        explanation: "Scope 3 inkluderar alla indirekta utsläpp i värdekedjan: råmaterialutvinning, komponenttillverkning, transport, produktanvändning och sluthantering. Det utgör typiskt 70–90% av en produkts totala klimatpåverkan.",
      },
      {
        id: "q3",
        question: "Vad är en EPD?",
        options: [
          "En EU-förordning om produktpass",
          "En tredjeparts-verifierad miljödeklaration enligt ISO 14025",
          "En typ av energieffektivitetsmärkning",
          "Ett EU-register för produktdata",
        ],
        correct: 1,
        explanation: "EPD (Environmental Product Declaration) är en tredjeparts-verifierad miljödeklaration som leverantörer kan tillhandahålla. Den är en av de bästa datakällorna för DPP-materialdata.",
      },
    ],
    practicalTip:
      "Skicka ett enkelt e-postmeddelande till dina tre viktigaste leverantörer och be om: (1) materialsammansättning i %, (2) COâ‚‚-avtryck per kg material, och (3) eventuell EPD. De flesta leverantörer har denna data tillgänglig – det handlar om att fråga.",
  },

  // â”€â”€â”€ LEKTION 3 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-2",
    courseId: "dpp-creator",
    moduleIndex: 2,
    title: "Skapa DPP med Nexus-OS (hands-on)",
    duration: "45 min",
    free: false,
    intro:
      "Nu är det dags att skapa ditt första riktiga DPP i Nexus-OS. Denna lektion är en komplett genomgång av hela skapandeprocessen – från att fylla i produktinformation till att generera en EU-kompatibel JSON-LD-fil och en QR-kod. Du arbetar med din pilotprodukt under hela lektionen.",
    sections: [
      {
        heading: "Steg 1: Produktidentifiering",
        body:
          "Börja med att fylla i produktens grundinformation i Nexus-OS DPP-formulär. Produktnamn ska vara det officiella handelsnamnet (inte ett internt arbetsnamn). Varumärke är ditt registrerade varumärke. Kategori väljer du från en standardiserad EU-lista – välj den kategori som bäst matchar din produkt. Nexus-OS genererar automatiskt ett UUID (unikt ID) för ditt DPP och kopplar det till ditt GTIN om du anger det.",
        highlight: "Produktnamn och kategori är de viktigaste fälten – de avgör vilka obligatoriska datapunkter som aktiveras.",
      },
      {
        heading: "Steg 2: Materialdata och COâ‚‚",
        body:
          "I materialformuläret anger du de material du samlade in i lektion 2. Nexus-OS har en inbyggd materialdatabas med 500+ vanliga material och deras standardvärden för COâ‚‚, vatten och energi. Sök på materialnamn och välj från listan för att automatiskt fylla i standardvärden. Justera sedan värdena med din primärdata om du har den. COâ‚‚-fältet beräknas automatiskt baserat på materialvikter och emissionsfaktorer.",
      },
      {
        heading: "Steg 3: Reparerbarhets- och återvinningsindex",
        body:
          "Reparerbarhetsindex (0–10) beräknas i Nexus-OS via ett frågeformulär med fem frågor: Finns reservdelar tillgängliga? Finns reparationsdokumentation? Kan produkten demonteras utan specialverktyg? Finns auktoriserade reparatörer? Är reservdelar tillgängliga i minst 7 år? Varje ja ger 2 poäng. Återvinningsbarhet anges som procentandel av produktens vikt som kan återvinnas i befintlig infrastruktur.",
        highlight: "Ett reparerbarhetsindex på 8+ är ett starkt säljargument och kan ge tillgång till EU:s gröna upphandling.",
      },
      {
        heading: "Steg 4: Generera och granska DPP",
        body:
          "När alla obligatoriska fält är ifyllda klickar du på 'Generera DPP'. Nexus-OS skapar ett komplett JSON-LD-dokument och en QR-kod. Granska JSON-LD-förhandsgranskningen för att verifiera att all data är korrekt. Kontrollera särskilt att produktidentifieraren är unik, att alla obligatoriska fält är ifyllda, och att COâ‚‚-värdet verkar rimligt för din produktkategori. Spara DPP:et som ett utkast – du kan redigera det i lektion 4 innan publicering.",
      },
    ],
    keyConcepts: [
      { term: "Emissionsfaktor", definition: "Mängden COâ‚‚e som genereras per kg av ett specifikt material eller per kWh energi, används för att beräkna koldioxidavtryck." },
      { term: "UUID", definition: "Universally Unique Identifier – en globalt unik kod som automatiskt genereras av Nexus-OS för varje nytt DPP." },
      { term: "QR-kod", definition: "Tvådimensionell streckkod som länkas till DPP:et i EU-registret – måste fästas på eller medfölja produkten." },
      { term: "Utkast", definition: "Ett DPP som är sparat men inte publicerat – kan redigeras fritt utan att påverka det officiella registret." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad händer när du väljer produktkategori i Nexus-OS DPP-formulär?",
        options: [
          "Ingenting – kategorin är bara för intern sortering",
          "Systemet aktiverar de obligatoriska datapunkterna för den kategorin",
          "Systemet söker automatiskt efter liknande produkter",
          "Kategorin skickas direkt till EU-registret",
        ],
        correct: 1,
        explanation: "Produktkategorin avgör vilka datapunkter som är obligatoriska enligt den delegerade akten för den kategorin. Nexus-OS aktiverar automatiskt rätt fält baserat på vald kategori.",
      },
      {
        id: "q2",
        question: "Hur beräknas reparerbarhetsindex i Nexus-OS?",
        options: [
          "Manuellt av användaren baserat på egna bedömningar",
          "Via ett frågeformulär med fem frågor om reservdelar, dokumentation och demonterbarhet",
          "Automatiskt baserat på produktens vikt och material",
          "Av en extern certifierare som Nexus-OS kontaktar",
        ],
        correct: 1,
        explanation: "Reparerbarhetsindex beräknas via ett strukturerat frågeformulär med fem frågor. Varje ja ger 2 poäng, vilket ger ett index från 0 till 10.",
      },
      {
        id: "q3",
        question: "Vad är skillnaden mellan ett DPP-utkast och ett publicerat DPP?",
        options: [
          "Utkast är gratis, publicerade DPP:er kostar pengar",
          "Utkast kan redigeras fritt; publicerade DPP:er är registrerade i EU-registret",
          "Utkast är bara synliga för dig; publicerade DPP:er är synliga för alla",
          "Det finns ingen skillnad",
        ],
        correct: 1,
        explanation: "Ett utkast är ett DPP under arbete som kan redigeras fritt. När du publicerar registreras DPP:et i EU:s centrala register och QR-koden aktiveras – det är det officiella dokumentet.",
      },
    ],
    practicalTip:
      "Skapa ett DPP-utkast för din pilotprodukt i Nexus-OS nu. Fyll i så mycket du kan med tillgänglig data och använd branschdatabasens standardvärden för resten. Spara utkastet – du verifierar och kompletterar det i lektion 4.",
  },

  // â”€â”€â”€ LEKTION 4 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-3",
    courseId: "dpp-creator",
    moduleIndex: 3,
    title: "Verifiera och publicera",
    duration: "30 min",
    free: false,
    intro:
      "Ett DPP är bara trovärdigt om datan är korrekt och verifierbar. Denna lektion täcker verifieringsprocessen – hur du kontrollerar att din data är rimlig, hur NIF-granskningsfunktionen i Nexus-OS fungerar, och hur du publicerar ditt DPP i EU-registret.",
    sections: [
      {
        heading: "NIF-granskning – Nexus Integrity Framework",
        body:
          "Innan du publicerar kör Nexus-OS en automatisk NIF-granskning (Nexus Integrity Framework) av ditt DPP. Granskningen kontrollerar tre saker: Datakvalitet (är alla obligatoriska fält ifyllda och inom rimliga värdeintervall?), Konsistens (stämmer materialdata överens med COâ‚‚-beräkningarna?) och Trovärdighet (avviker dina värden signifikant från branschgenomsnittet?). Granskningen tar 10–30 sekunder och returnerar en rapport med eventuella varningar.",
        highlight: "NIF-granskning är obligatorisk i Nexus-OS innan publicering – den skyddar dig mot oavsiktliga fel.",
      },
      {
        heading: "Tolka NIF-rapporten",
        body:
          "NIF-rapporten delar in fynd i tre kategorier. Grönt (godkänt) innebär att datapunkten är inom rimliga gränser och konsistent. Gult (varning) innebär att värdet avviker från branschgenomsnittet med mer än 30% – det kan vara korrekt men bör dubbelkollas. Rött (fel) innebär att ett obligatoriskt fält saknas eller att ett värde är utanför rimliga gränser (t.ex. negativt COâ‚‚-värde). Röda fynd måste åtgärdas innan publicering; gula är rekommendationer.",
      },
      {
        heading: "Publicering och EU-registrering",
        body:
          "När NIF-granskningen är godkänd klickar du på 'Publicera DPP'. Nexus-OS skickar automatiskt DPP:et till EU:s centrala DPP-register (när det är operativt 2026) och genererar en permanent QR-kod. QR-koden är länkad till ditt DPP och uppdateras automatiskt om du uppdaterar DPP:et. Tills EU-registret är operativt lagras DPP:et i Nexus-OS eget register med en temporär QR-kod.",
        highlight: "EU:s centrala DPP-register beräknas vara operativt Q3 2026. Nexus-OS migrerar automatiskt alla DPP:er vid lansering.",
      },
      {
        heading: "Övning 4: Verifiera ditt utkast",
        body:
          "Öppna ditt DPP-utkast från lektion 3 och kör NIF-granskning (klicka på 'Granska DPP'). Läs igenom rapporten och åtgärda eventuella röda fynd. För gula varningar, kontrollera om dina värden faktiskt är korrekta eller om du behöver bättre data. När granskningen är godkänd (inga röda fynd), klicka på 'Publicera' för att skapa ett officiellt DPP med QR-kod.",
      },
    ],
    keyConcepts: [
      { term: "NIF", definition: "Nexus Integrity Framework – Nexus-OS interna granskningssystem som verifierar DPP-data för kvalitet, konsistens och trovärdighet." },
      { term: "Datakvalitet", definition: "Mått på hur fullständig, korrekt och verifierbar DPP-datan är – avgör DPP:ets trovärdighet på marknaden." },
      { term: "EU DPP-register", definition: "EU:s centrala databas för alla publicerade DPP:er, beräknas vara operativt Q3 2026." },
      { term: "Permanent QR-kod", definition: "En QR-kod som är permanent länkad till ett specifikt DPP och automatiskt uppdateras när DPP:et uppdateras." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad kontrollerar NIF-granskningen i Nexus-OS?",
        options: [
          "Att produkten uppfyller alla EU-säkerhetskrav",
          "Datakvalitet, konsistens och trovärdighet i DPP-datan",
          "Att tillverkaren är registrerad i EU:s företagsregister",
          "Att produkten har rätt CE-märkning",
        ],
        correct: 1,
        explanation: "NIF-granskning kontrollerar tre dimensioner: Datakvalitet (fullständiga och rimliga värden), Konsistens (intern logik i datan) och Trovärdighet (jämförelse med branschgenomsnitt).",
      },
      {
        id: "q2",
        question: "Vad innebär ett GULT fynd i NIF-rapporten?",
        options: [
          "Felet är kritiskt och måste åtgärdas omedelbart",
          "Värdet avviker från branschgenomsnittet med >30% – bör dubbelkollas men blockerar inte publicering",
          "Datapunkten är frivillig och kan utelämnas",
          "Granskningen kunde inte kontrollera datapunkten",
        ],
        correct: 1,
        explanation: "Gult innebär en varning – värdet avviker signifikant från branschgenomsnittet. Det kan vara korrekt (om din produkt är ovanlig) men bör verifieras. Det blockerar inte publicering, till skillnad från röda fynd.",
      },
      {
        id: "q3",
        question: "Vad händer med QR-koden om du uppdaterar ett publicerat DPP?",
        options: [
          "Du måste skapa en ny QR-kod",
          "Den gamla QR-koden slutar fungera",
          "QR-koden är permanent och uppdateras automatiskt med ny data",
          "Du måste kontakta EU-registret för att uppdatera",
        ],
        correct: 2,
        explanation: "QR-koden är permanent länkad till DPP:ets UUID. När du uppdaterar DPP:et i Nexus-OS uppdateras automatiskt den data som QR-koden pekar på – ingen ny kod behövs.",
      },
    ],
    practicalTip:
      "Kör NIF-granskning på ditt utkast och ta en skärmdump av rapporten. Den visar exakt vilka data som behöver förbättras och är ett utmärkt underlag för dialog med leverantörer om vilken data de behöver leverera.",
  },

  // â”€â”€â”€ LEKTION 5 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-4",
    courseId: "dpp-creator",
    moduleIndex: 4,
    title: "Underhåll och uppdatering",
    duration: "30 min",
    free: false,
    intro:
      "Ett DPP är inte ett statiskt dokument – det ska uppdateras när produkten förändras, när bättre data blir tillgänglig, eller när EU-kraven skärps. Denna avslutande lektion ger dig ett ramverk för löpande DPP-förvaltning och visar hur du bygger en skalbar process för hela din produktportfölj.",
    sections: [
      {
        heading: "Tre typer av DPP-uppdateringar",
        body:
          "DPP-uppdateringar delas in i tre kategorier. Produktförändringar sker när du ändrar materialsammansättning, leverantör eller tillverkningsprocess – DPP:et måste uppdateras inom 30 dagar. Datakvalitetsförbättringar sker när du ersätter branschdatabasens standardvärden med primärdata från din leverantör – detta stärker DPP:ets trovärdighet och bör göras löpande. Regelverksuppdateringar sker när EU publicerar nya delegerade akter eller skärper befintliga krav – Nexus-OS notifierar dig automatiskt och markerar vilka fält som behöver uppdateras.",
        highlight: "Nexus-OS skickar automatiska notifieringar när ditt DPP behöver uppdateras på grund av regelverksförändringar.",
      },
      {
        heading: "Versionshantering och spårbarhet",
        body:
          "Nexus-OS sparar en komplett versionshistorik för varje DPP. Varje uppdatering skapar en ny version med tidsstämpel och en notering om vad som ändrades. Den senaste versionen är alltid den aktiva – den som QR-koden pekar på. Äldre versioner är tillgängliga för granskning och kan exporteras som bevis för compliance-revisioner. Versionshistoriken är också värdefull för att visa kontinuerlig förbättring mot hållbarhetsmål.",
      },
      {
        heading: "Skalning till hela produktportföljen",
        body:
          "När du har ett fungerande DPP för din pilotprodukt är det dags att skala upp. Nexus-OS erbjuder tre skalningsverktyg: DPP-mallar (skapa en mall från en befintlig produkt och applicera den på liknande produkter), Bulk-import (importera produktdata från Excel eller CSV för att skapa flera DPP:er samtidigt) och API-integration (koppla Nexus-OS direkt till ditt ERP-system för automatisk DPP-generering vid produktskapande).",
        highlight: "Med DPP-mallar kan du skapa ett nytt DPP på under 10 minuter för liknande produkter.",
      },
      {
        heading: "Övning 5: Skapa en DPP-mall",
        body:
          "Öppna ditt publicerade DPP och klicka på 'Spara som mall'. Ge mallen ett beskrivande namn (t.ex. 'Textil – bomull/polyester standard'). Mallen sparar produktkategori, materialstruktur och standardvärden, men rensar produktspecifik data som namn, GTIN och primärdata. Nästa gång du skapar ett liknande DPP väljer du mallen som startpunkt och behöver bara fylla i de produktspecifika fälten.",
      },
    ],
    keyConcepts: [
      { term: "Versionshistorik", definition: "Komplett logg över alla ändringar i ett DPP med tidsstämpel och ändringsnotering – obligatorisk för compliance-revisioner." },
      { term: "DPP-mall", definition: "En återanvändbar DPP-struktur med förifyllda standardvärden för en produktkategori, som snabbar upp skapandet av liknande DPP:er." },
      { term: "Bulk-import", definition: "Funktion i Nexus-OS för att skapa flera DPP:er samtidigt via Excel/CSV-import." },
      { term: "API-integration", definition: "Teknisk koppling mellan Nexus-OS och ett ERP-system för automatisk DPP-generering vid produktskapande." },
      { term: "Compliance-revision", definition: "Extern granskning av ett företags efterlevnad av ESPR-kraven, ofta utförd av certifieringsorgan." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Inom hur många dagar måste ett DPP uppdateras efter en produktförändring?",
        options: ["7 dagar", "30 dagar", "90 dagar", "1 år"],
        correct: 1,
        explanation: "Enligt ESPR-regelverket måste ett DPP uppdateras inom 30 dagar efter en väsentlig produktförändring, som ändrad materialsammansättning eller ny leverantör.",
      },
      {
        id: "q2",
        question: "Vad är fördelen med DPP-mallar i Nexus-OS?",
        options: [
          "De ersätter behovet av primärdata",
          "De gör att du kan skapa liknande DPP:er snabbt med förifyllda standardvärden",
          "De godkänns automatiskt av EU utan NIF-granskning",
          "De är gratis att använda även i gratisplanen",
        ],
        correct: 1,
        explanation: "DPP-mallar sparar produktkategori, materialstruktur och standardvärden. När du skapar ett liknande DPP väljer du mallen och behöver bara fylla i produktspecifika fält – skapar ett nytt DPP på under 10 minuter.",
      },
      {
        id: "q3",
        question: "Varför är versionshistoriken i DPP:et viktig?",
        options: [
          "Den är inte viktig – bara den senaste versionen räknas",
          "Den visar kontinuerlig förbättring och är bevis vid compliance-revisioner",
          "Den krävs för att QR-koden ska fungera",
          "Den används för att beräkna produktens koldioxidavtryck",
        ],
        correct: 1,
        explanation: "Versionshistoriken dokumenterar kontinuerlig förbättring av produktens hållbarhetsprestanda och är ett viktigt bevisunderlag vid externa compliance-revisioner och EU-granskningar.",
      },
    ],
    practicalTip:
      "Sätt upp en återkommande kalenderpost var tredje månad för att granska dina DPP:er. Kontrollera om leverantörer har ny primärdata, om produkten har förändrats, och om Nexus-OS har flaggat nya regelverksuppdateringar. Konsistens är nyckeln till ett trovärdigt DPP-program.",
  },
];

