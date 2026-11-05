import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/format';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16'];

export default function Charts({ transactions }) {
  // Pie: expense per category
  const pieData = useMemo(() => {
    const map = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => (map[t.category] = (map[t.category] || 0) + t.amount));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  // Bar: income vs expense per month
  const barData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      map[m] = map[m] || { month: m, income: 0, expense: 0 };
      map[m][t.type] += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [transactions]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card">
        <h2 className="mb-2 font-semibold">Spending by category</h2>
        {pieData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={formatCurrency} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-16 text-center text-sm text-slate-500">Add an expense to see the breakdown.</p>
        )}
      </div>
      <div className="card">
        <h2 className="mb-2 font-semibold">Monthly income vs expense</h2>
        {barData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={formatCurrency} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-16 text-center text-sm text-slate-500">No data yet.</p>
        )}
      </div>
    </div>
  );
}
