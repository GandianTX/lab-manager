'use strict';

module.exports = app => {
  const { router, controller } = app;

  // ═══ 第一阶段：登录认证 ═══
  router.post('/api/user/login', controller.user.login);

  // ═══ 第二阶段：用户管理 ═══
  router.get('/api/user/list', controller.user.list);
  router.get('/api/user/info', controller.user.info);
  router.put('/api/user/profile', controller.user.profile);
  router.post('/api/user/create', controller.user.create);
  router.put('/api/user/update/:id', controller.user.update);
  router.delete('/api/user/delete/:id', controller.user.delete);

  // ═══ 第三阶段：资源管理 + 分类管理 ═══
  router.get('/api/resource/list', controller.resource.list);
  router.post('/api/resource/create', controller.resource.create);
  router.put('/api/resource/update/:id', controller.resource.update);
  router.delete('/api/resource/delete/:id', controller.resource.delete);
  router.get('/api/resource/category/list', controller.resource.categoryList);
  router.post('/api/resource/category/create', controller.resource.categoryCreate);
  router.put('/api/resource/category/update/:id', controller.resource.categoryUpdate);
  router.delete('/api/resource/category/delete/:id', controller.resource.categoryDelete);

  // ═══ 第四阶段：借用审批 ═══
  router.get('/api/borrow/list', controller.borrow.list);
  router.post('/api/borrow/create', controller.borrow.create);
  router.put('/api/borrow/approve/:id', controller.borrow.approve);
  router.put('/api/borrow/reject/:id', controller.borrow.reject);
  router.put('/api/borrow/return/:id', controller.borrow.returnResource);

  // ═══ 第五阶段：公告管理 ═══
  router.get('/api/notice/list', controller.notice.list);
  router.post('/api/notice/create', controller.notice.create);
  router.delete('/api/notice/delete/:id', controller.notice.delete);

  // ═══ 第六阶段：Dashboard 统计 ═══
  router.get('/api/dashboard/stats', controller.dashboard.stats);
};
