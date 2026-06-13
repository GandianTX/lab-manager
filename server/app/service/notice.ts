import { Service } from 'egg';

export default class NoticeService extends Service {
  /** 公告列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10, type }: {
    pageNum?: number | string; pageSize?: number | string; type?: string;
  }) {
    const pNum = parseInt(String(pageNum)) || 1;
    const pSize = parseInt(String(pageSize)) || 10;
    const { ctx } = this;
    const where: any = {};
    if (type) where.type = type;

    const { count, rows } = await ctx.model.Notice.findAndCountAll({
      where,
      offset: (pNum - 1) * pSize,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 发布公告（admin only） */
  async create({ title, content, type }: { title: string; content?: string; type?: string }) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    return await ctx.model.Notice.create({ title, content, type: type || 'SYSTEM' });
  }

  /** 修改公告（admin only） */
  async update(id: number, params: any) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const notice = await ctx.model.Notice.findByPk(id);
    if (!notice) ctx.throw(404, '公告不存在');
    await notice.update(params);
    return notice;
  }

  /** 删除公告（admin only） */
  async delete(id: number) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const notice = await ctx.model.Notice.findByPk(id);
    if (!notice) ctx.throw(404, '公告不存在');
    await notice.destroy();
    return { message: '删除成功' };
  }
}
