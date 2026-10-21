import { useGame } from "../context/GameContext.jsx";
import { getHistory } from "../services/storageService.js";
import { useEffect, useState } from "react";

export default function Progress() {
  const { cases, progress } = useGame();
  const [history, setHistory] = useState([]);
  useEffect(() => { setHistory(getHistory()); }, []);
  const completed = cases.filter((c) => progress[c.id]?.completed).length;
  const totalScore = cases.reduce((sum, c) => sum + (progress[c.id]?.completed ? Number(progress[c.id]?.score || 0) : 0), 0);
  return <section><p className="text-xs tracking-widest text-amber-200/60">DETECTIVE RECORD</p><h2 className="mt-2 font-serif text-4xl">Progress & History</h2>
    <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="border border-white/15 p-5"><p className="text-xs text-white/50">CASES COMPLETED</p><p className="mt-2 font-serif text-4xl">{completed}/3</p></div><div className="border border-white/15 p-5"><p className="text-xs text-white/50">SAVED SCORE TOTAL</p><p className="mt-2 font-serif text-4xl">{totalScore}</p></div><div className="border border-white/15 p-5"><p className="text-xs text-white/50">ATTEMPTS RECORDED</p><p className="mt-2 font-serif text-4xl">{history.length}</p></div></div>
    <h3 className="mt-8 font-serif text-2xl">Case records</h3><div className="mt-3 space-y-2">{cases.map((c) => <div key={c.id} className="flex items-center justify-between gap-4 border border-white/10 p-4"><div><p className="font-serif text-lg">{c.title}</p><p className="text-xs text-white/45">{c.difficulty} · {progress[c.id]?.completed ? "Completed" : progress[c.id]?.stage || "Not started"}</p></div><p className="text-amber-100">{progress[c.id]?.completed ? `${progress[c.id]?.score || 0}/100` : "—"}</p></div>)}</div>
    <h3 className="mt-8 font-serif text-2xl">Attempt history</h3>{history.length === 0 ? <p className="mt-3 text-sm text-white/50">No submitted attempts yet.</p> : <div className="mt-3 space-y-2">{history.map((h) => <article key={h.attemptId} className="border border-white/10 p-4"><div className="flex flex-wrap justify-between gap-2"><strong>{h.caseTitle}</strong><span>{h.score}/100 · {h.correct ? "Correct" : "Incorrect"}</span></div><p className="mt-1 text-xs text-white/45">{new Date(h.completedAt).toLocaleString()}</p></article>)}</div>}
  </section>;
}
