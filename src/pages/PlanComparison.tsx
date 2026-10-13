import { AppLayout } from '@/components/layout/AppLayout';

const metrics = [
  { label: 'On-Time Delivery %', current: '86.7%', optA: '84.2%', optADelta: '↓ 2.5%', optB: '83.9%', optBDelta: '↓ 2.8%' },
  { label: 'Revenue at Risk', current: '₹142 Cr', optA: '₹154 Cr', optADelta: '↑ ₹12 Cr', optB: '₹168 Cr', optBDelta: '↑ ₹26 Cr' },
  { label: 'Pune Utilization', current: '87%', optA: '82%', optADelta: '↓ 5%', optB: '91%', optBDelta: '↑ 4%' },
  { label: 'Vadodara Utilization', current: '68%', optA: '74%', optADelta: '↑ 6%', optB: '68%', optBDelta: '→' },
  { label: 'Orders Delayed', current: '41', optA: '44', optADelta: '↑ 3', optB: '47', optBDelta: '↑ 6' },
  { label: 'Overtime Hours', current: '0', optA: '120 hrs', optADelta: '+120', optB: '240 hrs', optBDelta: '+240' },
  { label: 'Additional Cost', current: '—', optA: '₹18L', optADelta: '', optB: '₹42L', optBDelta: '' },
];

const getDeltaColor = (delta: string) => {
  if (delta.includes('↓') || delta.includes('+')) {
    if (delta.includes('Utilization') || delta.includes('↑')) return '';
  }
  if (delta.includes('↑') && !delta.includes('Utilization')) return 'text-status-critical';
  if (delta.includes('↓')) return 'text-status-critical';
  return 'text-muted-foreground';
};

export default function PlanComparison() {
  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="font-display text-display-xl text-foreground mb-5">Plan Comparison</h2>

        <div className="metric-card mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Side-by-Side KPI Comparison</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Current Plan</th>
                <th>Scenario: Bharat Forge Delay (Opt A)</th>
                <th>Scenario: NTPC Pull-In (Opt B)</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={i} className="cursor-default">
                  <td className="text-xs font-medium">{m.label}</td>
                  <td className="text-xs font-mono font-medium">{m.current}</td>
                  <td className="text-xs">
                    <span className="font-mono font-medium">{m.optA}</span>
                    {m.optADelta && <span className="ml-1.5 text-[10px] text-status-critical">({m.optADelta})</span>}
                  </td>
                  <td className="text-xs">
                    <span className="font-mono font-medium">{m.optB}</span>
                    {m.optBDelta && <span className="ml-1.5 text-[10px] text-status-critical">({m.optBDelta})</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="metric-card">
          <h3 className="text-xs font-semibold text-foreground mb-3">Timeline Comparison</h3>
          <p className="text-xs text-muted-foreground">Select a scenario above to view Gantt comparison with change highlighting.</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Current Plan</p>
              <div className="h-8 bg-muted/30 rounded relative">
                <div className="absolute left-[5%] top-1 h-6 w-[30%] bg-status-on-track rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium">PF-2025-0012 NTPC</div>
                <div className="absolute left-[40%] top-1 h-6 w-[25%] bg-status-at-risk rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium">PF-2025-0178 ADNOC</div>
                <div className="absolute left-[68%] top-1 h-6 w-[28%] bg-status-at-risk rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium">PF-2025-0256 Tata</div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Scenario A — Bharat Forge Delay</p>
              <div className="h-8 bg-muted/30 rounded relative">
                <div className="absolute left-[5%] top-1 h-6 w-[30%] bg-status-on-track rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium">PF-2025-0012 NTPC</div>
                <div className="absolute left-[42%] top-1 h-6 w-[25%] bg-status-critical rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium border-2 border-status-critical">PF-2025-0178 +8d</div>
                <div className="absolute left-[72%] top-1 h-6 w-[28%] bg-status-critical rounded-sm flex items-center px-2 text-[9px] text-primary-foreground font-medium border-2 border-status-critical">PF-2025-0256 +14d</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
