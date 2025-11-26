import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to login. Please check your credentials.';
      setError(msg);
      setLoading(false);
    }
  };

  const quickFillAdmin = () => {
    setEmail('BSCS3B@gmail.com');
    setPassword('bscsclass2025');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_transparent_55%)]" />
      <div className="relative w-full max-w-md md:max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-slate-700/80 bg-slate-950/90 shadow-card p-6 md:p-7"
        >
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to portal
            </Link>
            
          </div>

          <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
            <LogIn className="h-5 w-5 text-royal" /> Login
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Use your registered student account or the instructor admin credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
                  placeholder="you@student.email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-royal text-white text-sm font-medium shadow-lg shadow-royal/40 hover:bg-blue-600 transition-colors disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="mt-5 text-[11px] text-slate-400 flex items-center justify-between">
            <span>New here? Create your student account.</span>
            <Link to="/register" className="text-royal hover:text-blue-400 font-medium">
              Register
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
