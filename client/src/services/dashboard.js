import request from '../utils/request';

export async function getDashboardStats() {
  return request.get('/dashboard/stats');
}
