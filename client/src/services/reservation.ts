import request from '../utils/request';

/** 预约列表 */
export async function getReservationList(params?: any) {
  return request.get('/reservation/list', { params });
}

/** 提交预约 */
export async function createReservation(params: any) {
  return request.post('/reservation/create', params);
}

/** 审批通过 — admin only */
export async function approveReservation(id: number) {
  return request.put(`/reservation/approve/${id}`);
}

/** 驳回 — admin only */
export async function rejectReservation(id: number) {
  return request.put(`/reservation/reject/${id}`);
}

/** 完成 — admin only */
export async function finishReservation(id: number) {
  return request.put(`/reservation/finish/${id}`);
}

/** 取消预约 */
export async function cancelReservation(id: number) {
  return request.put(`/reservation/cancel/${id}`);
}
