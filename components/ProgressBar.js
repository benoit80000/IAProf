export default function ProgressBar({ value = 0, max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="progress-track" aria-label="Progression">
      <div className="progress-bar" style={{ width: pct + "%" }} />
    </div>
  );
}
