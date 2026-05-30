'use strict';

const Service = require('egg').Service;

class NoticeService extends Service {
  /** 公告列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10 }) {
    pageNum = parseInt(pageNum) || 1;
    pageSize = parseInt(pageSize) || 10;
    const { ctx } = this;
    const { count, rows } = await ctx.model.Notice.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum, pageSize };
  }

  /** 发布公告（admin only） */
  async create({ title, content }) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    return await ctx.model.Notice.create({ title, content });
  }

  /** 删除公告（admin only） */
  async delete(id) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const notice = await ctx.model.Notice.findByPk(id);
    if (!notice) ctx.throw(404, '公告不存在');
    await notice.destroy();
    return { message: '删除成功' };
  }
}

module.exports = NoticeService;
