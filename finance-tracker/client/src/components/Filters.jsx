import { ALL_CATEGORIES } from '../utils/format';

export default function Filters({ filters, setFilters }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  const active = Object.values(filters).some(Boolean);

  return (
    <div className="card grid grid-cols-2 gap-2 md:grid-cols-5">
      <select className="input" value={filters.type} onChange={set('type')}>
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select className="input" value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>
        {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input className="input" type="date" value={filters.startDate} onChange={set('startDate')} aria-label="From date" />
      <input className="input" type="date" value={filters.endDate} onChange={set('endDate')} aria-label="To date" />
      <button
        className="btn-ghost"
        disabled={!active}
        onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })}
      >
        Clear
      </button>
    </div>
  );
}
