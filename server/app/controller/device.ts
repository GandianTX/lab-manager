import { Controller } from 'egg';

export default class DeviceController extends Controller {
  /** GET /api/device/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.device.list(ctx.query);
    if (!result) return ctx.success([]);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/device/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      name: { type: 'string', required: true },
      lab_id: { type: 'int', required: true },
      model: { type: 'string', required: false },
      description: { type: 'string', required: false },
    });
    const result = await ctx.service.device.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/device/update/:id */
  async update() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.device.update(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/device/delete/:id */
  async delete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.device.delete(id);
    ctx.success(result);
  }
}
