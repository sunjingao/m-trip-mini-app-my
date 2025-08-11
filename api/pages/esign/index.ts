import request from "@/util/common-request";

// 查询合同是否签署
export const getContentSigningStatusApi = (parmas) => {
  return request.get(
    `/tsl/api/app/m/contract/content-signing-status/${parmas.orderNo}`,
    parmas
  );
};
