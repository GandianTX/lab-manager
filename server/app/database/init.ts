/**
 * 数据库初始化脚本（仅首次部署执行）
 *   npx ts-node app/database/init.ts
 *
 * · 使用 Sequelize sync({ force: true }) 建表，不手写 SQL
 * · 日常启动由 app.ts 的 sync({ alter: true }) 负责
 */
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const DB_NAME = 'lab_manager';

async function init() {
  let db: Sequelize | null = null;
  try {
    // 1. 确保数据库存在
    const root = new Sequelize({
      host: '127.0.0.1', port: 3306,
      username: 'gandiantx', password: '66716276101k423',
      dialect: 'mysql', logging: false,
    });
    await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log('✅ 数据库就绪');
    await root.close();

    // 2. 连接目标库
    db = new Sequelize({
      host: '127.0.0.1', port: 3306, database: DB_NAME,
      username: 'gandiantx', password: '66716276101k423',
      dialect: 'mysql', logging: false,
      define: { freezeTableName: true, underscored: true, timestamps: false },
    });

    // 3. 定义 Model
    const User = db.define('user', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('admin', 'student'), defaultValue: 'student' },
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const Lab = db.define('lab', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      location: { type: DataTypes.STRING(200), allowNull: false },
      capacity: { type: DataTypes.INTEGER, defaultValue: 30 },
      status: { type: DataTypes.ENUM('OPEN', 'MAINTAIN', 'DISABLED'), defaultValue: 'OPEN' },
      description: DataTypes.STRING(500),
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const Device = db.define('device', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      model: DataTypes.STRING(100),
      lab_id: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM('NORMAL', 'BROKEN', 'MAINTAINING', 'DISABLED'), defaultValue: 'NORMAL' },
      description: DataTypes.STRING(500),
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const Reservation = db.define('reservation', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      lab_id: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      start_time: { type: DataTypes.TIME, allowNull: false },
      end_time: { type: DataTypes.TIME, allowNull: false },
      purpose: DataTypes.STRING(500),
      status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'FINISHED', 'CANCELLED'), defaultValue: 'PENDING' },
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const Repair = db.define('repair', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      device_id: { type: DataTypes.INTEGER, allowNull: false },
      lab_id: { type: DataTypes.INTEGER, allowNull: false },
      fault_description: { type: DataTypes.STRING(500), allowNull: false },
      status: { type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'REJECTED', 'RESOLVED'), defaultValue: 'PENDING' },
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    const Notice = db.define('notice', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(200), allowNull: false },
      content: DataTypes.STRING(2000),
      type: { type: DataTypes.ENUM('SYSTEM', 'EXPERIMENT', 'MAINTAIN', 'SUSPENSION'), defaultValue: 'SYSTEM' },
      create_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });

    // 4. 关联
    Lab.hasMany(Device, { foreignKey: 'lab_id', as: 'devices' });
    Device.belongsTo(Lab, { foreignKey: 'lab_id', as: 'lab' });
    Reservation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    Reservation.belongsTo(Lab, { foreignKey: 'lab_id', as: 'lab' });
    Repair.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    Repair.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });
    Repair.belongsTo(Lab, { foreignKey: 'lab_id', as: 'lab' });

    // 5. sync
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sync({ force: true });
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ 所有数据表创建完成');

    // 6. 种子数据：管理员
    await User.create({ username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'admin' });
    console.log('✅ 管理员：admin / admin123');

    // 7. 种子数据：学生
    await User.create({ username: 'student1', password: bcrypt.hashSync('123456', 10), role: 'student' });
    console.log('✅ 学生：student1 / 123456');

    // 8. 种子数据：实验室
    const labs = await Lab.bulkCreate([
      { name: '计算机基础实验室', location: '教学楼A301', capacity: 40, status: 'OPEN', description: '配备高性能计算机' },
      { name: '电子技术实验室', location: '教学楼B201', capacity: 30, status: 'OPEN', description: '电子电路实验' },
      { name: '网络工程实验室', location: '教学楼C102', capacity: 25, status: 'OPEN', description: '网络配置与安全实验' },
      { name: '多媒体实验室', location: '教学楼D401', capacity: 35, status: 'MAINTAIN', description: '多媒体制作与编辑' },
    ]);
    console.log('✅ 示例实验室创建完成');

    const labIds = labs.map((l: any) => l.id);

    // 9. 种子数据：设备
    await Device.bulkCreate([
      { name: '高性能计算机-01', model: 'Dell OptiPlex 7090', lab_id: labIds[0], status: 'NORMAL', description: 'i7-11700/16G/512G SSD' },
      { name: '高性能计算机-02', model: 'Dell OptiPlex 7090', lab_id: labIds[0], status: 'NORMAL', description: 'i7-11700/16G/512G SSD' },
      { name: '开发笔记本-01', model: 'ThinkPad X1 Carbon', lab_id: labIds[0], status: 'NORMAL', description: 'i7-1165G7/16G' },
      { name: '数字示波器-01', model: 'Tektronix TBS1102B', lab_id: labIds[1], status: 'NORMAL', description: '100MHz 双通道' },
      { name: '信号发生器-01', model: 'Agilent 33220A', lab_id: labIds[1], status: 'BROKEN', description: '20MHz 函数/任意波形' },
      { name: '万用表-01', model: 'Fluke 17B+', lab_id: labIds[1], status: 'NORMAL', description: '数字万用表' },
      { name: '核心交换机', model: 'Huawei S5700', lab_id: labIds[2], status: 'NORMAL', description: '48口千兆' },
      { name: '投影仪-01', model: 'Epson CB-X51', lab_id: labIds[3], status: 'MAINTAINING', description: '3LCD 3800流明' },
    ]);
    console.log('✅ 示例设备创建完成');

    // 10. 种子数据：公告
    await Notice.bulkCreate([
      { title: '系统上线通知', content: '高校实验资源协同管理平台已正式上线，欢迎各位师生使用。', type: 'SYSTEM' },
      { title: '计算机实验室开放通知', content: '计算机基础实验室本周六全天开放，欢迎预约使用。', type: 'EXPERIMENT' },
      { title: '多媒体实验室维护通知', content: '多媒体实验室因设备升级，暂时关闭，预计下周恢复开放。', type: 'MAINTAIN' },
    ]);
    console.log('✅ 示例公告创建完成');

    await db.close();
    console.log('\n🎉 数据库初始化完成！');
    process.exit(0);
  } catch (e: any) {
    console.error('❌', e.message);
    if (db) await db.close();
    process.exit(1);
  }
}

init();
