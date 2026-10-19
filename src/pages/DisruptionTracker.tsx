import { AppLayout } from '@/components/layout/AppLayout';
import { Mark } from '@/components/ui/mark';
import { disruptions } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, User, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const typeColors: Record<string, string> = {
  'Supplier Delay': 'bg-status-critical/10 text-status-critical',
  'Material Shortage': 'bg-status-at-risk/10 text-status-at-risk',
  'Customs Hold': 'bg-status-at-risk/10 text-status-at-risk',
  'Quality Issue': 'bg-status-critical/10 text-status-critical',
  'Equipment Downtime': 'bg-primary/10 text-primary',
  'Logistics Delay': 'bg-status-at-risk/10 text-status-at-risk',
};

const statusColors: Record<string, string> = {
  'Investigating': 'bg-status-critical/10 text-status-critical',
  'Mitigation in progress': 'bg-status-at-risk/10 text-status-at-risk',
  'Escalated': 'bg-status-critical/10 text-status-critical',
  'Under review': 'bg-status-at-risk/10 text-status-at-risk',
  'Parts on order': 'bg-primary/10 text-primary',
  'Monitoring': 'bg-status-on-track/10 text-status-on-track',
};

export default function DisruptionTracker() {
  const navigate = useNavigate();

  const totalRevenue = disruptions.reduce((sum, d) => {
    const num = parseFloat(d.revenueImpact.replace(/[₹, Cr]/g, ''));
    return sum + num;
  }, 0);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-3"><Mark name="disruption-tracker" size={44} /><h1 className="font-display text-display-xl text-foreground">Disruption Tracker</h1></div>
          <p className="text-xs text-muted-foreground mt-0.5">Active supply chain disruptions being managed</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Disruptions</p>
            <p className="font-display text-display-metric tabular-nums text-status-critical mt-1">{disruptions.length}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orders Affected</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">{disruptions.reduce((s, d) => s + d.ordersAffected, 0)}</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Revenue at Risk</p>
            <p className="font-display text-display-metric tabular-nums text-status-critical mt-1">₹{totalRevenue} Cr</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Escalated</p>
            <p className="font-display text-display-metric tabular-nums text-status-at-risk mt-1">{disruptions.filter(d => d.status === 'Escalated').length}</p>
          </div>
        </div>

        {/* Disruption cards */}
        <div className="space-y-3">
          {disruptions.map(d => (
            <div key={d.id} className="bg-card border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-medium text-muted-foreground">{d.id}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[d.type] || 'bg-muted text-muted-foreground'}`}>{d.type}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[d.status] || 'bg-muted text-muted-foreground'}`}>{d.status}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{d.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Source: <span className="font-medium text-foreground">{d.source}</span></p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{d.ordersAffected} orders affected</span>
                    <span className="font-semibold text-status-critical">{d.revenueImpact}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Detected: {d.detected}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{d.owner}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate('/simulate')}
                    className="px-3 py-1.5 text-[11px] font-medium bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                  >
                    Simulate Impact
                  </button>
                  <button
                    onClick={() => toast.success('Acknowledged', { description: `${d.id} marked as acknowledged` })}
                    className="px-3 py-1.5 text-[11px] font-medium border rounded text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
