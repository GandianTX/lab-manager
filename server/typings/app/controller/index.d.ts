// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportDashboard from '../../../app/controller/dashboard';
import ExportDevice from '../../../app/controller/device';
import ExportLab from '../../../app/controller/lab';
import ExportNotice from '../../../app/controller/notice';
import ExportRepair from '../../../app/controller/repair';
import ExportReservation from '../../../app/controller/reservation';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    dashboard: ExportDashboard;
    device: ExportDevice;
    lab: ExportLab;
    notice: ExportNotice;
    repair: ExportRepair;
    reservation: ExportReservation;
    user: ExportUser;
  }
}
