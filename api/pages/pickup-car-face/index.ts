import request from "@/util/common-request";

// 查询合同是否签署
export const postDistinguishApi = (data) => {
  return request.post(
    `/tsl/api/app/third-party-auth/h5-face-distinguish-url`,
    data
  );
};


export const postFaceResultApi = (data) =>
  request.post('/tsl/api/app/third-party-auth/h5-face-result', data)

// 微信小程序人脸结果临时存储，部分场景下微信人脸识别结果需要临时存储到后端
export const postOrderFaceResultApi = (data) => {
  return request.post(
    `/tsl/api/app/third-party-auth/wx/order-face-result`,
    data
  );
};
