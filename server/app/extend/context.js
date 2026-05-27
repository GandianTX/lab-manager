'use strict';

module.exports = {
  // 成功：{ code: 0, message: "success", data }
  success(data) {
    this.body = { code: 0, message: 'success', data };
    this.status = 200;
  },

  // 失败：{ code: 1, message }
  fail(message = '操作失败') {
    this.body = { code: 1, message };
    this.status = 200;
  },

  // 分页：{ code: 0, message: "success", data: { list, total, pageNum, pageSize } }
  page(list, total, pageNum, pageSize) {
    this.body = {
      code: 0,
      message: 'success',
      data: { list, total, pageNum, pageSize },
    };
    this.status = 200;
  },
};
