import request from '../utils/request';

/** 设备列表 */
export async function getDeviceList(params?: any) {
  return request.get('/device/list', { params });
}

/** 创建设备 — admin only */
export async function createDevice(params: any) {
  return request.post('/device/create', params);
}

/** 更新设备 — admin only */
export async function updateDevice(id: number, params: any) {
  return request.put(`/device/update/${id}`, params);
}

/** 删除设备 — admin only */
export async function deleteDevice(id: number) {
  return request.delete(`/device/delete/${id}`);
}
