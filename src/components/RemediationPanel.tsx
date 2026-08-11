import { Radio, X, CheckCircle } from 'lucide-react';
import type { UnknownRisk, MarketSignal } from '@/types/signals';
import type { RemediationOption } from '@/types/remediationTypes';
import { REMEDIATION_DATA } from '@/data/remediationOptions';

interface RemediationPanelProps {
  risk: UnknownRisk;
  signals: MarketSignal[];
  selectedOption: 'a' | 'b' | 'c' | null;
  isCommitted: boolean;
  onSelectOption: (opt: 'a' | 'b' | 'c') => void;
  onCommit: () => void;
  onClose: () => void;
}

const directionColor = (d: string) => {
  if (d === 'positive') return 'text-[hsl(var(--status-on-track))]';
  if (d === 'warning') return 'text-[hsl(var(--status-at-risk))]';
  if (d === 'negative') return 'text-[hsl(var(--status-critical))]';
  return 'text-foreground';
};

const urgencyStyle = (u: string) => {
  if (u === 'today') return 'bg-[hsl(var(--status-critical))]/10 text-[hsl(var(--status-critical))]';
  if (u === 'this_week') return 'bg-[hsl(var(--status-at-risk))]/10 text-[hsl(var(--status-at-risk))]';
  if (u === 'this_month') return 'bg-[hsl(var(--status-on-track))]/10 text-[hsl(var(--status-on-track))]';
  return 'bg-primary/10 text-primary';
};

const urgencyLabel = (u: string) => {
  if (u === 'today') return 'Today';
  if (u === 'this_week') return 'This week';
  if (u === 'this_month') return 'This month';
  return 'Ongoing';
};

const optionPillStyle = (id: 'a' | 'b' | 'c') => {
  if (id === 'a') return 'bg-[hsl(var(--status-on-track))]/10 text-[hsl(var(--status-on-track))]';
  if (id === 'b') return 'bg-primary/10 text-primary';
  return 'bg-[hsl(var(--status-at-risk))]/10 text-[hsl(var(--status-at-risk))]';
};

const postureStyle = (posture: string) => {
  if (posture === 'Recommended') return 'bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-medium';
  if (posture === 'Lowest risk' || posture === 'Lowest cost' || posture === 'Fastest')
    return 'text-[hsl(var(--status-on-track))] text-[10px] font-medium';
  return 'text-[hsl(var(--status-at-risk))] text-[10px] font-medium';
};

// Confirmation messages per risk
const confirmMessages: Record<string, string> = {
  ur_steel_margin: '8 action items added · Pune Bay 2 updated · NTPC notified',
  ur_gulf_geo: 'Option committed · Gulf orders updated · Credit review initiated',
  ur_supplier_insolvency: 'PO raised · Bay 3 schedule updated · Second-source initiated',
  ur_export_control: 'Monitoring activated · IEC compliance audit scheduled',
};

function OptionCard({
  option,
  isSelected,
  onSelect,
}: {
  option: RemediationOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`metric-card transition-all ${
        isSelected ? 'border-[1.5px] border-primary ring-1 ring-primary/20' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${optionPillStyle(option.id)}`}>
          {option.label}
        </span>
        <span className={postureStyle(option.posture)}>{option.posture}</span>
      </div>

      {/* Title + description */}
      <h4 className="text-xs font-medium text-foreground mb-1">{option.title}</h4>
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{option.description}</p>

      {/* Metrics 2×2 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {option.metrics.map((m, i) => (
          <div key={i}>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
            <p className={`text-xs font-medium ${directionColor(m.direction)}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Impact categories */}
      <div className="flex flex-wrap gap-1 mb-3">
        {option.impactCategories.map((c, i) => (
          <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {c}
          </span>
        ))}
      </div>

      {/* Select button */}
      <button
        onClick={onSelect}
        className={`w-full text-[11px] py-2 rounded font-medium transition-all ${
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground'
        }`}
      >
        {isSelected ? 'Selected ✓' : 'Select'}
      </button>
    </div>
  );
}

