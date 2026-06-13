import { Service } from 'egg';

export default class RepairService extends Service {
  /** 报修列表（分页；student 仅看自己） */
  async list({ pageNum = 1, pageSize = 10, status }: {
    pageNum?: number | string; pageSize?: number | string; status?: string;
  }) {
    const pNum = parseInt(String(pageNum)) || 1;
    const pSize = parseInt(String(pageSize)) || 10;
    const { ctx } = this;
    const where: any = {};

    // 普通用户只能看自己的
    if (ctx.state.user.role === 'student') {
      where.user_id = ctx.state.user.id;
    }
    if (status) where.status = status;

    const { count, rows } = await ctx.model.Repair.findAndCountAll({
      where,
      include: [
        { model: ctx.model.User, as: 'user', attributes: ['id', 'username'] },
        { model: ctx.model.Device, as: 'device', attributes: ['id', 'name', 'model'] },
        { model: ctx.model.Lab, as: 'lab', attributes: ['id', 'name', 'location'] },
      ],
      offset: (pNum - 1) * pSize,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 提交报修（student） */
  async create(params: any) {
    const { ctx } = this;

    // 检查设备是否存在
    const device = await ctx.model.Device.findByPk(params.device_id);
    if (!device) ctx.throw(400, '设备不存在');

    // 检查实验室是否存在
    const lab = await ctx.model.Lab.findByPk(params.lab_id);
    if (!lab) ctx.throw(400, '实验室不存在');

    const record = await ctx.model.Repair.create({
      user_id: ctx.state.user.id,
      ...params,
    });
    return record;
  }

  /** 确认故障（admin only）→ 设备状态自动改为 BROKEN */
  async confirm(id: number) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.Repair.findByPk(id);
    if (!record) ctx.throw(404, '报修记录不存在');
    if (record.status !== 'PENDING') ctx.throw(400, '当前状态不可确认');

    await record.update({ status: 'CONFIRMED' });
    // 设备状态自动改为 BROKEN
    await ctx.model.Device.update({ status: 'BROKEN' }, { where: { id: record.device_id } });

    return record;
  }

  /** 驳回报修（admin only） */
  async reject(id: number) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.Repair.findByPk(id);
    if (!record) ctx.throw(404, '报修记录不存在');
    if (record.status !== 'PENDING') ctx.throw(400, '当前状态不可驳回');

    await record.update({ status: 'REJECTED' });
    return record;
  }

  /** 标记已处理（admin only）→ 设备状态自动恢复 NORMAL */
  async resolve(id: number) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.Repair.findByPk(id);
    if (!record) ctx.throw(404, '报修记录不存在');
    if (record.status !== 'CONFIRMED') ctx.throw(400, '当前状态不可标记已处理');

    await record.update({ status: 'RESOLVED' });
    // 设备状态自动恢复 NORMAL
    await ctx.model.Device.update({ status: 'NORMAL' }, { where: { id: record.device_id } });

    return record;
  }
}
