import { LockKeyhole, CheckCircle2, Play, RotateCcw } from "lucide-react";

export default function CaseCard({ item, status = {}, locked = false, onLaunch }) {
  return (
    <article className={`border bg-[#201b15] p-5 ${locked ? "border-white/10 opacity-65" : "border-amber-100/20"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[.25em] text-amber-200/60">CASE FILE {item.id}</p>
          <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
        </div>
        <span className="border border-amber-100/20 px-2 py-1 text-[10px] tracking-widest">{item.difficulty.toUpperCase()}</span>
      </div>
      <p className="mt-3 min-h-12 text-sm leading-6 text-white/65">{item.description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="text-xs text-white/55">
          {locked ? <span className="flex items-center gap-1"><LockKeyhole size={14}/> Locked</span> :
            status.completed ? <span className="flex items-center gap-1 text-emerald-200"><CheckCircle2 size={14}/> Solved · {status.score ?? 0}/100</span> :
            <span>{status.stage && status.stage !== "investigation" ? "In progress" : "Not started"}</span>}
        </div>
        <button disabled={locked} onClick={() => onLaunch(item)} className="flex items-center gap-2 border border-amber-200/40 px-4 py-2 text-xs tracking-widest text-amber-100 hover:bg-amber-100/10 disabled:cursor-not-allowed disabled:opacity-50">
          {locked ? <LockKeyhole size={14}/> : status.completed ? <RotateCcw size={14}/> : <Play size={14}/>}
          {locked ? "LOCKED" : status.completed ? "REPLAY" : status.stage ? "CONTINUE" : "OPEN CASE"}
        </button>
      </div>
    </article>
  );
}
