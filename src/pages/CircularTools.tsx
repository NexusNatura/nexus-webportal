import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Leaf, Recycle, Factory, ArrowRight, BarChart3, Cloud, Zap } from "lucide-react";
import { Link } from "wouter";

export default function CircularTools() {
  const [recycledMaterial, setRecycledMaterial] = useState([40]);
  const [lifespan, setLifespan] = useState([5]);

  const mciScore = Math.min(100, Math.round(((recycledMaterial[0] / 100) * 50) + ((lifespan[0] / 10) * 50)));
  const co2Saved = Math.round(recycledMaterial[0] * 12.5); // Mock calculation

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 text-green-500 border-green-500/30">Cirkulär Ekonomi</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Cirkulära Verktyg & Analys</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Beräkna din produkts cirkularitet, mät CO2-besparingar och upptäck nya affärsmodeller. Designat för nästa generations industri.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Verktyg 1: Material Circularity Indicator */}
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-sm relative overflow-hidden group hover:border-green-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Recycle className="w-32 h-32 text-green-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg"><Recycle className="w-5 h-5 text-green-500" /></div>
              <CardTitle>Material Cirkularitets-Index (MCI)</CardTitle>
            </div>
            <CardDescription>Beräkna hur cirkulär din produkt är baserat på materialval och livslängd.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-sm">Återvunnet material (%)</span>
                <span className="font-bold text-green-500">{recycledMaterial[0]}%</span>
              </div>
              <Slider 
                value={recycledMaterial} 
                onValueChange={setRecycledMaterial} 
                max={100} 
                step={1} 
                className="[&_[role=slider]]:bg-green-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-sm">Förväntad livslängd (År)</span>
                <span className="font-bold text-primary">{lifespan[0]} år</span>
              </div>
              <Slider 
                value={lifespan} 
                onValueChange={setLifespan} 
                max={20} 
                step={1}
              />
            </div>

            <div className="pt-6 border-t border-border/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Beräknad MCI Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter text-foreground">{mciScore}</span>
                  <span className="text-lg text-muted-foreground">/ 100</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                mciScore > 75 ? 'border-green-500 text-green-500' : 
                mciScore > 40 ? 'border-yellow-500 text-yellow-500' : 
                'border-red-500 text-red-500'
              }`}>
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verktyg 2: CO2 Kalkylator */}
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Cloud className="w-32 h-32 text-blue-500" />
          </div>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Cloud className="w-5 h-5 text-blue-500" /></div>
              <CardTitle>Koldioxidbesparing (CO2e)</CardTitle>
            </div>
            <CardDescription>Estimerad utsläppsminskning vid nuvarande cirkulär design.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10 flex flex-col justify-between h-[calc(100%-80px)]">
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <div className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-600 mb-4 transition-all duration-500">
                -{co2Saved}
              </div>
              <p className="text-lg font-medium text-muted-foreground">kg CO2e per tillverkad enhet</p>
            </div>
            
            <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20 flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Genom att öka andelen återvunnet material med ytterligare 20% skulle du kunna sänka utsläppen till nivåer som berättigar till gröna skattesubventioner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card/40 backdrop-blur border-border/50 shadow-sm md:col-span-2 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-xl shrink-0">
              <Factory className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">Avfall-till-Resurs Karta</h3>
              <p className="text-muted-foreground text-sm max-w-md">Koppla ihop era restströmmar med lokala aktörer. Hitta industriella symbios-partners automatiskt med AI.</p>
            </div>
          </div>
          <Link href="/symbios">
            <Button className="shrink-0 font-bold shadow-sm">
              Öppna Kartan <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
