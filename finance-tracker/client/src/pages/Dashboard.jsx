import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import Charts from '../components/Charts.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Filters from '../components/Filters.jsx';
import BudgetCard from '../components/BudgetCard.jsx';
import { exportCSV } from '../utils/format';

const emptyFilters = { type: '', category: '', startDate: '', endDate: '' };

export default function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ monthExpense: 0 });
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const [tx, sum] = await Promise.all([api.get('/transactions', { params }), api.get('/transactions/summary')]);
      setTransactions(tx.data);
      setSummary(sum.data);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  // Optimistic delete: remove from UI first, roll back on failure
  const remove = async (id) => {
    const prev = transactions;
    setTransactions(prev.filter((t) => t._id !== id));
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      const sum = await api.get('/transactions/summary');
      setSummary(sum.data);
    } catch (err) {
      setTransactions(prev);
      toast.error(errMsg(err));
    }
  };

  // Stats for the currently filtered view
  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <h2 className="text-2xl font-bold">Hello, {user.name.split(' ')[0]} 👋</h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Income" value={income} tone="green" icon="📈" />
          <StatCard label="Expenses" value={expense} tone="red" icon="📉" />
          <StatCard label="Balance" value={income - expense} tone="blue" icon="💰" />
        </div>

        <Charts transactions={transactions} />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <TransactionForm onAdded={load} />
            <BudgetCard monthExpense={summary.monthExpense} />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Filters filters={filters} setFilters={setFilters} />
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Transactions ({transactions.length})</h2>
              <button className="btn-ghost" disabled={!transactions.length} onClick={() => exportCSV(transactions)}>
                ⬇ Export CSV
              </button>
            </div>
            <TransactionList transactions={transactions} onDelete={remove} loading={loading} />
          </div>
        </div>
      </main>
    </>
  );
}
