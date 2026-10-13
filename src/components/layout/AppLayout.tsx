import { AppSidebar } from './AppSidebar';
import { ConversationalPlanner } from '../shared/ConversationalPlanner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-page">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto bg-page">
        {children}
      </main>
      <ConversationalPlanner />
    </div>
  );
}
