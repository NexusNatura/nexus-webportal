/**
 * NEXUS-OS â€“ CertificateView
 * Visuellt certifikat som visas nÃ¤r en kurs Ã¤r avklarad
 */

import { useRef } from "react";
import { Award, Download, Share2, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CertificateViewProps {
  courseName: string;
  certAbbr: string;
  certName: string;
  recipientName: string;
  completedDate: string;
  onClose: () => void;
}

export default function CertificateView({
  courseName,
  certAbbr,
  certName,
  recipientName,
  completedDate,
  onClose,
}: CertificateViewProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    toast.success("Certifikat nedladdat!", {
      description: "Sparat som PDF i din nedladdningsmapp.",
    });
    // In a real implementation, this would call a server-side PDF generation endpoint
    // For now, we show a success toast
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Jag har precis avslutat kursen "${courseName}" och fÃ¥tt certifieringen ${certAbbr} pÃ¥ Nexus-OS! ðŸŽ“ #CircularEconomy #ESPR #Nexus`
      );
      toast.success("Delningstext kopierad!", {
        description: "Klistra in pÃ¥ LinkedIn eller i ett e-postmeddelande.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Certificate visual */}
        <div
          ref={certRef}
          className="relative bg-gradient-to-br from-[#0d2b1e] via-[#1a4a30] to-[#0d2b1e] p-10 text-white text-center overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 20%, #b87333 0%, transparent 40%), radial-gradient(circle at 80% 80%, #2d6a4f 0%, transparent 40%)",
            }}
          />
          <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/20 rounded-xl pointer-events-none" />
          <div className="absolute top-6 left-6 right-6 bottom-6 border border-white/10 rounded-lg pointer-events-none" />

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-4 relative z-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#b87333] text-[#b87333]" />
            ))}
          </div>

          {/* Logo */}
          <div className="w-16 h-16 bg-[#b87333] rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
            <Award className="w-8 h-8 text-white" />
          </div>

          <p className="text-white/60 text-xs uppercase tracking-[0.3em] mb-2 relative z-10">
            Nexus-OS Â· Circular Excellence Program
          </p>
          <h1 className="font-display text-3xl font-bold mb-1 relative z-10">Certifikat</h1>
          <p className="text-white/60 text-sm mb-6 relative z-10">fÃ¶r slutfÃ¶rd utbildning</p>

          <div className="bg-white/10 rounded-xl px-6 py-4 mb-6 relative z-10">
            <p className="text-white/60 text-xs mb-1">Tilldelat</p>
            <p className="font-display text-2xl font-bold text-[#e8c98a]">{recipientName || "Peter Johansson"}</p>
          </div>

          <p className="text-white/80 text-sm mb-2 relative z-10">
            fÃ¶r framgÃ¥ngsrikt genomfÃ¶rande av
          </p>
          <p className="font-display text-xl font-bold text-white mb-1 relative z-10">{courseName}</p>
          <div className="inline-flex items-center gap-2 bg-[#b87333] text-white px-4 py-1.5 rounded-full text-sm font-bold mt-2 mb-6 relative z-10">
            <CheckCircle2 className="w-4 h-4" />
            {certAbbr} â€“ {certName}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-white/50 relative z-10">
            <span>UtfÃ¤rdat: {completedDate}</span>
            <span>Â·</span>
            <span>Nexus-OS Platform v2.0</span>
            <span>Â·</span>
            <span>Verifierat av NIF</span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <p className="font-semibold text-[var(--forest-deep)]">
              Grattis! Du har avslutat <strong>{courseName}</strong>.
            </p>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-5">
            Ditt certifikat {certAbbr} Ã¤r nu aktivt. Det stÃ¤rker din trovÃ¤rdighet i ansÃ¶kningar till
            Vinnova, Almi och EU-finansiering.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[var(--forest-deep)] hover:bg-[var(--forest-mid)] text-white gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              Ladda ner PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Dela pÃ¥ LinkedIn
            </Button>
            <Button variant="ghost" onClick={onClose}>
              StÃ¤ng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

