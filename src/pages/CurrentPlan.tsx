import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { orders } from '@/data/mockData';
import { toast } from 'sonner';

const bays = [
  { id: 'Pune Bay 1', factory: 'Pune' }, { id: 'Pune Bay 2', factory: 'Pune' },
  { id: 'Pune Bay 3', factory: 'Pune' }, { id: 'Pune Bay 4', factory: 'Pune' },
  { id: 'Vadodara Bay 1', factory: 'Vadodara' }, { id: 'Vadodara Bay 2', factory: 'Vadodara' },
  { id: 'Vadodara Bay 3', factory: 'Vadodara' },
];

const weeks = ['W16','W17','W18','W19','W20','W21','W22','W23','W24','W25','W26','W27'];

const bayAssignments: Record<string, Array<{orderId:string;customer:string;start:number;end:number;status:string}>> = {
  'Pune Bay 1': [
    { orderId:'PF-2025-0034', customer:'Adani', start:0, end:4, status:'On Track' },
    { orderId:'PF-2025-0099', customer:'ONGC', start:4, end:8, status:'On Track' },
    { orderId:'PF-2025-0350', customer:'L&T', start:9, end:11, status:'On Track' },
  ],
  'Pune Bay 2': [
    { orderId:'PF-2025-0067', customer:'Tata', start:0, end:5, status:'On Track' },
    { orderId:'PF-2025-0245', customer:'Reliance', start:5, end:9, status:'On Track' },
    { orderId:'PF-2025-0360', customer:'Qatar', start:8, end:11, status:'At Risk' },
  ],
  'Pune Bay 3': [
    { orderId:'PF-2025-0012', customer:'NTPC', start:0, end:6, status:'On Track' },
    { orderId:'PF-2025-0156', customer:'Tata', start:2, end:5, status:'On Track' },
    { orderId:'PF-2025-0178', customer:'ADNOC', start:6, end:10, status:'At Risk' },
    { orderId:'PF-2025-0256', customer:'Tata', start:7, end:11, status:'At Risk' },
  ],
  'Pune Bay 4': [
    { orderId:'PF-2025-0267', customer:'ADNOC', start:0, end:5, status:'On Track' },
    { orderId:'PF-2025-0128', customer:'Cairn', start:1, end:5, status:'On Track' },
    { orderId:'PF-2025-0167', customer:'GAIL', start:5, end:11, status:'At Risk' },
  ],
  'Vadodara Bay 1': [
    { orderId:'PF-2025-0052', customer:'NTPC', start:0, end:4, status:'On Track' },
    { orderId:'PF-2025-0088', customer:'Adani', start:2, end:6, status:'On Track' },
    { orderId:'PF-2025-0142', customer:'Reliance', start:5, end:9, status:'On Track' },
  ],
  'Vadodara Bay 2': [
    { orderId:'PF-2025-0023', customer:'BHEL', start:0, end:3, status:'Delayed' },
    { orderId:'PF-2025-0134', customer:'JSW', start:4, end:9, status:'On Track' },
    { orderId:'PF-2025-0198', customer:'Reliance', start:6, end:11, status:'On Track' },
  ],
  'Vadodara Bay 3': [
    { orderId:'PF-2025-0189', customer:'ONGC', start:0, end:4, status:'On Track' },
    { orderId:'PF-2025-0045', customer:'Adani', start:0, end:4, status:'On Track' },
    { orderId:'PF-2025-0275', customer:'NTPC', start:5, end:10, status:'At Risk' },
  ],
};

const utilizationData: Record<string, number[]> = {
  'Pune Bay 1': [85,88,82,80,78,84,86,90,88,82,80,78],
  'Pune Bay 2': [80,82,85,88,90,87,84,82,88,92,90,85],
  'Pune Bay 3': [88,90,92,95,96,94,92,90,88,86,84,82],
  'Pune Bay 4': [72,75,78,80,82,85,88,90,86,82,78,74],
  'Vadodara Bay 1': [65,68,70,72,74,76,78,75,72,70,68,66],
  'Vadodara Bay 2': [58,62,65,68,70,72,68,64,60,58,62,65],
  'Vadodara Bay 3': [70,72,74,68,66,70,74,78,80,76,72,68],
};

