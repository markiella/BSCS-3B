import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../state/AuthContext';

interface StudentProject {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
}

const StudentHome: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<StudentProject[]>('/projects/me');
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;
    const approved = projects.filter((p) => p.status === 'approved').length;
    const pending = projects.filter((p) => p.status === 'pending').length;
    const rejected = projects.filter((p) => p.status === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [projects]);

  const upcomingBirthday = useMemo(() => {
    const birthdayStr = user?.birthday;
    if (!birthdayStr) return null;

    const parsed = new Date(birthdayStr);
    if (Number.isNaN(parsed.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    const month = parsed.getMonth();
    const day = parsed.getDate();
    if (Number.isNaN(month) || Number.isNaN(day)) return null;

    let nextBirthday = new Date(currentYear, month, day);
    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, month, day);
    }

    const diffMs = nextBirthday.getTime() - today.getTime();
    const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0 || daysRemaining > 7) return null;

    const dateLabel = nextBirthday.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
    });

    return { dateLabel, daysRemaining };
  }, [user?.birthday]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-50 mb-1">Welcome back, {user?.fullName}</h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          This dashboard helps you submit and track your BSCS 3B web application project. Once approved by the
          instructor, your work will be featured on the public landing page.
        </p>
      </div>

      {upcomingBirthday && (
        <div className="rounded-2xl bg-gradient-to-r from-royal/40 via-emerald-500/15 to-slate-900 border border-royal/60 px-4 py-3 text-xs md:text-sm text-slate-50 flex flex-col gap-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">Upcoming birthday</p>
          <p className="text-sm md:text-base font-semibold">
            {upcomingBirthday.daysRemaining === 0
              ? 'Happy birthday! Wishing you an amazing year ahead.'
              : `Your birthday is coming up on ${upcomingBirthday.dateLabel}.`}
          </p>
          {upcomingBirthday.daysRemaining > 0 && (
            <p className="text-[11px] text-slate-200/80">
              {upcomingBirthday.daysRemaining === 1
                ? 'In 1 day.'
                : `In ${upcomingBirthday.daysRemaining} days.`}
            </p>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Submitted Projects</p>
          <p className="text-2xl font-semibold text-slate-50">{stats.total}</p>
          <p className="text-[11px] text-slate-500">You can create, edit, or delete your project anytime.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/60 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">Approved</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-emerald-300">{stats.approved}</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="text-[11px] text-emerald-200/80">These projects are already live on the portal.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="rounded-2xl bg-amber-500/10 border border-amber-500/60 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Pending</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-amber-300">{stats.pending}</p>
            <Clock3 className="h-5 w-5 text-amber-300" />
          </div>
          <p className="text-[11px] text-amber-200/80">Waiting for instructor review and feedback.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="rounded-2xl bg-rose-500/10 border border-rose-500/60 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-rose-300">Rejected</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-rose-300">{stats.rejected}</p>
            <XCircle className="h-5 w-5 text-rose-300" />
          </div>
          <p className="text-[11px] text-rose-200/80">Check notifications for revision notes.</p>
        </motion.div>
      </div>

      <div className="mt-2 rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-300">
        <p className="font-medium mb-1">What to do next?</p>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>Go to <span className="text-slate-100 font-medium">My Project</span> to upload or update your deployed app.</li>
          <li>Use a clear thumbnail URL (e.g., hosted image) to make your project visually stand out.</li>
          <li>Watch the <span className="text-emerald-300 font-medium">Notifications</span> tab for approval or revision feedback.</li>
        </ul>
      </div>
    </div>
  );
};

export default StudentHome;
