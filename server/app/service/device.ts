import { Service } from 'egg';

export default class DeviceService extends Service {
  /** 设备列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10, keyword = '', lab_id, status }: {
    pageNum?: number | string; pageSize?: number | string; keyword?: string; lab_id?: number | string; status?: string;
  }) {
    const { ctx } = this;
    const { pageNum: pNum, pageSize: pSize, offset } = ctx.helper.parsePage(pageNum, pageSize);
    const where: any = {};
    if (keyword) where.name = { [ctx.app.Sequelize.Op.like]: `%${keyword}%` };
    if (lab_id) where.lab_id = lab_id;
    if (status) where.status = status;

    const { count, rows } = await ctx.model.Device.findAndCountAll({
      where,
      include: [{ model: ctx.model.Lab, as: 'lab', attributes: ['id', 'name', 'location'] }],
      offset,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 创建设备（admin only） */
  async create(params: any) {
    const { ctx } = this;
    ctx.mustAdmin();
    const lab = await ctx.model.Lab.findByPk(params.lab_id);
    if (!lab) ctx.throw(400, '所属实验室不存在');
    return await ctx.model.Device.create(params);
  }

  /** 更新设备（admin only） */
  async update(id: number, params: any) {
    const { ctx } = this;
    ctx.mustAdmin();
    const device = await ctx.model.Device.findByPk(id);
    if (!device) ctx.throw(404, '设备不存在');
    if (params.lab_id) {
      const lab = await ctx.model.Lab.findByPk(params.lab_id);
      if (!lab) ctx.throw(400, '所属实验室不存在');
    }
    await device.update(params);
    return device;
  }

  /** 删除设备（admin only） */
  async delete(id: number) {
    const { ctx } = this;
    ctx.mustAdmin();
    const device = await ctx.model.Device.findByPk(id);
    if (!device) ctx.throw(404, '设备不存在');
    // 检查是否有未完成的报修
    const repairCount = await ctx.model.Repair.count({
      where: { device_id: id, status: { [ctx.app.Sequelize.Op.in]: ['PENDING', 'CONFIRMED'] } },
    });
    if (repairCount > 0) ctx.throw(400, '该设备有未完成的报修记录，无法删除');
    await device.destroy();
    return { message: '删除成功' };
  }
}
