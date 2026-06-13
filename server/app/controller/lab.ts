import { Controller } from 'egg';

export default class LabController extends Controller {
  /** GET /api/lab/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.lab.list(ctx.query);
    if (!result) return ctx.success([]);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** GET /api/lab/detail/:id */
  async detail() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.lab.detail(id);
    ctx.success(result);
  }

  /** POST /api/lab/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      name: { type: 'string', required: true },
      location: { type: 'string', required: true },
      capacity: { type: 'int', required: false },
      description: { type: 'string', required: false },
    });
    const result = await ctx.service.lab.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/lab/update/:id */
  async update() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.lab.update(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/lab/delete/:id */
  async delete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.lab.delete(id);
    ctx.success(result);
  }
}
