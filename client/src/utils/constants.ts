/** 预约状态 */
export const reservationStatusMap: Record<string, string> = {
  PENDING: '待审批', APPROVED: '已通过', REJECTED: '已驳回', FINISHED: '已完成', CANCELLED: '已取消',
};
export const reservationStatusColors: Record<string, string> = {
  PENDING: 'gold', APPROVED: 'green', REJECTED: 'red', FINISHED: 'blue', CANCELLED: 'default',
};

/** 报修状态 */
export const repairStatusMap: Record<string, string> = {
  PENDING: '待处理', CONFIRMED: '已确认', REJECTED: '已驳回', RESOLVED: '已处理',
};
export const repairStatusColors: Record<string, string> = {
  PENDING: 'gold', CONFIRMED: 'blue', REJECTED: 'red', RESOLVED: 'green',
};

/** 实验室状态 */
export const labStatusMap: Record<string, string> = {
  OPEN: '开放中', MAINTAIN: '维护中', DISABLED: '停用',
};
export const labStatusColors: Record<string, string> = {
  OPEN: 'green', MAINTAIN: 'orange', DISABLED: 'red',
};

/** 设备状态 */
export const deviceStatusMap: Record<string, string> = {
  NORMAL: '正常', BROKEN: '故障', MAINTAINING: '维护中', DISABLED: '停用',
};
export const deviceStatusColors: Record<string, string> = {
  NORMAL: 'green', BROKEN: 'red', MAINTAINING: 'orange', DISABLED: 'default',
};

/** 公告类型 */
export const noticeTypeMap: Record<string, string> = {
  SYSTEM: '系统公告', EXPERIMENT: '实验通知', MAINTAIN: '维护通知', SUSPENSION: '停课通知',
};
export const noticeTypeColors: Record<string, string> = {
  SYSTEM: 'blue', EXPERIMENT: 'green', MAINTAIN: 'orange', SUSPENSION: 'red',
};

/** 用户角色 */
export const roleLabels: Record<string, string> = { admin: '管理员', student: '学生' };
export const roleColors: Record<string, string> = { admin: 'red', student: 'blue' };
