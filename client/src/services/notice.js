import request from '../utils/request';

export async function getNoticeList(params) {
  return request.get('/notice/list', { params });
}
export async function createNotice(params) {
  return request.post('/notice/create', params);
}
export async function deleteNotice(id) {
  return request.delete(`/notice/delete/${id}`);
}
