import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BasicLayout from './layouts/BasicLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManage from './pages/User';
import UserProfile from './pages/Profile';
import ResourceManage from './pages/Resource';
import BorrowManage from './pages/Borrow';
import NoticeManage from './pages/Notice';

/** 登录守卫 */
function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

/** admin 路由守卫 */
function AdminGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  } catch { return <Navigate to="/login" replace />; }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AuthGuard><BasicLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="user" element={<AdminGuard><UserManage /></AdminGuard>} />
        <Route path="resource" element={<ResourceManage />} />
        <Route path="borrow" element={<BorrowManage />} />
        <Route path="notice" element={<NoticeManage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
