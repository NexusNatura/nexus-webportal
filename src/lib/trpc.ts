export const trpc = {
  useUtils: () => ({ 
    opportunities: {
      list: { 
        useQuery: (opts: any) => ({ 
          data: [
            { id: 101, title: 'Klimatklivet', provider: 'Naturvårdsverket', amount: 'Upp till 2,5 MSEK', deadline: 'Löpande', category: 'Klimat & Energi', tags: ['CO2-reduktion', 'Investeringsstöd', 'SMF'], status: 'Öppen', description: 'Investeringsstöd för åtgärder som minskar utsläpp av växthusgaser.' },
            { id: 102, title: 'Almi Verifieringsmedel', provider: 'Almi Företagspartner', amount: '50-250 000 SEK', deadline: 'Löpande', category: 'Innovation', tags: ['Startup', 'Verifiering', 'Teknik'], status: 'Öppen', description: 'Stöd för att verifiera en affärsidé eller teknik i marknaden.' },
            { id: 103, title: 'Vinnova Innovativa Startups', provider: 'Vinnova', amount: '300 000 SEK', deadline: '31 Okt 2026', category: 'Forskning & Utveckling', tags: ['Förstudie', 'Tech', 'Hållbarhet'], status: 'Stänger snart', description: 'Finansiering för nystartade företag med innovativa affärsidéer.' }
          ],
          isLoading: false
        }) 
      },
      calculatePWin: { 
        useQuery: (opts: any, queryOpts: any) => ({ 
          data: opts?.opportunityId === 101 ? { score: 92, factors: ['Stark hållbarhetsprofil (+15%)', 'Tidigare godkända projekt (+10%)', 'Hög konkurrens (-5%)'] } :
                opts?.opportunityId === 102 ? { score: 88, factors: ['Innovativ tech (+20%)', 'Saknar extern pilotkund (-10%)'] } :
                { score: 76, factors: ['Relevant bransch (+10%)', 'Kort tid till deadline (-15%)'] },
          isLoading: false,
          refetch: () => {}
        }) 
      }
    },
    marketplace: { list: { invalidate: () => {} } } 
  }),
  useQuery: () => ({ data: null }),
  useMutation: () => ({ mutateAsync: async () => ({}) }),
  grants: {
    generateDPP: { useMutation: () => ({ mutateAsync: async () => ({}) }) }
  },
  courses: { useQuery: () => ({ data: [] }) },
  lessons: { useQuery: () => ({ data: [] }) },
  agents: {
    createCheckout: { useMutation: () => ({ mutateAsync: async () => ({ checkoutUrl: '#' }) }) },
    requestNotify: { useMutation: () => ({ mutateAsync: async () => ({}) }) },
    install: { useMutation: () => ({ mutateAsync: async () => ({ success: true }) }) },
    configure: { useMutation: () => ({ mutateAsync: async () => ({ success: true }) }) },
    getMyPurchases: { useQuery: () => ({ data: [] }) },
    list: { 
      useQuery: () => ({ 
        data: [
          { id: 1, slug: 'ai-agent-cell', name: 'AI Agent Cell', tagline: 'Autonom agent för specifik affärsfunktion', description: 'En autonom agent som hanterar en specifik affärsfunktion med självoptimering.', category: 'agents', pricingModel: 'monthly', priceMonthlyOre: 499900, riskClass: 'minimal', securityLevel: 'standard', capabilities: ['Självförbättrande', '24/7 drift', 'Skalbar'], benchmarkScore: 94.2, avgResponseTimeSec: 0.8, status: 'active', isOfficial: true, purchaseCount: 89, iconName: 'Bot', accentColor: 'text-indigo-400', isEnterprise: false, agentType: 'ai-agent' },
          { id: 2, slug: 'meta-expert-agent', name: 'Meta-Expert Agent (MEA)', tagline: 'Mästaragent som skapar och hanterar agentflottor', description: 'Master agent that creates and manages a fleet of specialized AI agents. Inkluderar Agent Factory och Portfolio Management.', category: 'agents', pricingModel: 'enterprise', priceMonthlyOre: null, riskClass: 'limited', securityLevel: 'high_a', capabilities: ['Agent factory', 'Portfolio management', 'Autonom skalning', 'Cellulär arkitektur'], benchmarkScore: 99.8, avgResponseTimeSec: 1.5, status: 'active', isOfficial: true, purchaseCount: 12, iconName: 'Hexagon', accentColor: 'text-fuchsia-400', isEnterprise: true, agentType: 'ai-agent' },
          { id: 3, slug: 'dpp-delta', name: 'DPP-Delta (MINT)', tagline: 'Generera EU ESPR-kompatibla Produktpass automatiskt.', description: 'En avancerad Digital Tvilling som scannar material och leverantörsdata för att skapa kryptografiskt säkrade produktpass.', category: 'dpp', pricingModel: 'per_task', pricePerTaskOre: 25000, riskClass: 'limited', securityLevel: 'high_a', capabilities: ['JSON-LD Export', 'LCA Analys', 'Blockchain Minting'], benchmarkScore: 99.4, avgResponseTimeSec: 1.2, status: 'active', isOfficial: true, purchaseCount: 142, iconName: 'FileText', accentColor: 'text-emerald-400', isEnterprise: false, agentType: 'digital-twin' },
          { id: 4, slug: 'grant-finder', name: 'Grant Finder Pro', tagline: 'Hitta och ansök om EU-bidrag', description: 'Identifierar automatiskt relevanta bidrag och genererar utkast.', category: 'grants', pricingModel: 'monthly', priceMonthlyOre: 990000, riskClass: 'minimal', securityLevel: 'standard', capabilities: ['Auto-matchning', 'Utkast-generering', 'Success fee model'], benchmarkScore: 92.1, avgResponseTimeSec: 0.8, status: 'active', isOfficial: true, purchaseCount: 389, iconName: 'Search', accentColor: 'text-amber-400', isEnterprise: false, agentType: 'ai-agent' },
          { id: 5, slug: 'compliance-sentinel', name: 'Compliance Sentinel Agent', tagline: 'Realtidsövervakning av EU-lagstiftning', description: 'Säkerställer att dina processer och produktpass alltid är uppdaterade mot senaste EU-kraven.', category: 'compliance', pricingModel: 'monthly', priceMonthlyOre: 1290000, riskClass: 'limited', securityLevel: 'high_a', capabilities: ['Realtidsbevakning', 'Regelverksanalys', 'Larmfunktion'], benchmarkScore: 96.5, avgResponseTimeSec: 1.1, status: 'active', isOfficial: true, purchaseCount: 64, iconName: 'ShieldCheck', accentColor: 'text-blue-400', isEnterprise: false, agentType: 'ai-agent' },
          { id: 6, slug: 'green-claims', name: 'Green Claims Defender', tagline: 'Marknadsföringsgranskare för hållbarhet', description: 'Granskar marknadsföringsmaterial och säkerställer att alla miljöpåståenden är styrkta av underliggande LCA och DPP-data.', category: 'compliance', pricingModel: 'monthly', priceMonthlyOre: 790000, riskClass: 'minimal', securityLevel: 'standard', capabilities: ['Textanalys', 'Faktagranskning', 'Greenwashing-skydd'], benchmarkScore: 91.8, avgResponseTimeSec: 2.3, status: 'active', isOfficial: true, purchaseCount: 112, iconName: 'Recycle', accentColor: 'text-green-500', isEnterprise: false, agentType: 'ai-agent' },
          { id: 7, slug: 'twin-jewellery', name: 'Jewellery Auth Twin', tagline: 'Smyckens äkthets- och värderings-tvilling', description: 'Specialized passports for luxury items with material verification and authenticity proof. Höjer andrahandsvärdet.', category: 'dpp', pricingModel: 'per_task', pricePerTaskOre: 29900, riskClass: 'limited', securityLevel: 'high_a', capabilities: ['Material analysis', 'Authenticity proof', 'Resale value boost'], benchmarkScore: 98.2, avgResponseTimeSec: 1.0, status: 'active', isOfficial: true, purchaseCount: 205, iconName: 'Sparkles', accentColor: 'text-cyan-400', isEnterprise: false, agentType: 'digital-twin' }
        ],
        isLoading: false
      }) 
    }
  },
  opportunities: {
    list: { 
      useQuery: (opts: any) => ({ 
        data: [
          { id: 101, title: 'Klimatklivet', provider: 'Naturvårdsverket', amount: 'Upp till 2,5 MSEK', deadline: 'Löpande', category: 'Klimat & Energi', tags: ['CO2-reduktion', 'Investeringsstöd', 'SMF'], status: 'Öppen', description: 'Investeringsstöd för åtgärder som minskar utsläpp av växthusgaser.' },
          { id: 102, title: 'Almi Verifieringsmedel', provider: 'Almi Företagspartner', amount: '50-250 000 SEK', deadline: 'Löpande', category: 'Innovation', tags: ['Startup', 'Verifiering', 'Teknik'], status: 'Öppen', description: 'Stöd för att verifiera en affärsidé eller teknik i marknaden.' },
          { id: 103, title: 'Vinnova Innovativa Startups', provider: 'Vinnova', amount: '300 000 SEK', deadline: '31 Okt 2026', category: 'Forskning & Utveckling', tags: ['Förstudie', 'Tech', 'Hållbarhet'], status: 'Stänger snart', description: 'Finansiering för nystartade företag med innovativa affärsidéer.' }
        ],
        isLoading: false
      }) 
    },
    calculatePWin: { 
      useQuery: (opts: any, queryOpts: any) => ({ 
        data: opts?.opportunityId === 101 ? { score: 92, factors: ['Stark hållbarhetsprofil (+15%)', 'Tidigare godkända projekt (+10%)', 'Hög konkurrens (-5%)'] } :
              opts?.opportunityId === 102 ? { score: 88, factors: ['Innovativ tech (+20%)', 'Saknar extern pilotkund (-10%)'] } :
              { score: 76, factors: ['Relevant bransch (+10%)', 'Kort tid till deadline (-15%)'] },
        isLoading: false,
        refetch: () => {}
      }) 
    }
  },
  marketplace: {
    createListing: { useMutation: () => ({ mutateAsync: async () => ({}) }) },
    list: { 
      useQuery: () => ({ 
        data: [
          { id: 'L-001', title: 'LCA Data: Återvunnet Stål 90%', description: 'Komplett Scope 1 & 2 utsläppsdata från stålverk i Norrland.', industry: 'Metall', priceOre: 45000, dataPoints: 1250, seller: 'GreenSteel AB', verification: 'Verifierad' },
          { id: 'L-002', title: 'Kemikaliesammansättning: Bio-plast', description: 'Innehållsdeklaration och nedbrytningsprofil för ny bio-polymer.', industry: 'Plast', priceOre: 12000, dataPoints: 450, seller: 'PolyNature SE', verification: 'Väntar på granskning' },
          { id: 'L-003', title: 'Energiförbrukning: Textiltryck 2025', description: 'Aggregerad data för energianvändning vid storskaligt textiltryck.', industry: 'Textil', priceOre: 8500, dataPoints: 3200, seller: 'PrintFabrikken', verification: 'Verifierad' },
        ] 
      }) 
    },
    getMyPurchases: { useQuery: () => ({ data: [] }) },
    getMyListings: { useQuery: () => ({ data: [] }) },
    createCheckout: { useMutation: () => ({ mutateAsync: async () => ({ checkoutUrl: '#' }) }) },
    submitRequest: { useMutation: () => ({ mutateAsync: async () => ({}) }) }
  }
} as any;
