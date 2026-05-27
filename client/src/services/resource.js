import request from '../utils/request';

// ─── 资源 ───
export async function getResourceList(params) {
  return request.get('/resource/list', { params });
}
export async function createResource(params) {
  return request.post('/resource/create', params);
}
export async function updateResource(id, params) {
  return request.put(`/resource/update/${id}`, params);
}
export async function deleteResource(id) {
  return request.delete(`/resource/delete/${id}`);
}

// ─── 分类 ───
export async function getCategoryList() {
  return request.get('/resource/category/list');
}
export async function createCategory(params) {
  return request.post('/resource/category/create', params);
}
export async function updateCategory(id, params) {
  return request.put(`/resource/category/update/${id}`, params);
}
export async function deleteCategory(id) {
  return request.delete(`/resource/category/delete/${id}`);
}
