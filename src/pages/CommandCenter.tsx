import { useNavigate } from 'react-router-dom';
import { AppIcon } from '@/components/ui/app-icon';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard, StatusBadge, SeverityIndicator } from '@/components/shared/StatusBadge';
import { orders, alerts, orderStatusCounts, formatRevenue } from '@/data/mockData';
import { ShieldAlert, Package, TrendingDown, Factory as FactoryIcon, ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const statusData = [
  { name: 'On Track', value: orderStatusCounts.onTrack, color: 'hsl(var(--status-on-track))' },
  { name: 'At Risk', value: orderStatusCounts.atRisk, color: 'hsl(var(--status-at-risk))' },
  { name: 'Critical', value: orderStatusCounts.critical, color: 'hsl(var(--status-critical))' },
  { name: 'Delayed', value: orderStatusCounts.delayed, color: 'hsl(var(--status-delayed))' },
  { name: 'Completed', value: orderStatusCounts.completed, color: 'hsl(var(--status-completed))' },
];

const capacityData = [
  { week: 'W16', puneCommitted: 82, puneFlexible: 8, vadCommitted: 62, vadFlexible: 10 },
  { week: 'W17', puneCommitted: 85, puneFlexible: 6, vadCommitted: 65, vadFlexible: 8 },
  { week: 'W18', puneCommitted: 88, puneFlexible: 5, vadCommitted: 68, vadFlexible: 7 },
  { week: 'W19', puneCommitted: 91, puneFlexible: 4, vadCommitted: 70, vadFlexible: 6 },
  { week: 'W20', puneCommitted: 87, puneFlexible: 7, vadCommitted: 66, vadFlexible: 9 },
  { week: 'W21', puneCommitted: 92, puneFlexible: 3, vadCommitted: 72, vadFlexible: 5 },
  { week: 'W22', puneCommitted: 95, puneFlexible: 2, vadCommitted: 68, vadFlexible: 8 },
  { week: 'W23', puneCommitted: 93, puneFlexible: 4, vadCommitted: 64, vadFlexible: 10 },
];

const milestones = orders
  .filter(o => o.status !== 'Completed')
  .sort((a, b) => a.daysToDelivery - b.daysToDelivery)
  .slice(0, 10);

const factoryOrders = {
  pune: orders.filter(o => o.factory === 'Pune'),
  vadodara: orders.filter(o => o.factory === 'Vadodara'),
};

export default function CommandCenter() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-5 space-y-4">
        {/* Top metrics */}
        <div className="grid grid-cols-5 gap-3">
          <MetricCard
            title="Active Orders"
            value="1,183"
            subtitle="28 added this week"
            icon={<ClipboardList className="w-4 h-4" />}
          />
          <MetricCard
            title="On-Time Delivery"
            value="86.7%"
            delta="↓ 1.8% vs. last week"
            deltaType="negative"
            icon={<TrendingDown className="w-4 h-4" />}
          />
          <MetricCard
            title="Pune Utilization"
            value="87%"
            subtitle="4 bays active"
            icon={<FactoryIcon className="w-4 h-4" />}
          />
          <MetricCard
            title="Vadodara Utilization"
            value="68%"
            subtitle="3 bays active"
            icon={<FactoryIcon className="w-4 h-4" />}
          />
          <MetricCard
            title="Revenue at Risk"
            value="₹142 Cr"
            subtitle="4 critical shortages"
            delta="↑"
            deltaType="negative"
            icon={<ShieldAlert className="w-4 h-4" />}
          />
        </div>

        {/* Second row: Status + Capacity */}
        <div className="grid grid-cols-2 gap-3">
          {/* Order status donut */}
          <div className="metric-card">
            <h3 className="text-xs font-semibold text-foreground mb-3">Order Status Distribution</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-foreground">{s.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">{s.value}</span>
                    <span className="text-[10px] text-muted-foreground">({Math.round(s.value / 11.83)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Capacity timeline */}
          <div className="metric-card">
            <h3 className="text-xs font-semibold text-foreground mb-3">Capacity Timeline — Next 8 Weeks</h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={capacityData} barGap={1}>
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Bar dataKey="puneCommitted" stackId="pune" fill="hsl(var(--chart-series-1))" name="Pune Committed" />
                <Bar dataKey="puneFlexible" stackId="pune" fill="hsl(var(--chart-series-2))" name="Pune Flexible" />
                <Bar dataKey="vadCommitted" stackId="vad" fill="hsl(var(--chart-series-3))" name="Vadodara Committed" />
                <Bar dataKey="vadFlexible" stackId="vad" fill="hsl(var(--chart-series-4))" name="Vadodara Flexible" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third row: Alerts + Factory Snapshot + Milestones */}
        <div className="grid grid-cols-3 gap-3">
          {/* Alerts */}
          <div className="metric-card max-h-80 overflow-y-auto">
            <h3 className="text-xs font-semibold text-foreground mb-3">Active Alerts</h3>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex gap-2 p-2 rounded bg-muted/30 border border-stroke-muted">
                  <SeverityIndicator severity={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-foreground leading-tight">{alert.message}</p>
                    <p className="text-[9px] text-muted-foreground mt-1">{alert.timestamp}</p>
                    <div className="flex gap-2 mt-1.5">
                      <button onClick={() => navigate('/simulate')} className="text-[9px] text-primary font-medium hover:underline">Simulate Impact</button>
                      <button onClick={() => navigate('/orders')} className="text-[9px] text-primary font-medium hover:underline">View Orders</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Factory snapshot */}
          <div className="space-y-3">
            {(['Pune', 'Vadodara'] as const).map(factory => {
              const fOrders = factory === 'Pune' ? factoryOrders.pune : factoryOrders.vadodara;
              const utilization = factory === 'Pune' ? 87 : 68;
              const bays = factory === 'Pune' ? 4 : 3;
              const bottleneck = factory === 'Pune' ? 'Bay 3 — GT-9500 assembly backlog' : 'Bay 2 — Crane hydraulic repair';
              return (
                <div key={factory} className="metric-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-foreground">{factory} Plant</h3>
                    <span className="text-[10px] font-mono text-muted-foreground">{bays} bays</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-center mb-2">
                    <div>
                      <p className="text-lg font-bold text-foreground">{utilization}%</p>
                      <p className="text-[9px] text-muted-foreground">Utilization</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{fOrders.length}</p>
                      <p className="text-[9px] text-muted-foreground">Active Orders</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-status-at-risk"><AppIcon name="warning" size="xs" className="inline-block align-[-2px] mr-1 text-feedback-warning-icon" />{bottleneck}</p>
                  <div className="mt-2 space-y-1">
                    {fOrders.slice(0, 3).map(o => (
                      <div key={o.id} className="flex items-center justify-between text-[10px]">
                        <button onClick={() => navigate(`/orders/${o.id}`)} className="text-primary font-mono hover:underline">{o.id}</button>
                        <span className="text-muted-foreground truncate mx-2">{o.customer.split(' ')[0]}</span>
                        <StatusBadge status={o.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestones */}
          <div className="metric-card max-h-80 overflow-y-auto">
            <h3 className="text-xs font-semibold text-foreground mb-3">Upcoming Milestones</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map(o => (
                  <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                    <td className="font-mono text-[10px] text-primary">{o.id.split('-').pop()}</td>
                    <td className="text-[10px] truncate max-w-[80px]">{o.customer.split(' ')[0]}</td>
                    <td className="text-[10px] font-mono">{o.daysToDelivery}d</td>
                    <td><StatusBadge status={o.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
