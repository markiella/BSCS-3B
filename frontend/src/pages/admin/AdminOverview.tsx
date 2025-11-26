import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, LayoutGrid, Users, XCircle } from 'lucide-react';
import { api } from '../../utils/api';

interface LatestProject {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  user?: {
    fullName: string;
    email: string;
  };
}

interface StatsResponse {
  totalStudents: number;
  totalProjects: number;
  approvedProjects: number;
  pendingProjects: number;
  latestProjects: LatestProject[];
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<StatsResponse>('/admin/stats');
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-50">Class overview</h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Monitor BSCS 3B submissions, quickly see pending approvals, and review the latest student projects from a
          single dashboard.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total students</p>
          <p className="text-2xl font-semibold text-slate-50">{stats?.totalStudents ?? '—'}</p>
          <p className="text-[11px] text-slate-500">Active BSCS 3B student accounts.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.04 }}
          className="rounded-2xl bg-slate-900/80 border border-slate-700/80 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Total submissions</p>
          <p className="text-2xl font-semibold text-slate-50">{stats?.totalProjects ?? '—'}</p>
          <p className="text-[11px] text-slate-500">All student web application entries.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/60 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">Approved</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-emerald-300">{stats?.approvedProjects ?? '—'}</p>
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
          </div>
          <p className="text-[11px] text-emerald-200/80">Published on the public portal.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.12 }}
          className="rounded-2xl bg-amber-500/10 border border-amber-500/60 px-4 py-3 flex flex-col gap-1.5"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300">Pending approvals</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold text-amber-300">{stats?.pendingProjects ?? '—'}</p>
            <Clock3 className="h-5 w-5 text-amber-300" />
          </div>
          <p className="text-[11px] text-amber-200/80">Waiting for your review.</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)] gap-5 items-start">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 text-xs md:text-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-royal" />
              <p className="font-medium text-slate-100">Latest submissions</p>
            </div>
            {loading && <p className="text-[11px] text-slate-500">Loading...</p>}
          </div>

          {!stats || stats.latestProjects.length === 0 ? (
            <p className="text-xs text-slate-400">No projects submitted yet.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {stats.latestProjects.map((project) => (
                <div
                  key={project._id}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2.5 flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {project.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {project.status === 'pending' && <Clock3 className="h-4 w-4 text-amber-300" />}
                    {project.status === 'rejected' && <XCircle className="h-4 w-4 text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-100 truncate">{project.title}</p>
                    {project.user && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {project.user.fullName} · {project.user.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 text-xs md:text-sm space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-royal" />
            <p className="font-medium text-slate-100">Quick guide</p>
          </div>
          <p className="text-slate-400">
            Use this admin panel to manage BSCS 3B project submissions:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>
              Go to <span className="text-slate-100 font-medium">Project Approvals</span> to approve or reject
              individual projects.
            </li>
            <li>
              Use <span className="text-slate-100 font-medium">Manage Students</span> to deactivate or delete student
              accounts.
            </li>
            <li>
              In <span className="text-slate-100 font-medium">Manage Projects</span>, you can edit details or remove
              any submission.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
