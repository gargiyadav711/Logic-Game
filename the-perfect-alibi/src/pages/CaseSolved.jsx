import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";

export default function CaseSolved() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeCase: c, caseProgress } = useGame();
  const result = location.state?.result || caseProgress.result;
  if (!c || !result) return <section><h2 className="font-serif text-3xl">No completed result found</h2><Link to="/dashboard" className="mt-4 inline-block underline">Return to archive</Link></section>;
  const culprit = c.suspects.find((s) => s.id === c.correctSuspectId);
  const chosen = c.suspects.find((s) => s.id === result.selectedSuspectId);
  return <section className="max-w-3xl">
    <p className="text-xs tracking-[.3em] text-amber-200/60">CASE REPORT FILED</p>
    <h2 className="mt-2 font-serif text-4xl">{result.correct ? "Deduction confirmed" : "Case reviewed"}</h2>
    <p className="mt-4 text-lg">{result.correct ? `Your accusation of ${chosen?.name} was correct.` : `Your accusation of ${chosen?.name || "the selected suspect"} was incorrect.`}</p>
    <div className="mt-6 border border-amber-100/20 bg-black/20 p-6"><p className="text-xs tracking-widest text-amber-200/60">FINAL SCORE</p><p className="mt-2 font-serif text-5xl">{result.score}<span className="text-xl text-white/40">/100</span></p><p className="mt-2 text-xs text-white/45">{result.mode || "Local Validation Mode"}</p>
      <h3 className="mt-6 font-serif text-2xl">The decisive explanation</h3><p className="mt-2 leading-7 text-white/70">{c.solutionExplanation}</p><p className="mt-4 text-sm text-amber-100/80">Correct culprit: {culprit?.name}</p>
    </div>
    {result.breakdown && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{Object.entries(result.breakdown).map(([key, value]) => <div key={key} className="border border-white/10 p-3"><p className="text-xs capitalize text-white/50">{key}</p><p className="mt-1 text-xl">{value}</p></div>)}</div>}
    <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => navigate("/dashboard")} className="border border-amber-200/40 px-4 py-2 text-sm">Return to archive</button><Link to="/progress" className="border border-white/20 px-4 py-2 text-sm">View progress</Link></div>
  </section>;
}
