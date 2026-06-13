import { Service } from 'egg';

export default class ReservationService extends Service {
  /** 预约列表（分页；student 仅看自己） */
  async list({ pageNum = 1, pageSize = 10, status }: {
    pageNum?: number | string; pageSize?: number | string; status?: string;
  }) {
    const { ctx } = this;
    const { pageNum: pNum, pageSize: pSize, offset } = ctx.helper.parsePage(pageNum, pageSize);
    const where: any = {};

    // 普通用户只能看自己的
    if (ctx.state.user.role === 'student') {
      where.user_id = ctx.state.user.id;
    }
    if (status) where.status = status;

    const { count, rows } = await ctx.model.Reservation.findAndCountAll({
      where,
      include: [
        { model: ctx.model.User, as: 'user', attributes: ['id', 'username'] },
        { model: ctx.model.Lab, as: 'lab', attributes: ['id', 'name', 'location'] },
      ],
      offset,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 提交预约申请 */
  async create(params: any) {
    const { ctx } = this;

    // 检查实验室是否存在且状态为 OPEN
    const lab = await ctx.model.Lab.findByPk(params.lab_id);
    if (!lab) ctx.throw(400, '实验室不存在');
    if (lab.status !== 'OPEN') ctx.throw(400, '当前实验室暂停开放，暂不可预约');

    // 时间冲突检测
    await this.checkTimeConflict(params.lab_id, params.date, params.start_time, params.end_time);

    const record = await ctx.model.Reservation.create({
      user_id: ctx.state.user.id,
      ...params,
    });
    return record;
  }

  /** 审批通过（admin only） */
  async approve(id: number) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;

    const record = await ctx.model.Reservation.findByPk(id);
    if (!record) ctx.throw(404, '预约记录不存在');
    if (record.status !== 'PENDING') ctx.throw(400, '当前状态不可审批');

    // 审批时再次检查时间冲突，防止两个待审核预约同时审批通过
    await this.checkTimeConflict(record.lab_id, record.date, record.start_time, record.end_time, id);

    // 再次检查实验室状态
    const lab = await ctx.model.Lab.findByPk(record.lab_id);
    if (!lab || lab.status !== 'OPEN') ctx.throw(400, '当前实验室暂停开放，暂不可预约');

    await record.update({ status: 'APPROVED' });
    return record;
  }

  /** 驳回（admin only） */
  async reject(id: number) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.Reservation.findByPk(id);
    if (!record) ctx.throw(404, '预约记录不存在');
    if (record.status !== 'PENDING') ctx.throw(400, '当前状态不可审批');

    await record.update({ status: 'REJECTED' });
    return record;
  }

  /** 完成（admin only） */
  async finish(id: number) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;

    const record = await ctx.model.Reservation.findByPk(id);
    if (!record) ctx.throw(404, '预约记录不存在');
    if (record.status !== 'APPROVED') ctx.throw(400, '当前状态不可完成');

    await record.update({ status: 'FINISHED' });
    return record;
  }

  /** 取消预约（student 自己取消） */
  async cancel(id: number) {
    const { ctx } = this;
    const record = await ctx.model.Reservation.findByPk(id);
    if (!record) ctx.throw(404, '预约记录不存在');
    if (record.status !== 'PENDING' && record.status !== 'APPROVED') ctx.throw(400, '当前状态不可取消');

    // 只有预约人或管理员可以取消
    if (record.user_id !== ctx.state.user.id && ctx.state.user.role !== 'admin') {
      ctx.throw(403, '无权限');
    }

    await record.update({ status: 'CANCELLED' });
    return record;
  }

  /** 时间冲突检测 */
  private async checkTimeConflict(labId: number, date: string, startTime: string, endTime: string, excludeId?: number) {
    const { ctx } = this;

    const where: any = {
      lab_id: labId,
      date,
      status: { [ctx.app.Sequelize.Op.in]: ['PENDING', 'APPROVED'] },
    };

    if (excludeId) {
      where.id = { [ctx.app.Sequelize.Op.ne]: excludeId };
    }

    const conflicts = await ctx.model.Reservation.findAll({ where });

    for (const r of conflicts) {
      const rStart = r.start_time;
      const rEnd = r.end_time;
      // 时间段存在交集
      if (startTime < rEnd && endTime > rStart) {
        ctx.throw(400, '当前时间段已被预约，请选择其他时间');
      }
    }
  }
}
