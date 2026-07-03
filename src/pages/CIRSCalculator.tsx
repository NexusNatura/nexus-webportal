import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, TrendingUp, ShieldCheck, PieChart, BarChart3, Recycle, FileText } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: { label: string; score: number }[];
}

interface Dimension {
  id: string;
  title: string;
  description: string;
  icon: any;
  maxScore: number;
  questions: Question[];
}

const CIRS_DIMENSIONS: Dimension[] = [
  {
    id: "circular_model",
    title: "1. Cirkulär Affärsmodell",
    description: "Hur cirkulär är er nuvarande affärsmodell och resursflöde?",
    icon: Recycle,
    maxScore: 25,
    questions: [
      {
        id: "c_rev",
        question: "Vilken andel av er omsättning kommer från cirkulära modeller?",
        options: [
          { label: "0-10% (Linjär modell)", score: 0 },
          { label: "10-50% (Hybrid)", score: 5 },
          { label: "Över 50% (Huvudsakligen cirkulär)", score: 10 },
        ],
      },
      {
        id: "c_takeback",
        question: "Har ni ett 'take-back'-system för era produkter?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Ja, men under 30% returneras", score: 3 },
          { label: "Ja, och över 70% returneras", score: 8 },
        ],
      },
      {
        id: "c_ownership",
        question: "Äger ni produkten under hela dess livscykel (t.ex. Product-as-a-Service)?",
        options: [
          { label: "Nej, vi säljer produkten", score: 0 },
          { label: "Delvis (t.ex. leasing på utvalda modeller)", score: 3 },
          { label: "Ja, full PaaS-modell", score: 7 },
        ],
      },
    ],
  },
  {
    id: "env_impact",
    title: "2. Miljöpåverkan (Environmental Impact)",
    description: "Vilken verifierbar miljönytta skapar er lösning?",
    icon: LeafIcon,
    maxScore: 25,
    questions: [
      {
        id: "e_lca",
        question: "Har ni genomfört en Livscykelanalys (LCA) för er produkt?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Ja, en intern/pågående analys", score: 5 },
          { label: "Ja, en tredjepartsverifierad LCA/EPD", score: 10 },
        ],
      },
      {
        id: "e_co2",
        question: "Vilken CO2-reduktion erbjuder ni jämfört med det linjära alternativet?",
        options: [
          { label: "Under 20% (eller vet ej)", score: 2 },
          { label: "20-50% reduktion", score: 5 },
          { label: "Över 50% reduktion", score: 10 },
        ],
      },
      {
        id: "e_mat",
        question: "Hur stor andel av produkten består av återvunnet material?",
        options: [
          { label: "Under 20%", score: 1 },
          { label: "20-50%", score: 3 },
          { label: "Över 50%", score: 5 },
        ],
      },
    ],
  },
  {
    id: "invest_ready",
    title: "3. Investment Readiness",
    description: "Är företaget finansiellt och organisatoriskt redo för tillväxt?",
    icon: TrendingUp,
    maxScore: 20,
    questions: [
      {
        id: "i_growth",
        question: "Vad är er omsättningstillväxt (Revenue growth) det senaste året?",
        options: [
          { label: "Under 10% (eller pre-revenue)", score: 1 },
          { label: "10-30%", score: 5 },
          { label: "Över 30%", score: 10 },
        ],
      },
      {
        id: "i_ip",
        question: "Har ni patent (IP) kopplat till er cirkulära innovation?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Ja, patent pending", score: 2 },
          { label: "Ja, beviljat patent (granted)", score: 5 },
        ],
      },
      {
        id: "i_team",
        question: "Har grundarteamet tidigare erfarenhet av framgångsrika bolagsbyggen (exits)?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Domänexperter utan exit", score: 2 },
          { label: "Ja, tidigare exit", score: 5 },
        ],
      },
    ],
  },
  {
    id: "market_scale",
    title: "4. Marknadsskalbarhet",
    description: "Kan er lösning växa till att få en betydande 'impact'?",
    icon: BarChart3,
    maxScore: 15,
    questions: [
      {
        id: "m_tam",
        question: "Hur stor är er totala adresserbara marknad (TAM)?",
        options: [
          { label: "Under 100M EUR", score: 1 },
          { label: "100M - 1B EUR", score: 3 },
          { label: "Över 1B EUR", score: 5 },
        ],
      },
      {
        id: "m_customers",
        question: "Hur många betalande B2B-kunder har ni idag?",
        options: [
          { label: "Färre än 10", score: 1 },
          { label: "10-50 stycken", score: 3 },
          { label: "Fler än 50", score: 5 },
        ],
      },
      {
        id: "m_moat",
        question: "Hur unik är er konkurrensfördel (Moat)?",
        options: [
          { label: "Låg (Lätt att kopiera)", score: 1 },
          { label: "Differentiated (Tydlig niché)", score: 3 },
          { label: "Hög (Stark teknisk moat)", score: 5 },
        ],
      },
    ],
  },
  {
    id: "eu_tax",
    title: "5. EU Taxonomy Alignment",
    description: "Uppfyller ni EU:s formella krav för grön finansiering?",
    icon: ShieldCheck,
    maxScore: 15,
    questions: [
      {
        id: "t_goal",
        question: "Har ni formellt identifierat vilket av EU:s 6 miljömål ni bidrar till (Substantial Contribution)?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Ja, internt identifierat", score: 3 },
        ],
      },
      {
        id: "t_dnsh",
        question: "Har ni genomfört en DNSH-screening (Do No Significant Harm)?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Pågående/Delvis", score: 3 },
          { label: "Ja, komplett screening", score: 6 },
        ],
      },
      {
        id: "t_safeguards",
        question: "Har ni dokumenterade policies för 'Minimum Safeguards' (Mänskliga rättigheter, arbetsvillkor)?",
        options: [
          { label: "Nej", score: 0 },
          { label: "Ja, men ej externt verifierade", score: 2 },
          { label: "Ja, implementerade och verifierade", score: 6 },
        ],
      },
    ],
  },
];

function LeafIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
  );
}

export default function CIRSCalculator() {
  const [currentDimension, setCurrentDimension] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const dimension = CIRS_DIMENSIONS[currentDimension];

  const handleSelectOption = (questionId: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentDimension < CIRS_DIMENSIONS.length - 1) {
      setCurrentDimension((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentDimension > 0) {
      setCurrentDimension((prev) => prev - 1);
    }
  };

  const calculateTotalScore = () => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  };

  const calculateDimensionScore = (dim: Dimension) => {
    return dim.questions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
  };

  const getReadinessLevel = (score: number) => {
    if (score <= 30) return { label: "Not Investment Ready", color: "text-red-500", desc: "Ni behöver stärka er cirkulära strategi och EU-efterlevnad innan extern finansiering." };
    if (score <= 50) return { label: "Early Stage", color: "text-orange-500", desc: "Ni har grunden på plats, men behöver dokumentera LCA och EU-taxonomin bättre." };
    if (score <= 70) return { label: "Growth Stage", color: "text-yellow-600", desc: "Stark modell. Ni är redo att skala och söka EU-bidrag i mellanklassen." };
    if (score <= 85) return { label: "Scale-Up Ready", color: "text-emerald-500", desc: "Mycket stark profil. Ni uppfyller hårda krav för tunga institutionella investerare och EU-miljoner." };
    return { label: "Market Leader", color: "text-green-600", desc: "Exceptionell EU-mognad. Ni kan dominera er nisch genom full transparens och produktpass." };
  };

  if (isFinished) {
    const totalScore = calculateTotalScore();
    const readiness = getReadinessLevel(totalScore);

    // AI Recommendation logic
    const taxonomyScore = calculateDimensionScore(CIRS_DIMENSIONS.find(d => d.id === "eu_tax")!);
    const investScore = calculateDimensionScore(CIRS_DIMENSIONS.find(d => d.id === "invest_ready")!);
    const envScore = calculateDimensionScore(CIRS_DIMENSIONS.find(d => d.id === "env_impact")!);

    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="container max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary mb-6">
              <PieChart className="w-12 h-12" />
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground mb-4">Ditt CIRS-Resultat</h1>
            <p className="text-xl text-muted-foreground">Circular Investment Readiness Score</p>
          </div>

          <div className="bg-card border border-border shadow-sm rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
            <div className={`text-7xl font-bold mb-4 ${readiness.color}`}>
              {totalScore}<span className="text-3xl text-muted-foreground">/100</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">{readiness.label}</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">{readiness.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {CIRS_DIMENSIONS.map((dim) => {
              const dimScore = calculateDimensionScore(dim);
              const progress = (dimScore / dim.maxScore) * 100;
              return (
                <div key={dim.id} className="bg-muted/30 border border-border/50 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm font-medium text-foreground">{dim.title}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{dimScore}/{dim.maxScore}</div>
                  </div>
                  <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Nästa steg för ditt företag</h3>
            
            {taxonomyScore < 8 && (
              <div className="flex gap-4 p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl items-center">
                <div className="bg-orange-500/20 p-3 rounded-xl text-orange-600"><ShieldCheck className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">EU-Taxonomin haltar</h4>
                  <p className="text-sm text-muted-foreground">Ni missar investeringar för att ni inte dokumenterat EU-taxonomin. Använd vår Compliance-agent.</p>
                </div>
                <Link href="/agenter"><Button variant="outline" className="border-orange-500/50 text-orange-600">Åtgärda</Button></Link>
              </div>
            )}

            {investScore < 10 && (
              <div className="flex gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl items-center">
                <div className="bg-blue-500/20 p-3 rounded-xl text-blue-600"><Search className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Säkra Bidragsfinansiering</h4>
                  <p className="text-sm text-muted-foreground">Med er nuvarande finansiella mognad är EU-bidrag och mjuka medel optimalt. Låt vår AI hitta dem.</p>
                </div>
                <Link href="/bidrag"><Button variant="outline" className="border-blue-500/50 text-blue-600">Hitta Bidrag</Button></Link>
              </div>
            )}

            {envScore < 15 && (
              <div className="flex gap-4 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl items-center">
                <div className="bg-emerald-500/20 p-3 rounded-xl text-emerald-600"><FileText className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Krav på Produktpass (ESPR)</h4>
                  <p className="text-sm text-muted-foreground">Ni saknar verifierad miljödata (LCA). Skapa ett Digitalt Produktpass för att möta EU:s krav 2026.</p>
                </div>
                <Link href="/produktpass"><Button variant="outline" className="border-emerald-500/50 text-emerald-600">Skapa DPP</Button></Link>
              </div>
            )}

            {totalScore >= 70 && (
              <div className="flex gap-4 p-5 bg-primary/10 border border-primary/20 rounded-2xl items-center">
                <div className="bg-primary/20 p-3 rounded-xl text-primary"><CheckCircle2 className="w-6 h-6" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Ni är redo för marknadsdominans</h4>
                  <p className="text-sm text-muted-foreground">Er höga poäng gör er extremt attraktiva. Använd Nexus-OS för att paketera och sälja er miljödata till storföretag.</p>
                </div>
                <Link href="/datamarknad"><Button className="bg-primary text-primary-foreground">Utforska Datamarknad</Button></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isCurrentDimensionComplete = dimension.questions.every((q) => answers[q.id] !== undefined);
  const DimIcon = dimension.icon;

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
            <span>CIRS Kalkylatorn</span>
            <span>•</span>
            <span>Steg {currentDimension + 1} av {CIRS_DIMENSIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-8">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${((currentDimension + 1) / CIRS_DIMENSIONS.length) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary">
              <DimIcon className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">{dimension.title}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{dimension.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-10 mb-12 animate-in fade-in slide-in-from-right-8 duration-500" key={currentDimension}>
          {dimension.questions.map((q, idx) => (
            <div key={q.id} className="space-y-4">
              <h3 className="text-lg font-medium text-foreground leading-snug">
                {idx + 1}. {q.question}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.score;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(q.id, opt.score)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" 
                          : "border-border/50 bg-card hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground/90'}`}>
                          {opt.label}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/30'}`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentDimension === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Föregående
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!isCurrentDimensionComplete}
            className="px-8 shadow-sm gap-2"
          >
            {currentDimension === CIRS_DIMENSIONS.length - 1 ? "Se Mitt Resultat" : "Nästa Steg"} 
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
