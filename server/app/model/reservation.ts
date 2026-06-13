import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE, DATEONLY, TIME } = app.Sequelize;

  const Reservation = app.model.define('reservation', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER,
      allowNull: false,
      comment: '预约人ID',
    },
    lab_id: {
      type: INTEGER,
      allowNull: false,
      comment: '预约实验室ID',
    },
    date: {
      type: DATEONLY,
      allowNull: false,
      comment: '预约日期',
    },
    start_time: {
      type: TIME,
      allowNull: false,
      comment: '开始时间',
    },
    end_time: {
      type: TIME,
      allowNull: false,
      comment: '结束时间',
    },
    purpose: {
      type: STRING(500),
      comment: '预约用途',
    },
    status: {
      type: ENUM('PENDING', 'APPROVED', 'REJECTED', 'FINISHED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
      comment: '预约状态',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '创建时间',
    },
  }, {
    comment: '实验室预约表',
    timestamps: false,
  });

  Reservation.associate = function() {
    app.model.Reservation.belongsTo(app.model.User, { foreignKey: 'user_id', as: 'user' });
    app.model.Reservation.belongsTo(app.model.Lab, { foreignKey: 'lab_id', as: 'lab' });
  };

  return Reservation;
};
