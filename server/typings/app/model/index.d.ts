// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportBorrowRecord = require('../../../app/model/borrow_record');
import ExportNotice = require('../../../app/model/notice');
import ExportResource = require('../../../app/model/resource');
import ExportResourceCategory = require('../../../app/model/resource_category');
import ExportUser = require('../../../app/model/user');

declare module 'egg' {
  interface IModel {
    BorrowRecord: ReturnType<typeof ExportBorrowRecord>;
    Notice: ReturnType<typeof ExportNotice>;
    Resource: ReturnType<typeof ExportResource>;
    ResourceCategory: ReturnType<typeof ExportResourceCategory>;
    User: ReturnType<typeof ExportUser>;
  }
}
