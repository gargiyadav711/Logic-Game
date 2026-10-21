import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import { validateFinalAccusation } from "../services/validationService.js";
import { saveAttempt, getHistory } from "../services/storageService.js";

export default function FinalDeduction() {
  const { activeCase: c, caseProgress, updateCaseProgress, refreshProgress } = useGame();
  const [suspectId, setSuspectId] = useState(caseProgress.selectedSuspectId || "");
  const [explanation, setExplanation] = useState(caseProgress.explanation || "");
  const [evidenceIds, setEvidenceIds] = useState(caseProgress.selectedEvidenceIds || caseProgress.collectedEvidenceIds || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  if (!c) return <p>No active case. <Link to="/dashboard">Open a case</Link>.</p>;
  const toggle = (id, checked) => setEvidenceIds((prev) => checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id));
  const submit = async (event) => {
    event.preventDefault();
    if (!suspectId || explanation.trim().length < 20) { setError("Choose a suspect and write an explanation of at least 20 characters."); return; }
    setLoading(true); setError("");
    const attempt = { selectedSuspectId: suspectId, explanation: explanation.trim(), selectedEvidenceIds: evidenceIds, challengedStatementIds: caseProgress.challengedStatementIds || [], timelineOrder: caseProgress.timelineOrder || [] };
    try {
      const result = await validateFinalAccusation(c, attempt);
      const attemptId = `${c.id}-${Date.now()}`;
      const finalResult = { ...result, attemptId, caseId: c.id, caseTitle: c.title, selectedSuspectId: suspectId, explanation: explanation.trim(), evidenceIds, completedAt: new Date().toISOString() };
      updateCaseProgress({ ...attempt, selectedSuspectId: suspectId, explanation: explanation.trim(), selectedEvidenceIds: evidenceIds, completed: true, score: result.score, result: finalResult, stage: "solved", attempts: (caseProgress.attempts || 0) + 1 });
      saveAttempt(finalResult);
      refreshProgress();
      navigate("/case-solved", { state: { result: finalResult } });
    } catch (err) {
      setError(err.message || "Could not validate your accusation. Your progress has been preserved.");
    } finally { setLoading(false); }
  };
  return <section><p className="text-xs tracking-widest text-amber-200/60">FINAL REPORT</p><h2 className="mt-2 font-serif text-4xl">Who is responsible?</h2>
    <p className="mt-3 text-white/60">Your accusation must cite evidence. Only selected evidence is included in your final report.</p>
    <form onSubmit={submit} className="mt-6 max-w-3xl space-y-5">
      <label className="block text-sm">Accuse a suspect<select value={suspectId} onChange={(e) => setSuspectId(e.target.value)} className="mt-2 block w-full border border-white/20 bg-[#201b15] p-3 text-white" required><option value="">Select suspect…</option>{c.suspects.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}</select></label>
      <fieldset><legend className="mb-2 text-sm">Evidence supporting your accusation</legend><div className="space-y-2">{c.evidence.map((e) => <label key={e.id} className="flex gap-3 border border-white/15 p-3 text-sm"><input type="checkbox" checked={evidenceIds.includes(e.id)} onChange={(event) => toggle(e.id, event.target.checked)} className="accent-amber-200"/><span>{e.title}<span className="block text-white/50">{e.detail}</span></span></label>)}</div></fieldset>
      <label className="block text-sm">Explain your deduction<textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={5} className="mt-2 block w-full border border-white/20 bg-black/30 p-3 text-white" placeholder="Explain which evidence contradicts the alibi and why…" required minLength={20}/></label>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      <button disabled={loading} className="border border-amber-200/50 bg-amber-100/10 px-5 py-3 text-sm tracking-widest text-amber-100 disabled:opacity-50">{loading ? "VALIDATING…" : "SUBMIT FINAL ACCUSATION"}</button>
    </form>
  </section>;
}
