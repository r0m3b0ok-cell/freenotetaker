import TopBar from './TopBar';
import Sidebar from './Sidebar';
import ViewerPanel from '@/components/viewer/ViewerPanel';

const AppShell = () => {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans selection:bg-primary/30">
      <TopBar />
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-white/[0.02]">
          <ViewerPanel />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
