'use strict';

/**
 * 数据库初始化脚本（仅首次部署执行）
 *   node app/database/init.js
 *
 * · 使用 Sequelize sync({ force: true }) 建表，不手写 SQL
 * · 日常启动由 app.js 的 sync({ alter: true }) 负责
 */
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const DB_NAME = 'lab_manager';

async function init() {
  let db;
  try {
    // 1. 确保数据库存在
    const root = new Sequelize({ host:'127.0.0.1', port:3306, username:'gandiantx', password:'66716276101k423', dialect:'mysql', logging:false });
    await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log('✅ 数据库就绪');
    await root.close();

    // 2. 连接目标库
    db = new Sequelize({ host:'127.0.0.1', port:3306, database:DB_NAME, username:'gandiantx', password:'66716276101k423', dialect:'mysql', logging:false,
      define: { freezeTableName:true, underscored:true, timestamps:false } });

    // 3. 定义 Model（与 app/model/* 一致）
    const User = db.define('user', {
      id: { type:Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      username: { type:Sequelize.STRING(50), allowNull:false, unique:true },
      password: { type:Sequelize.STRING(255), allowNull:false },
      role: { type:Sequelize.ENUM('admin','user'), defaultValue:'user' },
      create_time: { type:Sequelize.DATE, defaultValue:Sequelize.NOW },
    });
    const ResourceCategory = db.define('resource_category', {
      id: { type:Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      name: { type:Sequelize.STRING(50), allowNull:false },
      remark: Sequelize.STRING(200),
    });
    const Resource = db.define('resource', {
      id: { type:Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      name: { type:Sequelize.STRING(100), allowNull:false },
      category_id: { type:Sequelize.INTEGER, allowNull:false },
      status: { type:Sequelize.ENUM('idle','borrowed','repair'), defaultValue:'idle' },
      description: Sequelize.STRING(500),
      create_time: { type:Sequelize.DATE, defaultValue:Sequelize.NOW },
    });
    const BorrowRecord = db.define('borrow_record', {
      id: { type:Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      user_id: { type:Sequelize.INTEGER, allowNull:false },
      resource_id: { type:Sequelize.INTEGER, allowNull:false },
      status: { type:Sequelize.ENUM('pending','approved','rejected','returned'), defaultValue:'pending' },
      borrow_time: Sequelize.DATE,
      return_time: Sequelize.DATE,
      remark: Sequelize.STRING(500),
      create_time: { type:Sequelize.DATE, defaultValue:Sequelize.NOW },
    });
    const Notice = db.define('notice', {
      id: { type:Sequelize.INTEGER, primaryKey:true, autoIncrement:true },
      title: { type:Sequelize.STRING(200), allowNull:false },
      content: Sequelize.STRING(2000),
      create_time: { type:Sequelize.DATE, defaultValue:Sequelize.NOW },
    });

    // 4. 关联
    Resource.belongsTo(ResourceCategory, { foreignKey:'category_id', as:'category' });
    BorrowRecord.belongsTo(User, { foreignKey:'user_id', as:'user' });
    BorrowRecord.belongsTo(Resource, { foreignKey:'resource_id', as:'resource' });

    // 5. sync（先关闭外键检查以允许重建）
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sync({ force:true });
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ 所有数据表创建完成');

    // 6. 种子数据：管理员
    await User.create({ username:'admin', password:bcrypt.hashSync('admin123',10), role:'admin' });
    console.log('✅ 管理员：admin / admin123');

    // 7. 种子数据：分类
    const cats = await ResourceCategory.bulkCreate([
      { name:'计算机设备', remark:'台式机、笔记本、工作站' },
      { name:'实验仪器', remark:'示波器、信号发生器、万用表' },
      { name:'网络设备', remark:'交换机、路由器、防火墙' },
      { name:'多媒体设备', remark:'投影仪、音响、屏幕' },
    ]);
    console.log('✅ 示例分类创建完成');

    // 8. 种子数据：资源
    await Resource.bulkCreate([
      { name:'高性能计算机-01', category_id:cats[0].id, status:'idle', description:'Dell OptiPlex' },
      { name:'高性能计算机-02', category_id:cats[0].id, status:'idle', description:'Dell OptiPlex' },
      { name:'开发笔记本-01', category_id:cats[0].id, status:'idle', description:'ThinkPad X1' },
      { name:'数字示波器-01', category_id:cats[1].id, status:'idle', description:'Tektronix TBS1102B' },
      { name:'信号发生器-01', category_id:cats[1].id, status:'repair', description:'Agilent 33220A' },
      { name:'万用表-01', category_id:cats[1].id, status:'idle', description:'Fluke 17B+' },
      { name:'核心交换机', category_id:cats[2].id, status:'idle', description:'Huawei S5700' },
      { name:'投影仪-01', category_id:cats[3].id, status:'idle', description:'Epson CB-X51' },
    ]);
    console.log('✅ 示例资源创建完成');

    await db.close();
    console.log('\n🎉 数据库初始化完成！');
    process.exit(0);
  } catch(e) {
    console.error('❌', e.message);
    if(db) await db.close();
    process.exit(1);
  }
}
init();
