import { useState, useEffect } from 'react';
import { Mark } from '@/components/ui/mark';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMarketSignals } from '@/hooks/useMarketSignals';
import type { UnknownRisk, KnownScenario, PredictedScenario, ScenarioPreload, MarketSignal } from '@/types/signals';
import { ChevronDown, ChevronUp, ExternalLink, ArrowRight, CheckCircle, AlertTriangle, Shield, Radio } from 'lucide-react';
import RemediationPanel from '@/components/RemediationPanel';

// ─── Mitigation data ───────────────────────────────────────────
const mitigationSteps: Record<string, { dot: string; text: string }[]> = {
  ur_gulf_geo: [
    { dot: '🔴', text: 'Credit review window: ADNOC and Aramco payment cycles fall Jun 15–Jul. Initiate before June.' },
    { dot: '🔴', text: 'Force majeure clause audit: Verify FM definitions on all 3 contracts. Qatar Energy flagged as ambiguous.' },
    { dot: '🟡', text: 'Advance billing: Accelerate milestone billing on PF-2025-0301 (₹148Cr) before Jun window.' },
    { dot: '🟢', text: 'Alternate routing: Qatar Energy delivery can reroute via Mundra–Duqm corridor (14-day additional transit).' },
  ],
  ur_steel_margin: [
    { dot: '🔴', text: 'Price escalation clause: Both contracts lack escalation clauses. Initiate renegotiation with NTPC — April window.' },
    { dot: '🟡', text: 'Procurement timing: Forward-buy 60% of remaining HRC for PF-2025-0012 at current price.' },
    { dot: '🟡', text: 'Scope optimisation: Engineering review material substitution to reduce HRC exposure ~12%.' },
    { dot: '🟢', text: 'Section 232 exemption: Transformer-grade CRGO steel may qualify for BIS-backed exemption. 3–4 week process.' },
  ],
  ur_export_control: [
    { dot: '🟡', text: 'IEC compliance audit: Ensure all Gulf orders have IEC code and DGFT registration current.' },
    { dot: '🟡', text: 'Domestic substitution: Map which Gulf orders can be rerouted to BHEL/NTPC domestic delivery.' },
  ],
  ur_supplier_insolvency: [
    { dot: '🟡', text: 'Second-source qualification: Identify and qualify 1 alternate Tier-2. 6–8 week timeline.' },
    { dot: '🟡', text: 'Safety stock: Build 45-day buffer of single-source component. Current: 12-day coverage.' },
    { dot: '🟢', text: 'Vadodara reroute: Pre-model Bay 4 (Vadodara) for Bay 3 WIP. Reroute feasibility: medium (45% of WIP).' },
  ],
};

const earlyWarningIndicators: Record<string, string[]> = {
  ur_export_control: [
    '⬜ MoD gazette notifications: Monitor for SCOMET list amendments. Weekly cadence.',
    '⬜ DGFT circulars: Subscribe to DGFT policy alert feed — "immediate effect" language = 24h escalation.',
    '⬜ FICCI/CII briefings: Industry back-channels often have 48–72h advance notice.',
  ],
  ur_supplier_insolvency: [
    '⬜ Payment behavior: Payment extension requests from Tier-2 supplier — first signal, 30–90 days before failure.',
    '⬜ Delivery slippage: Partial shipments or substituted lot sizes signal capacity stress.',
    '⬜ Credit bureau monitoring: Enable automated CIBIL/MCA21 alerts for supplier company reg number.',
  ],
};

// ─── Sub-components ─────────────────────────────────────────────

function SourceCitationBlock({ source }: { source: { institution: string; quote: string; date: string; url: string } }) {
  return (
    <div className="bg-muted/40 rounded p-2.5 text-[11px]">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-foreground">{source.institution}</span>
        <span className="text-muted-foreground">{source.date}</span>
      </div>
      <p className="text-muted-foreground italic mb-1">"{source.quote}"</p>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--primary))] flex items-center gap-1 hover:underline">
        Source <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

