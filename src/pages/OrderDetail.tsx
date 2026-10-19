import { useParams, useNavigate } from 'react-router-dom';
import { Mark } from '@/components/ui/mark';
import { AppIcon } from '@/components/ui/app-icon';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge, PriorityTag, MaterialBar } from '@/components/shared/StatusBadge';
import { orders, formatRevenue } from '@/data/mockData';
import { ArrowLeft, ExternalLink, GitCompareArrows, RefreshCw, Factory } from 'lucide-react';
import { toast } from 'sonner';

const bomComponents = [
  { name: 'Rotor Forging Assembly', required: 2, available: 1, shortfall: 1, supplier: 'Bharat Forge Ltd.', eta: '02 May 2026', status: 'Critical' as const },
  { name: 'Compressor Blade Set (Stages 1-8)', required: 16, available: 16, shortfall: 0, supplier: 'Sandvik India', eta: '—', status: 'OK' as const },
  { name: 'Combustion Liner CL-7000', required: 6, available: 4, shortfall: 2, supplier: 'Precision Castparts India', eta: '18 May 2026', status: 'Warning' as const },
  { name: 'Hot Gas Path Transition Piece', required: 4, available: 4, shortfall: 0, supplier: 'Precision Castparts India', eta: '—', status: 'OK' as const },
  { name: 'Journal Bearing Assembly', required: 4, available: 4, shortfall: 0, supplier: 'SKF India', eta: '—', status: 'OK' as const },
  { name: 'DCS Control Panel CP-200', required: 2, available: 2, shortfall: 0, supplier: 'Honeywell', eta: '—', status: 'OK' as const },
  { name: 'Generator Stator Winding GSW-8500', required: 2, available: 1, shortfall: 1, supplier: 'Siemens Gamesa', eta: '20 May 2026', status: 'Warning' as const },
  { name: 'IGBT Excitation Module EX-400', required: 4, available: 2, shortfall: 2, supplier: 'ABB India', eta: '25 Apr 2026', status: 'Warning' as const },
  { name: 'Base Frame Weldment BF-9500', required: 2, available: 2, shortfall: 0, supplier: 'Godrej Precision', eta: '—', status: 'OK' as const },
  { name: 'Coupling Assembly CA-450', required: 2, available: 2, shortfall: 0, supplier: 'Voith Turbo India', eta: '—', status: 'OK' as const },
];

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId) || orders[0];

  const stageColors: Record<string, string> = {
    completed: 'bg-status-on-track',
    'in-progress': 'bg-primary',
    upcoming: 'bg-muted',
    delayed: 'bg-status-critical',
  };

  return (
    <AppLayout>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/orders')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3"><Mark name="order-detail" size={44} /><h2 className="font-display text-display-xl text-foreground">{order.id}</h2></div>
              <PriorityTag priority={order.priority} />
              <StatusBadge status={order.status} size="md" />
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{order.factory}</span>
            </div>
            <p className="text-sm text-muted-foreground">{order.customer} • {order.product}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/simulate')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90">
              <GitCompareArrows className="w-3.5 h-3.5" /> Run Simulation
            </button>
            <button onClick={() => toast.success('Priority updated')} className="text-xs px-3 py-1.5 border rounded text-foreground hover:bg-muted/50">
              Change Priority
            </button>
            <button onClick={() => toast.success('Reassignment initiated')} className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded text-foreground hover:bg-muted/50">
              <Factory className="w-3.5 h-3.5" /> Reassign
            </button>
            <button className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-3.5 h-3.5" /> View in Oracle
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {/* Left: Timeline (3 cols) */}
          <div className="col-span-3 space-y-4">
            {/* Order Timeline */}
            <div className="metric-card">
              <h3 className="text-xs font-semibold text-foreground mb-4">Production Timeline</h3>
              <div className="relative">
                {/* Timeline bar */}
                <div className="flex items-center gap-1 mb-6">
                  {order.stages.map((stage, i) => (
                    <div key={i} className="flex-1">
                      <div className={`h-2 rounded-full ${stageColors[stage.status]}`} />
                    </div>
                  ))}
                </div>
                {/* Stage details */}
                <div className="grid grid-cols-3 gap-3">
                  {order.stages.map((stage, i) => (
                    <div key={i} className={`p-2.5 rounded border ${stage.status === 'delayed' ? 'border-status-critical/30 bg-status-critical/5' : 'border-stroke-muted'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${stageColors[stage.status]}`} />
                        <span className="text-[11px] font-medium text-foreground">{stage.name}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Plan: {stage.plannedStart} → {stage.plannedEnd}</p>
                      {stage.actualStart && (
                        <p className="text-[10px] text-primary">Actual: {stage.actualStart}{stage.actualEnd ? ` → ${stage.actualEnd}` : ' (in progress)'}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Material Readiness */}
            <div className="metric-card">
              <h3 className="text-xs font-semibold text-foreground mb-3">Material Readiness — Top BOM Components</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Reqd</th>
                    <th>Avail</th>
                    <th>Short</th>
                    <th>Supplier</th>
                    <th>ETA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bomComponents.map((c, i) => (
                    <tr key={i}>
                      <td className="text-[11px]">{c.name}</td>
                      <td className="text-[11px] font-mono text-center">{c.required}</td>
                      <td className="text-[11px] font-mono text-center">{c.available}</td>
                      <td className={`text-[11px] font-mono text-center ${c.shortfall > 0 ? 'text-status-critical font-bold' : ''}`}>{c.shortfall || '—'}</td>
                      <td className="text-[11px] text-muted-foreground">{c.supplier}</td>
                      <td className="text-[10px] font-mono text-muted-foreground">{c.eta}</td>
                      <td>
                        <span className={`text-[10px] font-medium ${c.status === 'Critical' ? 'text-status-critical' : c.status === 'Warning' ? 'text-status-at-risk' : 'text-status-on-track'}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Details (2 cols) */}
          <div className="col-span-2 space-y-4">
            {/* Order Summary */}
            <div className="metric-card">
              <h3 className="text-xs font-semibold text-foreground mb-3">Order Summary</h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Customer', order.customer],
                  ['Product', order.product],
                  ['Quantity', order.quantity.toString()],
                  ['Unit Price', `₹${order.unitPrice} Cr`],
                  ['Total Value', formatRevenue(order.revenue)],
                  ['Contract Ref', order.contractRef],
                  ['Order Date', order.orderDate],
                  ['Committed Delivery', order.deliveryDate],
                  ['Current Forecast', order.currentForecast || order.deliveryDate],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground text-right">{value}</span>
                  </div>
                ))}
                {order.currentForecast && order.currentForecast !== order.deliveryDate && (
                  <div className="mt-1 p-2 bg-status-critical/5 border border-status-critical/20 rounded">
                    <p className="text-[10px] text-status-critical font-medium">Forecast delivery differs from commitment by {Math.abs(parseInt(order.currentForecast) - parseInt(order.deliveryDate)) || 'N'} days</p>
                  </div>
                )}
              </div>
            </div>

            {/* Capacity Allocation */}
            <div className="metric-card">
              <h3 className="text-xs font-semibold text-foreground mb-3">Capacity Allocation</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Factory</span><span className="font-medium text-foreground">{order.factory}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Assembly Bay</span><span className="font-medium text-foreground">{order.assemblyBay || 'Unassigned'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Production Window</span><span className="font-medium text-foreground">Week 16-26</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Bay Utilization</span><span className="font-medium text-foreground">92%</span></div>
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-status-at-risk rounded-full" style={{ width: '92%' }} />
              </div>
              <p className="text-[9px] text-status-at-risk mt-1"><AppIcon name="warning" size="xs" className="inline-block align-[-2px] mr-1 text-feedback-warning-icon" />Near capacity threshold</p>
            </div>

            {/* Risk Summary */}
            <div className="metric-card">
              <h3 className="text-xs font-semibold text-foreground mb-3">Risk Summary</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <p className="font-display text-display-metric tabular-nums text-status-at-risk">78%</p>
                  <p className="text-[9px] text-muted-foreground">Delivery Confidence</p>
                </div>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-status-at-risk rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-status-critical/5 border border-status-critical/20">
                  <p className="text-[10px] font-medium text-status-critical">Top Risk: Material</p>
                  <p className="text-[10px] text-muted-foreground">IGBT modules for excitation system, 2 units short. Supplier ETA: 25 Apr</p>
                </div>
                <div className="p-2 rounded bg-status-at-risk/5 border border-status-at-risk/20">
                  <p className="text-[10px] font-medium text-status-at-risk">Secondary: Capacity</p>
                  <p className="text-[10px] text-muted-foreground">{order.factory} {order.assemblyBay} over 92% utilization in Week 22</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => navigate('/simulate')} className="flex-1 text-[10px] py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium">Simulate Alt. Supplier</button>
                <button onClick={() => navigate('/allocation')} className="flex-1 text-[10px] py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium">Explore Reallocation</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
