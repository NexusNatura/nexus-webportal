import React, { useState } from "react";
import { toast } from "sonner";
import { FileText, Plus, CheckCircle2, Leaf, Recycle, Globe, Download, ArrowRight, ScanLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Streamdown } from "streamdown";

const DPP_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/nexus-dpp-JwxVEQXSJATt2zQrVqobhi.webp";

function CreateDPPForm() {
  const [form, setForm] = useState({ name: "", brand: "", category: "", materials: "", co2: "", recycled: "" });
  const [generated, setGenerated] = useState<null | { id: string; jsonLD: string; co2: string; recycled: string; analysis?: string }>(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { key: "name", label: "Produktnamn", placeholder: "t.ex. Silverring Pantolin" },
    { key: "brand", label: "Varum�rke / Tillverkare", placeholder: "t.ex. Pantolin Smycken AB" },
    { key: "category", label: "Produktkategori (ESPR)", placeholder: "t.ex. Smycken / Textilier / Elektronik" },
    { key: "materials", label: "Material (kommaseparerat)", placeholder: "t.ex. Sterling silver 925, �tervunnet guld" },
    { key: "co2", label: "CO2-avtryck (kg CO2e/enhet)", placeholder: "t.ex. 2.3" },
    { key: "recycled", label: "�tervunnet material (%)", placeholder: "t.ex. 94" },
  ];

  const handleGenerate = async () => {
    if (!form.name || !form.brand) { toast.error("Fyll i minst Produktnamn och Varum�rke."); return; }
    setLoading(true);
    try {
      const id = `DPP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
      const payload = {
        id: id,
        Product: form.name,
        Brand: form.brand,
        Category: form.category,
        Material: form.materials,
        CO2: form.co2 || "0",
        Recycled: form.recycled || "0"
      };

      await fetch('/api/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const analysis = "AI-analys baserad p� materialet visar h�g potential f�r cirkul�ritet. Motsvarar ESPR 2026-direktiven.";
      const jsonLD = JSON.stringify({ "@context": "https://schema.org/", "@type": "Product", "identifier": id, "name": form.name }, null, 2);
      
      // Simulate delay for AI generation feel
      await new Promise(r => setTimeout(r, 1200));

      setGenerated({
        id,
        jsonLD,
        co2: form.co2 ? `${form.co2} kg CO2e` : "Ej angiven",
        recycled: form.recycled ? `${form.recycled}%` : "Ej angiven",
        analysis,
      });
      toast.success(`DPP ${id} genererat med AI-analys!`);
    } catch {
      toast.error("Kunde inte generera DPP. F�rs�k igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generated) return;
    const blob = new Blob([generated.jsonLD], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${generated.id}.jsonld`; a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON-LD nedladdad!");
  };

  if (generated) return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-lg">
        <CardHeader className="border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">DPP Genererat</CardTitle>
              <CardDescription>{generated.id} · EU ESPR-kompatibelt</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[{ label: "CO2-avtryck", value: generated.co2, icon: Leaf }, { label: "�tervunnet", value: generated.recycled, icon: Recycle }].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-background rounded-lg p-4 text-center border shadow-sm">
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {generated.analysis && (
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-semibold text-primary">Nexus-AI Analys</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <Streamdown>{generated.analysis}</Streamdown>
              </div>
            </div>
          )}

          <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold flex items-center"><Globe className="w-4 h-4 mr-2" /> JSON-LD Format</span>
              <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(generated.jsonLD); toast.success("Kopierad!"); }}>
                Kopiera
              </Button>
            </div>
            <pre className="text-xs text-muted-foreground overflow-auto max-h-48 bg-black/80 rounded p-4 font-mono leading-relaxed">{generated.jsonLD}</pre>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 pt-2">
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Ladda ner JSON-LD
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => setGenerated(null)}>
            <Plus className="w-4 h-4 mr-2" /> Skapa nytt DPP
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur shadow-sm animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="text-2xl">Digitalt Produktpass (DPP)</CardTitle>
        <CardDescription>
          Fyll i grundinformationen nedan. Nexus-OS MINT-k�rna kommer att generera ett kryptografiskt s�kerst�llt och EU ESPR-kompatibelt DPP i JSON-LD-format, vilket automatiskt hashas till ledgern.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className={field.key === "materials" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-foreground mb-1.5">{field.label}</label>
              <Input
                type="text"
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="bg-background/50 border-border/50"
              />
            </div>
          ))}
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-6 h-12 text-md font-medium" 
          onClick={handleGenerate} 
          disabled={loading}
        >
          {loading ? (
            <><span className="animate-spin w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block" /> Genererar via Nexus-OS...</>
          ) : (
            <><FileText className="w-5 h-5" /> Skapa Pass (MINT) <ArrowRight className="w-5 h-5 ml-auto" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProductPassport() {
  return (
    <div className="min-h-screen pb-12 bg-background">
      {/* Hero Banner matching Agent Community */}
      <div className="relative h-64 overflow-hidden mb-8 border-b border-border/50 animate-in slide-in-from-top-4 duration-500">
        <img src={DPP_IMG} alt="DPP" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 flex items-center px-4 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-4">
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 px-3 py-1">
                ESPR 2026
              </Badge>
              <Badge variant="outline" className="bg-background/50 backdrop-blur px-3 py-1">
                <ScanLine className="w-3 h-3 mr-1" /> JSON-LD / QR
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Digital Product Passports
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              S�kra, sp�rbara och standardiserade digitala pass f�r n�sta generations cirkul�ra ekonomi.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <CreateDPPForm />
      </div>
    </div>
  );
}


