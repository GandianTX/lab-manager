'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    await app.model.sync({ alter: true });
    app.logger.info('数据库模型同步完成 (alter: true)');
  });
};