const barColors: Record<string, string> = {
  'On Track': 'bg-status-on-track', 'At Risk': 'bg-status-at-risk',
  'Critical': 'bg-status-critical', 'Delayed': 'bg-status-delayed',
};

const conflicts = [
  { desc: 'Pune Bay 3: GT-9500 orders PF-2025-0178 and PF-2025-0256 overlap in weeks 22-24. Over 95% utilization.', severity: 'critical' },
  { desc: 'Pune Bay 2: PF-2025-0245 and PF-2025-0360 share weeks 25-26. Material dependency chain risk.', severity: 'warning' },
  { desc: 'Vadodara Bay 2: PF-2025-0023 delayed, pushing PF-2025-0134 start by 1 week.', severity: 'warning' },
];

export default function CurrentPlan() {
  const navigate = useNavigate();
  const [factoryView, setFactoryView] = useState('Both');
  const [showConflicts, setShowConflicts] = useState(true);

  const visibleBays = bays.filter(b => factoryView === 'Both' || b.factory === factoryView);

  return (
    <AppLayout>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-display-xl text-foreground">Current Production Plan</h2>
          <div className="flex gap-2">
            {['Both','Pune','Vadodara'].map(f => (
              <button key={f} onClick={() => setFactoryView(f)}
                className={`text-xs px-3 py-1.5 rounded ${factoryView === f ? 'bg-primary text-primary-foreground' : 'border text-muted-foreground hover:text-foreground'}`}>
                {f}
              </button>
            ))}
            <button onClick={() => setShowConflicts(!showConflicts)} className="text-xs px-3 py-1.5 border rounded text-muted-foreground hover:text-foreground">
              {showConflicts ? 'Hide' : 'Show'} Conflicts
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Gantt */}
          <div className={`${showConflicts ? 'flex-1' : 'w-full'} metric-card overflow-x-auto`}>
            <div className="min-w-[800px]">
              {/* Week headers */}
              <div className="flex mb-1">
                <div className="w-28 flex-shrink-0" />
                {weeks.map(w => (
                  <div key={w} className="flex-1 text-center text-[10px] font-mono text-muted-foreground py-1">{w}</div>
                ))}
              </div>

              {/* Bay rows */}
              {visibleBays.map(bay => {
                const assignments = bayAssignments[bay.id] || [];
                const utils = utilizationData[bay.id] || [];
                return (
                  <div key={bay.id} className="mb-2">
                    <div className="flex items-center">
                      <div className="w-28 flex-shrink-0 text-[11px] font-medium text-foreground pr-2 truncate">{bay.id}</div>
                      <div className="flex-1 relative h-8 bg-muted/30 rounded-sm">
                        {assignments.map((a, i) => {
                          const left = (a.start / 12) * 100;
                          const width = ((a.end - a.start) / 12) * 100;
                          return (
                            <div
                              key={i}
                              className={`absolute top-0.5 h-7 rounded-sm text-[9px] font-medium flex items-center px-1.5 text-primary-foreground truncate cursor-pointer ${barColors[a.status]}`}
                              style={{ left: `${left}%`, width: `${width}%` }}
                              onClick={() => navigate(`/orders/${a.orderId}`)}
                              title={`${a.orderId} — ${a.customer}`}
                            >
                              {a.orderId.split('-').pop()} {a.customer}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Utilization strip */}
                    <div className="flex ml-28">
                      {utils.map((u, i) => (
                        <div key={i} className="flex-1 h-1.5" style={{
                          backgroundColor: u > 95 ? 'hsl(var(--status-critical))' : u > 80 ? 'hsl(var(--status-at-risk))' : 'hsl(var(--status-on-track))',
                          opacity: 0.6,
                        }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflicts */}
          {showConflicts && (
            <div className="w-72 metric-card flex-shrink-0">
              <h3 className="text-xs font-semibold text-foreground mb-3">Scheduling Conflicts ({conflicts.length})</h3>
              <div className="space-y-2">
                {conflicts.map((c, i) => (
                  <div key={i} className={`p-2 rounded border text-[10px] ${c.severity === 'critical' ? 'border-status-critical/30 bg-status-critical/5' : 'border-status-at-risk/30 bg-status-at-risk/5'}`}>
                    <p className="text-foreground leading-tight">{c.desc}</p>
                    <button onClick={() => navigate('/simulate')} className="text-primary font-medium mt-1 hover:underline">Resolve →</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
