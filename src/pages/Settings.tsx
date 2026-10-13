import { AppLayout } from '@/components/layout/AppLayout';
import { useState } from 'react';
import { toast } from 'sonner';
import { Settings as SettingsIcon, SlidersHorizontal, Bell } from 'lucide-react';

const tabs = [
  { id: 'planning', label: 'Planning Parameters', icon: <SettingsIcon className="w-3.5 h-3.5" /> },
  { id: 'constraints', label: 'Constraint Configuration', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
  { id: 'alerts', label: 'Alert Rules', icon: <Bell className="w-3.5 h-3.5" /> },
];

const planningParams = [
  { label: 'Default Planning Horizon', value: '12 weeks', type: 'text' },
  { label: 'Safety Stock Threshold (%)', value: '15', type: 'number' },
  { label: 'Capacity Utilization Target (%)', value: '85', type: 'number' },
  { label: 'Over-Capacity Warning Threshold (%)', value: '95', type: 'number' },
  { label: 'Lead Time Buffer (weeks)', value: '2', type: 'number' },
  { label: 'Priority Escalation Window (days)', value: '14', type: 'number' },
  { label: 'Auto-Replan Trigger', value: 'On disruption detection', type: 'text' },
  { label: 'Cross-Factory Transfer Lead Time (weeks)', value: '3', type: 'number' },
];

const constraintGroups = [
  { name: 'Capacity', items: ['Max concurrent orders per bay: 2', 'Min changeover time: 48 hours', 'Overtime cap: 20% of standard hours', 'Weekend shifts: Pune only'] },
  { name: 'Material', items: ['Min safety stock: 15% of 90-day demand', 'Alternate supplier lead time penalty: +4 weeks', 'Import clearance buffer: 10 days', 'Quality hold auto-escalation: 72 hours'] },
  { name: 'Delivery', items: ['Customer penalty clause trigger: >7 days late', 'Revenue at risk threshold: ₹50 Cr', 'Priority override window: P1 orders within 90 days', 'Delivery confidence minimum: 75%'] },
];

const alertRules = [
  { rule: 'Material below safety stock', severity: 'Warning', enabled: true, channel: 'Email + Dashboard' },
  { rule: 'Supplier delivery >7 days late', severity: 'Critical', enabled: true, channel: 'Email + SMS + Dashboard' },
  { rule: 'Bay utilization >95%', severity: 'Warning', enabled: true, channel: 'Dashboard' },
  { rule: 'Order delivery forecast slipped', severity: 'Warning', enabled: true, channel: 'Email + Dashboard' },
  { rule: 'P1 order at risk', severity: 'Critical', enabled: true, channel: 'Email + SMS + Dashboard' },
  { rule: 'Quality hold not resolved in 48h', severity: 'Warning', enabled: true, channel: 'Email + Dashboard' },
  { rule: 'Integration sync failed', severity: 'Critical', enabled: true, channel: 'Email + SMS' },
  { rule: 'Demand change request received', severity: 'Info', enabled: false, channel: 'Dashboard' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-display-xl text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Planning parameters, constraints, and alert configuration</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Planning Parameters */}
        {activeTab === 'planning' && (
          <div className="bg-card border rounded-lg p-5 space-y-4">
            {planningParams.map((param, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <label className="text-xs font-medium text-foreground">{param.label}</label>
                <input
                  type={param.type}
                  defaultValue={param.value}
                  className="w-48 px-3 py-1.5 text-xs border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-right"
                />
              </div>
            ))}
            <button
              onClick={() => toast.success('Settings saved', { description: 'Planning parameters updated successfully' })}
              className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Constraints */}
        {activeTab === 'constraints' && (
          <div className="space-y-4">
            {constraintGroups.map(group => (
              <div key={group.name} className="bg-card border rounded-lg p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">{group.name} Constraints</h3>
                <div className="space-y-2">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-xs text-foreground">{item}</span>
                      <button className="text-[10px] text-primary hover:underline">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alert Rules */}
        {activeTab === 'alerts' && (
          <div className="bg-card border rounded-lg">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Rule</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Severity</th>
                  <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Enabled</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Channel</th>
                </tr>
              </thead>
              <tbody>
                {alertRules.map((rule, i) => (
                  <tr key={i} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-2.5 font-medium text-foreground">{rule.rule}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        rule.severity === 'Critical' ? 'bg-status-critical/10 text-status-critical' :
                        rule.severity === 'Warning' ? 'bg-status-at-risk/10 text-status-at-risk' :
                        'bg-primary/10 text-primary'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className={`w-8 h-4 rounded-full mx-auto relative cursor-pointer ${rule.enabled ? 'bg-status-on-track' : 'bg-muted'}`}>
                        <div className={`w-3 h-3 rounded-full bg-primary-foreground absolute top-0.5 transition-all ${rule.enabled ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{rule.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
