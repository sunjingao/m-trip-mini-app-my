import request from "@/util/common-request";

// 查询合同是否签署
export const postFaceResultApi = (data) => {
  return request.post(
    `/tsl/api/app/third-party-auth/wx-face-result`,
    data
  );
};
