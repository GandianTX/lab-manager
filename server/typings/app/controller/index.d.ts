// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportBorrow = require('../../../app/controller/borrow');
import ExportDashboard = require('../../../app/controller/dashboard');
import ExportNotice = require('../../../app/controller/notice');
import ExportResource = require('../../../app/controller/resource');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    borrow: ExportBorrow;
    dashboard: ExportDashboard;
    notice: ExportNotice;
    resource: ExportResource;
    user: ExportUser;
  }
}
