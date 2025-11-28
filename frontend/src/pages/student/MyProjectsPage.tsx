import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Globe2, Plus, Trash2, XCircle } from 'lucide-react';
import { api } from '../../utils/api';

interface MyProject {
  _id: string;
  title: string;
  description: string;
  category?: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  deployedUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
}

const emptyForm: Omit<MyProject, '_id' | 'status'> = {
  title: '',
  description: '',
  category: '',
  thumbnailUrl: '',
  posterUrl: '',
  deployedUrl: '',
};

const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<MyProject[]>('/projects/me');
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setThumbnailFile(null);
    setPosterFile(null);
  };

  const startEdit = (project: MyProject) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      category: project.category || '',
      thumbnailUrl: project.thumbnailUrl || '',
      posterUrl: project.posterUrl || '',
      deployedUrl: project.deployedUrl,
    });
    setThumbnailFile(null);
    setPosterFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const isEditing = !!editingId;
    setSaving(true);
    try {
      const payload: typeof form = { ...form };

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('file', thumbnailFile);

        const { data } = await api.post<{ url: string }>('/uploads/thumbnail', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        payload.thumbnailUrl = data.url;
      }

      if (posterFile) {
        const posterData = new FormData();
        posterData.append('file', posterFile);

        const { data: posterRes } = await api.post<{ url: string }>('/uploads/thumbnail', posterData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        (payload as any).posterUrl = posterRes.url;
      }

      if (editingId) {
        await api.patch(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      await load();
      setEditingId(null);
      setForm(emptyForm);
      setThumbnailFile(null);
      setPosterFile(null);
      setSuccess(isEditing ? 'Project updated successfully.' : 'Project submitted successfully.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Unable to save project';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      await load();
      setSuccess('Project deleted successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-50">My Project</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl">
            Submit your deployed web application here. You can update the details anytime the admin will see the
            latest version when reviewing.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.15fr),minmax(0,1fr)] gap-5 items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 space-y-3 text-xs md:text-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-slate-100">
              {editingId ? 'Edit project' : 'Add new project'}
            </p>
            <p className="text-[11px] text-slate-500">Status resets to pending on instructor changes only.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-300">Project title</label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
                placeholder="Portfolio, E-commerce, etc."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-300">Poster Image</label>
              <input
                name="posterFile"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] || null;
                  setPosterFile(file);
                }}
                className="w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
              <p className="text-[10px] text-slate-500">Optional large poster that appears in the author details.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-medium text-slate-300">Short description</label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal resize-none"
              placeholder="Explain what your web app does in 1-3 sentences."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-300">Deployed URL</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                  <Globe2 className="h-4 w-4" />
                </span>
                <input
                  name="deployedUrl"
                  type="url"
                  required
                  value={form.deployedUrl}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-royal focus:border-royal"
                  placeholder="https://your-project.vercel.app"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-300">Logo Image</label>
              <input
                name="thumbnailFile"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0] || null;
                  setThumbnailFile(file);
                }}
                className="w-full text-[11px] text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
              />
              <p className="text-[10px] text-slate-500">
                Upload a logo or thumbnail image (max 5MB). If you don&apos;t upload one, a default style will be
                used.
              </p>
            </div>
          </div>

          {error && (
            <div className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2">
              {error}
            </div>
          )}
          {success && !error && (
            <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-xl px-3 py-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-royal text-white text-xs md:text-sm font-medium shadow-lg shadow-royal/40 hover:bg-blue-600 transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : editingId ? 'Update project' : 'Submit project'}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 md:p-5 text-xs md:text-sm space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-slate-100">Your submissions</p>
            {loading && <p className="text-[11px] text-slate-500">Loading...</p>}
          </div>

          {projects.length === 0 && !loading ? (
            <p className="text-slate-500 text-xs">
              You have no submissions yet. Use the form on the left to create your first project.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {projects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2.5 flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    {project.status === 'approved' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {project.status === 'pending' && <Globe2 className="h-4 w-4 text-amber-300" />}
                    {project.status === 'rejected' && <XCircle className="h-4 w-4 text-rose-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-medium text-slate-100 truncate">{project.title}</p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] capitalize border ${
                          project.status === 'approved'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
                            : project.status === 'rejected'
                            ? 'bg-rose-500/10 border-rose-500/50 text-rose-200'
                            : 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    {project.feedback && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        <span className="text-slate-500 mr-1">Feedback:</span>
                        {project.feedback}
                      </p>
                    )}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(project)}
                        className="text-[11px] text-royal hover:text-blue-400"
                      >
                        Edit details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project._id)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-300"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProjectsPage;
