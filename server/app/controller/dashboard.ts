import { Controller } from 'egg';

export default class DashboardController extends Controller {
  /** GET /api/dashboard/stats */
  async stats() {
    const { ctx } = this;
    const result = await ctx.service.dashboard.getStats();
    ctx.success(result);
  }
}
