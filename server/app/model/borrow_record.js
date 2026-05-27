'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const BorrowRecord = app.model.define('borrow_record', {
    id:          { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id:     { type: INTEGER, allowNull: false, comment: '借用人ID' },
    resource_id: { type: INTEGER, allowNull: false, comment: '资源ID' },
    status:      { type: ENUM('pending', 'approved', 'rejected', 'returned'), allowNull: false, defaultValue: 'pending', comment: '状态' },
    borrow_time: { type: DATE, comment: '借用时间' },
    return_time: { type: DATE, comment: '归还时间' },
    remark:      STRING(500),
    create_time: { type: DATE, allowNull: false, defaultValue: app.Sequelize.NOW },
  }, {
    comment: '借用记录表',
    timestamps: false,
  });

  BorrowRecord.associate = function() {
    app.model.BorrowRecord.belongsTo(app.model.User, { foreignKey: 'user_id', as: 'user' });
    app.model.BorrowRecord.belongsTo(app.model.Resource, { foreignKey: 'resource_id', as: 'resource' });
  };

  return BorrowRecord;
};
