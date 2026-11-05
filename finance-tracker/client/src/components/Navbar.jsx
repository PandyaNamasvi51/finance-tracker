import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-bold text-brand-600">💸 FinTrack</h1>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-slate-500 sm:inline">{user?.email}</span>
          <button className="btn-ghost" onClick={toggle} aria-label="Toggle dark mode">{dark ? '☀️' : '🌙'}</button>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
}
