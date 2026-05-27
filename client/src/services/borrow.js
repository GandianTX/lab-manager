import request from '../utils/request';

export async function getBorrowList(params) {
  return request.get('/borrow/list', { params });
}
export async function createBorrow(params) {
  return request.post('/borrow/create', params);
}
export async function approveBorrow(id) {
  return request.put(`/borrow/approve/${id}`);
}
export async function rejectBorrow(id, params) {
  return request.put(`/borrow/reject/${id}`, params);
}
export async function returnBorrow(id) {
  return request.put(`/borrow/return/${id}`);
}
