import { AppLayout } from '@/components/layout/AppLayout';

export default function DemandChangeLog() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-display-xl text-foreground">Demand Change Log</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Historical log of all demand modifications</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">See the <a href="/pull-in-push-out" className="text-primary underline">Pull-In / Push-Out Impact</a> page for active demand changes and their impacts.</p>
        </div>
      </div>
    </AppLayout>
  );
}
