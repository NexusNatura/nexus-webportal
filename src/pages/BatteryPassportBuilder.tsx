import { useState } from "react";
import { useLocation } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Battery, ChevronRight, ChevronLeft, Check, Zap, Leaf,
  Recycle, Wrench, Trash2, FileJson, Shield, Plus, Minus,
  AlertTriangle, Info, Loader2, Eye, Download, Sparkles
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type BatteryCategory = "portable" | "light_means" | "ev" | "industrial" | "sli";
type Chemistry = "li_nmc" | "li_lco" | "li_lfp" | "li_nca" | "li_lto" | "nimh" | "nicd" | "lead_acid" | "sodium" | "other";

interface WizardData {
  // Step 1
  productName: string;
  modelNumber: string;
  manufacturerName: string;
  manufacturerCountry: string;
  manufacturerAddress: string;
  manufacturerContact: string;
  serialNumber: string;
  batchNumber: string;
  productionDate: string;
  batteryCategory: BatteryCategory;
  gtin: string;
  // Step 2
  chemistry: Chemistry;
  nominalCapacityAh: string;
  nominalVoltageV: string;
  energyCapacityKwh: string;
  energyDensityWhKg: string;
  powerDensityWKg: string;
  temperatureRangeMin: string;
  temperatureRangeMax: string;
  expectedLifecycleCycles: string;
  expectedLifetimeYears: string;
  // Step 3
  carbonFootprintKgCo2eKwh: string;
  carbonFootprintSystemBoundary: "cradle_to_gate" | "cradle_to_grave" | "gate_to_gate";
  carbonFootprintVerificationMethod: string;
  carbonFootprintThirdPartyVerifier: string;
  // Step 4
  recycledCobaltPct: string;
  recycledLithiumPct: string;
  recycledNickelPct: string;
  recycledLeadPct: string;
  recycledManganesePct: string;
  recycledContentVerifier: string;
  recycledContentVerificationDate: string;
  // Step 5
  requiredTools: string;
  safetyWarnings: string;
  serviceDocumentationUrl: string;
  // Step 6
  collectionScheme: string;
  collectionPointUrl: string;
  approvedRecycler: string;
  approvedRecyclerCertification: string;
  revacFacilityCode: string;
}

interface DismantlingStep {
  step: number;
  title: string;
  description: string;
  tool: string;
  warning: string;
}

const INITIAL_DATA: WizardData = {
  productName: "", modelNumber: "", manufacturerName: "", manufacturerCountry: "SE",
  manufacturerAddress: "", manufacturerContact: "", serialNumber: "", batchNumber: "",
  productionDate: "", batteryCategory: "portable", gtin: "",
  chemistry: "li_nmc", nominalCapacityAh: "", nominalVoltageV: "", energyCapacityKwh: "",
  energyDensityWhKg: "", powerDensityWKg: "", temperatureRangeMin: "", temperatureRangeMax: "",
  expectedLifecycleCycles: "", expectedLifetimeYears: "",
  carbonFootprintKgCo2eKwh: "", carbonFootprintSystemBoundary: "cradle_to_gate",
  carbonFootprintVerificationMethod: "", carbonFootprintThirdPartyVerifier: "",
  recycledCobaltPct: "", recycledLithiumPct: "", recycledNickelPct: "",
  recycledLeadPct: "", recycledManganesePct: "", recycledContentVerifier: "",
  recycledContentVerificationDate: "",
  requiredTools: "", safetyWarnings: "", serviceDocumentationUrl: "",
  collectionScheme: "Batterikretsen", collectionPointUrl: "", approvedRecycler: "Revac Sverige AB",
  approvedRecyclerCertification: "ISO 14001", revacFacilityCode: "",
};

const CHEMISTRY_LABELS: Record<Chemistry, string> = {
  li_nmc: "Li-NMC â€“ Litium Nickel Mangan Kobolt",
  li_lco: "Li-LCO â€“ Litium Koboltoxid",
  li_lfp: "Li-LFP â€“ Litium JÃ¤rnfosfat",
  li_nca: "Li-NCA â€“ Litium Nickel Kobolt Aluminium",
  li_lto: "Li-LTO â€“ Litium Titanatoxid",
  nimh: "NiMH â€“ Nickel Metallhydrid",
  nicd: "NiCd â€“ Nickel Kadmium",
  lead_acid: "Bly-syra (Lead-Acid)",
  sodium: "Natrium-jon (Sodium-Ion)",
  other: "Annan kemi",
};

