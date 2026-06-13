export default {
  /** 解析分页参数，返回 { pageNum, pageSize, offset } */
  parsePage(pageNum?: number | string, pageSize?: number | string) {
    const pNum = parseInt(String(pageNum)) || 1;
    const pSize = parseInt(String(pageSize)) || 10;
    return { pageNum: pNum, pageSize: pSize, offset: (pNum - 1) * pSize };
  },
};
