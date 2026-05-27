'use strict';

const Controller = require('egg').Controller;

class ResourceController extends Controller {
  // ═══════ 资源 ═══════

  /** GET /api/resource/list */
  async list() {
    const { ctx } = this;
    const result = await ctx.service.resource.list(ctx.query);
    ctx.page(result.list, result.total, result.pageNum, result.pageSize);
  }

  /** POST /api/resource/create */
  async create() {
    const { ctx } = this;
    ctx.validate({
      name: { type: 'string', required: true },
      category_id: { type: 'int', required: true },
      description: { type: 'string', required: false },
    });
    const result = await ctx.service.resource.create(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/resource/update/:id */
  async update() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.resource.update(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/resource/delete/:id */
  async delete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.resource.delete(id);
    ctx.success(result);
  }

  // ═══════ 分类 ═══════

  /** GET /api/resource/category/list */
  async categoryList() {
    const { ctx } = this;
    const result = await ctx.service.resource.categoryList();
    ctx.success(result);
  }

  /** POST /api/resource/category/create */
  async categoryCreate() {
    const { ctx } = this;
    ctx.validate({ name: { type: 'string', required: true } });
    const result = await ctx.service.resource.categoryCreate(ctx.request.body);
    ctx.success(result);
  }

  /** PUT /api/resource/category/update/:id */
  async categoryUpdate() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.resource.categoryUpdate(id, ctx.request.body);
    ctx.success(result);
  }

  /** DELETE /api/resource/category/delete/:id */
  async categoryDelete() {
    const { ctx } = this;
    const id = parseInt(ctx.params.id);
    const result = await ctx.service.resource.categoryDelete(id);
    ctx.success(result);
  }
}

module.exports = ResourceController;
