import { AppSidebar } from './AppSidebar';
import { ConversationalPlanner } from '../shared/ConversationalPlanner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <ConversationalPlanner />
    </div>
  );
}
