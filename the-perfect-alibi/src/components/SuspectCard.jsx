export default function SuspectCard({ suspect, selected, onSelect }) {
  return (
    <article className={`border p-5 ${selected ? "border-amber-200 bg-amber-100/10" : "border-white/15 bg-black/20"}`}>
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs tracking-widest text-amber-200/60">{suspect.role}</p><h3 className="mt-1 font-serif text-2xl">{suspect.name}</h3></div>
        <button onClick={() => onSelect?.(suspect.id)} className="border border-amber-100/30 px-3 py-1 text-xs">{selected ? "SELECTED" : "SELECT"}</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/75"><strong className="text-amber-100">Motive:</strong> {suspect.motive}</p>
      <p className="mt-2 text-sm leading-6 text-white/75"><strong className="text-amber-100">Alibi:</strong> {suspect.alibi}</p>
      <blockquote className="mt-3 border-l-2 border-amber-100/30 pl-3 text-sm italic text-white/60">“{suspect.statement}”</blockquote>
    </article>
  );
}
