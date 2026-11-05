import { formatCurrency } from '../utils/format';

const tones = {
  green: 'text-emerald-600',
  red: 'text-rose-600',
  blue: 'text-brand-600',
};

// Reusable summary card
export default function StatCard({ label, value, tone = 'blue', icon }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${tones[tone]}`}>{formatCurrency(value)}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  );
}
