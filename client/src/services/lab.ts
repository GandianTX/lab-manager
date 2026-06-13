import request from '../utils/request';

/** 实验室列表 */
export async function getLabList(params?: any) {
  return request.get('/lab/list', { params });
}

/** 实验室详情 */
export async function getLabDetail(id: number) {
  return request.get(`/lab/detail/${id}`);
}

/** 创建实验室 — admin only */
export async function createLab(params: any) {
  return request.post('/lab/create', params);
}

/** 更新实验室 — admin only */
export async function updateLab(id: number, params: any) {
  return request.put(`/lab/update/${id}`, params);
}

/** 删除实验室 — admin only */
export async function deleteLab(id: number) {
  return request.delete(`/lab/delete/${id}`);
}
