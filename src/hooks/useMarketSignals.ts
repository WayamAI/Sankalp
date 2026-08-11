import { MarketSignal, PredictedScenario, KnownScenario, UnknownRisk, TimelineEvent, UseMarketSignalsReturn } from '../types/signals'

const STATIC_SIGNALS: MarketSignal[] = [
  { id: 'bdi', label: 'Baltic Dry Index', value: '2,139', delta: '+66% vs 12mo low — Apr 8', severity: 'warn',
    source: { institution: 'Baltic Exchange', quote: 'The Baltic Dry Index rose 44 points to reach 2,139 points on April 8, 2026.', date: 'Apr 8, 2026', url: 'https://www.balticexchange.com' }, lastUpdated: new Date('2026-04-08') },
  { id: 'steel_hrc', label: 'Steel HRC (US Midwest)', value: '$1,083/t', delta: '+15.5% YoY — structural', severity: 'critical',
    source: { institution: 'Metals-API / LME', quote: 'HRC Steel at 1,083.10 USD/T on April 13, 2026 — up 15.47% year on year.', date: 'Apr 13, 2026', url: 'https://metals-api.com' }, lastUpdated: new Date('2026-04-13') },
  { id: 'hormuz', label: 'Strait of Hormuz', value: 'CLOSED', delta: 'Since Feb 28 — no Q2 resolution', severity: 'critical',
    source: { institution: 'Maersk Advisory', quote: 'On 9 April, no sign that the Iranian blockade of the Strait of Hormuz was being lifted. 230 loaded tankers waiting inside the Gulf.', date: 'Apr 9, 2026', url: 'https://www.maersk.com/news/advisories' }, lastUpdated: new Date('2026-04-09') },
  { id: 'red_sea', label: 'Red Sea vessels/day', value: '30–35', delta: 'vs normal 70 — halved', severity: 'critical',
    source: { institution: 'Drewry WCI', quote: 'Commercial shipping through the southern Red Sea corridor dropped to about 30–35 vessels daily vs typical 70.', date: 'Apr 2026', url: 'https://www.drewry.co.uk' }, lastUpdated: new Date('2026-04-10') },
  { id: 'inr_usd', label: 'INR / USD', value: '84.3', delta: 'Stable — within band', severity: 'ok',
    source: { institution: 'RBI reference rate', quote: 'INR/USD at 84.3, stable within the Reserve Bank of India target band.', date: 'Apr 14, 2026', url: 'https://www.rbi.org.in' }, lastUpdated: new Date('2026-04-14') },
  { id: 'brent', label: 'Crude oil (Brent)', value: '$92/bbl', delta: 'Gulf crisis premium active', severity: 'warn',
    source: { institution: 'EIA Open Data', quote: 'Brent crude up 10–13% on Hormuz disruptions; analysts warn prices could reach $100/bbl if disruptions persist.', date: 'Apr 2026', url: 'https://www.eia.gov/opendata/' }, lastUpdated: new Date('2026-04-10') },
]

const STATIC_KNOWN_SCENARIOS: KnownScenario[] = [
  { id: 'ks_supplier_delay', category: 'SUPPLY', title: 'Supplier delay cascade', description: 'Tier-1 supplier fails → Tier-2 scramble. Avg 18-day lead time spike.', frequencyPct: 72, revenueRiskCr: 58 },
  { id: 'ks_demand_spike', category: 'DEMAND', title: 'Demand spike — energy sector', description: 'NTPC / GAIL pull-in requests. Overloads P1 queue by 40%.', frequencyPct: 61, revenueRiskCr: 44 },
  { id: 'ks_bay_downtime', category: 'CAPACITY', title: 'Bay downtime — Pune plant', description: 'Bay 3 failure rate 3× higher in Q3. Absorb via Vadodara reroute.', frequencyPct: 48, revenueRiskCr: 35 },
  { id: 'ks_jnpt', category: 'LOGISTICS', title: 'Port congestion — JNPT', description: 'JNPT backlog adds 7–12 days for import material. Impacts Qatar & Aramco orders.', frequencyPct: 39, revenueRiskCr: 28 },
]

const STATIC_UNKNOWN_RISKS: UnknownRisk[] = [
  { id: 'ur_gulf_geo', type: 'known_unknown', title: 'Geopolitical escalation — Gulf clients',
    description: 'ADNOC, Saudi Aramco, Qatar Energy orders total ₹492Cr. Regional escalation could trigger force majeure or payment holds. Strait of Hormuz closed since Feb 28 is the primary structural driver — no Q2 resolution confirmed.',
    exposureLabel: '₹492Cr across 3 orders', probabilityPct: 35, actionLabel: 'War-game',
    preload: { disruptionTypes: ['demand_change'], compoundMode: false, affectedOrders: ['PF-2025-0178','PF-2025-0301','PF-2025-0112'], sourceSignals: ['hormuz','brent'], confidenceScore: 35 } },
  { id: 'ur_steel_margin', type: 'known_unknown', title: 'Steel cost passthrough — margin erosion',
    description: 'HRC steel up 15.5% YoY. Fixed-price contracts with NTPC and Tata Power cannot absorb this. Margin compression now active — Section 232 tariffs locked this in on Apr 2.',
    exposureLabel: 'Margin risk: 4–7% on ₹246Cr', probabilityPct: 90, actionLabel: 'Simulate',
    preload: { disruptionTypes: ['material_shortage'], compoundMode: false, affectedOrders: ['PF-2025-0012','PF-2025-0256'], sourceSignals: ['steel_hrc'], confidenceScore: 90 } },
  { id: 'ur_export_control', type: 'unknown_unknown', title: 'Regulatory export control — sudden directive',
    description: 'No current signal. Black swan: MoD/DGFT directive could freeze exports on defense-adjacent power equipment within 72 hours. No lead time for mitigation.',
    exposureLabel: 'Category risk — unquantified', probabilityPct: 12, actionLabel: 'War-game',
    preload: { disruptionTypes: ['supplier_delay','demand_change'], compoundMode: true, factory: 'both', sourceSignals: [], confidenceScore: 12 } },
  { id: 'ur_supplier_insolvency', type: 'unknown_unknown', title: 'Tier-2 supplier insolvency — single-source',
    description: 'Tier-2 financial distress is invisible until failure. Single-source component collapse halts Pune Bay 3 with no substitute available.',
    exposureLabel: 'Production halt risk — Bay 3', probabilityPct: 18, actionLabel: 'Analyze',
    preload: { disruptionTypes: ['supplier_delay','material_shortage'], compoundMode: true, factory: 'pune', sourceSignals: [], confidenceScore: 18 } },
]

