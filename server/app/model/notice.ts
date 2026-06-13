import { Application } from 'egg';

export default (app: Application) => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const Notice = app.model.define('notice', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: STRING(200),
      allowNull: false,
      comment: '标题',
    },
    content: {
      type: STRING(2000),
      comment: '内容',
    },
    type: {
      type: ENUM('SYSTEM', 'EXPERIMENT', 'MAINTAIN', 'SUSPENSION'),
      allowNull: false,
      defaultValue: 'SYSTEM',
      comment: '公告类型',
    },
    create_time: {
      type: DATE,
      allowNull: false,
      defaultValue: app.Sequelize.NOW,
      comment: '发布时间',
    },
  }, {
    comment: '公告表',
    timestamps: false,
  });

  return Notice;
};
