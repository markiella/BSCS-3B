import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, LayoutGrid, LogOut, Megaphone, User, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';

const StudentDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-800/80 bg-slate-950/95">
        <div className="px-5 pt-5 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-royal/20 border border-royal/60 flex items-center justify-center">
              <LayoutGrid className="h-5 w-5 text-royal" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Student</p>
              <p className="text-xs font-semibold text-slate-50">BSCS3B Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-xs">
          <NavLink
            to="/dashboard"
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
            to="/dashboard/my-project"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <LayoutGrid className="h-4 w-4" /> My Project
          </NavLink>
          <NavLink
            to="/dashboard/notifications"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <Megaphone className="h-4 w-4" /> Notifications
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'bg-royal text-white' : 'text-slate-300 hover:bg-slate-900/80 hover:text-slate-50'
              }`
            }
          >
            <User className="h-4 w-4" /> Profile
          </NavLink>
        </nav>
        <div className="px-4 py-4 border-t border-slate-800/80 text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <UserCircle2 className="h-5 w-5 text-slate-400" />
            <div className="truncate">
              <p className="font-medium text-slate-100 truncate">{user?.fullName}</p>
              <p className="text-slate-500 truncate">{user?.email}</p>
            </div>
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
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Student Dashboard</p>
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

export default StudentDashboardLayout;
