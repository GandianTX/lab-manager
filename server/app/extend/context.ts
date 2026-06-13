import { Context } from 'egg';

export default {
  success(this: Context, data: any) {
    this.body = { code: 0, message: 'success', data };
    this.status = 200;
  },

  fail(this: Context, message = '操作失败') {
    this.body = { code: 1, message };
    this.status = 200;
  },

  page(this: Context, list: any[], total: number, pageNum: number, pageSize: number) {
    this.body = {
      code: 0, message: 'success',
      data: { list, total, pageNum, pageSize },
    };
    this.status = 200;
  },

  /** 检查当前用户是否为 admin，不是则抛出 403 */
  mustAdmin(this: Context) {
    if (!this.state.user || this.state.user.role !== 'admin') {
      this.status = 403;
      this.body = { code: 1, message: '无权限，仅管理员可操作' };
      return false;
    }
    return true;
  },
};
