import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, MessageSquareMore } from 'lucide-react';
import { api } from '../../utils/api';

interface AdminProject {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at?: string;
  user?: {
    fullName?: string;
    email?: string;
  };
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

const formatDate = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
};

const AdminApprovalsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<{ id: string; status: 'approved' | 'rejected' } | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<AdminProject[]>('/admin/projects');
        setProjects(data);
      } catch (err: any) {
        console.error(err);
        const msg = err?.response?.data?.message || 'Failed to load project submissions';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredSubmissions = projects.filter((submission) => {
    if (filter === 'all') return true;
    return submission.status === filter;
  });

  const getStatusBadge = (status: AdminProject['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-400">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
            <Clock className="h-3.5 w-3.5" /> Pending review
          </span>
        );
    }
  };

  const handleDecision = async (submissionId: string, status: 'approved' | 'rejected', feedback: string) => {
    setUpdatingId(submissionId);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await api.patch<AdminProject>(`/admin/projects/${submissionId}/status`, {
        status,
        feedback: feedback || undefined,
      });

      setProjects((prev) => prev.map((p) => (p._id === submissionId ? data : p)));
      setSuccess(status === 'approved' ? 'Project approved successfully.' : 'Project marked for revisions.');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Failed to update project status';
      setError(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const openFeedbackModal = (submissionId: string, status: 'approved' | 'rejected') => {
    setFeedbackTarget({ id: submissionId, status });
    setFeedbackDraft('');
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackTarget) return;
    await handleDecision(feedbackTarget.id, feedbackTarget.status, feedbackDraft.trim());
    setFeedbackTarget(null);
    setFeedbackDraft('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Project approvals
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Review BSCS 3B project submissions, leave feedback, and approve projects for the
            public compilation.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs text-slate-300">
          {(['pending', 'approved', 'rejected', 'all'] as StatusFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition-colors ${
                filter === value
                  ? 'bg-emerald-500 text-emerald-950 shadow-sm shadow-emerald-500/40'
                  : 'bg-transparent text-slate-300 hover:bg-slate-800'
              }`}
            >
              {value === 'pending' && <Clock className="h-3 w-3" />}
              {value === 'approved' && <CheckCircle2 className="h-3 w-3" />}
              {value === 'rejected' && <XCircle className="h-3 w-3" />}
              {value === 'all' && <MessageSquareMore className="h-3 w-3" />}
              <span className="capitalize">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
          {success}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredSubmissions.map((submission) => (
          <motion.div
            key={submission._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 shadow-[0_18px_60px_rgba(15,23,42,0.8)]"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/60 to-emerald-500/0 opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {submission.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {submission.user?.fullName || 'Student'} · {submission.user?.email || 'No email'}
                  </p>
                </div>
                {getStatusBadge(submission.status)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1">
                  <Clock className="h-3 w-3" /> Submitted {formatDate(submission.created_at)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1">
                  <MessageSquareMore className="h-3 w-3" />
                  {submission.feedback ? 'Feedback available' : 'No feedback yet'}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={updatingId === submission._id}
                  onClick={() => openFeedbackModal(submission._id, 'approved')}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-emerald-950 shadow-sm shadow-emerald-500/40 transition hover:bg-emerald-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {updatingId === submission._id ? 'Updating...' : 'Approve for compilation'}
                </button>
                <button
                  type="button"
                  disabled={updatingId === submission._id}
                  onClick={() => openFeedbackModal(submission._id, 'rejected')}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-inset ring-slate-700/80 transition hover:bg-slate-800 hover:text-rose-300 hover:ring-rose-500/60 disabled:opacity-70"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Request revisions
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-300">
              No projects found for this filter.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Once students submit or update their work, they will appear here for review.
            </p>
          </div>
        )}
      </div>

      {feedbackTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 p-4 md:p-5 text-xs md:text-sm space-y-3">
            <p className="text-sm md:text-base font-semibold text-slate-50">
              {feedbackTarget.status === 'approved' ? 'Approve project' : 'Request revisions'}
            </p>
            <p className="text-slate-400">
              {feedbackTarget.status === 'approved'
                ? 'Optional feedback for the student (leave blank to skip).'
                : 'Optional feedback / reason for rejection (leave blank to skip).'}
            </p>
            <textarea
              rows={3}
              value={feedbackDraft}
              onChange={(e) => setFeedbackDraft(e.target.value)}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
              placeholder={
                feedbackTarget.status === 'approved'
                  ? 'Great job! Your project is approved for compilation.'
                  : 'Please update the design, fix responsiveness issues, or address missing content.'
              }
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={updatingId === feedbackTarget.id}
                onClick={() => {
                  if (updatingId === feedbackTarget.id) return;
                  setFeedbackTarget(null);
                  setFeedbackDraft('');
                }}
                className="px-3 py-1.5 rounded-full text-xs md:text-sm text-slate-200 border border-slate-700/80 hover:bg-slate-800 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updatingId === feedbackTarget.id}
                onClick={handleSubmitFeedback}
                className="px-3 py-1.5 rounded-full text-xs md:text-sm bg-emerald-500 text-emerald-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {feedbackTarget.status === 'approved' ? 'Confirm approval' : 'Send request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;
