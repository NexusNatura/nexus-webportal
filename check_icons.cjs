const lucide = require("lucide-react");
const icons = ["Banknote", "Search", "Activity", "Calendar", "Tag", "ShieldCheck", "CheckCircle2", "Euro", "Target", "ArrowRight", "TrendingUp", "FileText", "Clock", "AlertCircle"];
const missing = [];
for (const icon of icons) {
  if (!lucide[icon]) {
    missing.push(icon);
  }
}
console.log("Missing icons:", missing);
