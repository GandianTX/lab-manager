'use strict';

const Service = require('egg').Service;

class DashboardService extends Service {
  async getStats() {
    const { ctx } = this;

    // 基础统计
    const [userCount, resourceCount, borrowCount] = await Promise.all([
      ctx.model.User.count(),
      ctx.model.Resource.count(),
      ctx.model.BorrowRecord.count(),
    ]);

    // 借用趋势（按日期分组最近 7 条）
    const trendData = await ctx.model.BorrowRecord.findAll({
      attributes: [
        [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'date'],
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('id')), 'count'],
      ],
      group: [ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time'))],
      order: [[ctx.app.Sequelize.fn('DATE', ctx.app.Sequelize.col('create_time')), 'ASC']],
      limit: 7,
      raw: true,
    });

    // 资源分类分布
    const categoryData = await ctx.model.Resource.findAll({
      attributes: [
        'category_id',
        [ctx.app.Sequelize.fn('COUNT', ctx.app.Sequelize.col('resource.id')), 'count'],
      ],
      include: [{
        model: ctx.model.ResourceCategory,
        as: 'category',
        attributes: ['name'],
      }],
      group: ['category_id'],
      raw: true,
      nest: true,
    });

    return {
      userCount,
      resourceCount,
      borrowCount,
      trend: trendData.map(t => ({ date: t.date, count: t.count })),
      categoryPie: categoryData.map(c => ({
        name: c.category?.name || '未分类',
        value: c.count,
      })),
    };
  }
}

module.exports = DashboardService;
