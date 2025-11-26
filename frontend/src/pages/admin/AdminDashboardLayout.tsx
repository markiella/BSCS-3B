import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, CheckCircle2, LayoutDashboard, LayoutGrid, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

const AdminDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/95">
        <div className="px-5 pt-5 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-royal/20 border border-royal/60 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Instructor</p>
              <p className="text-xs font-semibold text-slate-50">BSCS3B Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" /> Overview
          </NavLink>
          <NavLink
            to="/admin/approvals"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <CheckCircle2 className="h-4 w-4" /> Project Approvals
          </NavLink>
          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <Users className="h-4 w-4" /> Manage Students
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <LayoutGrid className="h-4 w-4" /> Manage Projects
          </NavLink>
        </nav>
        <div className="px-4 py-4 border-t border-slate-800/80 text-[11px] flex items-center justify-between gap-2">
          <div>
            <p className="font-medium text-slate-100 truncate">{user?.fullName}</p>
            <p className="text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-slate-700/80 text-slate-300 hover:border-rose-500/80 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden px-4 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/95">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Admin Dashboard</p>
            <p className="text-xs font-semibold text-slate-50 truncate">{user?.fullName}</p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700/80 text-[11px] text-slate-300 hover:border-rose-500/80 hover:text-rose-300"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </header>
        <main className="flex-1 px-4 md:px-6 py-5 md:py-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
