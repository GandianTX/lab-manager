import request from '../utils/request';

/** 用户登录 */
export async function login(params) {
  return request.post('/user/login', params);
}

/** 获取用户列表（分页） */
export async function getUserList(params) {
  return request.get('/user/list', { params });
}

/** 创建用户 */
export async function createUser(params) {
  return request.post('/user/create', params);
}

/** 更新用户 */
export async function updateUser(id, params) {
  return request.put(`/user/update/${id}`, params);
}

/** 删除用户 */
export async function deleteUser(id) {
  return request.delete(`/user/delete/${id}`);
}
