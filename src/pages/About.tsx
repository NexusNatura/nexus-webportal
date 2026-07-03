/*
 * NEXUS-OS About Page – Vision, Team & Kontakt
 * Design: Nordic Sustainability Intelligence
 */

import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Leaf, Users, Target, ArrowRight, CheckCircle2, Send } from "lucide-react";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/nexus-hero-BAK57Es8JRM7MRbEW2vPwu.webp";

const team = [
  {
    name: "Peter (Jerker)",
    role: "Grundare & Teknisk Arkitekt",
    desc: "Bygger NexusCore-plattformen och EU-byråkratiagenten. Ansvarar för systemarkitektur, AI-integration och PowerShell-motorn.",
    initials: "PJ",
    color: "oklch(0.28 0.08 155)",
  },
  {
    name: "Paula Pantolin",
    role: "Branschpartner & Pilotföretag",
    desc: "Grundare av Pantolin Smycken. Pilotpartner för DPP-implementering. Bevisade resultat: 89% COâ‚‚-reduktion, 18% premieprissättning.",
    initials: "PP",
    color: "oklch(0.62 0.12 55)",
  },
  {
    name: "Marlene",
    role: "Design & Kommunikation",
    desc: "Ansvarar för visuell identitet, användarupplevelse och kommunikation mot kunder och finansiärer.",
    initials: "ML",
    color: "oklch(0.38 0.09 155)",
  },
];

const values = [
  {
    icon: Leaf,
    title: "Hållbarhet i praktiken",
    desc: "Vi mäter alltid klimatpåverkan. Varje DPP, varje ansökan och varje symbiosflöde ska resultera i faktisk COâ‚‚-reduktion – inte bara på papper.",
  },
  {
    icon: Users,
    title: "Lokal förankring",
    desc: "Nexus-OS är byggt för och med företag i Skaraborg. Vi förstår de lokala utmaningarna och har ett nätverk av pilotkunder som bevisar konceptet.",
  },
  {
    icon: Target,
    title: "Senior EU-kompetens",
    desc: "Vi säljer inte bara ett verktyg – vi säljer senior kompetens om EU:s regellandskap. Vår AI är tränad på ESPR, AI Act, GDPR och Erasmus+.",
  },
];

type ContactRole = "pilotkund" | "partner" | "investerare" | "annan";