function SignalPill({ signal }: { signal: MarketSignal }) {
  const colors = {
    ok: 'bg-[hsl(var(--status-on-track))]/10 text-[hsl(var(--status-on-track))] border-[hsl(var(--status-on-track))]/20',
    warn: 'bg-[hsl(var(--status-at-risk))]/10 text-[hsl(var(--status-at-risk))] border-[hsl(var(--status-at-risk))]/20',
    critical: 'bg-[hsl(var(--status-critical))]/10 text-[hsl(var(--status-critical))] border-[hsl(var(--status-critical))]/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border ${colors[signal.severity]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${signal.severity === 'ok' ? 'bg-[hsl(var(--status-on-track))]' : signal.severity === 'warn' ? 'bg-[hsl(var(--status-at-risk))]' : 'bg-[hsl(var(--status-critical))]'}`} />
      {signal.label}: {signal.value}
    </span>
  );
}

// ─── Unknown Risk Card ──────────────────────────────────────────

function UnknownRiskCard({ risk, signals, isAssessmentOpen, onToggleAssessment }: { risk: UnknownRisk; signals: MarketSignal[]; isAssessmentOpen: boolean; onToggleAssessment: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const isKU = risk.type === 'known_unknown';
  const borderColor = isKU ? 'border-l-[hsl(var(--status-at-risk))]' : 'border-l-[hsl(var(--status-critical))]';
  const probColor = isKU ? 'text-[hsl(var(--status-at-risk))]' : 'text-[hsl(var(--status-critical))]';
  const badgeBg = isKU ? 'bg-[hsl(var(--status-at-risk))]/10 text-[hsl(var(--status-at-risk))]' : 'bg-[hsl(var(--status-critical))]/10 text-[hsl(var(--status-critical))]';

  const linkedSignals = risk.preload.sourceSignals.map(id => signals.find(s => s.id === id)).filter(Boolean) as MarketSignal[];
  const steps = mitigationSteps[risk.id] || [];
  const warnings = earlyWarningIndicators[risk.id];

  return (
    <div className={`metric-card border-l-[3px] ${borderColor} ${isAssessmentOpen ? 'border-[1.5px] border-primary rounded-b-none' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badgeBg}`}>
            {isKU ? 'Known Unknown' : 'Unknown Unknown'}
          </span>
          <h3 className="text-[15px] font-medium text-foreground">{risk.title}</h3>
        </div>
        <span className={`font-display text-display-metric tabular-nums ${probColor}`}>{risk.probabilityPct}%</span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">{risk.description}</p>

      {/* Steel margin active alert */}
      {risk.id === 'ur_steel_margin' && (
        <div className="flex items-center gap-2 bg-[hsl(var(--status-critical))]/8 border border-[hsl(var(--status-critical))]/20 rounded p-2.5 mb-3">
          <AlertTriangle className="w-4 h-4 text-[hsl(var(--status-critical))] flex-shrink-0" />
          <span className="text-xs font-medium text-[hsl(var(--status-critical))]">Active — margin compression confirmed</span>
        </div>
      )}

      {/* Export control unquantifiable block */}
      {risk.id === 'ur_export_control' && (
        <div className="bg-muted/50 border border-border rounded p-2.5 mb-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Why this is unquantifiable</p>
          <p className="text-[11px] text-muted-foreground">Regulatory black swans have no base rate in transformer manufacturing history. The event space is unbounded — any DGFT/MoD directive could create novel constraints with zero precedent for probability estimation.</p>
        </div>
      )}

      {/* Supplier insolvency blast radius */}
      {risk.id === 'ur_supplier_insolvency' && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-muted/50 border border-border rounded p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Blast radius</p>
            <p className="text-xs text-foreground font-medium">Pune Bay 3 — full halt</p>
          </div>
          <div className="bg-muted/50 border border-border rounded p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Recovery time</p>
            <p className="text-xs text-foreground font-medium">14–30 days min</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Exposure</p>
          <p className="text-xs font-semibold text-foreground">{risk.exposureLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Probability bar */}
          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isKU ? 'bg-[hsl(var(--status-at-risk))]' : 'bg-[hsl(var(--status-critical))]'}`}
              style={{ width: `${risk.probabilityPct}%` }}
            />
          </div>
          <button
            onClick={onToggleAssessment}
            className={`text-[10px] px-3 py-1.5 rounded font-medium ${isAssessmentOpen ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground'}`}
          >
            {isAssessmentOpen ? 'Assessing impact...' : 'Assess impact'}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-muted rounded">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Expandable drawer */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3">
          {/* Linked signals */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Linked market signals</p>
            {linkedSignals.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {linkedSignals.map(s => <SignalPill key={s.id} signal={s} />)}
                </div>
                {linkedSignals.map(s => <SourceCitationBlock key={s.id} source={s.source} />)}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground italic">No linked signals — black swan</p>
            )}
          </div>

          {/* Early warning indicators for black swans */}
          {warnings && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {risk.id === 'ur_export_control' ? 'Early warning indicators' : 'Financial distress early indicators'}
              </p>
              <div className="space-y-1.5">
                {warnings.map((w, i) => (
                  <p key={i} className="text-[11px] text-muted-foreground">{w}</p>
                ))}
              </div>
            </div>
          )}

          {/* Affected orders */}
          {risk.preload.affectedOrders && risk.preload.affectedOrders.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Affected orders</p>
              <div className="flex flex-wrap gap-1.5">
                {risk.preload.affectedOrders.map(o => (
                  <span key={o} className="font-mono text-[10px] px-2 py-1 bg-muted rounded border border-border text-foreground">{o}</span>
                ))}
              </div>
            </div>
          )}

          {/* Mitigation / resilience steps */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {risk.id === 'ur_export_control' ? 'Contingency pre-positioning' : risk.id === 'ur_supplier_insolvency' ? 'Structural resilience actions' : 'Mitigation steps'}
            </p>
            <div className="space-y-1.5">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <span className="flex-shrink-0">{s.dot}</span>
                  <span className="text-foreground">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulator scope */}
          <div className="bg-muted/30 rounded p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Simulator scope</p>
            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
              <span>Mode: {risk.preload.compoundMode ? 'Compound' : 'Single'}</span>
              <span>•</span>
              <span>Factory: {risk.preload.factory || 'all'}</span>
              <span>•</span>
              <span>Types: {risk.preload.disruptionTypes.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Known Scenario Card ────────────────────────────────────────

const categoryColors: Record<string, string> = {
  SUPPLY: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  DEMAND: 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/20',
  CAPACITY: 'bg-[hsl(var(--status-at-risk))]/10 text-[hsl(var(--status-at-risk))] border-[hsl(var(--status-at-risk))]/20',
  LOGISTICS: 'bg-[hsl(var(--status-critical))]/10 text-[hsl(var(--status-critical))] border-[hsl(var(--status-critical))]/20',
};

function KnownScenarioCard({ scenario, selected, onToggle }: { scenario: KnownScenario; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`metric-card text-left w-full transition-all ${selected ? 'ring-2 ring-[hsl(var(--primary))] border-[hsl(var(--primary))]' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[scenario.category]}`}>
          {scenario.category}
        </span>
        {selected && <CheckCircle className="w-4 h-4 text-[hsl(var(--primary))]" />}
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{scenario.title}</h3>
      <p className="text-[11px] text-muted-foreground mb-3">{scenario.description}</p>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-muted-foreground">Frequency</span>
            <span className="font-medium text-foreground">{scenario.frequencyPct}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[hsl(var(--status-at-risk))] rounded-full" style={{ width: `${scenario.frequencyPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-muted-foreground">Revenue risk</span>
            <span className="font-medium text-foreground">₹{scenario.revenueRiskCr}Cr</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[hsl(var(--status-critical))] rounded-full" style={{ width: `${(scenario.revenueRiskCr / 60) * 100}%` }} />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function ScenarioIntelligence() {
  const navigate = useNavigate();
  const { signals, predictions, knownScenarios, unknownRisks, timelineEvents, lastUpdated } = useMarketSignals();

  const [activeTab, setActiveTab] = useState<'known' | 'unknown' | 'predictions'>('unknown');
  const [riskFilter, setRiskFilter] = useState<'all' | 'known_unknown' | 'unknown_unknown' | 'high'>('all');
  const [selectedKnown, setSelectedKnown] = useState<Set<string>>(new Set());
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null);
  const [expandedPrediction, setExpandedPrediction] = useState<string | null>(null);
  const [assessmentOpenId, setAssessmentOpenId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, 'a' | 'b' | 'c'>>({});
  const [committedIds, setCommittedIds] = useState<Set<string>>(new Set());

  function toggleAssessment(riskId: string) {
    setAssessmentOpenId(prev => prev === riskId ? null : riskId);
  }
  function selectOption(riskId: string, opt: 'a' | 'b' | 'c') {
    setSelectedOptions(prev => ({ ...prev, [riskId]: opt }));
  }
  function commitPlan(riskId: string) {
    setCommittedIds(prev => new Set([...prev, riskId]));
  }

  useEffect(() => {
    if (!assessmentOpenId) return;
    const el = document.getElementById(`sim-${assessmentOpenId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [assessmentOpenId]);

  const filteredRisks = unknownRisks.filter(r => {
    if (riskFilter === 'all') return true;
    if (riskFilter === 'high') return r.probabilityPct > 50;
    return r.type === riskFilter;
  });

  const kuCount = unknownRisks.filter(r => r.type === 'known_unknown').length;
  const uuCount = unknownRisks.filter(r => r.type === 'unknown_unknown').length;

  const toggleKnown = (id: string) => {
    setSelectedKnown(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const minsAgo = Math.round((Date.now() - lastUpdated.getTime()) / 60000);
  const updatedLabel = minsAgo > 0 && minsAgo < 10000 ? `Updated ${minsAgo}m ago` : 'Updated 4m ago';

  const compoundPreload: ScenarioPreload = {
    disruptionTypes: ['supplier_delay', 'demand_change', 'capacity_loss', 'material_shortage'],
    compoundMode: true,
    factory: 'both',
    sourceSignals: ['bdi', 'steel_hrc', 'hormuz', 'red_sea', 'brent'],
    confidenceScore: 78,
  };

  const tabs = [
    { key: 'known' as const, label: 'Known scenarios' },
    { key: 'unknown' as const, label: 'Unknown risks' },
    { key: 'predictions' as const, label: 'Market predictions' },
  ];

  const filterChips = [
    { key: 'all' as const, label: 'All risks' },
    { key: 'known_unknown' as const, label: 'Known unknowns' },
    { key: 'unknown_unknown' as const, label: 'Unknown unknowns' },
    { key: 'high' as const, label: 'High probability (>50%)' },
  ];

  const severityBarColor = (s: MarketSignal['severity']) =>
    s === 'ok' ? 'bg-[hsl(var(--status-on-track))]' : s === 'warn' ? 'bg-[hsl(var(--status-at-risk))]' : 'bg-[hsl(var(--status-critical))]';

  const timelinePipColor = (s: string) =>
    s === 'now' ? 'bg-[hsl(var(--primary))]' : s === 'soon' ? 'bg-[hsl(var(--status-at-risk))]' : 'bg-[hsl(var(--status-critical))]';

  const confBorderColor = (c: number) =>
    c >= 70 ? 'border-l-[hsl(var(--status-critical))]' : c >= 40 ? 'border-l-[hsl(var(--status-at-risk))]' : 'border-l-[hsl(var(--status-on-track))]';

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3"><Mark name="scenario-intelligence" size={44} /><h1 className="font-display text-display-xl text-foreground">Scenario Intelligence</h1></div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--status-on-track))] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--status-on-track))]" />
              </span>
              <span className="text-xs text-[hsl(var(--status-on-track))] font-medium">Live market data</span>
            </div>
            <span className="text-xs text-muted-foreground">{updatedLabel}</span>
          </div>
          <button
            onClick={() => navigate('/simulate', { state: { scenarioPreload: compoundPreload } })}
            className="text-xs px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90 flex items-center gap-1.5"
          >
            Feed into Simulator <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-md w-fit">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all ${activeTab === t.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════ TAB: UNKNOWN RISKS ═══════ */}
        {activeTab === 'unknown' && (
          <div className="space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="metric-card text-center">
                <p className="font-display text-display-metric tabular-nums text-foreground">{unknownRisks.length}</p>
                <p className="text-[11px] text-muted-foreground">Active risk scenarios tracked</p>
              </div>
              <div className="metric-card text-center border-l-2 border-l-[hsl(var(--status-at-risk))]">
                <p className="font-display text-display-metric tabular-nums text-[hsl(var(--status-at-risk))]">{kuCount}</p>
                <p className="text-[11px] text-muted-foreground">Known unknowns — quantifiable</p>
              </div>
              <div className="metric-card text-center border-l-2 border-l-[hsl(var(--status-critical))]">
                <p className="font-display text-display-metric tabular-nums text-[hsl(var(--status-critical))]">{uuCount}</p>
                <p className="text-[11px] text-muted-foreground">Unknown unknowns — black swan</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--status-at-risk))]" />
                Known unknown — risk exists, unquantified
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--status-critical))]" />
                Unknown unknown — black swan category
              </span>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2">
              {filterChips.map(f => (
                <button
                  key={f.key}
                  onClick={() => setRiskFilter(f.key)}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${riskFilter === f.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-foreground/30'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Risk cards */}
            <div className="space-y-3">
              {filteredRisks.map(r => (
                <div key={r.id} className="flex flex-col gap-0.5">
                  <UnknownRiskCard
                    risk={r}
                    signals={signals}
                    isAssessmentOpen={assessmentOpenId === r.id}
                    onToggleAssessment={() => toggleAssessment(r.id)}
                  />
                  {assessmentOpenId === r.id && (
                    <RemediationPanel
                      risk={r}
                      signals={signals}
                      selectedOption={selectedOptions[r.id] ?? null}
                      isCommitted={committedIds.has(r.id)}
                      onSelectOption={(opt) => selectOption(r.id, opt)}
                      onCommit={() => commitPlan(r.id)}
                      onClose={() => setAssessmentOpenId(null)}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Compound footer */}
            <div className="metric-card border-t-2 border-t-[hsl(var(--status-critical))]">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[hsl(var(--status-critical))] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Compound scenario: all unknowns active simultaneously</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    In a compound scenario where Gulf geopolitics escalate, steel costs remain elevated, and a regulatory event occurs concurrently — combined revenue exposure exceeds ₹900Cr. This is a non-linear risk: mitigating one does not reduce others.
                  </p>
                  <button
                    onClick={() => navigate('/simulate', { state: { scenarioPreload: compoundPreload } })}
                    className="w-full text-xs py-2.5 bg-primary text-primary-foreground rounded font-medium hover:opacity-90"
                  >
                    Build compound contingency plan →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ TAB: KNOWN SCENARIOS ═══════ */}
        {activeTab === 'known' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {knownScenarios.map(s => (
                <KnownScenarioCard key={s.id} scenario={s} selected={selectedKnown.has(s.id)} onToggle={() => toggleKnown(s.id)} />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="metric-card text-center">
                <p className="font-display text-display-metric tabular-nums text-foreground">23</p>
                <p className="text-[11px] text-muted-foreground">Disruptions last 12 months</p>
              </div>
              <div className="metric-card text-center border-l-2 border-l-[hsl(var(--status-at-risk))]">
                <p className="font-display text-display-metric tabular-nums text-[hsl(var(--status-at-risk))]">14</p>
                <p className="text-[11px] text-muted-foreground">Had advance warning signals</p>
              </div>
              <div className="metric-card text-center border-l-2 border-l-[hsl(var(--status-critical))]">
                <p className="font-display text-display-metric tabular-nums text-[hsl(var(--status-critical))]">9</p>
                <p className="text-[11px] text-muted-foreground">Blindsided — no signal</p>
              </div>
            </div>

            <button
              disabled={selectedKnown.size === 0}
              onClick={() => {
                const selected = knownScenarios.filter(s => selectedKnown.has(s.id));
                const dtMap: Record<string, 'supplier_delay' | 'demand_change' | 'capacity_loss' | 'material_shortage'> = {
                  SUPPLY: 'supplier_delay', DEMAND: 'demand_change', CAPACITY: 'capacity_loss', LOGISTICS: 'material_shortage',
                };
                const preload: ScenarioPreload = {
                  disruptionTypes: [...new Set(selected.map(s => dtMap[s.category]))],
                  compoundMode: selected.length > 1,
                  sourceSignals: [],
                  factory: 'both',
                };
                navigate('/simulate', { state: { scenarioPreload: preload } });
              }}
              className={`w-full text-xs py-2.5 rounded font-medium transition-all ${selectedKnown.size > 0 ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
            >
              {selectedKnown.size > 0 ? `Load ${selectedKnown.size} selected into simulator →` : 'Load selected into simulator →'}
            </button>
          </div>
        )}

        {/* ═══════ TAB: MARKET PREDICTIONS ═══════ */}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {/* Section A: Live market signals */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Live market signals — threshold monitoring</h2>
              <div className="metric-card p-0 overflow-hidden">
                {signals.map((s, i) => (
                  <div key={s.id}>
                    <button
                      onClick={() => setExpandedSignal(expandedSignal === s.id ? null : s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/30 transition-colors ${i > 0 ? 'border-t border-stroke-muted' : ''}`}
                    >
                      <span className="text-xs font-medium text-foreground w-40 flex-shrink-0">{s.label}</span>
                      <span className="text-xs font-bold text-foreground w-24">{s.value}</span>
                      <span className="text-[11px] text-muted-foreground flex-1">{s.delta}</span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden flex-shrink-0">
                        <div className={`h-full rounded-full ${severityBarColor(s.severity)}`} style={{ width: s.severity === 'ok' ? '30%' : s.severity === 'warn' ? '65%' : '100%' }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-28 text-right flex-shrink-0">{s.source.institution}</span>
                      {expandedSignal === s.id ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {expandedSignal === s.id && (
                      <div className="px-4 pb-3 pt-1">
                        <SourceCitationBlock source={s.source} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Signal-driven predictions */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Signal-driven scenario predictions</h2>
              <div className="space-y-2">
                {predictions.map(p => (
                  <div key={p.id} className={`metric-card border-l-[3px] ${confBorderColor(p.confidence)}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground">{p.title}</h3>
                      <span className={`text-lg font-bold ${p.confidence >= 70 ? 'text-[hsl(var(--status-critical))]' : p.confidence >= 40 ? 'text-[hsl(var(--status-at-risk))]' : 'text-[hsl(var(--status-on-track))]'}`}>
                        {p.confidence}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground">{p.impactLabel}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate('/simulate', { state: { scenarioPreload: p.preload } })}
                          className="text-[10px] px-3 py-1.5 bg-primary text-primary-foreground rounded font-medium hover:opacity-90"
                        >
                          Inject into simulator →
                        </button>
                        <button onClick={() => setExpandedPrediction(expandedPrediction === p.id ? null : p.id)} className="p-1 hover:bg-muted rounded">
                          {expandedPrediction === p.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                    </div>
                    {expandedPrediction === p.id && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Sources</p>
                        {p.sources.map((src, i) => <SourceCitationBlock key={i} source={src} />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Timeline */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Predictive disruption timeline — next 90 days</h2>
              <div className="metric-card">
                <div className="space-y-0">
                  {timelineEvents.map((ev, i) => (
                    <div key={ev.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${timelinePipColor(ev.severity)} flex-shrink-0 mt-0.5`} />
                        {i < timelineEvents.length - 1 && <div className="w-px flex-1 bg-border min-h-[40px]" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-xs font-semibold text-foreground">{ev.dateLabel}</p>
                        <p className="text-[11px] text-muted-foreground">{ev.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/simulate', { state: { scenarioPreload: compoundPreload } })}
                className="w-full mt-3 text-xs py-2.5 bg-primary text-primary-foreground rounded font-medium hover:opacity-90"
              >
                Build full contingency plan →
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
