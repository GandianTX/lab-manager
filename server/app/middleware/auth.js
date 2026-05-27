'use strict';

const jwt = require('jsonwebtoken');
const SECRET = 'lab_manager_jwt_2024';

module.exports = () => {
  return async function auth(ctx, next) {
    const token = ctx.get('Authorization');
    if (!token) {
      ctx.status = 401;
      ctx.body = { code: 1, message: '未登录' };
      return;
    }
    try {
      const tokenValue = token.replace('Bearer ', '');
      const decoded = jwt.verify(tokenValue, SECRET);
      ctx.state.user = decoded;
    } catch (err) {
      ctx.status = 401;
      ctx.body = { code: 1, message: '登录已过期，请重新登录' };
      return;
    }
    // 仅 JWT 验证在 try-catch 内，下游错误由框架统一处理
    await next();
  };
};
