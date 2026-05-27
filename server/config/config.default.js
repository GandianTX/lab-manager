'use strict';

module.exports = appInfo => {
  const config = {};

  config.keys = appInfo.name + '_lab_manager_2024';
  config.security = { csrf: { enable: false } };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.validate = { convert: true, widelyUndefined: true };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'lab_manager',
    username: 'gandiantx',
    password: '66716276101k423',
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
