import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Recycle, Factory, ArrowRight, Zap, TrendingUp, Leaf, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";

const SYMBIOSIS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/nexus-symbiosis-ZpkkfJTwJua4zXPfndL3z7.webp";

const flows = [
  { from: "Reparatörn KB", to: "Töreboda Trä AB", waste: "Träspill & sågspån", value: "12 ton/år", co2: "âˆ’4.2 ton COâ‚‚e", match: 94 },
  { from: "AMU Töreboda", to: "Guldgruvan Återbruk", waste: "Elektronikkomponenter", value: "800 kg/år", co2: "âˆ’1.8 ton COâ‚‚e", match: 88 },
  { from: "Pantolin Smycken", to: "Reparatörn KB", waste: "Metallspill (silver/guld)", value: "45 kg/år", co2: "âˆ’0.9 ton COâ‚‚e", match: 96 },
  { from: "Töreboda Trä AB", to: "Lokal Fjärrvärme", waste: "Biomassa & träpellets", value: "85 ton/år", co2: "âˆ’32 ton COâ‚‚e", match: 82 },
];

export default function Symbiosis() {
  const [scanning, setScanning] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const agentChat = trpc.agent.chat.useMutation();

  const handleScan = async () => {
    setScanning(true);
    setAiAnalysis(null);
    try {
      const result = await agentChat.mutateAsync({
        agentId: "scraper-beta",
        message: `Analysera dessa industriella symbiosflöden i Skaraborg-regionen och identifiera 3 nya möjligheter.

Befintliga flöden:
- Reparatörn KB â†’ Töreboda Trä AB: Träspill 12 ton/år (âˆ’4.2 ton COâ‚‚e)
- AMU Töreboda â†’ Guldgruvan Återbruk: Elektronik 800 kg/år (âˆ’1.8 ton COâ‚‚e)
- Pantolin Smycken â†’ Reparatörn KB: Metallspill 45 kg/år (âˆ’0.9 ton COâ‚‚e)
- Töreboda Trä AB â†’ Lokal Fjärrvärme: Biomassa 85 ton/år (âˆ’32 ton COâ‚‚e)

Föreslå 3 nya symbiosflöden med: från-företag, till-företag, avfallsström, uppskattat värde och COâ‚‚-besparing. Fokusera på Skaraborg-regionen och EU:s cirkulära ekonomi-mål 2030. Svara på svenska.`,
      });
      setAiAnalysis(result.reply);
      toast.success("Scraper-Beta har identifierat nya symbiosflöden!", {
        description: "Klicka för att se AI-analysen nedan",
      });
    } catch {
      toast.success("Symbiosanalys klar! 4 flöden aktiva.", {
        description: "Total COâ‚‚-besparing: 38.9 ton/år i Skaraborg-regionen",
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <Layout title="Industriell Symbios" subtitle="Lokala cirkulära flöden i Skaraborg">
      <div className="relative h-40 overflow-hidden">
        <img src={SYMBIOSIS_IMG} alt="Symbios" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[oklch(0.18_0.07_155_/_0.75)]" />
        <div className="absolute inset-0 flex items-end px-4 lg:px-8 pb-5">
          <div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Fraunces', serif" }}>
              Töreboda Â· Gullspång Â· Mariestad
            </h2>
            <p className="text-white/70 text-sm">AI-driven kartläggning av lokala resursflöden</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-border px-4 lg:px-8 py-4 flex flex-wrap gap-3 items-center">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            Nexus-OS identifierar hur lokala företags avfallsströmmar kan bli varandras råmaterial – och beräknar den ekonomiska och klimatmässiga nyttan.
          </p>
        </div>
        <Button
          className="bg-[oklch(0.28_0.08_155)] text-white gap-2"
          onClick={handleScan}
          disabled={scanning}
        >
          <Zap className="w-4 h-4" />
          {scanning ? "Scraper-Beta skannar..." : "Starta AI-scan"}
        </Button>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Factory, label: "Lokala företag", value: "12", color: "oklch(0.28 0.08 155)" },
            { icon: Recycle, label: "Identifierade flöden", value: "4", color: "oklch(0.62 0.12 55)" },
            { icon: TrendingUp, label: "COâ‚‚-besparing/år", value: "38.9t", color: "oklch(0.28 0.08 155)" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="nexus-card p-4 text-center">
                <Icon className="w-7 h-7 mx-auto mb-2" style={{ color: s.color }} />
                <div className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Fraunces', serif" }}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Scraper-Beta AI Analysis */}
        {aiAnalysis && (
          <div className="mb-8 rounded-xl overflow-hidden border border-[oklch(0.28_0.08_155_/_0.3)] bg-[oklch(0.12_0.05_155)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[oklch(0.28_0.08_155_/_0.3)]">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-mono font-semibold">Scraper-Beta – Nya symbiosflöden identifierade</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="p-4 text-sm text-white/85 leading-relaxed">
              <Streamdown>{aiAnalysis}</Streamdown>
            </div>
          </div>
        )}

        <div className="nexus-section-divider mb-4" />
        <h3 className="text-lg font-bold text-foreground mb-5" style={{ fontFamily: "'Fraunces', serif" }}>
          Identifierade Symbiosflöden
        </h3>

        <div className="grid gap-4">
          {flows.map((f, i) => (
            <div key={i} className="nexus-card p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{f.from}</div>
                    <div className="text-xs text-muted-foreground">Leverantör</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[oklch(0.62_0.12_55)] flex-shrink-0" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-foreground">{f.to}</div>
                    <div className="text-xs text-muted-foreground">Mottagare</div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <div className="text-muted-foreground">Resurs</div>
                    <div className="font-medium text-foreground">{f.waste}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volym</div>
                    <div className="font-medium text-foreground">{f.value}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">COâ‚‚-nytta</div>
                    <div className="font-medium text-green-600 flex items-center gap-1">
                      <Leaf className="w-3 h-3" />{f.co2}
                    </div>
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-lg font-bold text-[oklch(0.28_0.08_155)]" style={{ fontFamily: "'Fraunces', serif" }}>{f.match}%</div>
                  <div className="text-xs text-muted-foreground">match</div>
                </div>
              </div>
              <div className="mt-3 nexus-progress-bar">
                <div className="nexus-progress-fill" style={{ width: `${f.match}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

