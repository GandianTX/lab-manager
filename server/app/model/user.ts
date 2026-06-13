import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名',
    },
    password: {
      type: STRING(255),
      allowNull: false,
      comment: '密码（bcrypt 加密）',
    },
    role: {
      type: ENUM('admin', 'student'),
      allowNull: false,
      defaultValue: 'student',
      comment: '角色',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '创建时间',
    },
  }, {
    comment: '用户表',
    timestamps: false,
  });

  return User;
};
