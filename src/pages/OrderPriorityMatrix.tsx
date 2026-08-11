import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { orders, formatRevenue } from '@/data/mockData';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const statusColors: Record<string, string> = {
  'On Track': '#C69910',
  'At Risk': '#F57F0A',
  'Critical': '#D43211',
  'Delayed': '#822E21',
  'Completed': '#9D897B',
};

export default function OrderPriorityMatrix() {
  const navigate = useNavigate();
  const [factoryFilter, setFactoryFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All');

  let filtered = orders;
  if (factoryFilter !== 'All') filtered = filtered.filter(o => o.factory === factoryFilter);
  if (productFilter !== 'All') filtered = filtered.filter(o => o.productLine === productFilter);

  const data = filtered.map(o => ({
    x: o.daysToDelivery,
    y: o.revenue,
    z: o.quantity * 8,
    id: o.id,
    customer: o.customer,
    status: o.status,
    product: o.productLine,
  }));

  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="text-lg font-bold text-foreground mb-4">Order Priority Matrix</h2>
        <div className="filter-bar mb-4">
          <select value={factoryFilter} onChange={e => setFactoryFilter(e.target.value)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            <option value="All">All Factories</option><option>Pune</option><option>Vadodara</option><option>Unassigned</option>
          </select>
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            <option value="All">All Products</option>
            {['GT-7000','GT-9500','ST-4000','CP-2200','GP-6000','GP-8500'].map(p => <option key={p}>{p}</option>)}
          </select>
          <div className="flex gap-3 ml-auto">
            {Object.entries(statusColors).map(([name, color]) => (
              <span key={name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="metric-card relative">
          {/* Quadrant labels */}
          <div className="absolute top-8 left-16 text-[9px] font-medium text-status-critical/60 uppercase tracking-wider">High Value, Near Deadline</div>
          <div className="absolute top-8 right-8 text-[9px] font-medium text-primary/60 uppercase tracking-wider">High Value, Far Out</div>
          <div className="absolute bottom-12 left-16 text-[9px] font-medium text-status-at-risk/60 uppercase tracking-wider">Lower Value, Near Deadline</div>
          <div className="absolute bottom-12 right-8 text-[9px] font-medium text-status-on-track/60 uppercase tracking-wider">Lower Value, Far Out</div>

          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis dataKey="x" type="number" name="Days to Delivery" tick={{ fontSize: 10 }} label={{ value: 'Days to Delivery →', position: 'bottom', fontSize: 10 }} />
              <YAxis dataKey="y" type="number" name="Revenue (₹ Cr)" tick={{ fontSize: 10 }} label={{ value: 'Revenue (₹ Cr) →', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border rounded p-2 shadow-lg text-xs">
                      <p className="font-mono font-bold text-foreground">{d.id}</p>
                      <p className="text-muted-foreground">{d.customer}</p>
                      <p className="text-muted-foreground">{d.product} • {formatRevenue(d.y)}</p>
                      <p className="text-muted-foreground">{d.x} days to delivery</p>
                    </div>
                  );
                }}
              />
              <Scatter data={data} onClick={(d: any) => navigate(`/orders/${d.id}`)}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={statusColors[entry.status]} fillOpacity={0.8} r={entry.z} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
