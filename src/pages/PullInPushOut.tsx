import { AppLayout } from '@/components/layout/AppLayout';
import { demandChanges } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function PullInPushOut() {
  const navigate = useNavigate();

  const pullIns = demandChanges.filter(d => d.direction === 'Pull-In');
  const pushOuts = demandChanges.filter(d => d.direction === 'Push-Out');

  const statusColor = (status: string) => {
    switch (status) {
      case 'Under review': return 'bg-status-at-risk/10 text-status-at-risk';
      case 'Accepted': return 'bg-status-on-track/10 text-status-on-track';
      case 'Simulating': return 'bg-primary/10 text-primary';
      case 'Rejected': return 'bg-status-critical/10 text-status-critical';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-display-xl text-foreground">Pull-In / Push-Out Impact</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Managing demand volatility across the order book</p>
        </div>

        {/* Volatility metrics */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Changes This Quarter</p>
            <p className="font-display text-display-metric tabular-nums text-foreground mt-1">34</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pull-Ins</p>
            <p className="font-display text-display-metric tabular-nums text-status-at-risk mt-1">21</p>
            <p className="text-[10px] text-muted-foreground">Avg: -22 days</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Push-Outs</p>
            <p className="font-display text-display-metric tabular-nums text-status-on-track mt-1">13</p>
            <p className="text-[10px] text-muted-foreground">Avg: +41 days</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Unresolved</p>
            <p className="font-display text-display-metric tabular-nums text-status-critical mt-1">8</p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Net Capacity Impact</p>
            <p className="text-sm font-bold text-foreground mt-1">
              <span className="text-status-on-track">+2.4% Pune</span> / <span className="text-status-critical">-1.8% Vadodara</span>
            </p>
          </div>
        </div>

        {/* Changes table */}
        <div className="bg-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <h2 className="text-sm font-semibold text-foreground">Recent Demand Changes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Change ID</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Original Delivery</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Requested Delivery</th>
                  <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Shift</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Direction</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Impact Assessment</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {demandChanges.map(dc => (
                  <tr key={dc.changeId} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-mono font-medium text-muted-foreground">{dc.changeId}</td>
                    <td className="px-4 py-2.5 font-medium text-primary cursor-pointer hover:underline" onClick={() => navigate(`/orders/${dc.orderId}`)}>{dc.orderId}</td>
                    <td className="px-4 py-2.5 text-foreground">{dc.customer}</td>
                    <td className="px-4 py-2.5 text-foreground">{dc.originalDelivery}</td>
                    <td className="px-4 py-2.5 text-foreground">{dc.requestedDelivery}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={dc.shiftDays < 0 ? 'text-status-at-risk font-semibold' : 'text-status-on-track font-semibold'}>
                        {dc.shiftDays > 0 ? '+' : ''}{dc.shiftDays}d
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        dc.direction === 'Pull-In' ? 'bg-status-at-risk/10 text-status-at-risk' : 'bg-status-on-track/10 text-status-on-track'
                      }`}>
                        {dc.direction}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">{dc.impactAssessment}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColor(dc.status)}`}>
                        {dc.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {dc.status !== 'Accepted' && dc.status !== 'Rejected' && (
                        <button
                          onClick={() => navigate('/simulate')}
                          className="px-2.5 py-1 text-[10px] font-medium bg-primary text-primary-foreground rounded hover:opacity-90"
                        >
                          Simulate
                        </button>
                      )}
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