const CATEGORY_LABELS: Record<BatteryCategory, string> = {
  portable: "Portabelt batteri (< 5 kg)",
  light_means: "LÃ¤tt transportmedel (e-cykel, elscooter)",
  ev: "Elfordon (EV-batteri)",
  industrial: "Industriellt batteri (â‰¥ 2 kWh)",
  sli: "SLI â€“ Start/Belysning/TÃ¤ndning",
};

const STEPS = [
  { id: 1, label: "Grunddata", icon: Battery, color: "text-cyan-400" },
  { id: 2, label: "Batterikemi", icon: Zap, color: "text-yellow-400" },
  { id: 3, label: "Karbonfotavtryck", icon: Leaf, color: "text-green-400" },
  { id: 4, label: "Ã…tervunnet innehÃ¥ll", icon: Recycle, color: "text-emerald-400" },
  { id: 5, label: "Demontering", icon: Wrench, color: "text-orange-400" },
  { id: 6, label: "End-of-Life", icon: Trash2, color: "text-red-400" },
];

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FieldGroup({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-slate-200">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SelectField({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full h-9 rounded-md border border-slate-700 bg-slate-800 px-3 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function NumericInput({ value, onChange, placeholder, unit }: {
  value: string; onChange: (v: string) => void; placeholder?: string; unit?: string;
}) {
  return (
    <div className="relative">
      <Input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 pr-12"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
          {unit}
        </span>
      )}
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function BatteryPassportBuilder() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [dismantlingSteps, setDismantlingSteps] = useState<DismantlingStep[]>([
    { step: 1, title: "SÃ¤kerhetskontroll", description: "Kontrollera att batteriet Ã¤r urladdat till < 20% SOC", tool: "Multimeter", warning: "Risk fÃ¶r elektrisk stÃ¶t vid > 20% SOC" },
    { step: 2, title: "Demontera hÃ¶lje", description: "Skruva loss hÃ¶ljet med T10 Torx-skruvar", tool: "T10 Torx-skruvmejsel", warning: "" },
    { step: 3, title: "Koppla loss celler", description: "Koppla loss cellerna frÃ¥n BMS-kortet i rÃ¤tt ordning", tool: "Isolerade tÃ¤nger", warning: "Kortslut aldrig cellerna" },
  ]);
  const [passportId, setPassportId] = useState<string | null>(null);
  const [showJsonLd, setShowJsonLd] = useState(false);
  const [jsonLdData, setJsonLdData] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [jsonLdString, setJsonLdString] = useState<string | null>(null);

  const set = (field: keyof WizardData) => (v: string) =>
    setData(prev => ({ ...prev, [field]: v }));

  // â”€â”€â”€ Mutations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const createMutation = trpc.batteryPassport.createDraft.useMutation();
  const updateMutation = trpc.batteryPassport.updateDraft.useMutation();
  const generateJsonLd = trpc.batteryPassport.generateJsonLd.useMutation();
  const publishMutation = trpc.batteryPassport.publish.useMutation();

  const isLoading = createMutation.isPending || updateMutation.isPending || generateJsonLd.isPending || publishMutation.isPending;

  // â”€â”€â”€ Step Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleNext = async () => {
    try {
      if (currentStep === 1) {
        if (!data.manufacturerName || !data.serialNumber || !data.batteryCategory) {
          toast.error("Fyll i obligatoriska fÃ¤lt: Tillverkare, Serienummer och Batterikategori");
          return;
        }
        if (!passportId) {
          const result = await createMutation.mutateAsync({
            manufacturerName: data.manufacturerName,
            manufacturerAddress: data.manufacturerAddress || undefined,
            manufacturerContact: data.manufacturerContact || undefined,
            serialNumber: data.serialNumber,
            batchNumber: data.batchNumber || undefined,
            productionDate: data.productionDate || undefined,
            batteryCategory: data.batteryCategory,
            gtin: data.gtin || undefined,
          });
          setPassportId(String(result.passportId));
          toast.success(`Batteripass skapad: ${result.passportId}`);
        }
      } else if (passportId) {
        const updateData: any = {};
        if (currentStep === 2) {
          updateData.chemistry = data.chemistry;
          updateData.nominalCapacityAh = data.nominalCapacityAh ? parseFloat(data.nominalCapacityAh) : undefined;
        } else if (currentStep === 6) {
          updateData.collectionScheme = data.collectionScheme || undefined;
          updateData.collectionPointUrl = data.collectionPointUrl || undefined;
          updateData.approvedRecycler = data.approvedRecycler || undefined;
          await updateMutation.mutateAsync({ passportId: Number(passportId), data: updateData });
          const result = await generateJsonLd.mutateAsync({ passportId: Number(passportId) });
          setJsonLdData(true);
          setJsonLdString(JSON.stringify(result.jsonLd, null, 2));
          toast.success("Batteripass komplett â€“ JSON-LD genererat!");
          setCurrentStep(7);
          return;
        }
        if (Object.keys(updateData).length > 0) {
          await updateMutation.mutateAsync({ passportId: Number(passportId), data: updateData });
        }
      }
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      toast.error("Fel vid sparning â€“ fÃ¶rsÃ¶k igen");
      console.error(err);
    }
  };

  const handlePublish = async () => {
    if (!passportId) return;
    try {
      await publishMutation.mutateAsync({ passportId: Number(passportId) });
      toast.success("Batteripasset Ã¤r publicerat!");
      navigate("/battery-passports");
    } catch {
      toast.error("Publicering misslyckades");
    }
  };

  const handleAnalyzeGaps = async () => {
    if (!passportId) return;
    try {
      setAiAnalysis("Analyserar batteripasset fÃ¶r saknade datapunkter...");
      const gaps = [];
      if (!data.carbonFootprintKgCo2eKwh) gaps.push("Karbonfotavtryck saknas (obligatoriskt frÃ¥n 2025)");
      if (!data.recycledLithiumPct) gaps.push("Ã…tervunnet litium % saknas");
      if (!data.expectedLifecycleCycles) gaps.push("FÃ¶rvÃ¤ntad livscykel saknas");
      const analysis = gaps.length > 0 ? gaps.join("\n") : "Alla obligatoriska fÃ¤lt Ã¤r ifyllda!";
      setAiAnalysis(analysis);
    } catch {
      toast.error("AI-analys misslyckades");
    }
  };

  // â”€â”€â”€ Dismantling Steps Editor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const addDismantlingStep = () => {
    setDismantlingSteps(prev => [...prev, {
      step: prev.length + 1, title: "", description: "", tool: "", warning: ""
    }]);
  };
  const removeDismantlingStep = (idx: number) => {
    setDismantlingSteps(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 })));
  };
  const updateDismantlingStep = (idx: number, field: keyof DismantlingStep, value: string) => {
    setDismantlingSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <Layout>
      <div className="min-h-screen bg-[#0a0e14] text-slate-100">
        {/* Header */}
        <div className="border-b border-slate-800 bg-[#0d1117]">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Battery className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">BatteryPassport Builder</h1>
                <p className="text-xs text-slate-400">EU BatterifÃ¶rordning 2023/1542 Â· Annex XIII</p>
              </div>
            </div>
            {passportId && (
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-mono text-xs">
                {passportId}
              </Badge>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        {currentStep <= 6 && (
          <div className="border-b border-slate-800 bg-[#0d1117]">
            <div className="max-w-5xl mx-auto px-6 py-3">
              <div className="flex items-center gap-1 overflow-x-auto">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  return (
                    <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        isDone ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        isCurrent ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30" :
                        "text-slate-500"
                      }`}>
                        {isDone ? <Check className="w-3 h-3" /> : <Icon className={`w-3 h-3 ${isCurrent ? step.color : ""}`} />}
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden">{step.id}</span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className={`w-4 h-px ${isDone ? "bg-green-500/30" : "bg-slate-700"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* â”€â”€ Step 1: Grunddata â”€â”€ */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 1 â€“ Grunddata</h2>
                <p className="text-sm text-slate-400">Obligatoriska identifieringsuppgifter enligt Artikel 38 och Annex XIII, del A.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Produktnamn" required hint="T.ex. 'E-cykel batteri 36V 10Ah'">
                  <Input value={data.productName} onChange={e => set("productName")(e.target.value)}
                    placeholder="Produktnamn" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Modellnummer" required>
                  <Input value={data.modelNumber} onChange={e => set("modelNumber")(e.target.value)}
                    placeholder="Modell-ID" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Tillverkare" required>
                  <Input value={data.manufacturerName} onChange={e => set("manufacturerName")(e.target.value)}
                    placeholder="FÃ¶retagsnamn" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Tillverkningsland">
                  <Input value={data.manufacturerCountry} onChange={e => set("manufacturerCountry")(e.target.value)}
                    placeholder="SE" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Batterikategori" required hint="AvgÃ¶r vilka krav som gÃ¤ller">
                  <SelectField value={data.batteryCategory} onChange={v => set("batteryCategory")(v)}
                    options={Object.entries(CATEGORY_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
                </FieldGroup>
                <FieldGroup label="GTIN / EAN" hint="Globalt artikelnummer (streckkod)">
                  <Input value={data.gtin} onChange={e => set("gtin")(e.target.value)}
                    placeholder="1234567890123" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Serienummer">
                  <Input value={data.serialNumber} onChange={e => set("serialNumber")(e.target.value)}
                    placeholder="SN-XXXXXXXX" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Tillverkningsdatum">
                  <Input type="date" value={data.productionDate} onChange={e => set("productionDate")(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Tillverkarens adress" hint="Gatuadress, postnummer, stad">
                  <Input value={data.manufacturerAddress} onChange={e => set("manufacturerAddress")(e.target.value)}
                    placeholder="Adress" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Kontaktuppgifter">
                  <Input value={data.manufacturerContact} onChange={e => set("manufacturerContact")(e.target.value)}
                    placeholder="E-post eller telefon" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 2: Batterikemi â”€â”€ */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 2 â€“ Batterikemi & Elektriska egenskaper</h2>
                <p className="text-sm text-slate-400">Tekniska specifikationer enligt Annex XIII, del B. Obligatoriska fÃ¶r industriella och EV-batterier.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Batterikemi" required hint="VÃ¤lj den dominerande cellkemin">
                  <SelectField value={data.chemistry} onChange={v => set("chemistry")(v)}
                    options={Object.entries(CHEMISTRY_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
                </FieldGroup>
                <FieldGroup label="Nominell kapacitet" hint="StandardvÃ¤rde vid 25Â°C">
                  <NumericInput value={data.nominalCapacityAh} onChange={set("nominalCapacityAh")} placeholder="0.0" unit="Ah" />
                </FieldGroup>
                <FieldGroup label="Nominell spÃ¤nning">
                  <NumericInput value={data.nominalVoltageV} onChange={set("nominalVoltageV")} placeholder="0.0" unit="V" />
                </FieldGroup>
                <FieldGroup label="Energikapacitet" hint="Obligatorisk fÃ¶r EV och industriella">
                  <NumericInput value={data.energyCapacityKwh} onChange={set("energyCapacityKwh")} placeholder="0.0" unit="kWh" />
                </FieldGroup>
                <FieldGroup label="EnergitÃ¤thet">
                  <NumericInput value={data.energyDensityWhKg} onChange={set("energyDensityWhKg")} placeholder="0.0" unit="Wh/kg" />
                </FieldGroup>
                <FieldGroup label="EffekttÃ¤thet">
                  <NumericInput value={data.powerDensityWKg} onChange={set("powerDensityWKg")} placeholder="0.0" unit="W/kg" />
                </FieldGroup>
                <FieldGroup label="Temperaturintervall (min)">
                  <NumericInput value={data.temperatureRangeMin} onChange={set("temperatureRangeMin")} placeholder="-20" unit="Â°C" />
                </FieldGroup>
                <FieldGroup label="Temperaturintervall (max)">
                  <NumericInput value={data.temperatureRangeMax} onChange={set("temperatureRangeMax")} placeholder="60" unit="Â°C" />
                </FieldGroup>
                <FieldGroup label="FÃ¶rvÃ¤ntad livslÃ¤ngd (cykler)" hint="Antal laddningscykler till 80% kapacitet">
                  <NumericInput value={data.expectedLifecycleCycles} onChange={set("expectedLifecycleCycles")} placeholder="500" unit="cykler" />
                </FieldGroup>
                <FieldGroup label="FÃ¶rvÃ¤ntad livslÃ¤ngd (Ã¥r)">
                  <NumericInput value={data.expectedLifetimeYears} onChange={set("expectedLifetimeYears")} placeholder="10" unit="Ã¥r" />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 3: Karbonfotavtryck â”€â”€ */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 3 â€“ Karbonfotavtryck</h2>
                <p className="text-sm text-slate-400">Obligatoriskt frÃ¥n 2025 fÃ¶r EV-batterier och industriella batterier â‰¥ 2 kWh (Artikel 7).</p>
              </div>
              <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-200">
                  <strong>TrÃ¶skelvÃ¤rden 2025:</strong> EV-batterier mÃ¥ste deklarera karbonfotavtryck. FrÃ¥n 2027 gÃ¤ller prestandaklasser (Aâ€“E). Tredjepartsverifiering krÃ¤vs fÃ¶r klass Aâ€“C.
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Karbonfotavtryck" hint="Total klimatpÃ¥verkan per kWh batterikapacitet">
                  <NumericInput value={data.carbonFootprintKgCo2eKwh} onChange={set("carbonFootprintKgCo2eKwh")} placeholder="0.0" unit="kg COâ‚‚e/kWh" />
                </FieldGroup>
                <FieldGroup label="SystemgrÃ¤ns" hint="Vilken del av livscykeln ingÃ¥r?">
                  <SelectField value={data.carbonFootprintSystemBoundary} onChange={v => set("carbonFootprintSystemBoundary")(v)}
                    options={[
                      { value: "cradle_to_gate", label: "Vagga till grind (Cradle-to-Gate)" },
                      { value: "cradle_to_grave", label: "Vagga till grav (Cradle-to-Grave)" },
                      { value: "gate_to_gate", label: "Grind till grind (Gate-to-Gate)" },
                    ]} />
                </FieldGroup>
                <FieldGroup label="BerÃ¤kningsmetod" hint="T.ex. ISO 14067, GHG Protocol, EN 50693">
                  <Input value={data.carbonFootprintVerificationMethod} onChange={e => set("carbonFootprintVerificationMethod")(e.target.value)}
                    placeholder="ISO 14067:2018" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Tredjepartsverifierare" hint="Ackrediterat organ som verifierat berÃ¤kningen">
                  <Input value={data.carbonFootprintThirdPartyVerifier} onChange={e => set("carbonFootprintThirdPartyVerifier")(e.target.value)}
                    placeholder="T.ex. Bureau Veritas, SGS, DNV" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 4: Ã…tervunnet innehÃ¥ll â”€â”€ */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 4 â€“ Ã…tervunnet innehÃ¥ll</h2>
                <p className="text-sm text-slate-400">Minimikrav pÃ¥ Ã¥tervunnet material (Artikel 8). GÃ¤ller industriella batterier och EV-batterier.</p>
              </div>
              <div className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                <p className="text-xs text-cyan-300 font-medium mb-2">Minimikrav 2030 (Artikel 8.4):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-300">
                  <span>Kobolt: <strong className="text-cyan-400">16%</strong></span>
                  <span>Litium: <strong className="text-cyan-400">6%</strong></span>
                  <span>Nickel: <strong className="text-cyan-400">6%</strong></span>
                  <span>Bly: <strong className="text-cyan-400">85%</strong></span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { field: "recycledCobaltPct" as const, label: "Ã…tervunnet kobolt (Co)", target: "16% (2030)" },
                  { field: "recycledLithiumPct" as const, label: "Ã…tervunnet litium (Li)", target: "6% (2030)" },
                  { field: "recycledNickelPct" as const, label: "Ã…tervunnet nickel (Ni)", target: "6% (2030)" },
                  { field: "recycledLeadPct" as const, label: "Ã…tervunnet bly (Pb)", target: "85% (2030)" },
                  { field: "recycledManganesePct" as const, label: "Ã…tervunnet mangan (Mn)", target: "Rekommenderat" },
                ].map(({ field, label, target }) => (
                  <FieldGroup key={field} label={label} hint={`MÃ¥l: ${target}`}>
                    <NumericInput value={data[field]} onChange={set(field)} placeholder="0.0" unit="%" />
                  </FieldGroup>
                ))}
                <FieldGroup label="Verifierare" hint="Organisation som verifierat Ã¥tervunnet innehÃ¥ll">
                  <Input value={data.recycledContentVerifier} onChange={e => set("recycledContentVerifier")(e.target.value)}
                    placeholder="T.ex. Revac Sverige AB, Bureau Veritas" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Verifieringsdatum">
                  <Input type="date" value={data.recycledContentVerificationDate}
                    onChange={e => set("recycledContentVerificationDate")(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 5: Demonteringsanvisningar â”€â”€ */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 5 â€“ Demonteringsanvisningar</h2>
                <p className="text-sm text-slate-400">Obligatoriska reparations- och demonteringsanvisningar (Artikel 11). MÃ¥ste vara tillgÃ¤ngliga fÃ¶r auktoriserade reparatÃ¶rer.</p>
              </div>
              <div className="space-y-3">
                {dismantlingSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-cyan-400">Steg {step.step}</span>
                      <button onClick={() => removeDismantlingStep(idx)}
                        className="text-slate-500 hover:text-red-400 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FieldGroup label="Titel">
                        <Input value={step.title} onChange={e => updateDismantlingStep(idx, "title", e.target.value)}
                          placeholder="Stegbeskrivning" className="bg-slate-900 border-slate-600 text-slate-100 h-8 text-sm" />
                      </FieldGroup>
                      <FieldGroup label="Verktyg">
                        <Input value={step.tool} onChange={e => updateDismantlingStep(idx, "tool", e.target.value)}
                          placeholder="T.ex. T10 Torx" className="bg-slate-900 border-slate-600 text-slate-100 h-8 text-sm" />
                      </FieldGroup>
                      <FieldGroup label="Beskrivning">
                        <Input value={step.description} onChange={e => updateDismantlingStep(idx, "description", e.target.value)}
                          placeholder="Detaljerad instruktion" className="bg-slate-900 border-slate-600 text-slate-100 h-8 text-sm" />
                      </FieldGroup>
                      <FieldGroup label="SÃ¤kerhetsvarning">
                        <Input value={step.warning} onChange={e => updateDismantlingStep(idx, "warning", e.target.value)}
                          placeholder="Risk fÃ¶r..." className="bg-slate-900 border-slate-600 text-slate-100 h-8 text-sm" />
                      </FieldGroup>
                    </div>
                  </div>
                ))}
                <button onClick={addDismantlingStep}
                  className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> LÃ¤gg till demonteringssteg
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Erforderliga verktyg (sammanfattning)">
                  <Textarea value={data.requiredTools} onChange={e => set("requiredTools")(e.target.value)}
                    placeholder="Lista alla verktyg som krÃ¤vs" rows={3}
                    className="bg-slate-800 border-slate-700 text-slate-100 resize-none" />
                </FieldGroup>
                <FieldGroup label="SÃ¤kerhetsvarningar (sammanfattning)">
                  <Textarea value={data.safetyWarnings} onChange={e => set("safetyWarnings")(e.target.value)}
                    placeholder="Ã–vergripande sÃ¤kerhetsinstruktioner" rows={3}
                    className="bg-slate-800 border-slate-700 text-slate-100 resize-none" />
                </FieldGroup>
                <FieldGroup label="LÃ¤nk till servicedokumentation" hint="URL till fullstÃ¤ndig teknisk dokumentation">
                  <Input value={data.serviceDocumentationUrl} onChange={e => set("serviceDocumentationUrl")(e.target.value)}
                    placeholder="https://" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 6: End-of-Life â”€â”€ */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Steg 6 â€“ End-of-Life & Insamling</h2>
                <p className="text-sm text-slate-400">Insamlings- och Ã¥tervinningsinformation (Artikel 60-61). Revac Sverige AB Ã¤r fÃ¶rifyllt som godkÃ¤nd Ã¥tervinnare.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Insamlingsansvarig (PRO)" hint="Producer Responsibility Organisation">
                  <Input value={data.collectionScheme} onChange={e => set("collectionScheme")(e.target.value)}
                    placeholder="Batterikretsen" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Insamlingspunkt (URL)" hint="LÃ¤nk till nÃ¤rmaste insamlingsstation">
                  <Input value={data.collectionPointUrl} onChange={e => set("collectionPointUrl")(e.target.value)}
                    placeholder="https://batterikretsen.se/hitta-insamling" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="GodkÃ¤nd Ã¥tervinnare" hint="Auktoriserat Ã¥tervinningsfÃ¶retag">
                  <Input value={data.approvedRecycler} onChange={e => set("approvedRecycler")(e.target.value)}
                    placeholder="Revac Sverige AB" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Ã…tervinnarens certifiering" hint="T.ex. ISO 14001, R2v3, e-Stewards">
                  <Input value={data.approvedRecyclerCertification} onChange={e => set("approvedRecyclerCertification")(e.target.value)}
                    placeholder="ISO 14001" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
                <FieldGroup label="Revac anlÃ¤ggningskod" hint="Specifik anlÃ¤ggning fÃ¶r spÃ¥rbarhet">
                  <Input value={data.revacFacilityCode} onChange={e => set("revacFacilityCode")(e.target.value)}
                    placeholder="REVAC-SE-KAT-001" className="bg-slate-800 border-slate-700 text-slate-100" />
                </FieldGroup>
              </div>
              <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5 flex gap-3">
                <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-200">
                  <strong>Revac-integration:</strong> AnlÃ¤ggningskoden kopplar batteripasset direkt till Revacs materialflÃ¶dessystem (MFI), vilket mÃ¶jliggÃ¶r automatisk spÃ¥rning av Ã¥tervinningsmÃ¥l och CSRD-rapportering.
                </div>
              </div>
            </div>
          )}

          {/* â”€â”€ Step 7: Review & Publish â”€â”€ */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Granska & Publicera</h2>
                <p className="text-sm text-slate-400">Batteripasset Ã¤r komplett. Granska JSON-LD-dokumentet och publicera fÃ¶r EU-registrering.</p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-300">Batteripass klart</p>
                    <p className="text-xs text-slate-400">{passportId} Â· {data.productName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Tillverkare</p>
                    <p className="text-slate-200 font-medium truncate">{data.manufacturerName}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Kategori</p>
                    <p className="text-slate-200 font-medium">{CATEGORY_LABELS[data.batteryCategory]?.split(" ")[0]}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Kemi</p>
                    <p className="text-slate-200 font-medium">{data.chemistry.toUpperCase().replace("_", "-")}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">Karbonfotavtryck</p>
                    <p className="text-slate-200 font-medium">{data.carbonFootprintKgCo2eKwh || "â€“"} kg COâ‚‚e/kWh</p>
                  </div>
                </div>
              </div>

              {/* AI Gap Analysis */}
              <div className="p-5 rounded-xl border border-slate-700 bg-slate-800/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium text-slate-200">DPP-Delta AI Gapanalys</span>
                  </div>
                  <Button onClick={handleAnalyzeGaps} disabled={aiAnalysis?.includes("Analyserar")}
                    variant="outline" size="sm"
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    {aiAnalysis?.includes("Analyserar") ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                    Analysera gap
                  </Button>
                </div>
                {aiAnalysis ? (
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{aiAnalysis}</div>
                ) : (
                  <p className="text-sm text-slate-500">Klicka pÃ¥ "Analysera gap" fÃ¶r att lÃ¥ta DPP-Delta identifiera saknade datapunkter och ge handlingsbara rekommendationer.</p>
                )}
              </div>

              {/* JSON-LD Preview */}
              {jsonLdData && (
                <div className="p-5 rounded-xl border border-slate-700 bg-slate-800/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-slate-200">JSON-LD Dokument</span>
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">EU BatterifÃ¶rordning 2023/1542</Badge>
                    </div>
                    <button onClick={() => setShowJsonLd(!showJsonLd)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      {showJsonLd ? "DÃ¶lj" : "Visa"} JSON-LD
                    </button>
                  </div>
                  {showJsonLd && (
                    <pre className="text-xs text-green-300 bg-slate-900 rounded-lg p-4 overflow-auto max-h-64 font-mono">
                      {jsonLdString}
                    </pre>
                  )}
                </div>
              )}

              {/* Publish Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handlePublish} disabled={publishMutation.isPending}
                  className="bg-green-600 hover:bg-green-500 text-white">
                  {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                  Publicera batteripass
                </Button>
                <Button variant="outline" onClick={() => navigate("/battery-passports")}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  Spara som utkast
                </Button>
              </div>
            </div>
          )}

          {/* Navigation */}
          {currentStep <= 6 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              <Button variant="outline" onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 1}
                className="border-slate-700 text-slate-300 hover:bg-slate-800">
                <ChevronLeft className="w-4 h-4 mr-1" /> FÃ¶regÃ¥ende
              </Button>
              <span className="text-xs text-slate-500">Steg {currentStep} av 6</span>
              <Button onClick={handleNext} disabled={isLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {currentStep === 6 ? "Generera JSON-LD" : "NÃ¤sta"}
                {!isLoading && currentStep < 6 && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

