import { Controller } from 'egg';

export default class RepairController extends Controller {
  /** GET /api/repair/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.repair.list(ctx.query);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/repair/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      device_id: { type: 'int', required: true },
      lab_id: { type: 'int', required: true },
      fault_description: { type: 'string', required: true },
    });
    const result = await ctx.service.repair.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/repair/confirm/:id — 确认故障 */
  async confirm() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.repair.confirm(id);
    ctx.success(result);
  }

  /** PUT /api/repair/reject/:id — 驳回 */
  async reject() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.repair.reject(id);
    ctx.success(result);
  }

  /** PUT /api/repair/resolve/:id — 标记已处理 */
  async resolve() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.repair.resolve(id);
    ctx.success(result);
  }
}
