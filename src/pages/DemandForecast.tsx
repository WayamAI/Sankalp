import { AppLayout } from '@/components/layout/AppLayout';
import { AppIcon } from '@/components/ui/app-icon';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const forecastData = [
  { month: 'Apr 26', forecast: 42, actual: 38, revenue: 380, capacity: 48 },
  { month: 'May 26', forecast: 48, actual: 45, revenue: 420, capacity: 48 },
  { month: 'Jun 26', forecast: 52, actual: null, revenue: 460, capacity: 48 },
  { month: 'Jul 26', forecast: 44, actual: null, revenue: 390, capacity: 48 },
  { month: 'Aug 26', forecast: 50, actual: null, revenue: 440, capacity: 48 },
  { month: 'Sep 26', forecast: 56, actual: null, revenue: 510, capacity: 48 },
  { month: 'Oct 26', forecast: 46, actual: null, revenue: 410, capacity: 48 },
  { month: 'Nov 26', forecast: 40, actual: null, revenue: 350, capacity: 48 },
  { month: 'Dec 26', forecast: 36, actual: null, revenue: 320, capacity: 48 },
  { month: 'Jan 27', forecast: 44, actual: null, revenue: 400, capacity: 48 },
  { month: 'Feb 27', forecast: 50, actual: null, revenue: 450, capacity: 48 },
  { month: 'Mar 27', forecast: 54, actual: null, revenue: 490, capacity: 48 },
];

const byProduct = [
  { month: 'Apr', 'GT-7000': 12, 'GT-9500': 6, 'ST-4000': 8, 'CP-2200': 10, 'GP-6000': 4, 'GP-8500': 2 },
  { month: 'May', 'GT-7000': 14, 'GT-9500': 8, 'ST-4000': 6, 'CP-2200': 12, 'GP-6000': 5, 'GP-8500': 3 },
  { month: 'Jun', 'GT-7000': 16, 'GT-9500': 10, 'ST-4000': 8, 'CP-2200': 10, 'GP-6000': 5, 'GP-8500': 3 },
  { month: 'Jul', 'GT-7000': 10, 'GT-9500': 8, 'ST-4000': 10, 'CP-2200': 8, 'GP-6000': 4, 'GP-8500': 4 },
  { month: 'Aug', 'GT-7000': 14, 'GT-9500': 10, 'ST-4000': 8, 'CP-2200': 12, 'GP-6000': 3, 'GP-8500': 3 },
  { month: 'Sep', 'GT-7000': 18, 'GT-9500': 12, 'ST-4000': 8, 'CP-2200': 10, 'GP-6000': 5, 'GP-8500': 3 },
];

export default function DemandForecast() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-display-xl text-foreground">Demand Forecast</h1>
          <p className="text-xs text-muted-foreground mt-0.5">12-month order intake forecast with capacity overlay</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Forecast (Next 12M)</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">562 units</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Revenue Forecast</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">₹5,020 Cr</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Capacity Constrained Months</p>
            <p className="font-display text-display-metric tabular-nums text-status-critical mt-1">3</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Forecast Accuracy (3M)</p>
            <p className="font-display text-display-metric tabular-nums text-status-on-track mt-1">91.2%</p>
          </div>
        </div>

        {/* Forecast vs Capacity */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Forecast vs. Available Capacity (Combined Plants)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={48} stroke="hsl(var(--status-critical))" strokeDasharray="4 4" label={{ value: 'Max Capacity', position: 'right', fontSize: 10, fill: 'hsl(var(--status-critical))' }} />
              <Area type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Forecast (Units)" />
              {forecastData.some(d => d.actual !== null) && (
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--status-on-track))" fill="hsl(var(--status-on-track))" fillOpacity={0.15} name="Actual Intake" />
              )}
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2"><AppIcon name="warning" size="xs" className="inline-block align-[-2px] mr-1 text-feedback-warning-icon" />Months exceeding capacity: <span className="font-semibold text-status-critical">Jun, Aug, Sep 2026</span></p>
        </div>

        {/* By Product */}
        <div className="bg-card border rounded-lg p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Demand by Product Line (Next 6 Months)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byProduct}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ fontSize: 11, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="GT-7000" stackId="a" fill="hsl(var(--chart-series-1))" />
              <Bar dataKey="GT-9500" stackId="a" fill="hsl(var(--chart-series-2))" />
              <Bar dataKey="ST-4000" stackId="a" fill="hsl(var(--chart-series-3))" />
              <Bar dataKey="CP-2200" stackId="a" fill="hsl(var(--chart-series-4))" />
              <Bar dataKey="GP-6000" stackId="a" fill="hsl(var(--chart-series-5))" />
              <Bar dataKey="GP-8500" stackId="a" fill="hsl(var(--chart-series-6))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
