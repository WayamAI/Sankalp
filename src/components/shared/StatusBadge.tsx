import { type OrderStatus, type Priority } from '@/data/mockData';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  'On Track': 'bg-feedback-success-background text-success',
  'At Risk': 'bg-feedback-warning-background text-warning',
  'Critical': 'bg-feedback-error-background text-error',
  'Delayed': 'bg-feedback-error-background text-error',
  'Completed': 'bg-feedback-neutral-background text-feedback-neutral',
};

const dotStyles: Record<string, string> = {
  'On Track': 'bg-feedback-success-icon',
  'At Risk': 'bg-feedback-warning-icon',
  'Critical': 'bg-feedback-error-icon',
  'Delayed': 'bg-status-delayed',
  'Completed': 'bg-feedback-neutral-icon',
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const baseClass = statusStyles[status] || statusStyles['Completed'];
  const dotClass = dotStyles[status] || dotStyles['Completed'];
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${baseClass} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      {status}
    </span>
  );
}

interface PriorityTagProps {
  priority: Priority;
}

const priorityStyles: Record<Priority, string> = {
  P1: 'bg-priority-p1/15 text-priority-p1',
  P2: 'bg-priority-p2/15 text-priority-p2',
  P3: 'bg-priority-p3/15 text-priority-p3',
  P4: 'bg-priority-p4/15 text-priority-p4',
};

export function PriorityTag({ priority }: PriorityTagProps) {
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold tabular-nums whitespace-nowrap px-2 py-0.5 rounded-md ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

interface MaterialBarProps {
  percentage: number;
  showLabel?: boolean;
}

export function MaterialBar({ percentage, showLabel = true }: MaterialBarProps) {
  const color = percentage > 85 ? 'bg-status-on-track' : percentage > 60 ? 'bg-status-at-risk' : 'bg-status-critical';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && <span className="text-[11px] text-muted-foreground font-mono tabular-nums">{percentage}%</span>}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, subtitle, delta, deltaType = 'neutral', icon }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        {icon && <div className="text-icon-tertiary">{icon}</div>}
      </div>
      <p className="font-display text-display-metric tabular-nums mt-2 text-foreground">{value}</p>
      <div className="flex items-center gap-2 mt-1.5">
        {delta && (
          <span className={deltaType === 'positive' ? 'kpi-delta-positive' : deltaType === 'negative' ? 'kpi-delta-negative' : 'text-xs text-muted-foreground'}>
            {delta}
          </span>
        )}
        {subtitle && <span className="text-[11px] text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}

interface SeverityIndicatorProps {
  severity: 'critical' | 'warning' | 'info';
}

export function SeverityIndicator({ severity }: SeverityIndicatorProps) {
  const styles = {
    critical: 'bg-status-critical',
    warning: 'bg-status-at-risk',
    info: 'bg-feedback-info-icon',
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles[severity]}`} />;
}
