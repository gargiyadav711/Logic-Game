import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import EvidenceCard from "../components/EvidenceCard.jsx";

export default function EvidenceBoard() {
  const { activeCase: c, caseProgress, updateCaseProgress } = useGame();
  if (!c) return <p>No active case. <Link to="/dashboard">Open a case</Link>.</p>;
  const selected = caseProgress.collectedEvidenceIds || [];
  const toggle = (id, checked) => {
    const next = checked ? [...new Set([...selected, id])] : selected.filter((x) => x !== id);
    updateCaseProgress({ collectedEvidenceIds: next, selectedEvidenceIds: next, stage: "evidence" });
  };
  return <section><p className="text-xs tracking-widest text-amber-200/60">FORENSIC RECORD</p><h2 className="mt-2 font-serif text-4xl">Evidence Board</h2>
    <p className="mt-3 text-white/60">Select the evidence you believe is relevant. Selected evidence is saved automatically.</p>
    <div className="mt-6 grid gap-3 md:grid-cols-2">{c.evidence.map((e) => <EvidenceCard key={e.id} evidence={e} checked={selected.includes(e.id)} onChange={toggle} />)}</div>
    <div className="mt-6 flex flex-wrap gap-3"><Link to="/timeline" className="border border-amber-200/40 px-4 py-2 text-sm">Reconstruct timeline →</Link><Link to="/interrogation" className="border border-white/20 px-4 py-2 text-sm">Challenge statements →</Link></div>
  </section>;
}
