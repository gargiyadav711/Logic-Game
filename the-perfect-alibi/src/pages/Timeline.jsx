import { Link } from "react-router-dom";
import { useGame } from "../context/GameContext.jsx";
import TimelineEvent from "../components/TimelineEvent.jsx";
import { validateTimeline } from "../services/logicEngine.js";

export default function Timeline() {
  const { activeCase: c, caseProgress, updateCaseProgress } = useGame();
  if (!c) return <p>No active case. <Link to="/dashboard">Open a case</Link>.</p>;
  const canonical = c.timeline.slice().sort((a,b) => a.order - b.order);
  const ids = caseProgress.timelineOrder?.length === canonical.length ? caseProgress.timelineOrder : canonical.map((e) => e.id);
  const events = ids.map((id) => canonical.find((e) => e.id === id)).filter(Boolean);
  const move = (index, delta) => {
    const next = [...events]; const target = index + delta;
    [next[index], next[target]] = [next[target], next[index]];
    updateCaseProgress({ timelineOrder: next.map((e) => e.id), stage: "timeline" });
  };
  const result = validateTimeline(c, events.map((e) => e.id));
  return <section><p className="text-xs tracking-widest text-amber-200/60">CHRONOLOGY</p><h2 className="mt-2 font-serif text-4xl">Reconstruct the Timeline</h2>
    <p className="mt-3 text-white/60">Use the arrows to arrange events from earliest to latest. This baseline includes the case's default order; rearrange it to test your deduction.</p>
    <div className="mt-6 space-y-3">{events.map((e,i) => <TimelineEvent key={e.id} event={e} index={i} total={events.length} onMove={move}/>)}</div>
    <p className="mt-4 text-sm text-amber-100/80">Current timeline score: {result.score}/10</p>
    <Link to="/interrogation" className="mt-5 inline-block border border-amber-200/40 px-4 py-2 text-sm">Continue to interrogation →</Link>
  </section>;
}
