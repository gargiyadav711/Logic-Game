import { useGame } from "../context/GameContext.jsx";
import SuspectCard from "../components/SuspectCard.jsx";
import { Link } from "react-router-dom";

export default function Suspects() {
  const { activeCase: c, caseProgress, updateCaseProgress } = useGame();
  if (!c) return <p>No active case. <Link to="/dashboard">Open a case</Link>.</p>;
  return <section><p className="text-xs tracking-widest text-amber-200/60">PERSONS OF INTEREST</p><h2 className="mt-2 font-serif text-4xl">Suspects</h2>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">{c.suspects.map((s) => <SuspectCard key={s.id} suspect={s} selected={caseProgress.selectedSuspectId === s.id} onSelect={(id) => updateCaseProgress({ selectedSuspectId: id, stage: "suspects" })} />)}</div>
    <Link to="/evidence" className="mt-6 inline-block border border-amber-200/40 px-4 py-2 text-sm">Review evidence →</Link>
  </section>;
}
