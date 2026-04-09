const Waveform = ({ active }: { active: boolean }) => {
  const bars = 24;

  return (
    <div className="flex items-center justify-center gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-amber-mid transition-all ${
            active ? 'animate-waveform-bar' : 'h-1'
          }`}
          style={{
            height: active ? `${Math.random() * 24 + 8}px` : '4px',
            animationDelay: active ? `${i * 0.05}s` : '0s',
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
