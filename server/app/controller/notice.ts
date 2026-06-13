import { Controller } from 'egg';

export default class NoticeController extends Controller {
  /** GET /api/notice/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.notice.list(ctx.query);
    if (!result) return ctx.success([]);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/notice/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      title: { type: 'string', required: true },
      content: { type: 'string', required: false },
      type: { type: 'string', required: false },
    });
    const result = await ctx.service.notice.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/notice/update/:id */
  async update() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.notice.update(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/notice/delete/:id */
  async delete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.notice.delete(id);
    ctx.success(result);
  }
}
