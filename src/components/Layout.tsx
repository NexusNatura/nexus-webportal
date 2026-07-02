import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  FileText,
  Search,
  Recycle,
  Terminal,
  Info,
  Menu,
  X,
  ChevronRight,
  Leaf,
  Building2,
  Zap,
  Database,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  Radio,
  BookOpen,
  BatteryCharging,
  Bot,
} from "lucide-react";

const navGroups = [
  {
    key: "start",
    label: "Kom igång",
    items: [
      { href: "/", label: "Översikt", icon: Leaf, description: "Hem & Dashboard" },
      { href: "/hitta-bidrag", label: "Hitta Bidrag", icon: Zap, description: "Gratis matchning", badge: "Gratis" },
    ]
  },
  {
    key: "core",
    label: "Plattform",
    items: [
      { href: "/bidrag", label: "EU Bidrag", icon: Search, description: "Ansök & hantera" },
      { href: "/produktpass", label: "Produktpass", icon: FileText, description: "DPP & LCA" },
      { href: "/batteripass", label: "Batteripass (BPB)", icon: BatteryCharging, description: "EU Batteriförordning 2027", badge: "Nytt" },
      { href: "/datamarknad", label: "Datamarknaden", icon: Database, description: "Sälj din LCA-data", badge: "Nytt" },
      { href: "/agenter", label: "Agentmarknaden", icon: Bot, description: "AI-agenter & Digitala Tvillingar", badge: "Nytt" },
      { href: "/agent-community", label: "Agent Community", icon: BookOpen, description: "Utbildning & Pussel" },
      { href: "/agenter/skapa", label: "Skapa Agent", icon: Bot, description: "Publicera din agent", badge: "Beta" },
      { href: "/symbios", label: "Industriell Symbios", icon: Recycle, description: "Lokala flöden" },
    ]
  },
  {
    key: "learn",
    label: "Lär & Väx",
    items: [
      { href: "/utbildning", label: "Circular Excellence", icon: GraduationCap, description: "Certifieringar", badge: "Nytt" },
      { href: "/foretag", label: "Företagsprofil", icon: Building2, description: "Din handlingsplan" },
    ]
  },
  {
    key: "tools",
    label: "Verktyg",
    items: [
      { href: "/terminal", label: "NexusCore Terminal", icon: Terminal, description: "PowerShell-agent" },
      { href: "/priser", label: "Prissättning", icon: CreditCard, description: "Planer & jämförelse" },
      { href: "/om-oss", label: "Om Nexus-OS", icon: Info, description: "Vision & team" },
      { href: "/integritet", label: "Integritet & Etik", icon: ShieldCheck, description: "NIF - Garantiramverk" },
      { href: "/operator", label: "Operator Center", icon: Radio, description: "HITL · GWD · Skrapning", badge: "Live" },
      { href: "/compliance", label: "EU AI Act Efterlevnad", icon: ShieldCheck, description: "Riskregister · Misuse · Art. 50", badge: "Nytt" },
      { href: "/blogg", label: "Blogg & Insikter", icon: BookOpen, description: "AI · Hållbarhet · EU-lag" },
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Sidebar - Apple Design (Mac Sidebar Style) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col
          bg-muted/30 backdrop-blur-3xl border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:flex
        `}
      >
        {/* Logo Area */}
        <div className="px-5 py-6 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group w-full">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-foreground font-semibold text-[15px] tracking-tight">
                Nexus-OS
              </div>
              <div className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">Workspace</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-5 scrollbar-none">
          {navGroups.map(({ key, label, items }) => (
            <div key={key}>
              <div className="px-2.5 pb-2">
                <span className="text-muted-foreground/70 text-[11px] font-semibold uppercase tracking-wider">
                  {label}
                </span>
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 group
                        ${isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/80 hover:bg-black/5 dark:hover:bg-white/10"
                        }
                      `}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] font-medium truncate ${isActive ? "text-primary-foreground" : ""}`}>{item.label}</div>
                      </div>
                      {"badge" in item && item.badge && !isActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile / Footer Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              PJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">Peter Johansson</div>
              <div className="text-[11px] text-muted-foreground truncate">peter@zymbolix.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-semibold tracking-tight text-foreground">Nexus-OS</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2 text-foreground/70 hover:text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Content Header if Title provided */}
        {title && (
          <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 pb-20 pt-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
