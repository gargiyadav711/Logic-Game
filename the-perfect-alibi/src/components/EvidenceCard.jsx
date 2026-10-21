export default function EvidenceCard({ evidence, checked, onChange }) {
  return (
    <label className={`block cursor-pointer border p-4 transition ${checked ? "border-amber-200 bg-amber-100/10" : "border-white/15 bg-black/20 hover:border-white/30"}`}>
      <span className="flex items-start gap-3">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(evidence.id, event.target.checked)} className="mt-1 accent-amber-200" />
        <span><strong className="font-serif text-lg">{evidence.title}</strong><span className="mt-1 block text-sm leading-6 text-white/65">{evidence.detail}</span></span>
      </span>
    </label>
  );
}
