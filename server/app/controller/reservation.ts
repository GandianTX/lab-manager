import { Controller } from 'egg';

export default class ReservationController extends Controller {
  /** GET /api/reservation/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.reservation.list(ctx.query);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/reservation/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      lab_id: { type: 'int', required: true },
      date: { type: 'string', required: true },
      start_time: { type: 'string', required: true },
      end_time: { type: 'string', required: true },
      purpose: { type: 'string', required: false },
    });
    const result = await ctx.service.reservation.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/reservation/approve/:id — 审批通过 */
  async approve() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.reservation.approve(id);
    ctx.success(result);
  }

  /** PUT /api/reservation/reject/:id — 驳回 */
  async reject() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.reservation.reject(id);
    ctx.success(result);
  }

  /** PUT /api/reservation/finish/:id — 完成 */
  async finish() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.reservation.finish(id);
    ctx.success(result);
  }

  /** PUT /api/reservation/cancel/:id — 取消 */
  async cancel() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.reservation.cancel(id);
    ctx.success(result);
  }
}
