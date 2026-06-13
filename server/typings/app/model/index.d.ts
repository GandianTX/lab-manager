// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportDevice from '../../../app/model/device';
import ExportLab from '../../../app/model/lab';
import ExportNotice from '../../../app/model/notice';
import ExportRepair from '../../../app/model/repair';
import ExportReservation from '../../../app/model/reservation';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Device: ReturnType<typeof ExportDevice>;
    Lab: ReturnType<typeof ExportLab>;
    Notice: ReturnType<typeof ExportNotice>;
    Repair: ReturnType<typeof ExportRepair>;
    Reservation: ReturnType<typeof ExportReservation>;
    User: ReturnType<typeof ExportUser>;
  }
}
