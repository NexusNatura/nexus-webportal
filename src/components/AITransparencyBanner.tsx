/**
 * AITransparencyBanner – EU AI Act Artikel 50 Efterlevnad
 * Informerar användaren om att de interagerar med ett AI-system.
 * Visas vid sessionstart, kan minimeras men återkommer efter 30 min inaktivitet.
 */

import { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronUp, X, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SESSION_KEY = "nexus_ai_transparency_acknowledged";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minuter

interface AITransparencyBannerProps {
  /** Vilken AI-modul som är aktiv på sidan */
  activeModule?: "GWD-Alpha" | "Scraper-Beta" | "Grant-Gamma" | "DPP-Delta" | "NexusCore";
  /** Visa kompakt variant (för sidor med begränsat utrymme) */
  compact?: boolean;
}

export default function AITransparencyBanner({
  activeModule = "NexusCore",
  compact = false,
}: AITransparencyBannerProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Visa bannern om den inte visats i denna session
  useEffect(() => {
    const acknowledged = sessionStorage.getItem(SESSION_KEY);
    if (!acknowledged) {
      setVisible(true);
    }
  }, []);

  // Återvisa bannern efter 30 min inaktivitet
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT_MS) {
        sessionStorage.removeItem(SESSION_KEY);
        setVisible(true);
      }
    }, 60_000); // Kontrollera varje minut

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity]);

  const handleAcknowledge = () => {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  const moduleDescriptions: Record<string, string> = {
    "GWD-Alpha": "Greenwashing-detektionsanalys med 14 taktiker baserade på EU:s Green Claims Directive",
    "Scraper-Beta": "Automatiserad datainsamling från TED, Vinnova och offentliga upphandlingsdatabaser",
    "Grant-Gamma": "Bidragsmatchning mot EU-, Vinnova- och Almi-program",
    "DPP-Delta": "Generering av Digitala Produktpass enligt ESPR-förordningen",
    "NexusCore": "Nexus-OS AI-plattform för hållbarhetsanalys och bidragshantering",
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 rounded-md text-xs text-amber-300">
        <Shield className="w-3 h-3 flex-shrink-0" />
        <span>AI-system aktiv: {activeModule} – Granska alltid AI-genererade svar.</span>
        <button
          onClick={handleAcknowledge}
          className="ml-auto text-amber-400 hover:text-amber-200 transition-colors"
          aria-label="Stäng AI-transparensmeddelande"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full border border-amber-500/40 rounded-lg bg-amber-950/30 backdrop-blur-sm overflow-hidden">
      {/* Huvud-rad */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-amber-300">
              Du interagerar med ett AI-system
            </span>
            <Badge
              variant="outline"
              className="text-[10px] border-amber-500/40 text-amber-400 bg-amber-500/10 px-1.5 py-0"
            >
              EU AI Act Art. 50
            </Badge>
          </div>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            <strong className="text-amber-300">{activeModule}</strong> är ett AI-drivet system.{" "}
            {moduleDescriptions[activeModule]} Alla rekommendationer och analyser är AI-genererade
            och ska granskas av en kvalificerad person innan beslut fattas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-amber-400/60 hover:text-amber-300 transition-colors p-1"
            aria-label={expanded ? "Dölj teknisk information" : "Visa teknisk information"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleAcknowledge}
            className="text-amber-400/60 hover:text-amber-300 transition-colors p-1"
            aria-label="Stäng AI-transparensmeddelande"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanderad teknisk information */}
      {expanded && (
        <div className="border-t border-amber-500/20 px-4 py-3 bg-amber-950/20 space-y-3">
          {/* Modell- och versionsinformation */}
          <div>
            <div className="text-xs font-semibold text-amber-300 mb-2">Modell & Version</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-black/20 rounded-md p-2.5">
                <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">AI-modell</div>
                <div className="text-xs text-amber-200 font-mono">Gemini 2.0 (Google DeepMind)</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5">
                <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Systemversion</div>
                <div className="text-xs text-amber-200 font-mono">NexusCore v3.0</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5">
                <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Riskklass</div>
                <div className="text-xs text-amber-200 font-mono">Begränsad Risk (Art. 50)</div>
              </div>
            </div>
          </div>

          {/* Träningsdata och cutoff */}
          <div>
            <div className="text-xs font-semibold text-amber-300 mb-2">Träningsdata</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-md p-2.5">
                <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Cutoff-datum</div>
                <div className="text-xs text-amber-200 font-mono">April 2024</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5">
                <div className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1">Uppdaterad</div>
                <div className="text-xs text-amber-200 font-mono">April 2026</div>
              </div>
            </div>
          </div>

          {/* Begränsningar */}
          <div>
            <div className="text-xs font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Kända begränsningar
            </div>
            <div className="bg-amber-900/20 rounded-md border border-amber-500/20 p-2.5 text-[11px] text-amber-200/70 leading-relaxed space-y-1.5">
              <p>”¢ <strong>Hallucination-risk:</strong> AI kan producera felaktiga, ofullständiga eller fabricerade svar</p>
              <p>”¢ <strong>Träningsdatums-cutoff:</strong> Systemet saknar information efter april 2024</p>
              <p>”¢ <strong>Greenwashing-analys:</strong> Baseras på tillgänglig publik information, ersätter inte juridisk rådgivning</p>
              <p>”¢ <strong>Bidragsmatchning:</strong> Indikativ endast, kräver verifiering mot aktuella utlysningskrav</p>
              <p>”¢ <strong>Regeluppdateringar:</strong> ESPR, Battery Regulation, CSDDD kan ändras – verifiera alltid aktuell lagstiftning</p>
            </div>
          </div>

          {/* EU-regelefterlevnad */}
          <div>
            <div className="text-xs font-semibold text-amber-300 mb-2">EU-regelefterlevnad</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-black/20 rounded-md p-2.5 text-[10px]">
                <div className="text-amber-400/60 uppercase tracking-wider mb-1">AI Act (Art. 50)</div>
                <div className="text-amber-200">Transparentkrav för AI-system</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5 text-[10px]">
                <div className="text-amber-400/60 uppercase tracking-wider mb-1">ESPR 2026</div>
                <div className="text-amber-200">Digitala Produktpass-stöd</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5 text-[10px]">
                <div className="text-amber-400/60 uppercase tracking-wider mb-1">Battery Reg. 2023/1542</div>
                <div className="text-amber-200">Batteripass-generering</div>
              </div>
              <div className="bg-black/20 rounded-md p-2.5 text-[10px]">
                <div className="text-amber-400/60 uppercase tracking-wider mb-1">CSDDD</div>
                <div className="text-amber-200">Leverantörsanalys</div>
              </div>
            </div>
          </div>

          {/* Juridisk information */}
          <div className="flex items-start gap-2 p-2.5 bg-black/20 rounded-md border border-amber-500/10">
            <Info className="w-3 h-3 text-amber-400/50 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] text-amber-400/50 leading-relaxed">
              Denna information visas i enlighet med EU AI Act (Förordning 2024/1689), Artikel 50.
              <br />
              <strong>Ansvarig organisation:</strong> Jerker AI AB, Moholm, Sverige
              <br />
              <strong>Kontakt:</strong> peter@jerker-ai.se | <strong>Webbplats:</strong> nexus-os.se
            </span>
          </div>
        </div>
      )}

      {/* Bekräftelseknapp */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-amber-500/20 bg-black/10">
        <span className="text-[10px] text-amber-400/50">
          Bannern återvisas automatiskt efter 30 min inaktivitet
        </span>
        <Button
          size="sm"
          onClick={handleAcknowledge}
          className="h-7 text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40"
          variant="outline"
        >
          Jag förstår – fortsätt
        </Button>
      </div>
    </div>
  );
}

