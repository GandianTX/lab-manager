'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Notice = app.model.define('notice', {
    id:          { type: INTEGER, primaryKey: true, autoIncrement: true },
    title:       { type: STRING(200), allowNull: false, comment: '标题' },
    content:     { type: STRING(2000), comment: '内容' },
    create_time: { type: DATE, allowNull: false, defaultValue: app.Sequelize.NOW },
  }, {
    comment: '公告表',
    timestamps: false,
  });

  return Notice;
};
