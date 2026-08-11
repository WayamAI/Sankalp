export type Severity = 'ok' | 'warn' | 'critical'

export type DisruptionType = 'supplier_delay' | 'demand_change' | 'capacity_loss' | 'material_shortage'

export interface SourceCitation {
  institution: string
  quote: string
  date: string
  url: string
}

export interface MarketSignal {
  id: string
  label: string
  value: string
  delta: string
  severity: Severity
  source: SourceCitation
  lastUpdated: Date
}

export interface ScenarioPreload {
  disruptionTypes: DisruptionType[]
  compoundMode: boolean
  affectedOrders?: string[]
  factory?: 'pune' | 'vadodara' | 'both'
  sourceSignals: string[]
  confidenceScore?: number
}

export interface KnownScenario {
  id: string
  category: 'SUPPLY' | 'DEMAND' | 'CAPACITY' | 'LOGISTICS'
  title: string
  description: string
  frequencyPct: number
  revenueRiskCr: number
}

export interface UnknownRisk {
  id: string
  type: 'known_unknown' | 'unknown_unknown'
  title: string
  description: string
  exposureLabel: string
  probabilityPct: number
  actionLabel: string
  preload: ScenarioPreload
}

export interface PredictedScenario {
  id: string
  title: string
  confidence: number
  confidenceLevel: 'high' | 'medium' | 'low'
  description: string
  impactLabel: string
  sources: SourceCitation[]
  preload: ScenarioPreload
}

export interface TimelineEvent {
  id: string
  severity: 'now' | 'soon' | 'risk'
  dateLabel: string
  description: string
}

export interface UseMarketSignalsReturn {
  signals: MarketSignal[]
  predictions: PredictedScenario[]
  knownScenarios: KnownScenario[]
  unknownRisks: UnknownRisk[]
  timelineEvents: TimelineEvent[]
  lastUpdated: Date
  isLoading: false
  error: null
}
