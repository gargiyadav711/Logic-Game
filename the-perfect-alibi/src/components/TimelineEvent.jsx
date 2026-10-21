export default function TimelineEvent({ event, index, total, onMove }) {
  return (
    <div className="flex items-center gap-3 border border-white/15 bg-black/20 p-4">
      <span className="font-serif text-xl text-amber-200/70">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1"><p className="text-xs tracking-widest text-amber-200/60">{event.time}</p><p className="mt-1 text-sm">{event.description}</p></div>
      <div className="flex gap-1">
        <button disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move event earlier" className="border border-white/20 px-2 py-1 disabled:opacity-30">↑</button>
        <button disabled={index === total - 1} onClick={() => onMove(index, 1)} aria-label="Move event later" className="border border-white/20 px-2 py-1 disabled:opacity-30">↓</button>
      </div>
    </div>
  );
}
