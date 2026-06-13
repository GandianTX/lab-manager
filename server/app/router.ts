import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller } = app;

  // ═══ 登录认证 ═══
  router.post('/api/user/login', controller.user.login);

  // ═══ 用户管理 ═══
  router.get('/api/user/list', controller.user.list);
  router.get('/api/user/info', controller.user.info);
  router.put('/api/user/profile', controller.user.profile);
  router.post('/api/user/create', controller.user.create);
  router.put('/api/user/update/:id', controller.user.update);
  router.delete('/api/user/delete/:id', controller.user.delete);

  // ═══ 实验室管理 ═══
  router.get('/api/lab/list', controller.lab.list);
  router.get('/api/lab/detail/:id', controller.lab.detail);
  router.post('/api/lab/create', controller.lab.create);
  router.put('/api/lab/update/:id', controller.lab.update);
  router.delete('/api/lab/delete/:id', controller.lab.delete);

  // ═══ 设备管理 ═══
  router.get('/api/device/list', controller.device.list);
  router.post('/api/device/create', controller.device.create);
  router.put('/api/device/update/:id', controller.device.update);
  router.delete('/api/device/delete/:id', controller.device.delete);

  // ═══ 实验室预约管理 ═══
  router.get('/api/reservation/list', controller.reservation.list);
  router.post('/api/reservation/create', controller.reservation.create);
  router.put('/api/reservation/approve/:id', controller.reservation.approve);
  router.put('/api/reservation/reject/:id', controller.reservation.reject);
  router.put('/api/reservation/finish/:id', controller.reservation.finish);
  router.put('/api/reservation/cancel/:id', controller.reservation.cancel);

  // ═══ 设备报修管理 ═══
  router.get('/api/repair/list', controller.repair.list);
  router.post('/api/repair/create', controller.repair.create);
  router.put('/api/repair/confirm/:id', controller.repair.confirm);
  router.put('/api/repair/reject/:id', controller.repair.reject);
  router.put('/api/repair/resolve/:id', controller.repair.resolve);

  // ═══ 公告管理 ═══
  router.get('/api/notice/list', controller.notice.list);
  router.post('/api/notice/create', controller.notice.create);
  router.put('/api/notice/update/:id', controller.notice.update);
  router.delete('/api/notice/delete/:id', controller.notice.delete);

  // ═══ Dashboard 统计 ═══
  router.get('/api/dashboard/stats', controller.dashboard.stats);
};
