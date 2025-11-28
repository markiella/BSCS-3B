import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Facebook, Github, Globe2, Instagram, LayoutGrid, LogIn, Sparkles, User, UserPlus } from 'lucide-react';
import { api } from '../utils/api';

interface LandingProject {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  posterUrl?: string;
  deployedUrl: string;
  user?: {
    fullName: string;
    contactNumber?: string;
    address?: string;
    birthday?: string;
    profileImageUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    githubUrl?: string;
  };
}

const LandingPage: React.FC = () => {
  const [projects, setProjects] = useState<LandingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<LandingProject | null>(null);
  const [imagePreview, setImagePreview] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<LandingProject[]>('/projects/approved');
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-slate-950 text-slate-50 min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur bg-slate-950/70 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-royal/20 border border-royal/60 flex items-center justify-center shadow-card">
              <Sparkles className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">BSCS 3B</p>
              <p className="text-sm font-semibold text-slate-50">Project Compilation Portal</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/70 text-slate-100 hover:border-royal hover:text-royal transition-colors"
            >
              <LogIn className="h-4 w-4" /> Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal text-white shadow-lg shadow-royal/30 hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="h-4 w-4" /> Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-800/60">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.35),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.85),_transparent_55%)]" />
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-royal bg-royal/10 border border-royal/40 px-3 py-1 rounded-full w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Graphics & Visual Computing · App Dev
              </p>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-50">
                BSCS3B Project Compilation Portal <span className="text-royal">2025</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-xl">
                A centralized platform showcasing all web application projects from BSCS 3B students.
                Built for clean UX, visual storytelling, and seamless instructor review.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-royal text-white text-sm font-medium shadow-lg shadow-royal/30 hover:bg-blue-600 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/70 text-slate-100 text-sm hover:border-royal/70 hover:text-royal transition-colors"
                >
                  <LayoutGrid className="h-4 w-4" />
                  View Approved Projects
                </a>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-royal" />
                  Role-based dashboards for students
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  sign in to upload your project
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                className="absolute -inset-8 rounded-3xl bg-gradient-to-tr from-royal/50 via-sky-500/10 to-transparent blur-3xl"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative flex items-center justify-center"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-royal/40 blur-2xl opacity-70"
                  animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                />
                <motion.img
                  src="/class-logo.png"
                  alt="BSCS 3B Class Logo"
                  className="relative h-60 w-60 md:h-80 md:w-80 object-contain drop-shadow-[0_0_40px_rgba(56,189,248,0.9)]"
                  animate={{ rotate: [0, 1.5, -1.5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="projects" className="max-w-6xl mx-auto px-4 py-14 md:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-50 flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-royal" /> Approved Student Projects
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1">
                Curated, instructor-approved web applications from BSCS 3B.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              Loading approved projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="h-32 flex flex-col items-center justify-center text-sm text-slate-400 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
              <p>No approved projects yet.</p>
              <p className="text-xs mt-1">Once the instructor approves submissions, they will appear here.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project, idx) => (
                <motion.article
                  key={project._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.04 * idx }}
                  className="group rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden shadow-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-royal/25 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden bg-slate-950/60">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                        <Globe2 className="h-10 w-10 text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="inline-flex items-center gap-1.5 bg-slate-950/70 px-2 py-1 rounded-full border border-slate-700/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Approved
                      </span>
                      {project.user?.fullName && (
                        <span className="bg-slate-950/70 px-2 py-1 rounded-full border border-slate-700/70 truncate max-w-[9rem]">
                          {project.user.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-3 text-sm">
                    <div>
                      <h3 className="font-semibold text-slate-50 line-clamp-1 mb-1">{project.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-3">{project.description}</p>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(project.deployedUrl, '_blank', 'noopener,noreferrer')}
                          className="inline-flex flex-1 items-center justify-between gap-2 text-xs px-3 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-100 hover:border-royal/80 hover:text-royal hover:bg-slate-900 transition-colors"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Globe2 className="h-3.5 w-3.5" /> View Live Project
                          </span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center justify-center text-xs px-3 py-2 rounded-full border border-slate-700/80 text-slate-100 hover:border-royal/80 hover:text-royal bg-slate-900/80"
                        >
                          <User className="h-3.5 w-3.5 mr-1" /> Author
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4">
          <div className="max-w-xl w-full rounded-2xl border border-slate-800 bg-slate-950/95 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-900/80">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Author</p>
                <p className="text-sm font-semibold text-slate-50 line-clamp-1">{selectedProject.user?.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="text-xs text-slate-400 hover:text-slate-100 px-2 py-1 rounded-full border border-slate-700/80"
              >
                Close
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4 text-xs md:text-sm text-slate-200">
              <div className="grid md:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] gap-4 items-start">
                <div className="space-y-2">
                  <p className="text-[11px] font-medium text-slate-400">Student details</p>
                  {(selectedProject.user?.profileImageUrl || selectedProject.thumbnailUrl) && (
                    <button
                      type="button"
                      onClick={() =>
                        setImagePreview({
                          url: selectedProject.user?.profileImageUrl || selectedProject.thumbnailUrl || '',
                          alt: `${selectedProject.user?.fullName || 'Student'} profile picture`,
                        })
                      }
                      className="mt-1 inline-flex items-center"
                    >
                      <img
                        src={selectedProject.user?.profileImageUrl || selectedProject.thumbnailUrl}
                        alt={`${selectedProject.user?.fullName || 'Student'} profile picture`}
                        className="h-14 w-14 rounded-full border border-slate-700 object-cover bg-slate-900"
                      />
                    </button>
                  )}
                  <div className="space-y-1.5">
                    {selectedProject.user?.contactNumber && (
                      <p className="text-[11px] text-slate-400">
                        <span className="text-slate-500 mr-1">Contact:</span>
                        {selectedProject.user.contactNumber}
                      </p>
                    )}
                    {selectedProject.user?.address && (
                      <p className="text-[11px] text-slate-400">
                        <span className="text-slate-500 mr-1">Address:</span>
                        {selectedProject.user.address}
                      </p>
                    )}
                    {selectedProject.user?.birthday && (
                      <p className="text-[11px] text-slate-400">
                        <span className="text-slate-500 mr-1">Birthday:</span>
                        {selectedProject.user.birthday}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <p className="text-[11px] font-medium text-slate-400">Project</p>
                    <p className="text-sm font-semibold text-slate-50 line-clamp-1">{selectedProject.title}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-3">{selectedProject.description}</p>
                    {(selectedProject.user?.facebookUrl ||
                      selectedProject.user?.instagramUrl ||
                      selectedProject.user?.githubUrl) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProject.user?.facebookUrl && (
                          <a
                            href={selectedProject.user.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-200 hover:border-royal/80 hover:text-royal"
                          >
                            <Facebook className="h-3.5 w-3.5" />
                            <span>Facebook</span>
                          </a>
                        )}
                        {selectedProject.user?.instagramUrl && (
                          <a
                            href={selectedProject.user.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-200 hover:border-royal/80 hover:text-royal"
                          >
                            <Instagram className="h-3.5 w-3.5" />
                            <span>Instagram</span>
                          </a>
                        )}
                        {selectedProject.user?.githubUrl && (
                          <a
                            href={selectedProject.user.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-slate-700/80 text-[11px] text-slate-200 hover:border-royal/80 hover:text-royal"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedProject.thumbnailUrl && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-medium text-slate-400">Logo</p>
                      <button
                        type="button"
                        onClick={() =>
                          setImagePreview({
                            url: selectedProject.thumbnailUrl || '',
                            alt: `${selectedProject.title} logo`,
                          })
                        }
                        className="block w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80"
                      >
                        <img
                          src={selectedProject.thumbnailUrl}
                          alt={`${selectedProject.title} logo`}
                          className="w-full h-28 object-contain bg-slate-950"
                        />
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-slate-400">Poster</p>
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center">
                      {selectedProject.posterUrl ? (
                        <button
                          type="button"
                          onClick={() =>
                            setImagePreview({
                              url: selectedProject.posterUrl || '',
                              alt: `${selectedProject.title} poster`,
                            })
                          }
                          className="block w-full"
                        >
                          <img
                            src={selectedProject.posterUrl}
                            alt={`${selectedProject.title} poster`}
                            className="w-full h-32 object-cover bg-slate-950"
                          />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 px-3 py-6 text-center">
                          Poster not uploaded yet.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {imagePreview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4"
          onClick={() => setImagePreview(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute -top-3 -right-3 rounded-full bg-slate-900/90 border border-slate-700/80 px-2 py-1 text-[11px] text-slate-200 hover:text-white"
            >
              Close
            </button>
            <img
              src={imagePreview.url}
              alt={imagePreview.alt}
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800 bg-slate-950"
            />
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800/70 bg-slate-950/95">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            BSCS3B Project Compilation System · <span className="text-slate-300">2025</span>
          </p>
          <p className="text-center">
            Graphics & Visual Computing · Application Development · Bachelor of Science in Computer Science
          </p>
          <p className="text-slate-400">Designed for clean UX and visual storytelling.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
