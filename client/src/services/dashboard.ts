import request from '../utils/request';

/** 获取仪表盘统计数据 */
export async function getDashboardStats() {
  return request.get('/dashboard/stats');
}
