import request from '../utils/request';

/** 报修列表 */
export async function getRepairList(params?: any) {
  return request.get('/repair/list', { params });
}

/** 提交报修 */
export async function createRepair(params: any) {
  return request.post('/repair/create', params);
}

/** 确认故障 — admin only */
export async function confirmRepair(id: number) {
  return request.put(`/repair/confirm/${id}`);
}

/** 驳回报修 — admin only */
export async function rejectRepair(id: number) {
  return request.put(`/repair/reject/${id}`);
}

/** 标记已处理 — admin only */
export async function resolveRepair(id: number) {
  return request.put(`/repair/resolve/${id}`);
}
