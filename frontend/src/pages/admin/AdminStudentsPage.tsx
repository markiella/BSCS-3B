import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter } from 'lucide-react';
import { api } from '../../utils/api';

interface StudentSummary {
  id: string;
  name: string;
  email: string;
  section: string;
  projectsCount: number;
  approved: number;
  pending: number;
  rejected: number;
}

interface StudentTotals {
  students: number;
  projects: number;
  approved: number;
  pending: number;
  rejected: number;
}

const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'all' | 'BSCS 3B'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<StudentSummary[]>('/admin/students');

        const normalized: StudentSummary[] = data.map((student: any) => ({
          id: String(student.id ?? student._id),
          name: student.name ?? student.fullName ?? '',
          email: student.email ?? '',
          section: student.section ?? 'BSCS 3B',
          projectsCount: Number(student.projectsCount ?? 0) || 0,
          approved: Number(student.approved ?? 0) || 0,
          pending: Number(student.pending ?? 0) || 0,
          rejected: Number(student.rejected ?? 0) || 0,
        }));

        setStudents(normalized);
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to load students';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student: StudentSummary) => {
      const matchesQuery =
        !query ||
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase());

      const matchesSection = sectionFilter === 'all' || student.section === sectionFilter;

      return matchesQuery && matchesSection;
    });
  }, [students, query, sectionFilter]);

  const totals = useMemo(() => {
    return filteredStudents.reduce(
      (acc: StudentTotals, student: StudentSummary) => {
        acc.students += 1;
        acc.projects += student.projectsCount;
        acc.approved += student.approved;
        acc.pending += student.pending;
        acc.rejected += student.rejected;
        return acc;
      },
      { students: 0, projects: 0, approved: 0, pending: 0, rejected: 0 } as StudentTotals,
    );
  }, [filteredStudents]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">Students</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            View BSCS students, their sections, and how many projects they have in the
            compilation pipeline.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full rounded-full border border-slate-800 bg-slate-950 px-9 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs text-slate-300">
            <Filter className="ml-1 h-3 w-3 text-slate-500" />
            {['all', 'BSCS 3B'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSectionFilter(value as 'all' | 'BSCS 3B')}
                className={`rounded-full px-3 py-1 transition-colors ${
                  sectionFilter === value
                    ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/40'
                    : 'bg-transparent text-slate-300 hover:bg-slate-800'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Students</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">{totals.students}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Total projects</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">{totals.projects}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-xs font-medium text-slate-400">Approved for compilation</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">{totals.approved}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-2 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {loading ? 'Loading students…' : `${filteredStudents.length} students`}
          </span>
          <span className="text-slate-500">Section · Projects · Approved · Pending · Rejected</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredStudents.map((student: StudentSummary) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2 px-4 py-3 text-xs text-slate-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-50">{student.name}</p>
                <p className="text-[11px] text-slate-400">{student.email}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="rounded-full bg-slate-900 px-2 py-1 text-slate-200">
                  {student.section}
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-1">
                  {student.projectsCount} project(s)
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-300">
                  {student.approved} approved
                </span>
                <span className="rounded-full bg-amber-500/10 px-2 py-1 text-amber-200">
                  {student.pending} pending
                </span>
                <span className="rounded-full bg-rose-500/10 px-2 py-1 text-rose-300">
                  {student.rejected} rejected
                </span>
              </div>
            </motion.div>
          ))}

          {filteredStudents.length === 0 && (
            <div className="px-6 py-10 text-center text-xs text-slate-400">
              No students match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
