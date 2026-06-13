import { EggAppConfig, PowerPartial } from 'egg';
import dotenv from 'dotenv';

dotenv.config();

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.keys = 'lab_manager_2024';
  config.jwtSecret = process.env.JWT_SECRET || 'lab_manager_jwt_2024';
  config.security = { csrf: { enable: false } };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.validate = { convert: true, widelyUndefined: true };

  config.sequelize = {
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'lab_manager',
    username: process.env.DB_USER || 'gandiantx',
    password: process.env.DB_PASSWORD || '',
    timezone: '+08:00',
    define: { freezeTableName: true, underscored: true, timestamps: false },
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  };

  config.middleware = ['auth'];
  config.auth = {
    enable: true,
    ignore: ['/api/user/login'],
  };

  return config;
};
