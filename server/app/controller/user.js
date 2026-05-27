'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  /** POST /api/user/login */
  async login() {
    const { ctx } = this;
    ctx.validate({ username: { type: 'string', required: true }, password: { type: 'string', required: true } });
    const result = await ctx.service.user.login(ctx.request.body);
    ctx.success(result);
  }

  /** GET /api/user/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.user.list(ctx.query);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** GET /api/user/info — 当前登录用户 */
  async info() {
    const { ctx } = this;
    const user = await ctx.service.user.info(ctx.state.user.id);
    ctx.success(user);
  }

  /** POST /api/user/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      username: { type: 'string', required: true, min: 3, max: 20 },
      password: { type: 'string', required: true, min: 6, max: 30 },
      role: { type: 'string', required: true },
    });
    const result = await ctx.service.user.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/user/update/:id */
  async update() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.user.update(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/user/delete/:id */
  async delete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.user.delete(id);
    ctx.success(result);
  }
}

module.exports = UserController;
