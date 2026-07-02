import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, CheckCircle2, FileSignature, UploadCloud, ChevronRight } from "lucide-react";

export default function SmartForms() {
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    orgNumber: "",
    projectDescription: "",
    sustainabilityGoals: ""
  });

  const handleAutoFill = () => {
    setIsGenerating(true);
    // Simulate AI thinking and API fetch
    setTimeout(() => {
      setFormData({
        companyName: "Nexus EcoTech AB",
        orgNumber: "556123-4567",
        projectDescription: "Implementering av AI-drivna materialpass för återvunnet litium för att möta kraven i EU:s nya batteriförordning.",
        sustainabilityGoals: "Minska koldioxidavtrycket i leverantörskedjan med 40% till 2028 genom spårbarhet och industriell symbios."
      });
      setIsGenerating(false);
      setStep(1); // Move to review step
    }, 1500);
  };

  const steps = [
    { title: "Välj Form", desc: "Starta magin" },
    { title: "Autofill & Granskning", desc: "Låt AI sköta byråkratin" },
    { title: "Signering", desc: "Redo att skickas" }
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 text-purple-500 border-purple-500/30">Intelligenta Blanketter</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Tala med din blankett</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Glöm krångliga Word-dokument. Vår AI genererar och fyller automatiskt i komplexa myndighetskrav, EU-deklarationer och ansökningar baserat på er data.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted-foreground/10 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-purple-500 -z-10 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(step / 2) * 100}%` }}
        ></div>
        
        {steps.map((s, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              step >= idx 
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                : 'bg-card border-2 border-muted-foreground/20 text-muted-foreground'
            }`}>
              {step > idx ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </div>
            <span className={`mt-3 text-sm font-medium ${step >= idx ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step 0: Select and Start */}
      {step === 0 && (
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-lg border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-500" />
              Ansökan om Klimatklivet (Naturvårdsverket)
            </CardTitle>
            <CardDescription>Detta dokument kräver normalt 14 sidors manuell inmatning. Låt NEXUS AI hämta er data och fylla i den åt er.</CardDescription>
          </CardHeader>
          <CardContent className="py-8 flex justify-center">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-transform hover:scale-105"
              onClick={handleAutoFill}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 animate-pulse" /> Analyserar Företagsdata...</span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> ✨ Fyll i med Nexus AI</span>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Review generated data */}
      {step === 1 && (
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-sm animate-in slide-in-from-bottom-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Granska Innehåll</CardTitle>
                <CardDescription>AI har fyllt i blanketten. Vänligen dubbelkolla uppgifterna nedan.</CardDescription>
              </div>
              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">100% Ifyllt</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Företagsnamn</Label>
                <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="bg-background/50 border-purple-500/30 focus-visible:ring-purple-500" />
              </div>
              <div className="space-y-2">
                <Label>Organisationsnummer</Label>
                <Input value={formData.orgNumber} onChange={e => setFormData({...formData, orgNumber: e.target.value})} className="bg-background/50 border-purple-500/30 focus-visible:ring-purple-500" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Projektbeskrivning (Sammanfattning)</Label>
              <textarea 
                className="w-full min-h-[100px] p-3 rounded-md bg-background/50 border border-purple-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.projectDescription}
                onChange={e => setFormData({...formData, projectDescription: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Hållbarhetsmål & Effekt</Label>
              <textarea 
                className="w-full min-h-[100px] p-3 rounded-md bg-background/50 border border-purple-500/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.sustainabilityGoals}
                onChange={e => setFormData({...formData, sustainabilityGoals: e.target.value})}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border/50 pt-6">
            <Button variant="ghost" onClick={() => setStep(0)}>Börja om</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => setStep(2)}>
              Bekräfta & Gå vidare <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Complete */}
      {step === 2 && (
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-sm animate-in zoom-in-95 text-center py-12">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <FileSignature className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Redo för Signering!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Den slutgiltiga PDF-blanketten har genererats i enlighet med Naturvårdsverkets standarder.
            </p>
            <div className="flex gap-4 mt-8">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" /> Granska PDF
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <UploadCloud className="w-4 h-4" /> Signera & Skicka in
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
