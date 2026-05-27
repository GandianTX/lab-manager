'use strict';

const Controller = require('egg').Controller;

class BorrowController extends Controller {
  /** GET /api/borrow/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.borrow.list(ctx.query);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/borrow/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      resource_id: { type: 'int', required: true },
      remark: { type: 'string', required: false },
    });
    const result = await ctx.service.borrow.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/borrow/approve/:id — 审批通过 */
  async approve() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.borrow.approve(id);
    ctx.success(result);
  }

  /** PUT /api/borrow/reject/:id — 驳回 */
  async reject() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.borrow.reject(id, ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/borrow/return/:id — 归还 */
  async returnResource() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.borrow.returnResource(id);
    ctx.success(result);
  }
}

module.exports = BorrowController;
