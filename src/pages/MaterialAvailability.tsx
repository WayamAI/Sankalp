import { AppLayout } from '@/components/layout/AppLayout';
import { materials, orders, formatRevenue } from '@/data/mockData';
import { Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { useState } from 'react';

const summaryStats = {
  total: 847,
  available: 612,
  partial: 178,
  critical: 57,
};

const forecastData = [
  { month: 'Apr', demand: 84, supply: 92 },
  { month: 'May', demand: 96, supply: 88 },
  { month: 'Jun', demand: 102, supply: 78 },
  { month: 'Jul', demand: 88, supply: 72 },
  { month: 'Aug', demand: 76, supply: 80 },
  { month: 'Sep', demand: 70, supply: 85 },
  { month: 'Oct', demand: 82, supply: 90 },
  { month: 'Nov', demand: 94, supply: 92 },
  { month: 'Dec', demand: 78, supply: 88 },
];

export default function MaterialAvailability() {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const criticalCount = materials.filter(m => m.status === 'Critical').length;
  const warningCount = materials.filter(m => m.status === 'Warning').length;
  const okCount = materials.filter(m => m.status === 'OK').length;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Material Availability</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Component readiness across the order book</p>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Components</p>
            <p className="text-2xl font-bold text-foreground mt-1">{summaryStats.total}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-status-on-track" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fully Available</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{summaryStats.available} <span className="text-sm font-normal text-muted-foreground">({Math.round(summaryStats.available / summaryStats.total * 100)}%)</span></p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-status-at-risk" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Partial</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{summaryStats.partial} <span className="text-sm font-normal text-muted-foreground">({Math.round(summaryStats.partial / summaryStats.total * 100)}%)</span></p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-status-critical" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Critical Shortage</p>
            </div>
            <p className="text-2xl font-bold text-foreground mt-1">{summaryStats.critical} <span className="text-sm font-normal text-muted-foreground">({Math.round(summaryStats.critical / summaryStats.total * 100)}%)</span></p>
          </div>
        </div>

        {/* Material shortage table */}
        <div className="bg-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-foreground">Material Shortages — Sorted by Revenue Impact</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Component</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Required (90d)</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Available</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Shortfall</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Orders</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Primary Supplier</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Expected Resupply</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {materials
                  .sort((a, b) => b.revenueAffected - a.revenueAffected)
                  .map(mat => (
                    <tr
                      key={mat.id}
                      className={`border-b hover:bg-muted/30 cursor-pointer transition-colors ${selectedMaterial === mat.id ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedMaterial(selectedMaterial === mat.id ? null : mat.id)}
                    >
                      <td className="px-4 py-2.5 font-medium text-foreground">{mat.component}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{mat.requiredNext90}</td>
                      <td className="px-4 py-2.5 text-right text-foreground">{mat.available}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={mat.shortfall > 0 ? 'text-status-critical font-semibold' : 'text-foreground'}>{mat.shortfall}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-foreground">{mat.ordersAffected}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-foreground">{formatRevenue(mat.revenueAffected)}</td>
                      <td className="px-4 py-2.5 text-foreground">{mat.primarySupplier}</td>
                      <td className="px-4 py-2.5 text-foreground">{mat.expectedResupply}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          mat.status === 'Critical' ? 'bg-status-critical/10 text-status-critical' :
                          mat.status === 'Warning' ? 'bg-status-at-risk/10 text-status-at-risk' :
                          'bg-status-on-track/10 text-status-on-track'
                        }`}>
                          {mat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecast chart */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Material Availability vs. Demand Forecast — Combustion Liner CL-7000</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={forecastData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="supply" stroke="hsl(var(--status-on-track))" fill="hsl(var(--status-on-track))" fillOpacity={0.15} name="Available Supply" />
              <Area type="monotone" dataKey="demand" stroke="hsl(var(--status-critical))" fill="hsl(var(--status-critical))" fillOpacity={0.15} name="Projected Demand" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2">⚠ Crossover point: <span className="font-semibold text-status-critical">May 2026</span> — demand exceeds supply. Action required.</p>
        </div>
      </div>
    </AppLayout>
  );
}
