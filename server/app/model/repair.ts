import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const Repair = app.model.define('repair', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      comment: '报修人ID',
    },
    device_id: {
      type: INTEGER,
      allowNull: false,
      comment: '报修设备ID',
    },
    lab_id: {
      type: INTEGER,
      allowNull: false,
      comment: '所属实验室ID',
    },
    fault_description: {
      type: STRING(500),
      allowNull: false,
      comment: '故障描述',
    },
    status: {
      type: ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'RESOLVED'),
      allowNull: false,
      defaultValue: 'PENDING',
      comment: '报修状态',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '创建时间',
    },
  }, {
    comment: '设备报修表',
    timestamps: false,
  });

  Repair.associate = function() {
    app.model.Repair.belongsTo(app.model.User, { foreignKey: 'user_id', as: 'user' });
    app.model.Repair.belongsTo(app.model.Device, { foreignKey: 'device_id', as: 'device' });
    app.model.Repair.belongsTo(app.model.Lab, { foreignKey: 'lab_id', as: 'lab' });
  };

  return Repair;
};
