/**
 * NEXUS-OS HITL OPERATOR DASHBOARD
 * Design: Cyberpunk Terminal / Dark Ops Intelligence Center
 * Color: #0a0e14 base, #00ff9d neon-green (approved), #ff3b5c neon-red (flagged), #ffb800 amber (pending)
 * Typography: JetBrains Mono (data), Space Grotesk (headings), DM Sans (body)
 * Layout: Three-column mission control – Agent Status | Active Workspace | Agent Chat + Decision Queue
 * HITL: Peter is always in control. Agents cannot act on flagged items without approval.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import AITransparencyBanner from "@/components/AITransparencyBanner";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Zap,
  MessageSquare,
  Send,
  RefreshCw,
  Eye,
  Download,
  ChevronRight,
  Cpu,
  Database,
  Shield,
  Search,
  FileText,
  TrendingUp,
  Radio,
  Hexagon,
  Terminal,
  Filter,
  BarChart3,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type AgentStatus = "AKTIV" | "VÄNTAR" | "FLAGGAT" | "OFFLINE";
type SeverityLevel = "KRITISK" | "HÖG" | "MEDEL" | "LÅG";
type DecisionType = "GODKÄNN" | "AVVISA" | "ESKALERA";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  tasksCompleted: number;
  currentTask: string;
  avatarUrl: string;
  lastSeen: string;
  confidence: number;
}

interface GWDCase {
  id: string;
  company: string;
  claim: string;
  severity: SeverityLevel;
  tactics: string[];
  evidence: string;
  aiConfidence: number;
  status: "VÄNTAR_BESLUT" | "GODKÄND" | "AVVISAD" | "ESKALERAD";
  timestamp: string;
  url: string;
}

interface ScraperJob {
  id: string;
  target: string;
  type: string;
  status: "AKTIV" | "KLAR" | "FEL" | "KÖAR";
  progress: number;
  found: number;
  started: string;
  eta: string;
}

interface ChatMessage {
  id: string;
  sender: "agent" | "peter";
  agentId?: string;
  agentName?: string;
  text: string;
  timestamp: string;
  type: "info" | "alert" | "decision" | "normal";
}

interface SystemMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  color: string;
}

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const AGENTS: Agent[] = [
  {
    id: "gwd-alpha",
    name: "GWD-Alpha",
    role: "Greenwashing Detektion",
    status: "AKTIV",
    tasksCompleted: 47,
    currentTask: "Analyserar Volvo Cars hållbarhetsrapport 2025",
    avatarUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/agent-avatar-gwd-ahwEDnW2hcvbCeGwgEi84H.webp",
    lastSeen: "Nu",
    confidence: 94,
  },
  {
    id: "scraper-beta",
    name: "Scraper-Beta",
    role: "Webbskrapning & Datainsamling",
    status: "AKTIV",
    tasksCompleted: 213,
    currentTask: "Skrapar TED-databasen för ESPR-upphandlingar",
    avatarUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/agent-avatar-scraper-PFYdh9mZ3v8acJcay9iPRc.webp",
    lastSeen: "2 min sedan",
    confidence: 88,
  },
  {
    id: "grant-gamma",
    name: "Grant-Gamma",
    role: "Bidragsmatchning",
    status: "VÄNTAR",
    tasksCompleted: 31,
    currentTask: "Väntar på Vinnova API-svar",
    avatarUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/agent-avatar-gwd-ahwEDnW2hcvbCeGwgEi84H.webp",
    lastSeen: "5 min sedan",
    confidence: 76,
  },
  {
    id: "dpp-delta",
    name: "DPP-Delta",
    role: "Digital Produktpass",
    status: "FLAGGAT",
    tasksCompleted: 19,
    currentTask: "HITL-beslut krävs: Paula Pantolin DPP-verifiering",
    avatarUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/agent-avatar-scraper-PFYdh9mZ3v8acJcay9iPRc.webp",
    lastSeen: "12 min sedan",
    confidence: 62,
  },
];

const INITIAL_GWD_CASES: GWDCase[] = [
  {
    id: "NIF-2026-GWD-047",
    company: "GreenTech Nordic AB",
    claim: '"100% koldioxidneutral produktion sedan 2023"',
    severity: "KRITISK",
    tactics: ["Scope 3-utelämning", "Kompensationsöverdrift", "Tidslinje-manipulation"],
    evidence: "Scope 3-utsläpp (leverantörskedja) saknas helt i rapporten. Koldioxidkompensation via skogsplantering räknas som 'noll' utan vetenskaplig grund.",
    aiConfidence: 97,
    status: "VÄNTAR_BESLUT",
    timestamp: "2026-03-23T14:32:00Z",
    url: "https://greentech-nordic.se/hallbarhet",
  },
  {
    id: "NIF-2026-GWD-046",
    company: "Skaraborg Textil Grupp",
    claim: '"Ekologisk bomull – 100% naturlig"',
    severity: "HÖG",
    tactics: ["Vag terminologi", "Certifieringsbrist"],
    evidence: "Ingen GOTS- eller OCS-certifiering. 'Ekologisk' är ej definierat. Vattenförbrukning 15 000L/kg bomull ej redovisad.",
    aiConfidence: 84,
    status: "VÄNTAR_BESLUT",
    timestamp: "2026-03-23T13:15:00Z",
    url: "https://skaraborg-textil.se/produkter",
  },
  {
    id: "NIF-2026-GWD-045",
    company: "Moholm Stål & Metall",
    claim: '"Återvunnet stål – cirkulär ekonomi"',
    severity: "MEDEL",
    tactics: ["Delvis sanning"],
    evidence: "23% återvunnet material, ej 100% som antyds. Resterande 77% primärstål ej kommunicerat.",
    aiConfidence: 71,
    status: "GODKÄND",
    timestamp: "2026-03-23T11:00:00Z",
    url: "https://moholm-stal.se",
  },
];

const INITIAL_SCRAPER_JOBS: ScraperJob[] = [
  {
    id: "JOB-2026-0891",
    target: "TED Europa – ESPR-upphandlingar",
    type: "Bidragsskrapning",
    status: "AKTIV",
    progress: 67,
    found: 23,
    started: "14:20",
    eta: "~8 min",
  },
  {
    id: "JOB-2026-0890",
    target: "Vinnova.se – Öppna utlysningar",
    type: "Bidragsskrapning",
    status: "KLAR",
    progress: 100,
    found: 7,
    started: "13:45",
    eta: "Klar",
  },
  {
    id: "JOB-2026-0889",
    target: "Naturvårdsverket – Miljöbidrag",
    type: "Bidragsskrapning",
    status: "KLAR",
    progress: 100,
    found: 4,
    started: "13:10",
    eta: "Klar",
  },
  {
    id: "JOB-2026-0888",
    target: "Skaraborg.se – Hållbarhetsrapporter",
    type: "Greenwash-analys",
    status: "KÖAR",
    progress: 0,
    found: 0,
    started: "–",
    eta: "Väntar",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "agent",
    agentId: "gwd-alpha",
    agentName: "GWD-Alpha",
    text: "Systemstart klar. Jag har laddat 14 detektionstaktiker och är redo för analys. Väntar på dina instruktioner, Peter.",
    timestamp: "14:00:01",
    type: "info",
  },
  {
    id: "m2",
    sender: "agent",
    agentId: "scraper-beta",
    agentName: "Scraper-Beta",
    text: "TED-skrapning påbörjad. Hittills 23 relevanta upphandlingar med ESPR-koppling. Estimerad klar tid: 8 minuter.",
    timestamp: "14:20:15",
    type: "info",
  },
  {
    id: "m3",
    sender: "agent",
    agentId: "gwd-alpha",
    agentName: "GWD-Alpha",
    text: "âš ï¸ KRITISK FLAGGA: GreenTech Nordic AB – Ärendenr NIF-2026-GWD-047. AI-konfidensgrad 97%. Tre greenwash-taktiker identifierade. Kräver ditt beslut innan rapport genereras.",
    timestamp: "14:32:07",
    type: "alert",
  },
  {
    id: "m4",
    sender: "agent",
    agentId: "dpp-delta",
    agentName: "DPP-Delta",
    text: "Paula Pantolins DPP-verifiering pausad. Jag är osäker på hur COâ‚‚-reduktionen på 89% ska klassificeras – är det Scope 1+2 eller inkluderar det Scope 3? Behöver din expertbedömning.",
    timestamp: "14:45:33",
    type: "decision",
  },
];

const SYSTEM_METRICS: SystemMetric[] = [
  { label: "Ärenden idag", value: "47", trend: "up", color: "#00ff9d" },
  { label: "Flaggade", value: "3", trend: "stable", color: "#ffb800" },
  { label: "Godkända", value: "41", trend: "up", color: "#00ff9d" },
  { label: "Avvisade", value: "3", trend: "stable", color: "#ff3b5c" },
  { label: "AI-konfidens", value: "89%", trend: "up", color: "#00ff9d" },
  { label: "Aktiva jobb", value: "1", trend: "stable", color: "#ffb800" },
];

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StatusBadge({ status }: { status: AgentStatus }) {
  const config = {
    AKTIV: { bg: "bg-[#00ff9d]/10 border-[#00ff9d]/30 text-[#00ff9d]", dot: "bg-[#00ff9d] animate-pulse" },
    VÄNTAR: { bg: "bg-[#ffb800]/10 border-[#ffb800]/30 text-[#ffb800]", dot: "bg-[#ffb800] animate-pulse" },
    FLAGGAT: { bg: "bg-[#ff3b5c]/10 border-[#ff3b5c]/30 text-[#ff3b5c]", dot: "bg-[#ff3b5c] animate-pulse" },
    OFFLINE: { bg: "bg-gray-500/10 border-gray-500/30 text-gray-400", dot: "bg-gray-500" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const config = {
    KRITISK: "bg-[#ff3b5c]/15 border-[#ff3b5c]/40 text-[#ff3b5c]",
    HÖG: "bg-orange-500/15 border-orange-500/40 text-orange-400",
    MEDEL: "bg-[#ffb800]/15 border-[#ffb800]/40 text-[#ffb800]",
    LÅG: "bg-[#00ff9d]/15 border-[#00ff9d]/40 text-[#00ff9d]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${config[severity]}`}>
      {severity}
    </span>
  );
}

function JobStatusBadge({ status }: { status: ScraperJob["status"] }) {
  const config = {
    AKTIV: "text-[#00ff9d] border-[#00ff9d]/30 bg-[#00ff9d]/10",
    KLAR: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    FEL: "text-[#ff3b5c] border-[#ff3b5c]/30 bg-[#ff3b5c]/10",
    KÖAR: "text-gray-400 border-gray-500/30 bg-gray-500/10",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${config[status]}`}>
      {status}
    </span>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono" style={{ color }}>{value}%</span>
    </div>
  );
}

function CountUp({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= target) { clearInterval(timer); return target; }
        return Math.min(prev + step, target);
      });
    }, 40);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState<"gwd" | "scraper" | "metrics">("gwd");
  const [gwdCases, setGwdCases] = useState<GWDCase[]>(INITIAL_GWD_CASES);
  const [scraperJobs] = useState<ScraperJob[]>(INITIAL_SCRAPER_JOBS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [selectedCase, setSelectedCase] = useState<GWDCase | null>(INITIAL_GWD_CASES[0]);
  const [decisionLog, setDecisionLog] = useState<{ id: string; decision: DecisionType; time: string; note: string }[]>([]);
  const [decisionNote, setDecisionNote] = useState("");
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueSeverity, setIssueSeverity] = useState<"låg" | "medel" | "hög" | "kritisk">("medel");
  const [issueSubmitting, setIssueSubmitting] = useState(false);

  const notifyOwnerMutation = trpc.system.notifyOwner.useMutation();

  const handleSubmitIssue = async () => {
    if (!issueTitle.trim()) {
      alert("Ange en titel för ärendet");
      return;
    }
    setIssueSubmitting(true);
    try {
      await notifyOwnerMutation.mutateAsync({
        title: `[${issueSeverity.toUpperCase()}] Nytt ärende från Operator: ${issueTitle}`,
        content: `Ärendetyp: ${issueSeverity}\n\nBeskrivning:\n${issueDescription || "(Ingen beskrivning)"}\n\nTid: ${new Date().toLocaleString("sv-SE")}`,
      });
      alert("Ärendet har skickats! Peter granskar det snart.");
      setShowIssueForm(false);
      setIssueTitle("");
      setIssueDescription("");
      setIssueSeverity("medel");
    } catch (err) {
      alert("Kunde inte skicka ärendet. Försök igen.");
    } finally {
      setIssueSubmitting(false);
    }
  };
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<{ caseId: string; type: DecisionType } | null>(null);
  const [agentTyping, setAgentTyping] = useState(false);
  const [newCaseAlert, setNewCaseAlert] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string>("gwd-alpha");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC mutation for real Gemini AI chat
  const agentChatMutation = trpc.agent.chat.useMutation({
    onSuccess: (data) => {
      setAgentTyping(false);
      const respondingAgent = AGENTS.find(a => a.id === data.agentId);
      setMessages(prev => [...prev, {
        id: `m${Date.now()}`,
        sender: "agent",
        agentId: data.agentId,
        agentName: respondingAgent?.name ?? data.agentId,
        text: data.reply,
        timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        type: "normal",
      }]);
    },
    onError: () => {
      setAgentTyping(false);
      setMessages(prev => [...prev, {
        id: `m${Date.now()}`,
        sender: "agent",
        agentId: activeAgentId,
        agentName: "System",
        text: "âš ï¸ Agenten är tillfälligt otillgänglig. Kontrollera nätverksanslutningen.",
        timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        type: "alert",
      }]);
    },
  });

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate live agent activity
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAgentTyping(true);
      setTimeout(() => {
        setAgentTyping(false);
        setMessages(prev => [...prev, {
          id: `m${Date.now()}`,
          sender: "agent",
          agentId: "scraper-beta",
          agentName: "Scraper-Beta",
          text: "TED-skrapning 67% klar. Hittills 23 träffar. Noterar ökad aktivitet kring ESPR-batteridirektivet – 8 nya upphandlingar sedan igår.",
          timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          type: "info",
        }]);
      }, 2500);
    }, 5000);

    const timer2 = setTimeout(() => {
      setNewCaseAlert(true);
      setGwdCases(prev => [{
        id: "NIF-2026-GWD-048",
        company: "Lidköping Energi AB",
        claim: '"Fossilfri energi – 100% förnybar"',
        severity: "HÖG",
        tactics: ["Geografisk avgränsning", "Tidsbegränsad sanning"],
        evidence: "Påståendet gäller enbart sommarhalvåret. Vinterproduktion 34% fossil gas. Ej kommunicerat.",
        aiConfidence: 88,
        status: "VÄNTAR_BESLUT",
        timestamp: new Date().toISOString(),
        url: "https://lidkoping-energi.se",
      }, ...prev]);
      setTimeout(() => setNewCaseAlert(false), 3000);
      setMessages(prev => [...prev, {
        id: `m${Date.now()}`,
        sender: "agent",
        agentId: "gwd-alpha",
        agentName: "GWD-Alpha",
        text: "ðŸ†• Nytt ärende: NIF-2026-GWD-048 – Lidköping Energi AB. Hög allvarlighetsgrad. Geografisk avgränsning och tidsbegränsad sanning detekterade. Konfidensgrad 88%.",
        timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        type: "alert",
      }]);
    }, 12000);

    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || agentChatMutation.isPending) return;
    const userText = inputText;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: "peter",
      text: userText,
      timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "normal",
    };
    setMessages(prev => [...prev, msg]);
    setInputText("");
    setAgentTyping(true);

    // Build context from selected case if available
    const context = selectedCase
      ? `Aktuellt ärende: ${selectedCase.id} | Företag: ${selectedCase.company} | Påstående: ${selectedCase.claim} | Allvarlighetsgrad: ${selectedCase.severity} | AI-konfidens: ${selectedCase.aiConfidence}% | Detekterade taktiker: ${selectedCase.tactics.join(", ")} | Bevisunderlag: ${selectedCase.evidence}`
      : undefined;

    agentChatMutation.mutate({
      agentId: activeAgentId,
      message: userText,
      context,
    });
  }, [inputText, activeAgentId, selectedCase, agentChatMutation]);

  const initiateDecision = (caseId: string, type: DecisionType) => {
    setPendingDecision({ caseId, type });
    setShowDecisionModal(true);
  };

  const confirmDecision = () => {
    if (!pendingDecision) return;
    const { caseId, type } = pendingDecision;
    const statusMap: Record<DecisionType, GWDCase["status"]> = {
      GODKÄNN: "GODKÄND",
      AVVISA: "AVVISAD",
      ESKALERA: "ESKALERAD",
    };
    setGwdCases(prev => prev.map(c => c.id === caseId ? { ...c, status: statusMap[type] } : c));
    setDecisionLog(prev => [{
      id: caseId,
      decision: type,
      time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
      note: decisionNote || "Inget kommentar",
    }, ...prev]);
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: "peter",
      text: `âœ… Beslut fattat för ${caseId}: ${type}. ${decisionNote ? `Notering: ${decisionNote}` : ""}`,
      timestamp: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "decision",
    }]);
    setShowDecisionModal(false);
    setDecisionNote("");
    setPendingDecision(null);
    if (selectedCase?.id === caseId) setSelectedCase(null);
  };

  const pendingCases = gwdCases.filter(c => c.status === "VÄNTAR_BESLUT");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0a0e14",
        fontFamily: "'DM Sans', sans-serif",
        color: "#c9d1d9",
      }}
    >
      {/* EU AI Act Art. 50 – AI Transparency Banner */}
      <div className="px-4 pt-3">
        <AITransparencyBanner activeModule="GWD-Alpha" />
      </div>

      {/* Top Status Bar */}
      <header
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "#1e2d3d", background: "#0d1117" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#00ff9d] animate-pulse" />
            <span className="text-[#00ff9d] text-xs font-mono font-bold tracking-widest">NEXUS-OS OPERATOR CENTER</span>
          </div>
          <span className="text-[#1e2d3d]">|</span>
          <span className="text-[#3d5a80] text-xs font-mono">SESSION: PJ-2026-{Math.floor(Math.random() * 9000 + 1000)}</span>
        </div>
        <div className="flex items-center gap-4">
          {SYSTEM_METRICS.map((m) => (
            <div key={m.label} className="hidden lg:flex items-center gap-1.5">
              <span className="text-[#3d5a80] text-[10px] font-mono">{m.label}:</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: m.color }}>
                {m.value.includes("%") ? m.value : <CountUp target={parseInt(m.value)} />}
                {m.value.includes("%") ? "" : ""}
              </span>
            </div>
          ))}
          <button
            onClick={() => setShowIssueForm(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#ffb800]/20 bg-[#ffb800]/5 hover:bg-[#ffb800]/10 transition-colors"
          >
            <FileText className="w-3 h-3 text-[#ffb800]" />
            <span className="text-[#ffb800] text-[10px] font-mono font-bold">NYTT ÄRENDE</span>
          </button>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#00ff9d]/20 bg-[#00ff9d]/5">
            <Shield className="w-3 h-3 text-[#00ff9d]" />
            <span className="text-[#00ff9d] text-[10px] font-mono font-bold">HITL AKTIV</span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 41px)" }}>

        {/* LEFT COLUMN – Agent Status */}
        <aside
          className="w-64 flex-shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: "#1e2d3d", background: "#0d1117" }}
        >
          <div className="px-3 py-3 border-b" style={{ borderColor: "#1e2d3d" }}>
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#3d5a80]" />
              <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Agenter</span>
            </div>
          </div>

          <div className="p-3 space-y-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="p-3 rounded border transition-all"
                style={{
                  borderColor: agent.status === "FLAGGAT" ? "#ff3b5c33" : "#1e2d3d",
                  background: agent.status === "FLAGGAT" ? "#ff3b5c08" : "#111827",
                }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                    style={{ border: `1px solid ${agent.status === "AKTIV" ? "#00ff9d33" : "#1e2d3d"}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white font-mono truncate">{agent.name}</div>
                    <div className="text-[10px] text-[#3d5a80] truncate">{agent.role}</div>
                  </div>
                </div>
                <StatusBadge status={agent.status} />
                <div className="mt-2">
                  <div className="text-[10px] text-[#3d5a80] mb-1">Konfidens</div>
                  <ConfidenceBar
                    value={agent.confidence}
                    color={agent.confidence > 85 ? "#00ff9d" : agent.confidence > 70 ? "#ffb800" : "#ff3b5c"}
                  />
                </div>
                <div className="mt-2 text-[10px] text-[#3d5a80] leading-relaxed line-clamp-2">
                  {agent.currentTask}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[9px] text-[#1e4d6b] font-mono">{agent.tasksCompleted} uppgifter</span>
                  <span className="text-[9px] text-[#1e4d6b] font-mono">{agent.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Decision Log */}
          <div className="px-3 py-3 border-t mt-auto" style={{ borderColor: "#1e2d3d" }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-3 h-3 text-[#3d5a80]" />
              <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Beslutslogg</span>
            </div>
            {decisionLog.length === 0 ? (
              <p className="text-[10px] text-[#1e4d6b] font-mono">Inga beslut ännu</p>
            ) : (
              <div className="space-y-1.5">
                {decisionLog.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#3d5a80]">{d.time}</span>
                    <span className={`text-[9px] font-mono font-bold ${d.decision === "GODKÄNN" ? "text-[#00ff9d]" : d.decision === "AVVISA" ? "text-[#ff3b5c]" : "text-[#ffb800]"}`}>
                      {d.decision}
                    </span>
                    <span className="text-[9px] font-mono text-[#1e4d6b] truncate">{d.id.split("-").pop()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* CENTER COLUMN – Active Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center border-b px-4 gap-1" style={{ borderColor: "#1e2d3d", background: "#0d1117" }}>
            {[
              { key: "gwd", label: "Greenwash-analys", icon: AlertTriangle, count: pendingCases.length },
              { key: "scraper", label: "Skrapningsjobb", icon: Globe, count: scraperJobs.filter(j => j.status === "AKTIV").length },
              { key: "metrics", label: "Systemmätare", icon: BarChart3, count: 0 },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 transition-all ${
                  activeTab === key
                    ? "border-[#00ff9d] text-[#00ff9d]"
                    : "border-transparent text-[#3d5a80] hover:text-[#c9d1d9]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count > 0 && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    key === "gwd" ? "bg-[#ff3b5c]/20 text-[#ff3b5c]" : "bg-[#00ff9d]/20 text-[#00ff9d]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
            {newCaseAlert && (
              <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded border border-[#ff3b5c]/40 bg-[#ff3b5c]/10 animate-pulse">
                <AlertCircle className="w-3 h-3 text-[#ff3b5c]" />
                <span className="text-[10px] font-mono text-[#ff3b5c] font-bold">NYTT ÄRENDE</span>
              </div>
            )}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">

            {/* GWD Tab */}
            {activeTab === "gwd" && (
              <div className="flex gap-4 h-full">
                {/* Case list */}
                <div className="w-72 flex-shrink-0 space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">
                      Ärenden ({gwdCases.length})
                    </span>
                    <div className="flex items-center gap-1">
                      <Filter className="w-3 h-3 text-[#3d5a80]" />
                      <span className="text-[10px] font-mono text-[#3d5a80]">Filter</span>
                    </div>
                  </div>
                  {gwdCases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`w-full text-left p-3 rounded border transition-all ${
                        selectedCase?.id === c.id
                          ? "border-[#00ff9d]/40 bg-[#00ff9d]/5"
                          : "border-[#1e2d3d] bg-[#111827] hover:border-[#1e4d6b]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono text-[#3d5a80]">{c.id}</span>
                        <SeverityBadge severity={c.severity} />
                      </div>
                      <div className="text-xs font-bold text-white mb-1">{c.company}</div>
                      <div className="text-[10px] text-[#3d5a80] line-clamp-2 mb-2">{c.claim}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold ${
                          c.status === "VÄNTAR_BESLUT" ? "text-[#ffb800]" :
                          c.status === "GODKÄND" ? "text-[#00ff9d]" :
                          c.status === "AVVISAD" ? "text-[#ff3b5c]" : "text-orange-400"
                        }`}>
                          {c.status.replace("_", " ")}
                        </span>
                        <span className="text-[9px] font-mono text-[#1e4d6b]">AI: {c.aiConfidence}%</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Case detail */}
                <div className="flex-1">
                  {selectedCase ? (
                    <div className="space-y-4">
                      {/* Header */}
                      <div
                        className="p-4 rounded border"
                        style={{
                          borderColor: selectedCase.severity === "KRITISK" ? "#ff3b5c44" : "#1e2d3d",
                          background: selectedCase.severity === "KRITISK" ? "#ff3b5c08" : "#111827",
                          backgroundImage: selectedCase.severity === "KRITISK"
                            ? `url(https://d2xsxph8kpxj0f.cloudfront.net/310419663030034659/WdTZ7r3vEJjEP43Ws5JWuq/greenwash-alert-bg-bAMu6akMuTiyM3CmMJaAJm.webp)`
                            : "none",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundBlendMode: "overlay",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-[#3d5a80]">{selectedCase.id}</span>
                              <SeverityBadge severity={selectedCase.severity} />
                            </div>
                            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {selectedCase.company}
                            </h2>
                            <p className="text-sm text-[#3d5a80] mt-1 font-mono italic">{selectedCase.claim}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[10px] text-[#3d5a80] mb-1">AI-konfidens</div>
                            <div className="text-2xl font-bold font-mono" style={{
                              color: selectedCase.aiConfidence > 85 ? "#ff3b5c" : selectedCase.aiConfidence > 70 ? "#ffb800" : "#00ff9d"
                            }}>
                              {selectedCase.aiConfidence}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tactics */}
                      <div className="p-4 rounded border" style={{ borderColor: "#1e2d3d", background: "#111827" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#ffb800]" />
                          <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Detekterade Taktiker</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCase.tactics.map((t) => (
                            <span key={t} className="px-2 py-1 rounded text-[10px] font-mono border border-[#ffb800]/30 bg-[#ffb800]/10 text-[#ffb800]">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Evidence */}
                      <div className="p-4 rounded border" style={{ borderColor: "#1e2d3d", background: "#111827" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Eye className="w-3.5 h-3.5 text-[#3d5a80]" />
                          <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Bevisunderlag</span>
                        </div>
                        <p className="text-sm text-[#c9d1d9] leading-relaxed">{selectedCase.evidence}</p>
                        <a
                          href={selectedCase.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono text-[#3d5a80] hover:text-[#00ff9d] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {selectedCase.url}
                        </a>
                      </div>

                      {/* HITL Decision Panel */}
                      {selectedCase.status === "VÄNTAR_BESLUT" && (
                        <div
                          className="p-4 rounded border"
                          style={{ borderColor: "#00ff9d33", background: "#00ff9d08" }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-3.5 h-3.5 text-[#00ff9d]" />
                            <span className="text-[10px] font-mono font-bold text-[#00ff9d] uppercase tracking-widest">HITL Beslutspanel – Kräver Din Bedömning</span>
                          </div>
                          <p className="text-xs text-[#3d5a80] mb-4">
                            AI-agenten kan inte agera utan ditt godkännande. Ditt beslut loggas med timestamp och motivering.
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => initiateDecision(selectedCase.id, "GODKÄNN")}
                              className="flex items-center gap-2 px-4 py-2 rounded border border-[#00ff9d]/40 bg-[#00ff9d]/10 text-[#00ff9d] text-xs font-mono font-bold hover:bg-[#00ff9d]/20 transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              GODKÄNN FLAGGA
                            </button>
                            <button
                              onClick={() => initiateDecision(selectedCase.id, "AVVISA")}
                              className="flex items-center gap-2 px-4 py-2 rounded border border-[#ff3b5c]/40 bg-[#ff3b5c]/10 text-[#ff3b5c] text-xs font-mono font-bold hover:bg-[#ff3b5c]/20 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              AVVISA
                            </button>
                            <button
                              onClick={() => initiateDecision(selectedCase.id, "ESKALERA")}
                              className="flex items-center gap-2 px-4 py-2 rounded border border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800] text-xs font-mono font-bold hover:bg-[#ffb800]/20 transition-all"
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                              ESKALERA
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedCase.status !== "VÄNTAR_BESLUT" && (
                        <div className="p-4 rounded border" style={{
                          borderColor: selectedCase.status === "GODKÄND" ? "#00ff9d33" : "#ff3b5c33",
                          background: selectedCase.status === "GODKÄND" ? "#00ff9d08" : "#ff3b5c08",
                        }}>
                          <div className="flex items-center gap-2">
                            {selectedCase.status === "GODKÄND" ? (
                              <CheckCircle className="w-4 h-4 text-[#00ff9d]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-[#ff3b5c]" />
                            )}
                            <span className="text-sm font-mono font-bold" style={{
                              color: selectedCase.status === "GODKÄND" ? "#00ff9d" : "#ff3b5c"
                            }}>
                              Beslut fattat: {selectedCase.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Hexagon className="w-12 h-12 text-[#1e2d3d] mx-auto mb-3" />
                        <p className="text-[#3d5a80] text-sm font-mono">Välj ett ärende för att granska</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Scraper Tab */}
            {activeTab === "scraper" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">
                    Aktiva & Senaste Skrapningsjobb
                  </span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1e2d3d] text-[10px] font-mono text-[#3d5a80] hover:border-[#00ff9d]/40 hover:text-[#00ff9d] transition-all">
                    <Zap className="w-3 h-3" />
                    Nytt jobb
                  </button>
                </div>
                {scraperJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded border" style={{ borderColor: "#1e2d3d", background: "#111827" }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-[#3d5a80]">{job.id}</span>
                          <JobStatusBadge status={job.status} />
                          <span className="text-[10px] font-mono text-[#1e4d6b]">{job.type}</span>
                        </div>
                        <div className="text-sm font-bold text-white">{job.target}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-[10px] text-[#3d5a80] font-mono">Hittade</div>
                        <div className="text-xl font-bold font-mono text-[#00ff9d]">{job.found}</div>
                      </div>
                    </div>
                    {job.status === "AKTIV" && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-[#3d5a80]">Framsteg</span>
                          <span className="text-[10px] font-mono text-[#00ff9d]">{job.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1e2d3d] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00ff9d] rounded-full transition-all duration-1000"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-[10px] font-mono text-[#1e4d6b]">
                      <span>Start: {job.started}</span>
                      <span>ETA: {job.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === "metrics" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {SYSTEM_METRICS.map((m) => (
                    <div key={m.label} className="p-4 rounded border" style={{ borderColor: "#1e2d3d", background: "#111827" }}>
                      <div className="text-[10px] font-mono text-[#3d5a80] uppercase tracking-widest mb-2">{m.label}</div>
                      <div className="text-3xl font-bold font-mono" style={{ color: m.color }}>
                        {m.value}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={`w-3 h-3 ${m.trend === "up" ? "text-[#00ff9d]" : m.trend === "down" ? "text-[#ff3b5c]" : "text-[#3d5a80]"}`} />
                        <span className="text-[10px] font-mono text-[#3d5a80]">
                          {m.trend === "up" ? "Ökar" : m.trend === "down" ? "Minskar" : "Stabilt"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded border" style={{ borderColor: "#1e2d3d", background: "#111827" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-3.5 h-3.5 text-[#3d5a80]" />
                    <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Systemhälsa</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "GWD-Alpha", value: 94, color: "#00ff9d" },
                      { label: "Scraper-Beta", value: 88, color: "#00ff9d" },
                      { label: "Grant-Gamma", value: 76, color: "#ffb800" },
                      { label: "DPP-Delta", value: 62, color: "#ffb800" },
                      { label: "Gemini API", value: 99, color: "#00ff9d" },
                      { label: "TED API", value: 87, color: "#00ff9d" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-[#3d5a80] w-28 flex-shrink-0">{item.label}</span>
                        <ConfidenceBar value={item.value} color={item.color} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT COLUMN – Agent Chat */}
        <aside
          className="w-80 flex-shrink-0 flex flex-col border-l"
          style={{ borderColor: "#1e2d3d", background: "#0d1117" }}
        >
          <div className="px-3 py-3 border-b" style={{ borderColor: "#1e2d3d" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#3d5a80]" />
                <span className="text-[10px] font-mono font-bold text-[#3d5a80] uppercase tracking-widest">Agent-kommunikation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
                <span className="text-[9px] font-mono text-[#00ff9d]">LIVE</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === "peter" ? "flex-row-reverse" : ""}`}
              >
                {msg.sender === "agent" && (
                  <div
                    className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-mono font-bold mt-0.5"
                    style={{
                      background: msg.type === "alert" ? "#ff3b5c22" : "#00ff9d22",
                      border: `1px solid ${msg.type === "alert" ? "#ff3b5c44" : "#00ff9d44"}`,
                      color: msg.type === "alert" ? "#ff3b5c" : "#00ff9d",
                    }}
                  >
                    {msg.agentName?.charAt(0)}
                  </div>
                )}
                <div className={`flex-1 ${msg.sender === "peter" ? "text-right" : ""}`}>
                  {msg.sender === "agent" && (
                    <div className="text-[9px] font-mono text-[#1e4d6b] mb-0.5">{msg.agentName} Â· {msg.timestamp}</div>
                  )}
                  <div
                    className={`inline-block px-3 py-2 rounded text-xs leading-relaxed max-w-[90%] text-left ${
                      msg.sender === "peter"
                        ? "bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d]"
                        : msg.type === "alert"
                        ? "bg-[#ff3b5c]/10 border border-[#ff3b5c]/20 text-[#ff3b5c]"
                        : msg.type === "decision"
                        ? "bg-[#ffb800]/10 border border-[#ffb800]/20 text-[#ffb800]"
                        : "bg-[#111827] border border-[#1e2d3d] text-[#c9d1d9]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "peter" && (
                    <div className="text-[9px] font-mono text-[#1e4d6b] mt-0.5">Peter Â· {msg.timestamp}</div>
                  )}
                </div>
              </div>
            ))}
            {agentTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-[9px] font-mono font-bold bg-[#00ff9d22] border border-[#00ff9d44] text-[#00ff9d]">G</div>
                <div className="bg-[#111827] border border-[#1e2d3d] px-3 py-2 rounded">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a80] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a80] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3d5a80] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t" style={{ borderColor: "#1e2d3d" }}>
            {/* Agent selector */}
            <div className="flex gap-1 mb-2">
              {AGENTS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setActiveAgentId(a.id)}
                  className={`flex-1 py-1 rounded text-[9px] font-mono font-bold transition-all border ${
                    activeAgentId === a.id
                      ? "border-[#00ff9d]/40 bg-[#00ff9d]/10 text-[#00ff9d]"
                      : "border-[#1e2d3d] text-[#3d5a80] hover:text-[#c9d1d9]"
                  }`}
                  title={a.role}
                >
                  {a.name.split("-")[0]}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Instruera ${AGENTS.find(a => a.id === activeAgentId)?.name ?? "agenten"}...`}
                disabled={agentChatMutation.isPending}
                className="flex-1 bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 text-xs font-mono text-[#c9d1d9] placeholder-[#1e4d6b] focus:outline-none focus:border-[#00ff9d]/40 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={agentChatMutation.isPending || !inputText.trim()}
                className="p-2 rounded border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[#00ff9d] hover:bg-[#00ff9d]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Terminal className="w-3 h-3 text-[#1e4d6b]" />
              <span className="text-[9px] font-mono text-[#1e4d6b]">
                {agentChatMutation.isPending ? "Gemini bearbetar..." : "Alla meddelanden loggas Â· NIF-2026 protokoll"}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Issue Submission Form Modal */}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0e14] border border-[#1e2d3d] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-[#ffb800]" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Nytt ärende</h3>
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-mono text-[#3d5a80] uppercase tracking-widest block mb-2">
                Titel
              </label>
              <input
                type="text"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                placeholder="T.ex. Agent X-1 svarar inte"
                className="w-full bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 text-xs font-mono text-[#c9d1d9] placeholder-[#1e4d6b] focus:outline-none focus:border-[#ffb800]/40 transition-colors"
              />
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-mono text-[#3d5a80] uppercase tracking-widest block mb-2">
                Allvarlighetsgrad
              </label>
              <select
                value={issueSeverity}
                onChange={(e) => setIssueSeverity(e.target.value as any)}
                className="w-full bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 text-xs font-mono text-[#c9d1d9] focus:outline-none focus:border-[#ffb800]/40 transition-colors"
              >
                <option value="låg">Låg</option>
                <option value="medel">Medel</option>
                <option value="hög">Hög</option>
                <option value="kritisk">Kritisk</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-mono text-[#3d5a80] uppercase tracking-widest block mb-2">
                Beskrivning
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Beskriv ärendet i detalj..."
                rows={4}
                className="w-full bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 text-xs font-mono text-[#c9d1d9] placeholder-[#1e4d6b] focus:outline-none focus:border-[#ffb800]/40 resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitIssue}
                disabled={issueSubmitting}
                className="flex-1 py-2 rounded border border-[#ffb800]/40 bg-[#ffb800]/10 text-[#ffb800] text-xs font-mono font-bold hover:bg-[#ffb800]/20 transition-all disabled:opacity-50"
              >
                {issueSubmitting ? "Skickar..." : "Skicka ärende"}
              </button>
              <button
                onClick={() => { setShowIssueForm(false); setIssueTitle(""); setIssueDescription(""); }}
                className="flex-1 py-2 rounded border border-[#1e2d3d] text-[#3d5a80] text-xs font-mono hover:border-[#3d5a80] transition-all"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && pendingDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            className="w-96 p-6 rounded border"
            style={{ borderColor: "#1e2d3d", background: "#0d1117" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[#00ff9d]" />
              <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Bekräfta HITL-beslut
              </h3>
            </div>
            <div className="p-3 rounded border border-[#1e2d3d] bg-[#111827] mb-4">
              <div className="text-[10px] font-mono text-[#3d5a80] mb-1">Ärende</div>
              <div className="text-sm font-mono text-white">{pendingDecision.caseId}</div>
              <div className="text-[10px] font-mono mt-2 text-[#3d5a80] mb-1">Beslut</div>
              <div className={`text-sm font-mono font-bold ${
                pendingDecision.type === "GODKÄNN" ? "text-[#00ff9d]" :
                pendingDecision.type === "AVVISA" ? "text-[#ff3b5c]" : "text-[#ffb800]"
              }`}>
                {pendingDecision.type}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[10px] font-mono text-[#3d5a80] uppercase tracking-widest block mb-2">
                Motivering (valfritt)
              </label>
              <textarea
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                placeholder="Beskriv din bedömning..."
                rows={3}
                className="w-full bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 text-xs font-mono text-[#c9d1d9] placeholder-[#1e4d6b] focus:outline-none focus:border-[#00ff9d]/40 resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmDecision}
                className="flex-1 py-2 rounded border border-[#00ff9d]/40 bg-[#00ff9d]/10 text-[#00ff9d] text-xs font-mono font-bold hover:bg-[#00ff9d]/20 transition-all"
              >
                Bekräfta
              </button>
              <button
                onClick={() => { setShowDecisionModal(false); setPendingDecision(null); }}
                className="flex-1 py-2 rounded border border-[#1e2d3d] text-[#3d5a80] text-xs font-mono hover:border-[#3d5a80] transition-all"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

