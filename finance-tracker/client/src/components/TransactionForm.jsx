import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, today } from '../utils/format';

const initial = { type: 'expense', category: 'Food', amount: '', note: '', date: today() };

export default function TransactionForm({ onAdded }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setType = (type) =>
    setForm({ ...form, type, category: (type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0] });

  const submit = async (e) => {
    e.preventDefault();
    if (!(Number(form.amount) > 0)) return toast.error('Enter an amount greater than 0');
    setSaving(true);
    try {
      await api.post('/transactions', { ...form, amount: Number(form.amount) });
      toast.success('Transaction added');
      setForm({ ...initial, type: form.type, category: form.category });
      onAdded();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="font-semibold">Add transaction</h2>
      <div className="grid grid-cols-2 gap-2">
        {['expense', 'income'].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`rounded-lg py-2 text-sm font-medium capitalize ${
              form.type === t ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <select className="input" value={form.category} onChange={set('category')}>
        {categories.map((c) => <option key={c}>{c}</option>)}
      </select>
      <input className="input" type="number" min="0.01" step="0.01" placeholder="Amount" value={form.amount} onChange={set('amount')} />
      <input className="input" type="date" value={form.date} onChange={set('date')} />
      <input className="input" placeholder="Note (optional)" maxLength={200} value={form.note} onChange={set('note')} />
      <button className="btn w-full" disabled={saving}>{saving ? 'Saving…' : 'Add'}</button>
    </form>
  );
}
