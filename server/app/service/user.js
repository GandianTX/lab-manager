'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = 'lab_manager_jwt_2024';

class UserService extends Service {
  /** 用户登录 */
  async login({ username, password }) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ where: { username } });
    if (!user) ctx.throw(400, '用户名或密码错误');
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) ctx.throw(400, '用户名或密码错误');

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET,
      { expiresIn: '24h' }
    );
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  /** 用户列表（分页 + 搜索） */
  async list({ pageNum = 1, pageSize = 10, keyword = '', role = '' }) {
    pageNum = parseInt(pageNum) || 1;
    pageSize = parseInt(pageSize) || 10;
    const { ctx } = this;
    const where = {};
    if (keyword) {
      where[ctx.app.Sequelize.Op.or] = [
        { username: { [ctx.app.Sequelize.Op.like]: `%${keyword}%` } },
      ];
    }
    if (role) where.role = role;

    const { count, rows } = await ctx.model.User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum, pageSize };
  }

  /** 创建用户 */
  async create({ username, password, role }) {
    const { ctx } = this;
    const exist = await ctx.model.User.findOne({ where: { username } });
    if (exist) ctx.throw(400, '用户名已存在');
    const hashed = bcrypt.hashSync(password, 10);
    const user = await ctx.model.User.create({ username, password: hashed, role: role || 'user' });
    return { id: user.id, username: user.username, role: user.role };
  }

  /** 更新用户 */
  async update(id, params) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    if (!user) ctx.throw(404, '用户不存在');
    if (params.password) params.password = bcrypt.hashSync(params.password, 10);
    await user.update(params);
    return { id: user.id, username: user.username, role: user.role };
  }

  /** 获取当前用户信息 */
  async info(userId) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) ctx.throw(404, '用户不存在');
    return user;
  }

  /** 删除用户 */
  async delete(id) {
    const { ctx } = this;
    const user = await ctx.model.User.findByPk(id);
    if (!user) ctx.throw(404, '用户不存在');
    await user.destroy();
    return { message: '删除成功' };
  }
}

module.exports = UserService;
