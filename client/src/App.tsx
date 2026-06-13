import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManage from './pages/User';
import UserProfile from './pages/Profile';
import LabPage from './pages/Lab';
import DevicePage from './pages/Device';
import ReservationPage from './pages/Reservation';
import RepairPage from './pages/Repair';
import NoticeManage from './pages/Notice';

/** 登录守卫 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** admin 路由守卫 */
function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  } catch { return <Navigate to="/login" replace />; }

  return <>{children}</>;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AuthGuard><BasicLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="user" element={<AdminGuard><UserManage /></AdminGuard>} />
        <Route path="lab" element={<LabPage />} />
        <Route path="device" element={<DevicePage />} />
        <Route path="reservation" element={<ReservationPage />} />
        <Route path="repair" element={<RepairPage />} />
        <Route path="notice" element={<NoticeManage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
