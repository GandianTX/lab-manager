import request from '../utils/request';

/** 用户登录 */
export async function login(params) {
  return request.post('/user/login', params);
}

/** 获取用户列表（分页） — admin only */
export async function getUserList(params) {
  return request.get('/user/list', { params });
}

/** 获取当前用户信息 */
export async function getCurrentUser() {
  return request.get('/user/info');
}

/** 自助修改个人信息 */
export async function updateProfile(params) {
  return request.put('/user/profile', params);
}

/** 创建用户 — admin only */
export async function createUser(params) {
  return request.post('/user/create', params);
}

/** 更新用户 — admin only */
export async function updateUser(id, params) {
  return request.put(`/user/update/${id}`, params);
}

/** 删除用户 — admin only */
export async function deleteUser(id) {
  return request.delete(`/user/delete/${id}`);
}
