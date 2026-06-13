import { useMemo } from 'react';

interface UserInfo {
  id?: number;
  username?: string;
  role?: string;
}

export function useAuth() {
  const user = useMemo<UserInfo>(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch { return {}; }
  }, []);

  const isAdmin = user.role === 'admin';

  return { user, isAdmin };
}
