import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import { formatCurrency } from '../utils/format';

export default function BudgetCard({ monthExpense }) {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(user.monthlyBudget || '');
  const budget = user.monthlyBudget || 0;
  const pct = budget ? Math.min((monthExpense / budget) * 100, 100) : 0;
  const over = budget && monthExpense > budget;

  const save = async () => {
    try {
      const { data } = await api.patch('/auth/budget', { monthlyBudget: Number(value) || 0 });
      setUser(data.user);
      setEditing(false);
      toast.success('Budget updated');
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold">Monthly budget</h2>
        <button className="btn-ghost" onClick={() => setEditing(!editing)}>{editing ? 'Cancel' : 'Edit'}</button>
      </div>
      {editing ? (
        <div className="flex gap-2">
          <input className="input" type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1500" />
          <button className="btn" onClick={save}>Save</button>
        </div>
      ) : budget ? (
        <>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className={`h-full ${over ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {formatCurrency(monthExpense)} of {formatCurrency(budget)} spent this month
            {over && <span className="font-medium text-rose-600"> · Over budget!</span>}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">Set a monthly budget to track your spending.</p>
      )}
    </div>
  );
}
