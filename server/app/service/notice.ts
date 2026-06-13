import { Service } from 'egg';

export default class NoticeService extends Service {
  /** 公告列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10, type }: {
    pageNum?: number | string; pageSize?: number | string; type?: string;
  }) {
    const { ctx } = this;
    const { pageNum: pNum, pageSize: pSize, offset } = ctx.helper.parsePage(pageNum, pageSize);
    const where: any = {};
    if (type) where.type = type;

    const { count, rows } = await ctx.model.Notice.findAndCountAll({
      where,
      offset,
      limit: pSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum: pNum, pageSize: pSize };
  }

  /** 发布公告（admin only） */
  async create({ title, content, type }: { title: string; content?: string; type?: string }) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;
    return await ctx.model.Notice.create({ title, content, type: type || 'SYSTEM' });
  }

  /** 修改公告（admin only） */
  async update(id: number, params: any) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;
    const notice = await ctx.model.Notice.findByPk(id);
    if (!notice) ctx.throw(404, '公告不存在');
    await notice.update(params);
    return notice;
  }

  /** 删除公告（admin only） */
  async delete(id: number) {
    const { ctx } = this;
    if (!ctx.mustAdmin()) return;
    const notice = await ctx.model.Notice.findByPk(id);
    if (!notice) ctx.throw(404, '公告不存在');
    await notice.destroy();
    return { message: '删除成功' };
  }
}
