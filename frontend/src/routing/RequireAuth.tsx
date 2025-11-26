import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

interface Props {
  role?: 'student' | 'admin';
}

const RequireAuth: React.FC<Props> = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
