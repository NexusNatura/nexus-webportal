/*
 * NEXUS-OS Terminal Page â€“ NexusCore v5.0 PowerShell Guide
 * Design: Nordic Sustainability Intelligence
 */

import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Terminal as TerminalIcon, Copy, CheckCircle2, Download, ChevronDown, ChevronRight } from "lucide-react";

const commands = [
  { cmd: "nexus 'version'", desc: "Visa version och systemstatus", output: "NexusCore v5.0 | WA-04: AKTIV | WA-06: InlÃ¤st" },
  { cmd: "nexus 'status'", desc: "FullstÃ¤ndig systemhÃ¤lsa", output: "âœ“ Gemini API: Ansluten | SÃ¤kerhetsklass: 2 | 47 sessioner" },
  { cmd: "nexus 'scan bidrag' -Profil 'Ditt FÃ¶retag'", desc: "AI-matchning mot 100+ EU-program", output: "â˜… Klimatklivet: 92% | â˜… Almi: 88% | â˜… Vinnova: 85%" },
  { cmd: "nexus 'generate dpp' -Produkt 'Produktnamn'", desc: "Generera EU ESPR-kompatibelt DPP", output: "âœ“ DPP genererat: EU JSON-LD | LCA: 2.3 kg COâ‚‚e" },
  { cmd: "nexus 'generate erasmus'", desc: "Generera Erasmus+ KA220-ansÃ¶kan", output: "âœ“ 7-sektioners ansÃ¶kan genererad med AI" },
  { cmd: "nexus 'generate dpia'", desc: "Generera GDPR DPIA-dokument", output: "âœ“ DPIA genererad: GDPR Art. 35-kompatibel" },
  { cmd: "nexus 'symbiosis scan' -Region 'Skaraborg'", desc: "KartlÃ¤gg industriella symbiosflÃ¶den", output: "âœ“ 4 flÃ¶den hittade | COâ‚‚-besparing: 38.9 ton/Ã¥r" },
  { cmd: "nexus 'improve erasmus'", desc: "AI-fÃ¶rbÃ¤ttra befintlig ansÃ¶kan", output: "âœ“ AnsÃ¶kan fÃ¶rbÃ¤ttrad i 3 iterationer" },
  { cmd: "nexus 'open latest'", desc: "Ã–ppna senaste genererat dokument", output: "âœ“ Ã–ppnar i Notepad..." },
  { cmd: "nexus 'wa04 status'", desc: "Visa Policy Gate-status", output: "WA-04: AKTIV | Klass: 2 | Auto-paus: AV" },
  { cmd: "nexus 'log stats'", desc: "WA-06 inlÃ¤rningsstatistik", output: "OK: 89% | Refined: 8% | Rejected: 3% | Total: 47" },
  { cmd: "nexus 'help'", desc: "Visa alla kommandon", output: "NexusCore v5.0 â€” Alla kommandon listade" },
];

const installSteps = [
  {
    title: "Krav: PowerShell 7.x",
    code: `# Kontrollera din version
$PSVersionTable.PSVersion

# Om du har 5.1, uppgradera via:
winget install Microsoft.PowerShell`,
  },
  {
    title: "Skapa modulkatalog",
    code: `# Skapa NexusCore-mappen
$ModulePath = "$HOME\\Documents\\PowerShell\\Modules\\NexusCore"
New-Item -ItemType Directory -Force -Path $ModulePath`,
  },
  {
    title: "Kopiera NexusCore_v5.psm1",
    code: `# Ladda ner frÃ¥n Nexus-OS (eller klistra in koden)
# Spara filen som NexusCore.psm1 i modulkatalogen
Copy-Item "NexusCore_v5.psm1" "$ModulePath\\NexusCore.psm1" -Force`,
  },
  {
    title: "Konfigurera Gemini API-nyckel",
    code: `# SÃ¤tt din Gemini API-nyckel (hÃ¤mtas frÃ¥n Google AI Studio)
[System.Environment]::SetEnvironmentVariable(
    "GOOGLE_API_KEY", 
    "din-api-nyckel-hÃ¤r",
    "User"
)`,
  },
  {
    title: "Ladda och verifiera modulen",
    code: `# Ladda modulen
Import-Module "$ModulePath\\NexusCore.psm1" -Force

# Verifiera installation
nexus 'version'
# FÃ¶rvÃ¤ntat: NexusCore v5.0 | WA-04: AKTIV`,
  },
];

export default function Terminal() {
  const [copied, setCopied] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<number | null>(0);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast.success("Kopierat till urklipp!");
    });
  };

  return (
    <Layout title="NexusCore Terminal" subtitle="PowerShell-agent v5.0 â€“ Installationsguide & Kommandoreferens">
      {/* Header */}
      <div className="bg-[oklch(0.22_0.07_155)] px-4 lg:px-8 py-6 border-b border-[oklch(0.30_0.07_155)]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[oklch(0.62_0.12_55_/_0.20)] flex items-center justify-center flex-shrink-0">
            <TerminalIcon className="w-6 h-6 text-[oklch(0.72_0.10_55)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              NexusCore v5.0
            </h2>
            <p className="text-[oklch(0.65_0.05_155)] text-sm">
              Senior AI-agent fÃ¶r EU-byrÃ¥krati Â· PowerShell 7.x Â· Gemini AI
            </p>
          </div>
          <Button
            className="bg-[oklch(0.62_0.12_55)] text-white gap-2 border-0"
            onClick={() => toast.info("Ladda ner NexusCore_v5.psm1 frÃ¥n Code-panelen")}
          >
            <Download className="w-4 h-4" />
            Ladda ner modul
          </Button>
        </div>
      </div>

      <div className="container py-8 grid lg:grid-cols-2 gap-8">
        {/* Installation guide */}
        <div>
          <div className="nexus-section-divider mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-5" style={{ fontFamily: "'Fraunces', serif" }}>
            Installationsguide
          </h3>
          <div className="space-y-3">
            {installSteps.map((step, i) => (
              <div key={i} className="nexus-card overflow-hidden">
                <button
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenStep(openStep === i ? null : i)}
                >
                  <div className="w-7 h-7 rounded-full bg-[oklch(0.28_0.08_155)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="font-medium text-foreground text-sm flex-1">{step.title}</span>
                  {openStep === i ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {openStep === i && (
                  <div className="border-t border-border">
                    <div className="nexus-terminal rounded-none relative">
                      <button
                        className="absolute top-2 right-2 p-1.5 rounded hover:bg-[oklch(0.30_0.07_155)] transition-colors"
                        onClick={() => copyToClipboard(step.code, `step-${i}`)}
                      >
                        {copied === `step-${i}` ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-[oklch(0.55_0.05_155)]" />
                        )}
                      </button>
                      <pre className="text-xs leading-relaxed overflow-x-auto pr-8 whitespace-pre-wrap">{step.code}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Command reference */}
        <div>
          <div className="nexus-section-divider mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-5" style={{ fontFamily: "'Fraunces', serif" }}>
            Kommandoreferens
          </h3>
          <div className="space-y-2">
            {commands.map((c, i) => (
              <div key={i} className="nexus-card p-3 group">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-mono text-[oklch(0.28_0.08_155)] bg-[oklch(0.28_0.08_155_/_0.08)] px-2 py-0.5 rounded">
                        {c.cmd}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{c.desc}</p>
                    <div className="nexus-terminal py-1.5 px-2.5 text-xs rounded-md">
                      <span className="output">{c.output}</span>
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-muted"
                    onClick={() => copyToClipboard(c.cmd, `cmd-${i}`)}
                  >
                    {copied === `cmd-${i}` ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}


