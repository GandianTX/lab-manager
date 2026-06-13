import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const Device = app.model.define('device', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: '设备名称',
    },
    model: {
      type: STRING(100),
      comment: '设备型号',
    },
    lab_id: {
      type: INTEGER,
      allowNull: false,
      comment: '所属实验室ID',
    },
    status: {
      type: ENUM('NORMAL', 'BROKEN', 'MAINTAINING', 'DISABLED'),
      allowNull: false,
      defaultValue: 'NORMAL',
      comment: '设备状态',
    },
    description: {
      type: STRING(500),
      comment: '设备描述',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '创建时间',
    },
  }, {
    comment: '设备表',
    timestamps: false,
  });

  Device.associate = function() {
    app.model.Device.belongsTo(app.model.Lab, { foreignKey: 'lab_id', as: 'lab' });
  };

  return Device;
};
