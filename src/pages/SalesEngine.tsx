import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, ChevronRight, Calendar, Clock, Building2, User, Mail, Zap, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  { id: "gratis", name: "Gratis", price: "0 kr", icon: Zap, color: "text-blue-400", border: "border-blue-900/50" },
  { id: "smf", name: "SMF", price: "299 kr/mån", icon: Building2, color: "text-nexus-gold", border: "border-nexus-gold/50" },
  { id: "enterprise", name: "Enterprise", price: "Offert", icon: Factory, color: "text-purple-400", border: "border-purple-900/50" }
];

const availableTimes = ["09:00", "10:30", "13:00", "14:30", "16:00"];

export default function SalesEngine() {
  const [selectedPlan, setSelectedPlan] = useState<string>("smf");
  const [step, setStep] = useState<number>(1);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [formData, setFormData] = useState({ name: "", company: "", email: "" });

  const bookMutation = trpc.sales.bookMeeting.useMutation({
    onSuccess: () => {
      toast.success('Möte bokat!', { description: 'Vi har skickat en inbjudan till din e-post.' });
      setStep(4); // Success step
    },
    onError: (err) => {
      toast.error('Något gick fel', { description: err.message });
    }
  });

  const handleBook = () => {
    if (!formData.name || !formData.company || !formData.email) {
      toast.error('Vänligen fyll i alla fält');
      return;
    }
    bookMutation.mutate({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      selectedPlan,
      meetingDate: date,
      meetingTime: time
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 text-white p-8 font-sans pb-32">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight">NEXUS-OS <span className="text-nexus-gold">Sales Engine</span></h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Från första intryck till bokad demo. Välj er plan och boka en genomgång direkt med våra experter.
            </p>
          </div>

          {/* Steg 1: Välj Plan */}
          <div className={cn("transition-all duration-500", step === 1 ? "opacity-100" : "opacity-50 grayscale pointer-events-none")}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-nexus-gold text-slate-900 flex items-center justify-center text-sm">1</span>
              Välj licensmodell
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div 
                  key={plan.id} 
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "p-6 rounded-2xl border-2 cursor-pointer transition-all hover:scale-105 bg-slate-900",
                    selectedPlan === plan.id ? plan.border + " shadow-[0_0_30px_rgba(184,115,51,0.15)]" : "border-slate-800"
                  )}
                >
                  <plan.icon className={cn("w-10 h-10 mb-4", plan.color)} />
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 font-mono text-lg">{plan.price}</p>
                </div>
              ))}
            </div>
            {step === 1 && (
              <div className="mt-8 text-right">
                <Button onClick={() => setStep(2)} className="bg-nexus-gold text-slate-900 hover:bg-yellow-600 text-lg px-8 py-6 rounded-full">
                  Nästa Steg <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Steg 2: Välj Tid */}
          {step >= 2 && (
            <div className={cn("transition-all duration-500", step === 2 ? "opacity-100" : (step > 2 ? "opacity-50 grayscale pointer-events-none" : "opacity-0 hidden"))}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-nexus-gold text-slate-900 flex items-center justify-center text-sm">2</span>
                Välj tid för Demo
              </h2>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row gap-12">
                
                {/* Dummy Calendar Grid */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-nexus-gold mb-4">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold">Kommande vecka</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-sm font-semibold text-slate-400 mb-2">
                    <div>Mån</div><div>Tis</div><div>Ons</div><div>Tor</div><div>Fre</div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[12, 13, 14, 15, 16].map(d => (
                      <button 
                        key={d} 
                        onClick={() => setDate(`2026-07-${d}`)}
                        className={cn("aspect-square rounded-xl border flex items-center justify-center text-lg transition-colors hover:bg-slate-800", date === `2026-07-${d}` ? "bg-nexus-gold text-slate-900 border-nexus-gold" : "border-slate-800")}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="flex-1 space-y-4 border-l border-slate-800 pl-12">
                  <div className="flex items-center gap-2 text-nexus-gold mb-4">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Lediga tider {date ? `den ${date.split('-')[2]}:e` : ''}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableTimes.map(t => (
                      <button 
                        key={t}
                        disabled={!date}
                        onClick={() => setTime(t)}
                        className={cn("p-3 rounded-xl border transition-colors", !date ? "opacity-30 cursor-not-allowed" : "hover:border-nexus-gold", time === t ? "bg-nexus-gold text-slate-900 border-nexus-gold font-bold" : "border-slate-800")}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
              
              {step === 2 && date && time && (
                <div className="mt-8 text-right">
                  <Button onClick={() => setStep(3)} className="bg-nexus-gold text-slate-900 hover:bg-yellow-600 text-lg px-8 py-6 rounded-full">
                    Gå till bokning <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Steg 3: Formulär */}
          {step >= 3 && step < 4 && (
            <div className="transition-all duration-500 opacity-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-nexus-gold text-slate-900 flex items-center justify-center text-sm">3</span>
                Dina uppgifter
              </h2>
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-2xl">
                <div className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><User className="w-4 h-4"/> Fullständigt namn</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-nexus-gold" placeholder="Anna Andersson" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><Building2 className="w-4 h-4"/> Företag</label>
                    <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-nexus-gold" placeholder="TechCorp AB" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 flex items-center gap-2"><Mail className="w-4 h-4"/> E-post</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:border-nexus-gold" placeholder="anna@techcorp.se" />
                  </div>

                  <Button 
                    onClick={handleBook} 
                    disabled={bookMutation.isLoading}
                    className="w-full bg-nexus-gold text-slate-900 hover:bg-yellow-600 text-lg py-6 rounded-xl mt-4"
                  >
                    {bookMutation.isLoading ? "Bokar..." : "Bekräfta Bokning"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Steg 4: Klart */}
          {step === 4 && (
            <div className="bg-emerald-950/30 border border-emerald-900/50 p-12 rounded-3xl text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-white">Bokning Bekräftad!</h2>
              <p className="text-slate-400 text-lg max-w-md mx-auto">
                Tack {formData.name.split(' ')[0]}! Vi har bokat in en demo den {date} kl {time}. Vi ser fram emot att träffa er.
              </p>
              <div className="pt-4">
                 <Button variant="outline" onClick={() => window.location.href = '/'} className="border-slate-700 hover:bg-slate-800">Tillbaka till start</Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
