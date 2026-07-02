/**
 * NEXUS-OS â€“ DPP-skaparen: Fem praktiska lektioner
 * Hands-on kursinnehÃ¥ll kopplat till Nexus-OS DPP-verktyget (/produktpass)
 */

import type { LessonContent } from "./lessonContent";

export const DPP_LESSONS: LessonContent[] = [
  // â”€â”€â”€ LEKTION 1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-0",
    courseId: "dpp-creator",
    moduleIndex: 0,
    title: "DPP-strukturen â€“ vad ska med?",
    duration: "35 min",
    free: false,
    intro:
      "Det Digitala Produktpasset Ã¤r mer Ã¤n ett dokument â€“ det Ã¤r ett standardiserat digitalt identitetskort fÃ¶r din produkt. Denna lektion gÃ¥r igenom den tekniska strukturen, vilka datapunkter som Ã¤r obligatoriska, och hur Nexus-OS DPP-verktyget Ã¤r byggt fÃ¶r att guida dig genom hela processen.",
    sections: [
      {
        heading: "DPP:ets tre lager",
        body:
          "Ett DPP bestÃ¥r av tre sammankopplade lager. Det fÃ¶rsta Ã¤r Identifieringslagret som innehÃ¥ller en unik produktidentifierare (UUID), GTIN/EAN-streckkod, batch- och serienummer samt tillverkningsdatum och -plats. Det andra lagret Ã¤r Datapunkterna â€“ den faktiska miljÃ¶informationen: materialsammansÃ¤ttning, koldioxidavtryck (Scope 1+2), reparerbarhetsindex, Ã¥tervinningsbarhet och fÃ¶rvÃ¤ntad livslÃ¤ngd. Det tredje lagret Ã¤r LÃ¤nkstrukturen â€“ en QR-kod eller NFC-tagg som pekar till ett registrerat DPP i EU:s centrala register.",
        highlight: "Varje DPP mÃ¥ste ha en globalt unik identifierare och vara registrerat i EU:s DPP-register senast 2026.",
      },
      {
        heading: "Obligatoriska vs. frivilliga datapunkter",
        body:
          "Varje produktkategori har sin egen uppsÃ¤ttning obligatoriska datapunkter definierade i den delegerade akten. FÃ¶r textilier Ã¤r materialsammansÃ¤ttning, land fÃ¶r primÃ¤r tillverkning och reparerbarhetsindex obligatoriska. FÃ¶r elektronik tillkommer batterikapacitet, energieffektivitetsklass och tillgÃ¥ng till reservdelar. Frivilliga datapunkter â€“ som Scope 3-utslÃ¤pp, sociala indikatorer och cirkulÃ¤rt innehÃ¥ll â€“ kan lÃ¤ggas till fÃ¶r att stÃ¤rka produktens marknadsposition och trovÃ¤rdighet.",
      },
      {
        heading: "JSON-LD och EU-datastandard",
        body:
          "DPP-data lagras och utbyts i formatet JSON-LD (JavaScript Object Notation for Linked Data). Det Ã¤r ett W3C-standardformat som gÃ¶r varje datapunkt maskinlÃ¤sbar och lÃ¤nkbar via en unik URI. Nexus-OS genererar automatiskt korrekt JSON-LD nÃ¤r du fyller i DPP-formulÃ¤ret â€“ du behÃ¶ver inte kunna programmera. Det Ã¤r Ã¤ndÃ¥ vÃ¤rdefullt att fÃ¶rstÃ¥ strukturen fÃ¶r att kunna verifiera att din data Ã¤r korrekt.",
        highlight: "Nexus-OS genererar automatiskt EU-kompatibel JSON-LD â€“ du fyller i formulÃ¤ret, systemet skÃ¶ter formateringen.",
      },
      {
        heading: "Ã–vning 1: Ã–ppna DPP-verktyget",
        body:
          "Navigera nu till Nexus-OS DPP-verktyget via menyn (Produktpass â†’ Skapa nytt DPP). Du ser ett formulÃ¤r med fyra sektioner: Produktidentifiering, Materialdata, MiljÃ¶prestanda och LÃ¤nkstruktur. Titta igenom alla fÃ¤lt innan du bÃ¶rjar fylla i. Notera vilka fÃ¤lt som Ã¤r markerade som obligatoriska (rÃ¶d asterisk) och vilka som Ã¤r frivilliga. I nÃ¤sta lektion bÃ¶rjar vi fylla i formulÃ¤ret med riktig data.",
      },
    ],
    keyConcepts: [
      { term: "JSON-LD", definition: "JavaScript Object Notation for Linked Data â€“ W3C-standardformat fÃ¶r DPP-data som gÃ¶r varje datapunkt maskinlÃ¤sbar och universellt fÃ¶rstÃ¥elig." },
      { term: "UUID", definition: "Universally Unique Identifier â€“ en globalt unik alfanumerisk kod som identifierar ett specifikt DPP-dokument." },
      { term: "GTIN", definition: "Global Trade Item Number â€“ standardiserad produktidentifierare (EAN-streckkod) som anvÃ¤nds i hela leverantÃ¶rskedjan." },
      { term: "Reparerbarhetsindex", definition: "EU-standardiserat mÃ¥tt (0â€“10) pÃ¥ hur lÃ¤tt en produkt Ã¤r att reparera, baserat pÃ¥ tillgÃ¥ng till reservdelar, dokumentation och demonterbarhet." },
      { term: "EPCIS", definition: "Electronic Product Code Information Services â€“ EU-standard fÃ¶r spÃ¥rbarhet och datautbyte i leverantÃ¶rskedjor." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilka tre lager utgÃ¶r ett komplett DPP?",
        options: [
          "Certifikat, rapport och faktura",
          "Identifieringslager, datapunkter och lÃ¤nkstruktur",
          "Produktbeskrivning, pris och garanti",
          "Tillverkare, distributÃ¶r och Ã¥terfÃ¶rsÃ¤ljare",
        ],
        correct: 1,
        explanation: "DPP:ets tre lager Ã¤r Identifieringslagret (unik ID och produktinfo), Datapunkterna (miljÃ¶data) och LÃ¤nkstrukturen (QR/NFC till EU-register).",
      },
      {
        id: "q2",
        question: "Vilket dataformat anvÃ¤nds fÃ¶r att lagra och utbyta DPP-data?",
        options: ["PDF", "Excel/CSV", "JSON-LD", "Word-dokument"],
        correct: 2,
        explanation: "JSON-LD (JavaScript Object Notation for Linked Data) Ã¤r W3C-standarden fÃ¶r DPP-data. Nexus-OS genererar automatiskt korrekt JSON-LD frÃ¥n formulÃ¤rdata.",
      },
      {
        id: "q3",
        question: "Vad avgÃ¶r vilka datapunkter som Ã¤r OBLIGATORISKA fÃ¶r ett specifikt DPP?",
        options: [
          "Tillverkarens egna val",
          "EU-kommissionens generella riktlinjer",
          "Den produktkategorispecifika delegerade akten",
          "Nexus-OS plattformens standardinstÃ¤llningar",
        ],
        correct: 2,
        explanation: "Varje produktkategori regleras av en specifik delegerad akt som exakt specificerar vilka datapunkter som Ã¤r obligatoriska. Textilier har andra krav Ã¤n elektronik.",
      },
    ],
    practicalTip:
      "Ã–ppna Nexus-OS DPP-verktyget (Produktpass â†’ Skapa nytt DPP) och titta igenom alla formulÃ¤rfÃ¤lt. GÃ¶r en lista pÃ¥ vilka data du behÃ¶ver samla in fÃ¶r din pilotprodukt. Det Ã¤r din checklista fÃ¶r lektion 2.",
  },

  // â”€â”€â”€ LEKTION 2 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-1",
    courseId: "dpp-creator",
    moduleIndex: 1,
    title: "LCA-data â€“ samla in rÃ¤tt information",
    duration: "40 min",
    free: false,
    intro:
      "Det svÃ¥raste med att skapa ett DPP Ã¤r inte tekniken â€“ det Ã¤r datainsamlingen. Denna lektion ger dig ett systematiskt ramverk fÃ¶r att samla in LCA-data (livscykelanalysdata) frÃ¥n din leverantÃ¶rskedja, och visar hur du fyller i Nexus-OS materialformulÃ¤r med verklig data.",
    sections: [
      {
        heading: "Fyra datakÃ¤llor fÃ¶r LCA",
        body:
          "LCA-data fÃ¶r ett DPP kommer frÃ¥n fyra primÃ¤ra kÃ¤llor. PrimÃ¤rdata Ã¤r den mest exakta: mÃ¤tningar direkt frÃ¥n din tillverkningsprocess (energifÃ¶rbrukning, vattenanvÃ¤ndning, avfall). LeverantÃ¶rsdata Ã¤r information om rÃ¥material och komponenter som dina leverantÃ¶rer tillhandahÃ¥ller. Branschdatabaser som Ecoinvent, GaBi och ELCD innehÃ¥ller genomsnittsvÃ¤rden fÃ¶r tusentals material och processer. Slutligen finns EPD:er (Environmental Product Declarations) â€“ tredjeparts-verifierade miljÃ¶deklarationer frÃ¥n leverantÃ¶rer.",
        highlight: "PrimÃ¤rdata ger det mest exakta DPP:et. Branschdatabaser Ã¤r acceptabla fÃ¶r en fÃ¶rsta version.",
      },
      {
        heading: "MaterialsammansÃ¤ttning â€“ steg fÃ¶r steg",
        body:
          "BÃ¶rja med att lista alla material i din produkt och deras procentuella vikt. Nexus-OS materialformulÃ¤r har fÃ¤lt fÃ¶r upp till 20 material. FÃ¶r varje material anger du: materialnamn (standardiserat enligt CAS-nummer om mÃ¶jligt), vikt i gram eller procent, om det Ã¤r Ã¥tervunnet material (och hur stor andel), och ursprungsland. En t-shirt kan exempelvis bestÃ¥ av 60% bomull (Indien), 35% polyester (Ã¥tervunnet, Kina) och 5% elastan (Tyskland).",
      },
      {
        heading: "Koldioxidavtryck â€“ Scope 1, 2 och 3",
        body:
          "DPP:et krÃ¤ver koldioxidavtryck uppdelat pÃ¥ Scope 1 (direkta utslÃ¤pp frÃ¥n din produktion), Scope 2 (indirekta utslÃ¤pp frÃ¥n kÃ¶pt energi) och Scope 3 (alla Ã¶vriga utslÃ¤pp i vÃ¤rdekedjan â€“ rÃ¥material, transport, anvÃ¤ndning, avfallshantering). FÃ¶r ett fÃ¶rsta DPP Ã¤r Scope 1+2 obligatoriska; Scope 3 Ã¤r frivilligt men starkt rekommenderat. Nexus-OS berÃ¤knar automatiskt ett totalt COâ‚‚-vÃ¤rde i kg COâ‚‚e per produkt.",
        highlight: "Scope 3 utgÃ¶r typiskt 70â€“90% av ett produkts totala koldioxidavtryck.",
      },
      {
        heading: "Ã–vning 2: Fyll i materialformulÃ¤ret",
        body:
          "Ã–ppna Nexus-OS DPP-verktyget och vÃ¤lj din pilotprodukt. GÃ¥ till sektionen 'Materialdata' och fyll i de tre viktigaste materialen med deras procentuella vikt. Om du inte har exakta data, anvÃ¤nd branschdatabasens standardvÃ¤rden (klicka pÃ¥ 'HÃ¤mta branschvÃ¤rde' bredvid varje fÃ¤lt). Spara ett utkast och notera vilka fÃ¤lt som fortfarande saknar data â€“ det Ã¤r din insamlingslista fÃ¶r leverantÃ¶rsdialog.",
      },
    ],
    keyConcepts: [
      { term: "LCA", definition: "Life Cycle Assessment (Livscykelanalys) â€“ systematisk metod fÃ¶r att kvantifiera miljÃ¶pÃ¥verkan frÃ¥n en produkts hela livscykel." },
      { term: "Scope 1/2/3", definition: "GHG Protocol-klassificering av koldioxidutslÃ¤pp: Scope 1 = direkta, Scope 2 = kÃ¶pt energi, Scope 3 = hela vÃ¤rdekedjan." },
      { term: "EPD", definition: "Environmental Product Declaration â€“ tredjeparts-verifierad miljÃ¶deklaration enligt ISO 14025 och EN 15804." },
      { term: "Ecoinvent", definition: "VÃ¤rldens mest anvÃ¤nda LCA-databas med data fÃ¶r 18 000+ processer och material." },
      { term: "CAS-nummer", definition: "Chemical Abstracts Service-nummer â€“ globalt unikt ID fÃ¶r kemiska Ã¤mnen, anvÃ¤nds fÃ¶r att standardisera materialnamn i DPP." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vilken datakÃ¤lla ger det mest exakta LCA-resultatet fÃ¶r ett DPP?",
        options: [
          "Branschdatabaser som Ecoinvent",
          "PrimÃ¤rdata frÃ¥n din egen tillverkningsprocess",
          "LeverantÃ¶rernas marknadsfÃ¶ringsmaterial",
          "EU-kommissionens standardvÃ¤rden",
        ],
        correct: 1,
        explanation: "PrimÃ¤rdata â€“ mÃ¤tningar direkt frÃ¥n din tillverkningsprocess â€“ ger det mest exakta och trovÃ¤rdiga DPP:et. Branschdatabaser Ã¤r acceptabla fÃ¶r en fÃ¶rsta version men bÃ¶r ersÃ¤ttas med primÃ¤rdata nÃ¤r mÃ¶jligt.",
      },
      {
        id: "q2",
        question: "Vad ingÃ¥r i Scope 3-utslÃ¤pp?",
        options: [
          "Direkta utslÃ¤pp frÃ¥n din fabrik",
          "UtslÃ¤pp frÃ¥n kÃ¶pt el och vÃ¤rme",
          "UtslÃ¤pp frÃ¥n rÃ¥material, transport, anvÃ¤ndning och avfallshantering",
          "UtslÃ¤pp frÃ¥n konkurrenters produkter",
        ],
        correct: 2,
        explanation: "Scope 3 inkluderar alla indirekta utslÃ¤pp i vÃ¤rdekedjan: rÃ¥materialutvinning, komponenttillverkning, transport, produktanvÃ¤ndning och sluthantering. Det utgÃ¶r typiskt 70â€“90% av en produkts totala klimatpÃ¥verkan.",
      },
      {
        id: "q3",
        question: "Vad Ã¤r en EPD?",
        options: [
          "En EU-fÃ¶rordning om produktpass",
          "En tredjeparts-verifierad miljÃ¶deklaration enligt ISO 14025",
          "En typ av energieffektivitetsmÃ¤rkning",
          "Ett EU-register fÃ¶r produktdata",
        ],
        correct: 1,
        explanation: "EPD (Environmental Product Declaration) Ã¤r en tredjeparts-verifierad miljÃ¶deklaration som leverantÃ¶rer kan tillhandahÃ¥lla. Den Ã¤r en av de bÃ¤sta datakÃ¤llorna fÃ¶r DPP-materialdata.",
      },
    ],
    practicalTip:
      "Skicka ett enkelt e-postmeddelande till dina tre viktigaste leverantÃ¶rer och be om: (1) materialsammansÃ¤ttning i %, (2) COâ‚‚-avtryck per kg material, och (3) eventuell EPD. De flesta leverantÃ¶rer har denna data tillgÃ¤nglig â€“ det handlar om att frÃ¥ga.",
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
      "Nu Ã¤r det dags att skapa ditt fÃ¶rsta riktiga DPP i Nexus-OS. Denna lektion Ã¤r en komplett genomgÃ¥ng av hela skapandeprocessen â€“ frÃ¥n att fylla i produktinformation till att generera en EU-kompatibel JSON-LD-fil och en QR-kod. Du arbetar med din pilotprodukt under hela lektionen.",
    sections: [
      {
        heading: "Steg 1: Produktidentifiering",
        body:
          "BÃ¶rja med att fylla i produktens grundinformation i Nexus-OS DPP-formulÃ¤r. Produktnamn ska vara det officiella handelsnamnet (inte ett internt arbetsnamn). VarumÃ¤rke Ã¤r ditt registrerade varumÃ¤rke. Kategori vÃ¤ljer du frÃ¥n en standardiserad EU-lista â€“ vÃ¤lj den kategori som bÃ¤st matchar din produkt. Nexus-OS genererar automatiskt ett UUID (unikt ID) fÃ¶r ditt DPP och kopplar det till ditt GTIN om du anger det.",
        highlight: "Produktnamn och kategori Ã¤r de viktigaste fÃ¤lten â€“ de avgÃ¶r vilka obligatoriska datapunkter som aktiveras.",
      },
      {
        heading: "Steg 2: Materialdata och COâ‚‚",
        body:
          "I materialformulÃ¤ret anger du de material du samlade in i lektion 2. Nexus-OS har en inbyggd materialdatabas med 500+ vanliga material och deras standardvÃ¤rden fÃ¶r COâ‚‚, vatten och energi. SÃ¶k pÃ¥ materialnamn och vÃ¤lj frÃ¥n listan fÃ¶r att automatiskt fylla i standardvÃ¤rden. Justera sedan vÃ¤rdena med din primÃ¤rdata om du har den. COâ‚‚-fÃ¤ltet berÃ¤knas automatiskt baserat pÃ¥ materialvikter och emissionsfaktorer.",
      },
      {
        heading: "Steg 3: Reparerbarhets- och Ã¥tervinningsindex",
        body:
          "Reparerbarhetsindex (0â€“10) berÃ¤knas i Nexus-OS via ett frÃ¥geformulÃ¤r med fem frÃ¥gor: Finns reservdelar tillgÃ¤ngliga? Finns reparationsdokumentation? Kan produkten demonteras utan specialverktyg? Finns auktoriserade reparatÃ¶rer? Ã„r reservdelar tillgÃ¤ngliga i minst 7 Ã¥r? Varje ja ger 2 poÃ¤ng. Ã…tervinningsbarhet anges som procentandel av produktens vikt som kan Ã¥tervinnas i befintlig infrastruktur.",
        highlight: "Ett reparerbarhetsindex pÃ¥ 8+ Ã¤r ett starkt sÃ¤ljargument och kan ge tillgÃ¥ng till EU:s grÃ¶na upphandling.",
      },
      {
        heading: "Steg 4: Generera och granska DPP",
        body:
          "NÃ¤r alla obligatoriska fÃ¤lt Ã¤r ifyllda klickar du pÃ¥ 'Generera DPP'. Nexus-OS skapar ett komplett JSON-LD-dokument och en QR-kod. Granska JSON-LD-fÃ¶rhandsgranskningen fÃ¶r att verifiera att all data Ã¤r korrekt. Kontrollera sÃ¤rskilt att produktidentifieraren Ã¤r unik, att alla obligatoriska fÃ¤lt Ã¤r ifyllda, och att COâ‚‚-vÃ¤rdet verkar rimligt fÃ¶r din produktkategori. Spara DPP:et som ett utkast â€“ du kan redigera det i lektion 4 innan publicering.",
      },
    ],
    keyConcepts: [
      { term: "Emissionsfaktor", definition: "MÃ¤ngden COâ‚‚e som genereras per kg av ett specifikt material eller per kWh energi, anvÃ¤nds fÃ¶r att berÃ¤kna koldioxidavtryck." },
      { term: "UUID", definition: "Universally Unique Identifier â€“ en globalt unik kod som automatiskt genereras av Nexus-OS fÃ¶r varje nytt DPP." },
      { term: "QR-kod", definition: "TvÃ¥dimensionell streckkod som lÃ¤nkas till DPP:et i EU-registret â€“ mÃ¥ste fÃ¤stas pÃ¥ eller medfÃ¶lja produkten." },
      { term: "Utkast", definition: "Ett DPP som Ã¤r sparat men inte publicerat â€“ kan redigeras fritt utan att pÃ¥verka det officiella registret." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad hÃ¤nder nÃ¤r du vÃ¤ljer produktkategori i Nexus-OS DPP-formulÃ¤r?",
        options: [
          "Ingenting â€“ kategorin Ã¤r bara fÃ¶r intern sortering",
          "Systemet aktiverar de obligatoriska datapunkterna fÃ¶r den kategorin",
          "Systemet sÃ¶ker automatiskt efter liknande produkter",
          "Kategorin skickas direkt till EU-registret",
        ],
        correct: 1,
        explanation: "Produktkategorin avgÃ¶r vilka datapunkter som Ã¤r obligatoriska enligt den delegerade akten fÃ¶r den kategorin. Nexus-OS aktiverar automatiskt rÃ¤tt fÃ¤lt baserat pÃ¥ vald kategori.",
      },
      {
        id: "q2",
        question: "Hur berÃ¤knas reparerbarhetsindex i Nexus-OS?",
        options: [
          "Manuellt av anvÃ¤ndaren baserat pÃ¥ egna bedÃ¶mningar",
          "Via ett frÃ¥geformulÃ¤r med fem frÃ¥gor om reservdelar, dokumentation och demonterbarhet",
          "Automatiskt baserat pÃ¥ produktens vikt och material",
          "Av en extern certifierare som Nexus-OS kontaktar",
        ],
        correct: 1,
        explanation: "Reparerbarhetsindex berÃ¤knas via ett strukturerat frÃ¥geformulÃ¤r med fem frÃ¥gor. Varje ja ger 2 poÃ¤ng, vilket ger ett index frÃ¥n 0 till 10.",
      },
      {
        id: "q3",
        question: "Vad Ã¤r skillnaden mellan ett DPP-utkast och ett publicerat DPP?",
        options: [
          "Utkast Ã¤r gratis, publicerade DPP:er kostar pengar",
          "Utkast kan redigeras fritt; publicerade DPP:er Ã¤r registrerade i EU-registret",
          "Utkast Ã¤r bara synliga fÃ¶r dig; publicerade DPP:er Ã¤r synliga fÃ¶r alla",
          "Det finns ingen skillnad",
        ],
        correct: 1,
        explanation: "Ett utkast Ã¤r ett DPP under arbete som kan redigeras fritt. NÃ¤r du publicerar registreras DPP:et i EU:s centrala register och QR-koden aktiveras â€“ det Ã¤r det officiella dokumentet.",
      },
    ],
    practicalTip:
      "Skapa ett DPP-utkast fÃ¶r din pilotprodukt i Nexus-OS nu. Fyll i sÃ¥ mycket du kan med tillgÃ¤nglig data och anvÃ¤nd branschdatabasens standardvÃ¤rden fÃ¶r resten. Spara utkastet â€“ du verifierar och kompletterar det i lektion 4.",
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
      "Ett DPP Ã¤r bara trovÃ¤rdigt om datan Ã¤r korrekt och verifierbar. Denna lektion tÃ¤cker verifieringsprocessen â€“ hur du kontrollerar att din data Ã¤r rimlig, hur NIF-granskningsfunktionen i Nexus-OS fungerar, och hur du publicerar ditt DPP i EU-registret.",
    sections: [
      {
        heading: "NIF-granskning â€“ Nexus Integrity Framework",
        body:
          "Innan du publicerar kÃ¶r Nexus-OS en automatisk NIF-granskning (Nexus Integrity Framework) av ditt DPP. Granskningen kontrollerar tre saker: Datakvalitet (Ã¤r alla obligatoriska fÃ¤lt ifyllda och inom rimliga vÃ¤rdeintervall?), Konsistens (stÃ¤mmer materialdata Ã¶verens med COâ‚‚-berÃ¤kningarna?) och TrovÃ¤rdighet (avviker dina vÃ¤rden signifikant frÃ¥n branschgenomsnittet?). Granskningen tar 10â€“30 sekunder och returnerar en rapport med eventuella varningar.",
        highlight: "NIF-granskning Ã¤r obligatorisk i Nexus-OS innan publicering â€“ den skyddar dig mot oavsiktliga fel.",
      },
      {
        heading: "Tolka NIF-rapporten",
        body:
          "NIF-rapporten delar in fynd i tre kategorier. GrÃ¶nt (godkÃ¤nt) innebÃ¤r att datapunkten Ã¤r inom rimliga grÃ¤nser och konsistent. Gult (varning) innebÃ¤r att vÃ¤rdet avviker frÃ¥n branschgenomsnittet med mer Ã¤n 30% â€“ det kan vara korrekt men bÃ¶r dubbelkollas. RÃ¶tt (fel) innebÃ¤r att ett obligatoriskt fÃ¤lt saknas eller att ett vÃ¤rde Ã¤r utanfÃ¶r rimliga grÃ¤nser (t.ex. negativt COâ‚‚-vÃ¤rde). RÃ¶da fynd mÃ¥ste Ã¥tgÃ¤rdas innan publicering; gula Ã¤r rekommendationer.",
      },
      {
        heading: "Publicering och EU-registrering",
        body:
          "NÃ¤r NIF-granskningen Ã¤r godkÃ¤nd klickar du pÃ¥ 'Publicera DPP'. Nexus-OS skickar automatiskt DPP:et till EU:s centrala DPP-register (nÃ¤r det Ã¤r operativt 2026) och genererar en permanent QR-kod. QR-koden Ã¤r lÃ¤nkad till ditt DPP och uppdateras automatiskt om du uppdaterar DPP:et. Tills EU-registret Ã¤r operativt lagras DPP:et i Nexus-OS eget register med en temporÃ¤r QR-kod.",
        highlight: "EU:s centrala DPP-register berÃ¤knas vara operativt Q3 2026. Nexus-OS migrerar automatiskt alla DPP:er vid lansering.",
      },
      {
        heading: "Ã–vning 4: Verifiera ditt utkast",
        body:
          "Ã–ppna ditt DPP-utkast frÃ¥n lektion 3 och kÃ¶r NIF-granskning (klicka pÃ¥ 'Granska DPP'). LÃ¤s igenom rapporten och Ã¥tgÃ¤rda eventuella rÃ¶da fynd. FÃ¶r gula varningar, kontrollera om dina vÃ¤rden faktiskt Ã¤r korrekta eller om du behÃ¶ver bÃ¤ttre data. NÃ¤r granskningen Ã¤r godkÃ¤nd (inga rÃ¶da fynd), klicka pÃ¥ 'Publicera' fÃ¶r att skapa ett officiellt DPP med QR-kod.",
      },
    ],
    keyConcepts: [
      { term: "NIF", definition: "Nexus Integrity Framework â€“ Nexus-OS interna granskningssystem som verifierar DPP-data fÃ¶r kvalitet, konsistens och trovÃ¤rdighet." },
      { term: "Datakvalitet", definition: "MÃ¥tt pÃ¥ hur fullstÃ¤ndig, korrekt och verifierbar DPP-datan Ã¤r â€“ avgÃ¶r DPP:ets trovÃ¤rdighet pÃ¥ marknaden." },
      { term: "EU DPP-register", definition: "EU:s centrala databas fÃ¶r alla publicerade DPP:er, berÃ¤knas vara operativt Q3 2026." },
      { term: "Permanent QR-kod", definition: "En QR-kod som Ã¤r permanent lÃ¤nkad till ett specifikt DPP och automatiskt uppdateras nÃ¤r DPP:et uppdateras." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Vad kontrollerar NIF-granskningen i Nexus-OS?",
        options: [
          "Att produkten uppfyller alla EU-sÃ¤kerhetskrav",
          "Datakvalitet, konsistens och trovÃ¤rdighet i DPP-datan",
          "Att tillverkaren Ã¤r registrerad i EU:s fÃ¶retagsregister",
          "Att produkten har rÃ¤tt CE-mÃ¤rkning",
        ],
        correct: 1,
        explanation: "NIF-granskning kontrollerar tre dimensioner: Datakvalitet (fullstÃ¤ndiga och rimliga vÃ¤rden), Konsistens (intern logik i datan) och TrovÃ¤rdighet (jÃ¤mfÃ¶relse med branschgenomsnitt).",
      },
      {
        id: "q2",
        question: "Vad innebÃ¤r ett GULT fynd i NIF-rapporten?",
        options: [
          "Felet Ã¤r kritiskt och mÃ¥ste Ã¥tgÃ¤rdas omedelbart",
          "VÃ¤rdet avviker frÃ¥n branschgenomsnittet med >30% â€“ bÃ¶r dubbelkollas men blockerar inte publicering",
          "Datapunkten Ã¤r frivillig och kan utelÃ¤mnas",
          "Granskningen kunde inte kontrollera datapunkten",
        ],
        correct: 1,
        explanation: "Gult innebÃ¤r en varning â€“ vÃ¤rdet avviker signifikant frÃ¥n branschgenomsnittet. Det kan vara korrekt (om din produkt Ã¤r ovanlig) men bÃ¶r verifieras. Det blockerar inte publicering, till skillnad frÃ¥n rÃ¶da fynd.",
      },
      {
        id: "q3",
        question: "Vad hÃ¤nder med QR-koden om du uppdaterar ett publicerat DPP?",
        options: [
          "Du mÃ¥ste skapa en ny QR-kod",
          "Den gamla QR-koden slutar fungera",
          "QR-koden Ã¤r permanent och uppdateras automatiskt med ny data",
          "Du mÃ¥ste kontakta EU-registret fÃ¶r att uppdatera",
        ],
        correct: 2,
        explanation: "QR-koden Ã¤r permanent lÃ¤nkad till DPP:ets UUID. NÃ¤r du uppdaterar DPP:et i Nexus-OS uppdateras automatiskt den data som QR-koden pekar pÃ¥ â€“ ingen ny kod behÃ¶vs.",
      },
    ],
    practicalTip:
      "KÃ¶r NIF-granskning pÃ¥ ditt utkast och ta en skÃ¤rmdump av rapporten. Den visar exakt vilka data som behÃ¶ver fÃ¶rbÃ¤ttras och Ã¤r ett utmÃ¤rkt underlag fÃ¶r dialog med leverantÃ¶rer om vilken data de behÃ¶ver leverera.",
  },

  // â”€â”€â”€ LEKTION 5 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: "dpp-creator-4",
    courseId: "dpp-creator",
    moduleIndex: 4,
    title: "UnderhÃ¥ll och uppdatering",
    duration: "30 min",
    free: false,
    intro:
      "Ett DPP Ã¤r inte ett statiskt dokument â€“ det ska uppdateras nÃ¤r produkten fÃ¶rÃ¤ndras, nÃ¤r bÃ¤ttre data blir tillgÃ¤nglig, eller nÃ¤r EU-kraven skÃ¤rps. Denna avslutande lektion ger dig ett ramverk fÃ¶r lÃ¶pande DPP-fÃ¶rvaltning och visar hur du bygger en skalbar process fÃ¶r hela din produktportfÃ¶lj.",
    sections: [
      {
        heading: "Tre typer av DPP-uppdateringar",
        body:
          "DPP-uppdateringar delas in i tre kategorier. ProduktfÃ¶rÃ¤ndringar sker nÃ¤r du Ã¤ndrar materialsammansÃ¤ttning, leverantÃ¶r eller tillverkningsprocess â€“ DPP:et mÃ¥ste uppdateras inom 30 dagar. DatakvalitetsfÃ¶rbÃ¤ttringar sker nÃ¤r du ersÃ¤tter branschdatabasens standardvÃ¤rden med primÃ¤rdata frÃ¥n din leverantÃ¶r â€“ detta stÃ¤rker DPP:ets trovÃ¤rdighet och bÃ¶r gÃ¶ras lÃ¶pande. Regelverksuppdateringar sker nÃ¤r EU publicerar nya delegerade akter eller skÃ¤rper befintliga krav â€“ Nexus-OS notifierar dig automatiskt och markerar vilka fÃ¤lt som behÃ¶ver uppdateras.",
        highlight: "Nexus-OS skickar automatiska notifieringar nÃ¤r ditt DPP behÃ¶ver uppdateras pÃ¥ grund av regelverksfÃ¶rÃ¤ndringar.",
      },
      {
        heading: "Versionshantering och spÃ¥rbarhet",
        body:
          "Nexus-OS sparar en komplett versionshistorik fÃ¶r varje DPP. Varje uppdatering skapar en ny version med tidsstÃ¤mpel och en notering om vad som Ã¤ndrades. Den senaste versionen Ã¤r alltid den aktiva â€“ den som QR-koden pekar pÃ¥. Ã„ldre versioner Ã¤r tillgÃ¤ngliga fÃ¶r granskning och kan exporteras som bevis fÃ¶r compliance-revisioner. Versionshistoriken Ã¤r ocksÃ¥ vÃ¤rdefull fÃ¶r att visa kontinuerlig fÃ¶rbÃ¤ttring mot hÃ¥llbarhetsmÃ¥l.",
      },
      {
        heading: "Skalning till hela produktportfÃ¶ljen",
        body:
          "NÃ¤r du har ett fungerande DPP fÃ¶r din pilotprodukt Ã¤r det dags att skala upp. Nexus-OS erbjuder tre skalningsverktyg: DPP-mallar (skapa en mall frÃ¥n en befintlig produkt och applicera den pÃ¥ liknande produkter), Bulk-import (importera produktdata frÃ¥n Excel eller CSV fÃ¶r att skapa flera DPP:er samtidigt) och API-integration (koppla Nexus-OS direkt till ditt ERP-system fÃ¶r automatisk DPP-generering vid produktskapande).",
        highlight: "Med DPP-mallar kan du skapa ett nytt DPP pÃ¥ under 10 minuter fÃ¶r liknande produkter.",
      },
      {
        heading: "Ã–vning 5: Skapa en DPP-mall",
        body:
          "Ã–ppna ditt publicerade DPP och klicka pÃ¥ 'Spara som mall'. Ge mallen ett beskrivande namn (t.ex. 'Textil â€“ bomull/polyester standard'). Mallen sparar produktkategori, materialstruktur och standardvÃ¤rden, men rensar produktspecifik data som namn, GTIN och primÃ¤rdata. NÃ¤sta gÃ¥ng du skapar ett liknande DPP vÃ¤ljer du mallen som startpunkt och behÃ¶ver bara fylla i de produktspecifika fÃ¤lten.",
      },
    ],
    keyConcepts: [
      { term: "Versionshistorik", definition: "Komplett logg Ã¶ver alla Ã¤ndringar i ett DPP med tidsstÃ¤mpel och Ã¤ndringsnotering â€“ obligatorisk fÃ¶r compliance-revisioner." },
      { term: "DPP-mall", definition: "En Ã¥teranvÃ¤ndbar DPP-struktur med fÃ¶rifyllda standardvÃ¤rden fÃ¶r en produktkategori, som snabbar upp skapandet av liknande DPP:er." },
      { term: "Bulk-import", definition: "Funktion i Nexus-OS fÃ¶r att skapa flera DPP:er samtidigt via Excel/CSV-import." },
      { term: "API-integration", definition: "Teknisk koppling mellan Nexus-OS och ett ERP-system fÃ¶r automatisk DPP-generering vid produktskapande." },
      { term: "Compliance-revision", definition: "Extern granskning av ett fÃ¶retags efterlevnad av ESPR-kraven, ofta utfÃ¶rd av certifieringsorgan." },
    ],
    quiz: [
      {
        id: "q1",
        question: "Inom hur mÃ¥nga dagar mÃ¥ste ett DPP uppdateras efter en produktfÃ¶rÃ¤ndring?",
        options: ["7 dagar", "30 dagar", "90 dagar", "1 Ã¥r"],
        correct: 1,
        explanation: "Enligt ESPR-regelverket mÃ¥ste ett DPP uppdateras inom 30 dagar efter en vÃ¤sentlig produktfÃ¶rÃ¤ndring, som Ã¤ndrad materialsammansÃ¤ttning eller ny leverantÃ¶r.",
      },
      {
        id: "q2",
        question: "Vad Ã¤r fÃ¶rdelen med DPP-mallar i Nexus-OS?",
        options: [
          "De ersÃ¤tter behovet av primÃ¤rdata",
          "De gÃ¶r att du kan skapa liknande DPP:er snabbt med fÃ¶rifyllda standardvÃ¤rden",
          "De godkÃ¤nns automatiskt av EU utan NIF-granskning",
          "De Ã¤r gratis att anvÃ¤nda Ã¤ven i gratisplanen",
        ],
        correct: 1,
        explanation: "DPP-mallar sparar produktkategori, materialstruktur och standardvÃ¤rden. NÃ¤r du skapar ett liknande DPP vÃ¤ljer du mallen och behÃ¶ver bara fylla i produktspecifika fÃ¤lt â€“ skapar ett nytt DPP pÃ¥ under 10 minuter.",
      },
      {
        id: "q3",
        question: "VarfÃ¶r Ã¤r versionshistoriken i DPP:et viktig?",
        options: [
          "Den Ã¤r inte viktig â€“ bara den senaste versionen rÃ¤knas",
          "Den visar kontinuerlig fÃ¶rbÃ¤ttring och Ã¤r bevis vid compliance-revisioner",
          "Den krÃ¤vs fÃ¶r att QR-koden ska fungera",
          "Den anvÃ¤nds fÃ¶r att berÃ¤kna produktens koldioxidavtryck",
        ],
        correct: 1,
        explanation: "Versionshistoriken dokumenterar kontinuerlig fÃ¶rbÃ¤ttring av produktens hÃ¥llbarhetsprestanda och Ã¤r ett viktigt bevisunderlag vid externa compliance-revisioner och EU-granskningar.",
      },
    ],
    practicalTip:
      "SÃ¤tt upp en Ã¥terkommande kalenderpost var tredje mÃ¥nad fÃ¶r att granska dina DPP:er. Kontrollera om leverantÃ¶rer har ny primÃ¤rdata, om produkten har fÃ¶rÃ¤ndrats, och om Nexus-OS har flaggat nya regelverksuppdateringar. Konsistens Ã¤r nyckeln till ett trovÃ¤rdigt DPP-program.",
  },
];

