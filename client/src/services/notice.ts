import request from '../utils/request';

/** 公告列表 */
export async function getNoticeList(params?: any) {
  return request.get('/notice/list', { params });
}

/** 发布公告 — admin only */
export async function createNotice(params: any) {
  return request.post('/notice/create', params);
}

/** 修改公告 — admin only */
export async function updateNotice(id: number, params: any) {
  return request.put(`/notice/update/${id}`, params);
}

/** 删除公告 — admin only */
export async function deleteNotice(id: number) {
  return request.delete(`/notice/delete/${id}`);
}
