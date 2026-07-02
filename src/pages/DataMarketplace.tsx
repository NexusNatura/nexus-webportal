import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Database,
  Recycle,
  Factory,
  Search,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Plus
} from "lucide-react";

function formatSek(ore: number) {
  return `${(ore / 100).toLocaleString("sv-SE")} SEK`;
}

export default function DataMarketplace() {
  const { data: listings = [], isLoading } = trpc.marketplace.list.useQuery();
  const checkoutMutation = trpc.marketplace.createCheckout.useMutation();
  const [activeTab, setActiveTab] = useState("buy");

  const HERO_IMG = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full inline-block" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 overflow-hidden mb-8 border-b border-border/50 animate-in slide-in-from-top-4 duration-500">
        <img src={HERO_IMG} alt="Data Marketplace" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        <div className="absolute inset-0 flex items-center px-4 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-4">
              <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 px-3 py-1">
                LCA Datamarknad
              </Badge>
              <Badge variant="outline" className="bg-background/50 backdrop-blur px-3 py-1">
                <Database className="w-3 h-3 mr-1" /> Scope 3-data
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Monet�risera din H�llbarhet
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              K�p anonymiserad utsl�ppsdata f�r att st�rka dina LCA-kalkyler, eller s�lj din egen DPP-data och skapa en ny int�ktsstr�m.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl animate-in fade-in duration-700 delay-150">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-end mb-6">
            <TabsList className="bg-muted/50 border border-border/50 backdrop-blur p-1 h-12">
              <TabsTrigger value="buy" className="text-sm px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <ShoppingCart className="w-4 h-4 mr-2" /> K�p Data
              </TabsTrigger>
              <TabsTrigger value="sell" className="text-sm px-6 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                <TrendingUp className="w-4 h-4 mr-2" /> S�lj Data
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" className="gap-2 hidden md:flex">
              <Search className="w-4 h-4" /> S�k Datapaket
            </Button>
          </div>

          <TabsContent value="buy" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any, i: number) => (
                <Card 
                  key={listing.id} 
                  className="group border-border/50 bg-card/50 backdrop-blur shadow-sm hover:border-primary/50 transition-all duration-300 animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        {listing.industry === "Metall" ? <Factory className="w-5 h-5" /> : <Recycle className="w-5 h-5" />}
                      </div>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 mr-1" /> {listing.verification}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1">{listing.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{listing.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="text-xs text-muted-foreground mb-1">Datapunkter</div>
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-primary" />
                          {listing.dataPoints.toLocaleString("sv-SE")}
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-md p-3 border">
                        <div className="text-xs text-muted-foreground mb-1">Bransch</div>
                        <div className="font-semibold text-foreground">
                          {listing.industry}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 bg-muted/10 flex justify-between items-center rounded-b-xl">
                    <div>
                      <div className="text-xs text-muted-foreground">Licenspris</div>
                      <div className="font-bold text-lg text-foreground">{formatSek(listing.priceOre)}</div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2" onClick={() => {
                      toast.success(`K�per ${listing.title}...`);
                    }}>
                      K�p <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="mt-0">
            <Card className="max-w-2xl mx-auto border-border/50 bg-card/50 backdrop-blur shadow-sm animate-in zoom-in-95 duration-500">
              <CardHeader>
                <CardTitle className="text-2xl">Skapa ny datalistning</CardTitle>
                <CardDescription>
                  Har du genererat ett DPP via Nexus-OS? V�lj att anonymisera och s�lja dina livscykelanalyser (LCA) till plattformens andra anv�ndare.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">V�lj Datak�lla (Ditt DPP)</label>
                  <select className="w-full px-3 py-2.5 text-sm border border-border/50 rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>DPP-2026-001 (Silverring Pantolin) - 45 datapunkter</option>
                    <option>DPP-2026-002 (Reparerad Kaffemaskin) - 12 datapunkter</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Pris (SEK)</label>
                  <Input type="number" placeholder="t.ex. 5000" className="bg-background/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Beskrivning</label>
                  <textarea 
                    className="w-full px-3 py-2.5 text-sm border border-border/50 rounded-lg bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px]"
                    placeholder="Beskriv datakvaliteten och vilka processer som t�cks..."
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4 h-11">
                  <Plus className="w-4 h-4 mr-2" /> Publicera p� Datamarknaden
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


