import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RequireAuth from './routing/RequireAuth';
import StudentDashboardLayout from './pages/student/StudentDashboardLayout';
import StudentHome from './pages/student/StudentHome';
import MyProjectsPage from './pages/student/MyProjectsPage';
import StudentNotificationsPage from './pages/student/StudentNotificationsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import AdminDashboardLayout from './pages/admin/AdminDashboardLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminApprovalsPage from './pages/admin/AdminApprovalsPage';
import AdminStudentsPage from './pages/admin/AdminStudentsPage';
import AdminManageProjectsPage from './pages/admin/AdminManageProjectsPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<RequireAuth role="student" />}>
          <Route path="/dashboard" element={<StudentDashboardLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="my-project" element={<MyProjectsPage />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
            <Route path="profile" element={<StudentProfilePage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth role="admin" />}>
          <Route path="/admin" element={<AdminDashboardLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="approvals" element={<AdminApprovalsPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="projects" element={<AdminManageProjectsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
