'use strict';

const Service = require('egg').Service;

class BorrowService extends Service {
  /** 借用列表（分页） */
  async list({ pageNum = 1, pageSize = 10, status }) {
    pageNum = parseInt(pageNum) || 1;
    pageSize = parseInt(pageSize) || 10;
    const { ctx } = this;
    const where = {};

    // 普通用户只能看自己的
    if (ctx.state.user.role === 'user') {
      where.user_id = ctx.state.user.id;
    }
    if (status) where.status = status;

    const { count, rows } = await ctx.model.BorrowRecord.findAndCountAll({
      where,
      include: [
        { model: ctx.model.User, as: 'user', attributes: ['id', 'username'] },
        { model: ctx.model.Resource, as: 'resource', attributes: ['id', 'name'] },
      ],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum, pageSize };
  }

  /** 提交借用申请 */
  async create({ resource_id, remark }) {
    const { ctx } = this;

    const resource = await ctx.model.Resource.findByPk(resource_id);
    if (!resource) ctx.throw(400, '资源不存在');
    if (resource.status !== 'idle') ctx.throw(400, '该资源当前不可借用');

    const record = await ctx.model.BorrowRecord.create({
      user_id: ctx.state.user.id,
      resource_id,
      remark,
      borrow_time: new Date(),
    });
    return record;
  }

  /** 审批通过 */
  async approve(id) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.BorrowRecord.findByPk(id);
    if (!record) ctx.throw(404, '记录不存在');
    if (record.status !== 'pending') ctx.throw(400, '当前状态不可审批');

    // 审批通过 → 资源状态改为 borrowed
    await record.update({ status: 'approved', borrow_time: new Date() });
    await ctx.model.Resource.update({ status: 'borrowed' }, { where: { id: record.resource_id } });

    return record;
  }

  /** 驳回 */
  async reject(id, { remark }) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');

    const record = await ctx.model.BorrowRecord.findByPk(id);
    if (!record) ctx.throw(404, '记录不存在');
    if (record.status !== 'pending') ctx.throw(400, '当前状态不可审批');

    await record.update({ status: 'rejected', remark });
    return record;
  }

  /** 归还 */
  async returnResource(id) {
    const { ctx } = this;
    const record = await ctx.model.BorrowRecord.findByPk(id);
    if (!record) ctx.throw(404, '记录不存在');
    if (record.status !== 'approved') ctx.throw(400, '当前状态不可归还');

    // 只有借用人或管理员可以归还
    if (record.user_id !== ctx.state.user.id && ctx.state.user.role !== 'admin') {
      ctx.throw(403, '无权限');
    }

    await record.update({ status: 'returned', return_time: new Date() });
    await ctx.model.Resource.update({ status: 'idle' }, { where: { id: record.resource_id } });

    return record;
  }
}

module.exports = BorrowService;