export default function About() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "" as ContactRole | "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Namn krävs";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Giltig e-post krävs";
    if (!form.message.trim()) e.message = "Meddelande krävs";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSent(true);
    toast.success("Meddelande skickat!", { description: `Vi hör av oss till ${form.email} inom 1–2 arbetsdagar.` });
  };

  return (
    <Layout title="Om Nexus-OS" subtitle="Vision, team och vad vi byggt">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src={HERO_IMG} alt="Om Nexus-OS" className="w-full h-full object-cover" />
        <div className="nexus-hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex items-center px-4 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
              En motor – tre marknader
            </h2>
            <p className="text-white/80 max-w-xl text-sm">
              Nexus-OS hjälper lokala SMF att navigera EU:s cirkulära omställning, hitta rätt finansiering och bygga digitala produktpass som skapar nya intäkter.
            </p>
          </div>
        </div>
      </div>

      <div className="container py-10">
        {/* Vision */}
        <div className="max-w-3xl mb-12">
          <div className="nexus-section-divider mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
            Vår vision
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            EU:s ESPR-förordning gör Digitala Produktpass obligatoriska från 2026. De flesta lokala företag saknar infrastruktur, kompetens och resurser för att möta dessa krav. Nexus-OS vänder compliance-kostnaden till en ny intäktskälla.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Plattformen kombinerar en senior AI-agent för EU-byråkrati, en digital produktpassbank och en industriell symbiosmotor – allt drivet av samma AI-kärna och tillgängligt via en lokal PowerShell-terminal eller denna webbplattform.
          </p>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="nexus-card p-5">
                <div className="w-10 h-10 rounded-lg bg-[oklch(0.28_0.08_155_/_0.10)] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[oklch(0.28_0.08_155)]" />
                </div>
                <h4 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Team */}
        <div className="mb-12">
          <div className="nexus-section-divider mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Fraunces', serif" }}>
            Teamet
          </h3>
          <div className="grid md:grid-cols-3 gap-5">
            {team.map((member) => (
              <div key={member.name} className="nexus-card p-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3"
                  style={{ background: member.color, fontFamily: "'Fraunces', serif" }}
                >
                  {member.initials}
                </div>
                <h4 className="font-semibold text-foreground mb-0.5" style={{ fontFamily: "'Fraunces', serif" }}>{member.name}</h4>
                <div className="text-xs text-[oklch(0.62_0.12_55)] font-medium mb-2">{member.role}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="nexus-card p-6 bg-[oklch(0.28_0.08_155_/_0.04)] border-[oklch(0.28_0.08_155_/_0.20)]">
          <div className="nexus-section-divider mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Kom i kontakt med oss
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Vi söker samarbetspartners, pilotkunder och finansiering. Hör av dig om du vill veta mer eller utforska ett samarbete.
          </p>

          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-1" style={{ fontFamily: "'Fraunces', serif" }}>Tack, {form.name}!</h4>
              <p className="text-sm text-muted-foreground mb-4">Vi hör av oss till <strong>{form.email}</strong> inom 1–2 arbetsdagar.</p>
              <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", org: "", role: "", message: "" }); }}>
                Skicka ett till meddelande
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.28 0.08 155)" }}>Namn *</label>
                    <Input
                      placeholder="Ditt namn"
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
                      className={errors.name ? "border-red-400" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.28 0.08 155)" }}>Organisation</label>
                    <Input placeholder="Företag / Org" value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.28 0.08 155)" }}>E-post *</label>
                  <Input
                    type="email"
                    placeholder="din@email.se"
                    value={form.email}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: "" })); }}
                    className={errors.email ? "border-red-400" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.28 0.08 155)" }}>Jag är intresserad som</label>
                  <div className="flex flex-wrap gap-2">
                    {(["pilotkund", "partner", "investerare", "annan"] as ContactRole[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: r }))}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                          form.role === r
                            ? "bg-[oklch(0.28_0.08_155)] text-white border-[oklch(0.28_0.08_155)]"
                            : "bg-white text-muted-foreground border-border hover:border-[oklch(0.28_0.08_155)]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "oklch(0.28 0.08 155)" }}>Meddelande *</label>
                  <Textarea
                    placeholder="Beskriv ditt intresse eller dina frågor..."
                    value={form.message}
                    onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: "" })); }}
                    rows={4}
                    className={errors.message ? "border-red-400" : ""}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-0.5">{errors.message}</p>}
                </div>
                <Button className="w-full bg-[oklch(0.28_0.08_155)] hover:bg-[oklch(0.35_0.08_155)] text-white" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" />
                  Skicka meddelande
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>

              {/* Right: info */}
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[oklch(0.28_0.08_155_/_0.15)]">
                    <MapPin className="w-4 h-4 text-[oklch(0.62_0.12_55)] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Plats</div>
                      <div className="text-muted-foreground">Skaraborg, Västra Götaland</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[oklch(0.28_0.08_155_/_0.15)]">
                    <Mail className="w-4 h-4 text-[oklch(0.62_0.12_55)] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">E-post</div>
                      <div className="text-muted-foreground">info@nexus-os.se</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-xl p-4 border border-[oklch(0.28_0.08_155_/_0.15)]">
                    <Leaf className="w-4 h-4 text-[oklch(0.62_0.12_55)] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">Fokusområden</div>
                      <div className="text-muted-foreground">Cirkulär ekonomi, ESPR 2026, DPP, EU-bidrag</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[oklch(0.28_0.08_155_/_0.06)] rounded-xl p-4 border border-[oklch(0.28_0.08_155_/_0.15)] text-sm">
                  <div className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Fraunces', serif" }}>Vi söker aktivt</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Pilotkunder i Skaraborg</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Branschpartners med EU-kompetens</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Sådd-investering / Almi-finansiering</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Vinnova-konsortiumpartners</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

