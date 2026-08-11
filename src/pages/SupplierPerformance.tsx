import { AppLayout } from '@/components/layout/AppLayout';
import { suppliers } from '@/data/mockData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SupplierPerformance() {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<'riskScore' | 'onTimeRate' | 'qualityScore'>('riskScore');
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...suppliers].sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(key === 'riskScore' ? false : true); }
  };

  const riskChartData = suppliers
    .sort((a, b) => a.riskScore - b.riskScore)
    .slice(0, 10)
    .map(s => ({ name: s.name.split(' ').slice(0, 2).join(' '), risk: s.riskScore, status: s.status }));

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Supplier Performance</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{suppliers.length} active suppliers tracked across both factories</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Suppliers</p>
            <p className="text-2xl font-bold text-foreground mt-1">{suppliers.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">On Track</p>
            <p className="text-2xl font-bold text-status-on-track mt-1">{suppliers.filter(s => s.status === 'On Track').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">At Risk</p>
            <p className="text-2xl font-bold text-status-at-risk mt-1">{suppliers.filter(s => s.status === 'At Risk').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Critical</p>
            <p className="text-2xl font-bold text-status-critical mt-1">{suppliers.filter(s => s.status === 'Critical').length}</p>
          </div>
        </div>

        {/* Risk chart */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Supplier Risk Scores (Bottom 10)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskChartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="risk" name="Risk Score" radius={[0, 4, 4, 0]}>
                {riskChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.risk < 70 ? 'hsl(var(--status-critical))' : entry.risk < 80 ? 'hsl(var(--status-at-risk))' : 'hsl(var(--status-on-track))'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supplier table */}
        <div className="bg-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-foreground">Supplier Scorecard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Components</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Active Orders</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Dependent On</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('onTimeRate')}>
                    On-Time % {sortKey === 'onTimeRate' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('qualityScore')}>
                    Quality {sortKey === 'qualityScore' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Avg Lead Time</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Trend</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => handleSort('riskScore')}>
                    Risk Score {sortKey === 'riskScore' && (sortAsc ? '↑' : '↓')}
                  </th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.id} className="border-b hover:bg-muted/30 cursor-pointer transition-colors">
                    <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.components}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{s.activeOrders}</td>
                    <td className="px-4 py-2.5 text-right text-foreground">{s.dependentOrders}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={s.onTimeRate < 80 ? 'text-status-critical font-semibold' : s.onTimeRate < 90 ? 'text-status-at-risk' : 'text-foreground'}>{s.onTimeRate}%</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-foreground">{s.qualityScore}/100</td>
                    <td className="px-4 py-2.5 text-foreground">{s.avgLeadTime}</td>
                    <td className="px-4 py-2.5">
                      <span className={s.leadTimeTrend.includes('↑') ? 'text-status-critical font-medium' : s.leadTimeTrend.includes('↓') ? 'text-status-on-track font-medium' : 'text-muted-foreground'}>
                        {s.leadTimeTrend}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.riskScore >= 85 ? 'bg-status-on-track' : s.riskScore >= 70 ? 'bg-status-at-risk' : 'bg-status-critical'}`} style={{ width: `${s.riskScore}%` }} />
                        </div>
                        <span className="text-foreground font-medium">{s.riskScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.status === 'On Track' ? 'bg-status-on-track/10 text-status-on-track' :
                        s.status === 'At Risk' ? 'bg-status-at-risk/10 text-status-at-risk' :
                        'bg-status-critical/10 text-status-critical'
                      }`}>
                        {s.status}
                      </span>
                    </td>
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
