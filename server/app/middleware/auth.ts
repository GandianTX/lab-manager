import { Context } from 'egg';
import jwt from 'jsonwebtoken';

export default () => {
  return async function auth(ctx: Context, next: () => Promise<any>) {
    const token = ctx.get('Authorization');
    if (!token) {
      ctx.status = 401;
      ctx.body = { code: 1, message: '未登录' };
      return;
    }
    try {
      const tokenValue = token.replace('Bearer ', '');
      const decoded = jwt.verify(tokenValue, ctx.app.config.jwtSecret);
      ctx.state.user = decoded as any;
    } catch (err) {
      ctx.status = 401;
      ctx.body = { code: 1, message: '登录已过期，请重新登录' };
      return;
    }
    await next();
  };
};
