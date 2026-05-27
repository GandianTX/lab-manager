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
  error => Promise.reject(error)
);

// 响应拦截
request.interceptors.response.use(
  response => {
    const res = response.data;
    // 业务成功
    if (res && res.code === 0) {
      return res;
    }
    // 业务失败（HTTP 200 但 code !== 0）
    message.error(res?.message || '请求失败');
    return Promise.reject(new Error(res?.message || '请求失败'));
  },
  error => {
    // HTTP 错误
    if (error.response) {
      const status = error.response.status;
      // 401 未登录 → 跳转登录页
      if (status === 401) {
        localStorage.clear();
        // 避免在 login 页面重复跳转
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('未登录'));
      }
      // 其他 HTTP 错误
      const msg = error.response.data?.message || `请求错误 (${status})`;
      message.error(msg);
    } else {
      // 网络错误（无响应）
      message.error('网络连接失败，请检查服务是否启动');
    }
    return Promise.reject(error);
  }
);

export default request;
