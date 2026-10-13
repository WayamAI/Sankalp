import { useParams, useNavigate } from 'react-router-dom';
import { AppIcon } from '@/components/ui/app-icon';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard, StatusBadge } from '@/components/shared/StatusBadge';
import { orders } from '@/data/mockData';

const factoryData: Record<string, any> = {
  pune: {
    name: 'Pune Plant', bays: 4, utilization: 87, activeOrders: 16, planned: 8, actual: 7, bottleneck: 'Bay 3 — GT-9500 assembly backlog', workforce: 342,
    bayStatus: [
      { bay: 'Bay 1', currentOrder: 'PF-2025-0034', customer: 'Adani Power', completion: 45, nextOrder: 'PF-2025-0099', utilization: 85, status: 'On Track' },
      { bay: 'Bay 2', currentOrder: 'PF-2025-0067', customer: 'Tata Power', completion: 30, nextOrder: 'PF-2025-0245', utilization: 82, status: 'On Track' },
      { bay: 'Bay 3', currentOrder: 'PF-2025-0012', customer: 'NTPC Ltd.', completion: 22, nextOrder: 'PF-2025-0178', utilization: 95, status: 'At Risk' },
      { bay: 'Bay 4', currentOrder: 'PF-2025-0267', customer: 'ADNOC', completion: 18, nextOrder: 'PF-2025-0167', utilization: 78, status: 'On Track' },
    ],
  },
  vadodara: {
    name: 'Vadodara Plant', bays: 3, utilization: 68, activeOrders: 10, planned: 5, actual: 4, bottleneck: 'Bay 2 — Crane hydraulic repair', workforce: 218,
    bayStatus: [
      { bay: 'Bay 1', currentOrder: 'PF-2025-0052', customer: 'NTPC Ltd.', completion: 55, nextOrder: 'PF-2025-0088', utilization: 72, status: 'On Track' },
      { bay: 'Bay 2', currentOrder: 'PF-2025-0023', customer: 'BHEL', completion: 60, nextOrder: 'PF-2025-0134', utilization: 62, status: 'Delayed' },
      { bay: 'Bay 3', currentOrder: 'PF-2025-0189', customer: 'ONGC', completion: 35, nextOrder: 'PF-2025-0275', utilization: 70, status: 'On Track' },
    ],
  },
};

export default function FactoryView() {
  const { factoryId } = useParams();
  const navigate = useNavigate();
  const key = factoryId || 'pune';
  const factory = factoryData[key] || factoryData.pune;
  const fOrders = orders.filter(o => o.factory === factory.name.split(' ')[0]);

  return (
    <AppLayout>
      <div className="p-5">
        <h2 className="font-display text-display-xl text-foreground mb-5">{factory.name}</h2>

        <div className="grid grid-cols-5 gap-3 mb-4">
          <MetricCard title="Planned Output" value={`${factory.planned} units`} subtitle="This week" />
          <MetricCard title="Actual Output" value={`${factory.actual} units`} delta={factory.actual < factory.planned ? `${factory.actual - factory.planned}` : 'On target'} deltaType={factory.actual < factory.planned ? 'negative' : 'positive'} />
          <MetricCard title="Utilization" value={`${factory.utilization}%`} />
          <MetricCard title="Active Orders" value={factory.activeOrders} />
          <MetricCard title="Workforce" value={factory.workforce} subtitle="On shift" />
        </div>

        <p className="text-xs text-status-at-risk mb-4"><AppIcon name="warning" size="xs" className="inline-block align-[-2px] mr-1 text-feedback-warning-icon" />Top Bottleneck: {factory.bottleneck}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {factory.bayStatus.map((bay: any) => (
            <div key={bay.bay} className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-foreground">{bay.bay}</h4>
                <StatusBadge status={bay.status} />
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Current Order</span><button onClick={() => navigate(`/orders/${bay.currentOrder}`)} className="font-mono text-primary hover:underline">{bay.currentOrder}</button></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="text-foreground">{bay.customer}</span></div>
                <div>
                  <div className="flex justify-between mb-0.5"><span className="text-muted-foreground">Completion</span><span className="font-mono text-foreground">{bay.completion}%</span></div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${bay.completion}%` }} /></div>
                </div>
                <div className="flex justify-between"><span className="text-muted-foreground">Next in Queue</span><span className="font-mono text-foreground">{bay.nextOrder}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Utilization</span><span className={`font-mono ${bay.utilization > 90 ? 'text-status-critical' : 'text-foreground'}`}>{bay.utilization}%</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="metric-card">
          <h3 className="text-xs font-semibold text-foreground mb-3">Order Queue</h3>
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Bay</th><th>Start</th><th>Delivery</th><th>Status</th></tr></thead>
            <tbody>
              {fOrders.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                  <td className="font-mono text-xs text-primary">{o.id}</td>
                  <td className="text-xs">{o.customer}</td>
                  <td className="text-[11px] text-muted-foreground">{o.productLine}</td>
                  <td className="text-xs">{o.assemblyBay || '—'}</td>
                  <td className="text-xs font-mono">{o.plannedStart}</td>
                  <td className="text-xs font-mono">{o.deliveryDate}</td>
                  <td><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
