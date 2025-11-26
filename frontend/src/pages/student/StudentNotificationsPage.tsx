import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, Info, XCircle } from 'lucide-react';
import { api } from '../../utils/api';

interface NotificationProject {
  _id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  updated_at?: string;
}

const StudentNotificationsPage: React.FC = () => {
  const [projects, setProjects] = useState<NotificationProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<NotificationProject[]>('/projects/me');
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-slate-50">Notifications</h2>
        <p className="text-xs md:text-sm text-slate-400 max-w-xl">
          Here you will see when your project has been approved or rejected by the instructor, including any feedback or
          revision notes.
        </p>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Loading notifications...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-500" />
          You have no project submissions yet. Submit a project first to receive notifications.
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3 text-xs md:text-sm flex gap-3"
            >
              <div className="mt-0.5">
                {project.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                {project.status === 'pending' && <Clock3 className="h-4 w-4 text-amber-300" />}
                {project.status === 'rejected' && <XCircle className="h-4 w-4 text-rose-400" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-100 mb-0.5">{project.title}</p>
                <p className="text-[11px] text-slate-400 mb-1">
                  {project.status === 'approved' && 'Your project has been approved by the instructor.'}
                  {project.status === 'pending' && 'Your project is pending review. Please wait for instructor feedback.'}
                  {project.status === 'rejected' &&
                    'Your project has been rejected. Please review the feedback and revise your submission.'}
                </p>
                {project.feedback && (
                  <p className="text-[11px] text-slate-300">
                    <span className="text-slate-500 mr-1">Feedback:</span>
                    {project.feedback}
                  </p>
                )}
                {project.updated_at && (
                  <p className="mt-1 text-[10px] text-slate-500">Last updated · {formatDate(project.updated_at)}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsPage;
