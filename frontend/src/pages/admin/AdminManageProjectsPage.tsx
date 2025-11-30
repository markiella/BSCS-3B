import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Layers, FolderGit2 } from 'lucide-react';
import { api } from '../../utils/api';

type ProjectStatus = 'pending' | 'approved' | 'rejected';

interface AdminProjectSummary {
  id: string;
  title: string;
  ownerName: string;
  section: string;
  status: ProjectStatus;
  lastUpdated: string;
  deployedUrl?: string;
}

type ProjectTotals = Record<'total' | ProjectStatus, number>;

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
};

const AdminManageProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProjectSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'BSCS 3A' | 'BSCS 3B'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<any[]>('/admin/projects');
        const mapped: AdminProjectSummary[] = data.map((project) => ({
          id: project._id,
          title: project.title,
          ownerName: project.user?.fullName || 'Student',
          section: 'BSCS 3B',
          status: project.status as ProjectStatus,
          lastUpdated: formatDate(project.updated_at || project.created_at),
          deployedUrl: project.deployedUrl,
        }));
        setProjects(mapped);
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to load projects';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesSection = sectionFilter === 'all' || project.section === sectionFilter;
      return matchesStatus && matchesSection;
    });
  }, [projects, statusFilter, sectionFilter]);

  const totals = useMemo(() => {
    return filteredProjects.reduce(
      (acc: ProjectTotals, project: AdminProjectSummary) => {
        acc.total += 1;
        acc[project.status] += 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 } as ProjectTotals,
    );
  }, [filteredProjects]);

  const statusLabel: Record<ProjectStatus | 'all', string> = {
    all: 'All statuses',
    pending: 'Pending review',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  const statusChipClass: Record<ProjectStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-200',
    approved: 'bg-emerald-500/10 text-emerald-300',
    rejected: 'bg-rose-500/10 text-rose-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Manage projects
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Browse all BSCS compilation projects, filter by status and section, and quickly
            see which works are ready to be showcased.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs text-slate-300">
            <Filter className="ml-1 h-3 w-3 text-slate-500" />
            {(['all', 'pending', 'approved', 'rejected'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value === 'all' ? 'all' : value)}
                className={`rounded-full px-3 py-1 transition-colors ${
                  statusFilter === value
                    ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/40'
                    : 'bg-transparent text-slate-300 hover:bg-slate-800'
                }`}
              >
                {statusLabel[value]}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs text-slate-300">
            <Layers className="ml-1 h-3 w-3 text-slate-500" />
            {['all', 'BSCS 3A', 'BSCS 3B'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSectionFilter(value as 'all' | 'BSCS 3A' | 'BSCS 3B')}
                className={`rounded-full px-3 py-1 transition-colors ${
                  sectionFilter === value
                    ? 'bg-slate-100 text-slate-900 shadow-sm shadow-slate-100/40'
                    : 'bg-transparent text-slate-300 hover:bg-slate-800'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Total projects</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">{totals.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Rejected</p>
          <p className="mt-1 text-2xl font-semibold text-rose-300">{totals.rejected}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Pending review</p>
          <p className="mt-1 text-2xl font-semibold text-amber-200">{totals.pending}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Approved</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">{totals.approved}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 max-h-[480px] overflow-y-auto pr-1">
        {filteredProjects.map((project: AdminProjectSummary) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.8)] sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-50">{project.title}</h2>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                {project.ownerName} · {project.section}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Last updated {project.lastUpdated}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 text-xs">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  statusChipClass[project.status]
                }`}
              >
                {statusLabel[project.status]}
              </span>

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 ring-1 ring-inset ring-slate-700/80 transition hover:bg-slate-800 hover:text-emerald-300 hover:ring-emerald-500/60"
                onClick={() => project.deployedUrl && window.open(project.deployedUrl, '_blank', 'noopener,noreferrer')}
              >
                Open project details
              </button>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 px-6 py-10 text-center text-sm text-slate-400">
            No projects match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageProjectsPage;
