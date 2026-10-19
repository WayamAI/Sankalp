import { AppLayout } from '@/components/layout/AppLayout';
import { Mark } from '@/components/ui/mark';

export default function DemandChangeLog() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="flex items-center gap-3"><Mark name="demand-change-log" size={44} /><h1 className="font-display text-display-xl text-foreground">Demand Change Log</h1></div>
          <p className="text-xs text-muted-foreground mt-0.5">Historical log of all demand modifications</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">See the <a href="/pull-in-push-out" className="text-primary underline">Pull-In / Push-Out Impact</a> page for active demand changes and their impacts.</p>
        </div>
      </div>
    </AppLayout>
  );
}
