import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";

export default function Investigation() {
  const { activeCase: c, caseProgress, updateCaseProgress } = useGame();
  if (!c) return <p>Case not found. <Link to="/dashboard">Return to archive</Link>.</p>;
  return <section>
    <p className="text-xs tracking-[.3em] text-amber-200/60">CASE {c.id} · {c.difficulty.toUpperCase()}</p>
    <h2 className="mt-2 font-serif text-4xl">{c.title}</h2>
    <div className="mt-6 grid gap-5 md:grid-cols-[1.5fr_1fr]">
      <article className="border border-amber-100/20 bg-black/20 p-6">
        <h3 className="font-serif text-2xl">Case briefing</h3><p className="mt-3 leading-7 text-white/70">{c.briefing}</p>
        <h3 className="mt-6 font-serif text-xl">Scenario</h3><p className="mt-2 leading-7 text-white/70">{c.scenario}</p>
      </article>
      <aside className="border border-white/15 p-6">
        <p className="text-xs tracking-widest text-amber-200/60">VICTIM</p><p className="mt-2 font-serif text-xl">{c.victim}</p>
        <p className="mt-5 text-xs tracking-widest text-amber-200/60">CRITICAL WINDOW</p><p className="mt-2">{c.crimeTime}</p>
        <label className="mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(caseProgress.briefingReviewed)} onChange={(e) => updateCaseProgress({ briefingReviewed: e.target.checked, stage: "investigation" })} className="accent-amber-200" /> I have reviewed the briefing</label>
        <Link className="mt-6 inline-block border border-amber-200/40 px-4 py-2 text-sm text-amber-100" to="/suspects">Examine suspects →</Link>
      </aside>
    </div>
  </section>;
}