export default function RemediationPanel({
  risk,
  signals,
  selectedOption,
  isCommitted,
  onSelectOption,
  onCommit,
  onClose,
}: RemediationPanelProps) {
  const remediationData = REMEDIATION_DATA.find(r => r.riskId === risk.id);
  if (!remediationData) return null;

  const options = remediationData.options;
  const activeOption = selectedOption ? options.find(o => o.id === selectedOption) : null;

  // Resolve linked signals
  const linkedSignals = risk.preload.sourceSignals
    .map(id => signals.find(s => s.id === id))
    .filter(Boolean) as MarketSignal[];

  const factoryLabel = risk.preload.factory === 'pune' ? 'Plant: Pune' : risk.preload.factory === 'vadodara' ? 'Plant: Vadodara' : risk.preload.factory === 'both' ? 'Plant: Both' : null;

  return (
    <div
      id={`sim-${risk.id}`}
      className="bg-card border border-t-0 border-border rounded-b-lg overflow-hidden animate-fade-in"
    >
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span className="text-[12px] font-medium text-foreground">Impact assessment — {risk.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Running on live J2W data
          </span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* ── SCOPE BAR ── */}
      <div className="flex flex-wrap gap-1.5 px-4 py-2.5 bg-primary/[0.02] border-b border-primary/10">
        {linkedSignals.map(s => (
          <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-primary/20 text-primary font-medium">
            {s.label}: {s.value}
          </span>
        ))}
        {risk.preload.affectedOrders?.map(o => (
          <span key={o} className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-card border border-primary/20 text-primary">
            {o}
          </span>
        ))}
        {factoryLabel && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-primary/20 text-primary font-medium">
            {factoryLabel}
          </span>
        )}
        {risk.preload.compoundMode && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-card border border-primary/20 text-primary font-medium">
            Compound mode
          </span>
        )}
      </div>

      {/* ── OPTIONS SECTION ── */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-xs font-medium text-foreground mb-1">Choose a remediation path</h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Claude modelled 3 options against live J2W production data. Select one to see the full action plan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {options.map(opt => (
            <OptionCard
              key={opt.id}
              option={opt}
              isSelected={selectedOption === opt.id}
              onSelect={() => onSelectOption(opt.id)}
            />
          ))}
        </div>
      </div>

      {/* ── IMPACT PREVIEW ── */}
      {activeOption && (
        <div className="mx-4 mb-3 border-t border-border pt-4">
          <h3 className="text-[11px] font-medium text-foreground mb-1">
            {activeOption.label} — projected production impact
          </h3>
          <p className="text-[10px] text-muted-foreground mb-3">
            Based on live bay schedule, inventory and order data
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {activeOption.projectedImpact.map((imp, i) => (
              <div key={i} className="bg-card border border-border rounded-md p-2.5">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{imp.label}</p>
                <p className={`text-xs font-medium ${directionColor(imp.direction)}`}>{imp.value}</p>
                <p className="text-[10px] text-muted-foreground">{imp.delta}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTION PLAN ── */}
      {activeOption && (
        <div className="mx-4 mb-3 border-t border-border pt-4">
          <h3 className="text-xs font-medium text-foreground mb-3">
            {activeOption.label} — action plan ({activeOption.actionPlan.length} steps)
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            {activeOption.actionPlan.map((step, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-3 py-2.5 ${i > 0 ? 'border-t border-border' : ''}`}
              >
                {/* Step number */}
                <div className="w-[22px] h-[22px] rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{step.detail}</p>
                </div>

                {/* Due */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${urgencyStyle(step.urgency)}`}>
                    {urgencyLabel(step.urgency)}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{step.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COMMITTED BANNER ── */}
      {isCommitted && activeOption && (
        <div className="mx-4 mb-3 flex items-center gap-3 bg-[hsl(var(--status-on-track))]/8 border border-[hsl(var(--status-on-track))]/20 rounded-lg px-4 py-3">
          <CheckCircle className="w-[18px] h-[18px] text-[hsl(var(--status-on-track))] flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-[hsl(var(--status-on-track))]">Committed to production plan</p>
            <p className="text-[11px] text-[hsl(var(--status-on-track))]/80">
              {confirmMessages[risk.id] || activeOption.commitMessage}
            </p>
          </div>
        </div>
      )}

      {/* ── PANEL FOOTER ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t border-border">
        <p className="text-[11px] text-muted-foreground">
          {activeOption ? `${activeOption.label} — ${activeOption.title}` : 'No option selected'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-[11px] px-3 py-1.5 bg-card text-muted-foreground border border-border rounded font-medium hover:text-foreground hover:border-foreground/30"
          >
            Discard
          </button>
          {isCommitted ? (
            <button
              disabled
              className="text-[11px] px-3 py-1.5 bg-[hsl(var(--status-on-track))] text-white rounded font-medium opacity-90 cursor-not-allowed"
            >
              Committed ✓
            </button>
          ) : (
            <button
              disabled={!selectedOption}
              onClick={onCommit}
              className={`text-[11px] px-3 py-1.5 rounded font-medium transition-all ${
                selectedOption
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Commit to production plan →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
