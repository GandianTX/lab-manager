import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 请求拦截：注入 Token
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// 响应拦截
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res && res.code === 0) {
      return res;
    }
    message.error(res?.message || '请求失败');
    return Promise.reject(new Error(res?.message || '请求失败'));
  },
  error => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        localStorage.clear();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('未登录'));
      }
      if (status === 403) {
        message.error(error.response.data?.message || '无操作权限');
        return Promise.reject(new Error('无权限'));
      }
      const msg = error.response.data?.message || `请求错误 (${status})`;
      message.error(msg);
    } else {
      message.error('网络连接失败，请检查服务是否启动');
    }
    return Promise.reject(error);
  },
);

export default request;
