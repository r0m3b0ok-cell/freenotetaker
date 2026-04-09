import { useState } from 'react';
import RecordButton from '@/components/recording/RecordButton';
import ImportZone from '@/components/recording/ImportZone';
import RecordingList from '@/components/recording/RecordingList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { setGroqKey, getGroqKey, setOpenRouterKey, getOpenRouterKey } from '@/lib/config';
import { Save, Settings, Database, Key } from 'lucide-react';
import { toast } from 'sonner';

const Sidebar = () => {
  const [groqKey, setGroq] = useState(() => {
    try { return getGroqKey(); } catch { return ''; }
  });

  const [openRouterKey, setOpenRouter] = useState(() => {
    try { return getOpenRouterKey(); } catch { return ''; }
  });

  const handleSaveKeys = () => {
    if (!groqKey.startsWith('gsk_') && groqKey !== '') {
      toast.error('Invalid Groq key format');
      return;
    }
    setGroqKey(groqKey);
    setOpenRouterKey(openRouterKey);
    toast.success('API Keys saved securely');
  };

  return (
    <aside className="w-[300px] shrink-0 glass-sidebar flex flex-col h-full
      max-md:w-full max-md:h-auto max-md:border-r-0 max-md:border-b z-20">
      
      <div className="p-4 space-y-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center animate-pulse">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">NoteFlow</h1>
        </div>
        
        <div className="space-y-3">
          <RecordButton />
          <ImportZone />
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between border-y border-white/5 bg-white/5">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Recent Recordings</span>
        <span className="text-[10px] text-muted-foreground/60 px-1.5 py-0.5 rounded bg-white/5">Local Sync</span>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <RecordingList />
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-white/5 space-y-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-primary transition-colors h-9">
              <Settings className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Configure API Keys</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] glass-card ml-2 p-4 space-y-4 border-white/10" side="right" align="end">
            <div className="space-y-4 font-sans">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Key className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm">Security & API</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Groq (Whisper)</label>
                <Input
                  type="password"
                  placeholder="gsk-..."
                  value={groqKey}
                  onChange={(e) => setGroq(e.target.value)}
                  className="h-8 text-xs bg-black/40 border-white/10"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">OpenRouter (AI)</label>
                <Input
                  type="password"
                  placeholder="sk-or-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouter(e.target.value)}
                  className="h-8 text-xs bg-black/40 border-white/10"
                />
              </div>

              <Button onClick={handleSaveKeys} size="sm" className="w-full h-9 gap-2 shadow-lg shadow-primary/20">
                <Save className="h-4 w-4" />
                <span>Save Key Settings</span>
              </Button>
              
              <p className="text-[9px] text-center text-muted-foreground leading-tight italic">
                Keys are stored locally in your browser and never sent to our servers.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
};

export default Sidebar;