const STATIC_PREDICTIONS: PredictedScenario[] = [
  { id: 'pred_port_freight', title: 'Port congestion + freight surge', confidence: 78, confidenceLevel: 'high',
    description: 'Baltic Dry and Red Sea signals co-elevated. Historical correlation r=0.74, 18-day lag. Predicts 3–6 week inbound material delays peaking May 2–10.',
    impactLabel: '+₹28–45Cr revenue at risk',
    sources: [
      { institution: 'Baltic Exchange', quote: 'The Baltic Dry Index rose 44 points to reach 2,139 points on April 8, 2026.', date: 'Apr 8, 2026', url: 'https://www.balticexchange.com' },
      { institution: 'Drewry WCI', quote: 'Drewry World Container Index increased 1% to $2,309 per 40ft container this week.', date: 'Apr 9, 2026', url: 'https://www.drewry.co.uk' }
    ],
    preload: { disruptionTypes: ['supplier_delay','material_shortage'], compoundMode: true, factory: 'pune', affectedOrders: ['PF-2025-0178','PF-2025-0256','PF-2025-0289'], sourceSignals: ['bdi','red_sea'], confidenceScore: 78 } },
  { id: 'pred_steel_margin', title: 'Steel margin erosion — fixed contracts', confidence: 55, confidenceLevel: 'medium',
    description: 'HRC at $1,083/t confirmed. Section 232 tariffs Apr 2 make this structural. NTPC and Tata Power fixed-price contracts already at negative margin.',
    impactLabel: 'Margin risk: 4–7% on ₹246Cr',
    sources: [
      { institution: 'Metals-API / LME', quote: 'HRC Steel at 1,083.10 USD/T on April 13, 2026 — up 15.47% year on year.', date: 'Apr 13, 2026', url: 'https://metals-api.com' },
      { institution: 'SteelRadar', quote: 'On April 2, 2026, sweeping Section 232 tariff changes introduced, with tiered rates from 10% to 50%.', date: 'Apr 6, 2026', url: 'https://www.steelradar.com' }
    ],
    preload: { disruptionTypes: ['material_shortage'], compoundMode: false, affectedOrders: ['PF-2025-0012','PF-2025-0256'], sourceSignals: ['steel_hrc'], confidenceScore: 55 } },
  { id: 'pred_gulf_payment', title: 'Gulf order payment cycle risk', confidence: 35, confidenceLevel: 'low',
    description: 'Geopolitical index critical for 3 Gulf client regions. ADNOC and Saudi Aramco payment cycle falls Jun 15–Jul. Credit review recommended before June.',
    impactLabel: 'Exposure: ₹328Cr at payment risk',
    sources: [
      { institution: 'EIA Open Data', quote: 'Brent crude up 10–13% on Hormuz disruptions; could reach $100/bbl if sustained.', date: 'Apr 2026', url: 'https://www.eia.gov/opendata/' },
      { institution: 'Maersk Advisory', quote: 'ADNOC CEO confirmed on April 9 that the strait was still not open despite the ceasefire.', date: 'Apr 9, 2026', url: 'https://www.maersk.com/news/advisories' }
    ],
    preload: { disruptionTypes: ['demand_change'], compoundMode: false, affectedOrders: ['PF-2025-0178','PF-2025-0301','PF-2025-0112'], sourceSignals: ['hormuz','brent'], confidenceScore: 35 } },
]

const STATIC_TIMELINE: TimelineEvent[] = [
  { id: 'tl_now', severity: 'now', dateLabel: 'Apr 14 — now', description: 'Baltic + Red Sea co-elevated. Hormuz closed. Inbound delays confirmed for May deliveries. Pre-position inventory now.' },
  { id: 'tl_may', severity: 'soon', dateLabel: '~May 2–10', description: 'Material shortage peaks at 78% probability per lag model. Highest risk window for component shortfall at Pune Bay 3.' },
  { id: 'tl_steel', severity: 'soon', dateLabel: '~May 20–Jun 5', description: 'Steel contracts expire. NTPC and Tata Power margin exposure peaks. Re-negotiation window opens.' },
  { id: 'tl_gulf', severity: 'risk', dateLabel: '~Jun 15–Jul', description: 'Gulf payment cycle. ADNOC + Saudi Aramco credit review deadline. If geopolitical index stays elevated, flag for payment hold scenario.' },
]

export function useMarketSignals(): UseMarketSignalsReturn {
  return {
    signals: STATIC_SIGNALS,
    predictions: STATIC_PREDICTIONS,
    knownScenarios: STATIC_KNOWN_SCENARIOS,
    unknownRisks: STATIC_UNKNOWN_RISKS,
    timelineEvents: STATIC_TIMELINE,
    lastUpdated: new Date('2026-04-14T10:30:00'),
    isLoading: false,
    error: null,
  }
}
