// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportDashboard from '../../../app/service/dashboard';
import ExportDevice from '../../../app/service/device';
import ExportLab from '../../../app/service/lab';
import ExportNotice from '../../../app/service/notice';
import ExportRepair from '../../../app/service/repair';
import ExportReservation from '../../../app/service/reservation';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    dashboard: AutoInstanceType<typeof ExportDashboard>;
    device: AutoInstanceType<typeof ExportDevice>;
    lab: AutoInstanceType<typeof ExportLab>;
    notice: AutoInstanceType<typeof ExportNotice>;
    repair: AutoInstanceType<typeof ExportRepair>;
    reservation: AutoInstanceType<typeof ExportReservation>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
