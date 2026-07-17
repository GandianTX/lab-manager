import { Service } from 'egg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default class UserService extends Service {
  /** 用户登录（公开） */
  async login({ username, password }: { username: string; password: string }) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ where: { username } });
    if (!user) ctx.throw(400, '用户名或密码错误');
    if (!bcrypt.compareSync(password, user.password)) ctx.throw(400, '用户名或密码错误');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      ctx.app.config.jwtSecret, { expiresIn: '24h' },
    );
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  /** 用户列表（admin only） */
  async list({ pageNum = 1, pageSize = 10, keyword = '', role = '' }: {
    pageNum?: number | string; pageSize?: number | string; keyword?: string; role?: string;
  }) {
    const { ctx } = this;
    ctx.mustAdmin();
    const { pageNum: pNum, pageSize: pSize, offset } = ctx.helper.parsePage(pageNum, pageSize);

    const where: any = {};
    if (keyword) {
      where[ctx.app.Sequelize.Op.or] = [
        { username: { [ctx.app.Sequelize.Op.like]: `%${keyword}%` } },
      ];
    }
    if (role) where.role = role;

    const { count, rows } = await ctx.model.User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 创建用户（admin only） */
  async create({ username, password, role }: { username: string; password: string; role?: string }) {
    const { ctx } = this;
    ctx.mustAdmin();
    const exist = await ctx.model.User.findOne({ where: { username } });
    if (exist) ctx.throw(400, '用户名已存在');
    const hashed = bcrypt.hashSync(password, 10);
    const user = await ctx.model.User.create({ username, password: hashed, role: role || 'student' });
    return { id: user.id, username: user.username, role: user.role };
  }

  /** 更新用户（admin 可改任意用户，student 只能改自己） */
  async update(id: number, params: any) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    if (!user) ctx.throw(404, '用户不存在');

    if (ctx.state.user.role !== 'admin' && ctx.state.user.id !== id) {
      ctx.throw(403, '无权限');
    }

    if (ctx.state.user.role !== 'admin' && params.role) {
      delete params.role;
    }
    if (params.password) params.password = bcrypt.hashSync(params.password, 10);

    await user.update(params);
    return { id: user.id, username: user.username, role: user.role };
  }

  /** 获取当前用户信息 */
  async info(userId: number) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) ctx.throw(404, '用户不存在');
    return user;
  }

  /** 删除用户（admin only） */
  async delete(id: number) {
    const { ctx } = this;
    ctx.mustAdmin();
    const user = await ctx.model.User.findByPk(id);
    if (!user) ctx.throw(404, '用户不存在');
    await user.destroy();
    return { message: '删除成功' };
  }
}
