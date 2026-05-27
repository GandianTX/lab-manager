'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM, DATE } = app.Sequelize;

  const Resource = app.model.define('resource', {
    id:          { type: INTEGER, primaryKey: true, autoIncrement: true },
    name:        { type: STRING(100), allowNull: false, comment: '资源名称' },
    category_id: { type: INTEGER, allowNull: false, comment: '分类ID' },
    status:      { type: ENUM('idle', 'borrowed', 'repair'), allowNull: false, defaultValue: 'idle', comment: '状态' },
    description: STRING(500),
    create_time: { type: DATE, allowNull: false, defaultValue: app.Sequelize.NOW },
  }, {
    comment: '资源表',
    timestamps: false,
  });

  // 关联
  Resource.associate = function() {
    app.model.Resource.belongsTo(app.model.ResourceCategory, { foreignKey: 'category_id', as: 'category' });
  };

  return Resource;
};
