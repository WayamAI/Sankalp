import { AppLayout } from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const allocations = [
  { orderId: 'PF-2025-0112', customer: 'Qatar Energy LNG', product: 'GT-9500E', recommended: 'Pune', reason: 'Bay 3 has GT-9500 tooling. Pune has rotor assembly capability.', alternative: 'Vadodara (requires tooling transfer, +3 weeks)', impact: 'Pune utilization → 91% (Week 28-34)', confidence: 92 },
  { orderId: 'PF-2025-0223', customer: 'Larsen & Toubro EPC', product: 'ST-4000C', recommended: 'Vadodara', reason: 'Steam turbine line available. Vadodara has capacity headroom.', alternative: 'Pune (Bay 4 available but suboptimal for ST assembly)', impact: 'Vadodara utilization → 76% (Week 30-38)', confidence: 88 },
  { orderId: 'PF-2025-0340', customer: 'JSW Energy', product: 'GT-7000F', recommended: 'Pune', reason: 'GT-7000 tooling at Bay 1. Aligns with Adani batch completion.', alternative: 'Vadodara (requires tooling, +3 weeks setup)', impact: 'Pune utilization → 89% (Week 36-42)', confidence: 85 },
];

const loadData = [
  { month: 'Apr', pune: 87, vadodara: 68 },
  { month: 'May', pune: 89, vadodara: 72 },
  { month: 'Jun', pune: 91, vadodara: 70 },
  { month: 'Jul', pune: 88, vadodara: 74 },
  { month: 'Aug', pune: 85, vadodara: 76 },
  { month: 'Sep', pune: 82, vadodara: 78 },
];

export default function MultiPlantAllocation() {
  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="font-display text-display-xl text-foreground mb-5">Multi-Plant Allocation</h2>

        <div className="metric-card mb-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Allocation Recommendations</h3>
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Recommended</th><th>Reason</th><th>Alternative</th><th>Impact</th><th>Conf.</th><th>Action</th></tr></thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.orderId} className="cursor-default">
                  <td className="font-mono text-xs text-primary">{a.orderId}</td>
                  <td className="text-xs">{a.customer}</td>
                  <td className="text-[11px] text-muted-foreground">{a.product}</td>
                  <td className="text-xs font-medium text-foreground">{a.recommended}</td>
                  <td className="text-[10px] text-muted-foreground max-w-[200px]">{a.reason}</td>
                  <td className="text-[10px] text-muted-foreground max-w-[160px]">{a.alternative}</td>
                  <td className="text-[10px] text-muted-foreground">{a.impact}</td>
                  <td className="text-xs font-mono">{a.confidence}%</td>
                  <td className="space-x-1" onClick={e => e.stopPropagation()}>
                    <button onClick={() => toast.success('Recommendation accepted')} className="text-[10px] px-2 py-1 bg-primary text-primary-foreground rounded">Accept</button>
                    <button onClick={() => toast.info('Override mode')} className="text-[10px] px-2 py-1 border rounded text-muted-foreground">Override</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="metric-card">
          <h3 className="text-xs font-semibold text-foreground mb-3">Factory Load Balance — Next 6 Months</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={loadData} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <ReferenceLine y={70} stroke="hsl(var(--status-on-track))" strokeDasharray="3 3" label={{ value: '70%', fontSize: 9, fill: 'hsl(var(--status-on-track))' }} />
              <ReferenceLine y={90} stroke="hsl(var(--status-critical))" strokeDasharray="3 3" label={{ value: '90%', fontSize: 9, fill: 'hsl(var(--status-critical))' }} />
              <Bar dataKey="pune" fill="hsl(var(--chart-series-1))" name="Pune" radius={[2,2,0,0]} />
              <Bar dataKey="vadodara" fill="hsl(var(--chart-series-3))" name="Vadodara" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-2 rounded-sm bg-[hsl(var(--chart-series-1))]" />Pune</span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-2 rounded-sm bg-[hsl(var(--chart-series-3))]" />Vadodara</span>
            <span className="text-[10px] text-status-on-track">— Ideal range: 70-90%</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
