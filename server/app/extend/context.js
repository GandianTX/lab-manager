'use strict';

module.exports = {
  success(data) {
    this.body = { code: 0, message: 'success', data };
    this.status = 200;
  },

  fail(message = '操作失败') {
    this.body = { code: 1, message };
    this.status = 200;
  },

  page(list, total, pageNum, pageSize) {
    this.body = {
      code: 0, message: 'success',
      data: { list, total, pageNum, pageSize },
    };
    this.status = 200;
  },

  /** 检查当前用户是否为 admin，不是则抛出 403 */
  mustAdmin() {
    if (!this.state.user || this.state.user.role !== 'admin') {
      this.status = 403;
      this.body = { code: 1, message: '无权限，仅管理员可操作' };
      return false;
    }
    return true;
  },
};
