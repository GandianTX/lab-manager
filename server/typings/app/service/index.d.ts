// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportBorrow = require('../../../app/service/borrow');
import ExportDashboard = require('../../../app/service/dashboard');
import ExportNotice = require('../../../app/service/notice');
import ExportResource = require('../../../app/service/resource');
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    borrow: AutoInstanceType<typeof ExportBorrow>;
    dashboard: AutoInstanceType<typeof ExportDashboard>;
    notice: AutoInstanceType<typeof ExportNotice>;
    resource: AutoInstanceType<typeof ExportResource>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
