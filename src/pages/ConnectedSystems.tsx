import { AppLayout } from '@/components/layout/AppLayout';
import { Mark } from '@/components/ui/mark';
import { integrations } from '@/data/mockData';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Database, Wifi } from 'lucide-react';

const statusIcons: Record<string, React.ReactNode> = {
  Green: <CheckCircle className="w-4 h-4 text-status-on-track" />,
  Amber: <AlertTriangle className="w-4 h-4 text-status-at-risk" />,
  Red: <XCircle className="w-4 h-4 text-status-critical" />,
};

const connectorIcons: Record<string, React.ReactNode> = {
  API: <Wifi className="w-3.5 h-3.5" />,
  CDC: <Database className="w-3.5 h-3.5" />,
  File: <RefreshCw className="w-3.5 h-3.5" />,
};

export default function ConnectedSystems() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-3"><Mark name="connected-systems" size={44} /><h1 className="font-display text-display-xl text-foreground">Connected Systems</h1></div>
          <p className="text-xs text-muted-foreground mt-0.5">Integration health and data sync status</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Systems</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">{integrations.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Healthy</p>
            <p className="font-display text-display-metric tabular-nums text-status-on-track mt-1">{integrations.filter(i => i.status === 'Green').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Degraded</p>
            <p className="font-display text-display-metric tabular-nums text-status-at-risk mt-1">{integrations.filter(i => i.status === 'Amber').length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Records (24h)</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">{(integrations.reduce((s, i) => s + i.records24h, 0) / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Integration cards */}
        <div className="grid grid-cols-2 gap-4">
          {integrations.map((integration, i) => (
            <div key={i} className={`bg-card border rounded-lg p-4 ${integration.status === 'Amber' ? 'border-status-at-risk/40' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  {statusIcons[integration.status]}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                    <p className="text-[11px] text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  {connectorIcons[integration.connectorType]}
                  <span>{integration.connectorType}</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Last Sync</p>
                  <p className="text-xs font-medium text-foreground">{integration.lastSync}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Records (24h)</p>
                  <p className="text-xs font-medium text-foreground">{integration.records24h.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Data Quality</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${integration.dataQuality >= 95 ? 'bg-status-on-track' : integration.dataQuality >= 90 ? 'bg-status-at-risk' : 'bg-status-critical'}`}
                        style={{ width: `${integration.dataQuality}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{integration.dataQuality}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
