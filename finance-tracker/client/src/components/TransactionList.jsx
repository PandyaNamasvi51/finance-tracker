import { formatCurrency, formatDate } from '../utils/format';

export default function TransactionList({ transactions, onDelete, loading }) {
  if (loading) return <div className="card text-center text-slate-500">Loading transactions…</div>;
  if (!transactions.length)
    return <div className="card text-center text-slate-500">No transactions found. Add your first one! 🎉</div>;

  return (
    <div className="card divide-y divide-slate-100 p-0 dark:divide-slate-700">
      {transactions.map((t) => (
        <div key={t._id} className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-medium">{t.category}</p>
            <p className="truncate text-xs text-slate-500">{formatDate(t.date)}{t.note ? ` · ${t.note}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
            </span>
            <button onClick={() => onDelete(t._id)} className="text-slate-400 hover:text-rose-600" aria-label="Delete transaction">🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}
