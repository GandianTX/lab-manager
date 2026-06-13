import { Service } from 'egg';

export default class LabService extends Service {
  /** 实验室列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10, keyword = '', status }: {
    pageNum?: number | string; pageSize?: number | string; keyword?: string; status?: string;
  }) {
    const { ctx } = this;
    const { pageNum: pNum, pageSize: pSize, offset } = ctx.helper.parsePage(pageNum, pageSize);
    const where: any = {};
    if (keyword) where.name = { [ctx.app.Sequelize.Op.like]: `%${keyword}%` };
    if (status) where.status = status;

    const { count, rows } = await ctx.model.Lab.findAndCountAll({
      where,
      offset,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 实验室详情 */
  async detail(id: number) {
    const { ctx } = this;
    const lab = await ctx.model.Lab.findByPk(id, {
      include: [{ model: ctx.model.Device, as: 'devices' }],
    });
    if (!lab) ctx.throw(404, '实验室不存在');
    return lab;
  }

  /** 创建实验室（admin only） */
  async create(params: any) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;
    return await ctx.model.Lab.create(params);
  }

  /** 更新实验室（admin only） */
  async update(id: number, params: any) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const lab = await ctx.model.Lab.findByPk(id);
    if (!lab) ctx.throw(404, '实验室不存在');
    await lab.update(params);
    return lab;
  }

  /** 删除实验室（admin only） */
  async delete(id: number) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;
    const lab = await ctx.model.Lab.findByPk(id);
    if (!lab) ctx.throw(404, '实验室不存在');
    // 检查是否有关联设备
    const deviceCount = await ctx.model.Device.count({ where: { lab_id: id } });
    if (deviceCount > 0) ctx.throw(400, '该实验室下存在设备，无法删除');
    // 检查是否有未完成的预约
    const reservationCount = await ctx.model.Reservation.count({
      where: { lab_id: id, status: { [ctx.app.Sequelize.Op.in]: ['PENDING', 'APPROVED'] } },
    });
    if (reservationCount > 0) ctx.throw(400, '该实验室有未完成的预约，无法删除');
    await lab.destroy();
    return { message: '删除成功' };
  }
}
