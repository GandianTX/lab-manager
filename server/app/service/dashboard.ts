import { Service } from 'egg';

export default class DashboardService extends Service {
  async getStats() {
    const { ctx } = this;
    const isAdmin = ctx.state.user.role === 'admin';

    if (isAdmin) {
      return await this.getAdminStats();
    }
    return await this.getStudentStats();
  }

  /** 管理员统计 */
  private async getAdminStats() {
    const { ctx } = this;

    const [labCount, deviceCount, studentCount, reservationCount, repairCount,
      pendingReservation, pendingRepair] = await Promise.all([
      ctx.model.Lab.count(),
      ctx.model.Device.count(),
      ctx.model.User.count({ where: { role: 'student' } }),
      ctx.model.Reservation.count(),
      ctx.model.Repair.count(),
      ctx.model.Reservation.count({ where: { status: 'PENDING' } }),
      ctx.model.Repair.count({ where: { status: 'PENDING' } }),
    ]);

    // 实验室预约趋势（按日期分组最近 7 条）
    const trendData = await ctx.model.Reservation.findAll({
      attributes: [
        [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'date'],
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      group: [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time'))],
      order: [[ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'ASC']],
      limit: 7,
      raw: true,
    });

    // 实验室预约排行
    const labRank = await ctx.model.Reservation.findAll({
      attributes: [
        'lab_id',
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('reservation.id')), 'count'],
      ],
      include: [{ model: ctx.model.Lab, as: 'lab', attributes: ['name'] }],
      group: ['lab_id'],
      order: [[ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('reservation.id')), 'DESC']],
      limit: 5,
      raw: true,
      nest: true,
    });

    // 设备状态统计
    const deviceStatusData = await ctx.model.Device.findAll({
      attributes: [
        'status',
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    // 报修统计
    const repairStatusData = await ctx.model.Repair.findAll({
      attributes: [
        'status',
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      group: ['status'],
      raw: true,
    });

    return {
      labCount,
      deviceCount,
      studentCount,
      reservationCount,
      repairCount,
      pendingReservation,
      pendingRepair,
      trend: trendData.map((t: any) => ({ date: t.date, count: t.count })),
      labRank: labRank.map((l: any) => ({ name: l.lab?.name || '未知', value: l.count })),
      deviceStatus: deviceStatusData.map((d: any) => ({ name: d.status, value: d.count })),
      repairStatus: repairStatusData.map((r: any) => ({ name: r.status, value: r.count })),
    };
  }

  /** 学生统计 */
  private async getStudentStats() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    const [labCount, deviceCount, myReservationCount,
      pendingCount, approvedCount] = await Promise.all([
      ctx.model.Lab.count(),
      ctx.model.Device.count(),
      ctx.model.Reservation.count({ where: { user_id: userId } }),
      ctx.model.Reservation.count({ where: { user_id: userId, status: 'PENDING' } }),
      ctx.model.Reservation.count({ where: { user_id: userId, status: 'APPROVED' } }),
    ]);

    // 最新公告
    const latestNotices = await ctx.model.Notice.findAll({
      limit: 5,
      order: [['create_time', 'DESC']],
    });

    // 我的预约趋势
    const trendData = await ctx.model.Reservation.findAll({
      attributes: [
        [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'date'],
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      where: { user_id: userId },
      group: [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time'))],
      order: [[ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'ASC']],
      limit: 7,
      raw: true,
    });

    // 预约状态统计
    const statusData = await ctx.model.Reservation.findAll({
      attributes: [
        'status',
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      where: { user_id: userId },
      group: ['status'],
      raw: true,
    });

    return {
      labCount,
      deviceCount,
      myReservationCount,
      pendingCount,
      approvedCount,
      latestNotices,
      trend: trendData.map((t: any) => ({ date: t.date, count: t.count })),
      statusPie: statusData.map((s: any) => ({ name: s.status, value: s.count })),
    };
  }
}
