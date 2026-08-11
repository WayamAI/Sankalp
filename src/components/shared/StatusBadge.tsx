import { type OrderStatus, type Priority } from '@/data/mockData';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  'On Track': 'bg-status-on-track/15 text-status-on-track',
  'At Risk': 'bg-status-at-risk/15 text-status-at-risk',
  'Critical': 'bg-status-critical/15 text-status-critical',
  'Delayed': 'bg-status-delayed/15 text-status-delayed',
  'Completed': 'bg-status-completed/15 text-status-completed',
};

const dotStyles: Record<string, string> = {
  'On Track': 'bg-status-on-track',
  'At Risk': 'bg-status-at-risk',
  'Critical': 'bg-status-critical',
  'Delayed': 'bg-status-delayed',
  'Completed': 'bg-status-completed',
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const baseClass = statusStyles[status] || statusStyles['Completed'];
  const dotClass = dotStyles[status] || dotStyles['Completed'];
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${baseClass} ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
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
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded ${priorityStyles[priority]}`}>
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
      {showLabel && <span className="text-[11px] text-muted-foreground font-mono">{percentage}%</span>}
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
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
      <div className="flex items-center gap-2 mt-1">
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
    info: 'bg-primary',
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles[severity]}`} />;
}
