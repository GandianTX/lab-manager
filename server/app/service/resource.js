'use strict';

const Service = require('egg').Service;

class ResourceService extends Service {
  /** 资源列表（登录可查看） */
  async list({ pageNum = 1, pageSize = 10, keyword = '', category_id, status }) {
    pageNum = parseInt(pageNum) || 1;
    pageSize = parseInt(pageSize) || 10;
    const { ctx } = this;
    const where = {};
    if (keyword) where.name = { [ctx.app.Sequelize.Op.like]: `%${keyword}%` };
    if (category_id) where.category_id = category_id;
    if (status) where.status = status;

    const { count, rows } = await ctx.model.Resource.findAndCountAll({
      where,
      include: [{ model: ctx.model.ResourceCategory, as: 'category', attributes: ['id', 'name'] }],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });
    return { list: rows, total: count, pageNum, pageSize };
  }

  /** 创建资源（admin only） */
  async create(params) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const cat = await ctx.model.ResourceCategory.findByPk(params.category_id);
    if (!cat) ctx.throw(400, '分类不存在');
    return await ctx.model.Resource.create(params);
  }

  /** 更新资源（admin only） */
  async update(id, params) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const resource = await ctx.model.Resource.findByPk(id);
    if (!resource) ctx.throw(404, '资源不存在');
    await resource.update(params);
    return resource;
  }

  /** 删除资源（admin only） */
  async delete(id) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const resource = await ctx.model.Resource.findByPk(id);
    if (!resource) ctx.throw(404, '资源不存在');
    const borrowing = await ctx.model.BorrowRecord.findOne({
      where: { resource_id: id, status: { [ctx.app.Sequelize.Op.in]: ['pending', 'approved'] } },
    });
    if (borrowing) ctx.throw(400, '该资源有未完成的借用记录，无法删除');
    await resource.destroy();
    return { message: '删除成功' };
  }

  // ═══════ 分类 ═══════

  /** 分类列表（登录可查看） */
  async categoryList() {
    const { ctx } = this;
    return await ctx.model.ResourceCategory.findAll({ order: [['id', 'ASC']] });
  }

  /** 创建分类（admin only） */
  async categoryCreate(params) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    return await ctx.model.ResourceCategory.create(params);
  }

  /** 更新分类（admin only） */
  async categoryUpdate(id, params) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const cat = await ctx.model.ResourceCategory.findByPk(id);
    if (!cat) ctx.throw(404, '分类不存在');
    await cat.update(params);
    return cat;
  }

  /** 删除分类（admin only） */
  async categoryDelete(id) {
    const { ctx } = this;
    if (ctx.state.user.role !== 'admin') ctx.throw(403, '无权限');
    const resCount = await ctx.model.Resource.count({ where: { category_id: id } });
    if (resCount > 0) ctx.throw(400, '该分类下存在资源，无法删除');
    const cat = await ctx.model.ResourceCategory.findByPk(id);
    if (!cat) ctx.throw(404, '分类不存在');
    await cat.destroy();
    return { message: '删除成功' };
  }
}

module.exports = ResourceService;
