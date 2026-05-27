'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const ResourceCategory = app.model.define('resource_category', {
    id:   { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(50), allowNull: false, comment: '分类名称' },
    remark: STRING(200),
  }, {
    comment: '资源分类表',
    timestamps: false,
  });

  return ResourceCategory;
};
