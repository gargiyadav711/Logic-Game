import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import { validateStatementChallenge } from "../services/validationService.js";
import { useState } from "react";

export default function Interrogation() {
  const { activeCase: c, caseProgress, updateCaseProgress } = useGame();
  const [feedback, setFeedback] = useState({});
  if (!c) return <p>No active case. <Link to="/dashboard">Open a case</Link>.</p>;
  const evidenceIds = caseProgress.collectedEvidenceIds || [];
  const challenge = async (statement) => {
    const result = await validateStatementChallenge(c, statement.id, evidenceIds);
    setFeedback((prev) => ({ ...prev, [statement.id]: result }));
    if (result.status === "contradicted") {
      updateCaseProgress({ challengedStatementIds: [...new Set([...(caseProgress.challengedStatementIds || []), statement.id])], stage: "interrogation" });
    }
  };
  return <section><p className="text-xs tracking-widest text-amber-200/60">QUESTIONING ROOM</p><h2 className="mt-2 font-serif text-4xl">Interrogation</h2>
    <p className="mt-3 text-white/60">Select evidence on the Evidence Board first, then challenge a statement using related evidence.</p>
    <div className="mt-6 space-y-4">{c.statements.map((s) => {
      const suspect = c.suspects.find((x) => x.id === s.suspectId);
      const related = c.evidence.filter((e) => s.relatedEvidenceIds.includes(e.id));
      return <article key={s.id} className="border border-white/15 bg-black/20 p-5">
        <p className="text-xs tracking-widest text-amber-200/60">{suspect?.name || "Unknown suspect"}</p>
        <p className="mt-2 leading-6">“{s.text}”</p>
        <p className="mt-3 text-xs text-white/50">Related evidence: {related.map((e) => `${e.title}${evidenceIds.includes(e.id) ? " ✓" : ""}`).join(" · ")}</p>
        <button onClick={() => challenge(s)} disabled={!related.some((e) => evidenceIds.includes(e.id))} className="mt-4 border border-amber-200/40 px-3 py-2 text-xs disabled:opacity-40">Challenge with selected evidence</button>
        {feedback[s.id] && <p role="status" className="mt-3 text-sm text-amber-100">{feedback[s.id].status.toUpperCase()}: {feedback[s.id].feedback}</p>}
      </article>;
    })}</div>
    <Link to="/deduction" className="mt-6 inline-block border border-amber-200/40 px-4 py-2 text-sm">Make final deduction →</Link>
  </section>;
}
