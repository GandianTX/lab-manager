import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const Lab = app.model.define('lab', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING(100),
      allowNull: false,
      comment: '实验室名称',
    },
    location: {
      type: STRING(200),
      allowNull: false,
      comment: '实验室位置',
    },
    capacity: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 30,
      comment: '容纳人数',
    },
    status: {
      type: ENUM('OPEN', 'MAINTAIN', 'DISABLED'),
      allowNull: false,
      defaultValue: 'OPEN',
      comment: '开放状态',
    },
    description: {
      type: STRING(500),
      comment: '实验室简介',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '创建时间',
    },
  }, {
    comment: '实验室表',
    timestamps: false,
  });

  Lab.associate = function() {
    app.model.Lab.hasMany(app.model.Device, { foreignKey: 'lab_id', as: 'devices' });
    app.model.Lab.hasMany(app.model.Reservation, { foreignKey: 'lab_id', as: 'reservations' });
  };

  return Lab;
};
