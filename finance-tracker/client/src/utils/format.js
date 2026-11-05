export const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
export const formatCurrency = (n) => currency.format(n || 0);

export const formatDate = (iso) =>
  new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

export const today = () => new Date().toISOString().slice(0, 10);

// Export visible transactions to a CSV download
export function exportCSV(transactions) {
  const rows = [['Date', 'Type', 'Category', 'Amount', 'Note']];
  transactions.forEach((t) =>
    rows.push([t.date.slice(0, 10), t.type, t.category, t.amount, `"${(t.note || '').replace(/"/g, '""')}"`])
  );
  const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}
