import { useAppStore } from '@/store/useAppStore';
import RecordingItem from './RecordingItem';

const RecordingList = () => {
  const { recordings, activeRecordingId, setActiveRecording, searchQuery } = useAppStore();

  const filteredRecordings = recordings.filter((rec) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = rec.name.toLowerCase().includes(query);
    const transcriptMatch = rec.transcript?.toLowerCase().includes(query) || false;
    return nameMatch || transcriptMatch;
  });

  return (
    <div className="flex flex-col gap-0.5">
      {filteredRecordings.map((rec) => (
        <RecordingItem
          key={rec.id}
          recording={rec}
          isActive={rec.id === activeRecordingId}
          onClick={() => setActiveRecording(rec.id)}
        />
      ))}
      {filteredRecordings.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          {searchQuery ? 'No results found' : 'No recordings yet'}
        </p>
      )}
    </div>
  );
};

export default RecordingList;
