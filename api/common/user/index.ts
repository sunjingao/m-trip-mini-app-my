import request from "@/util/common-request";

// 获取个人信息
export const getPersonalDetailsApi = (parmas) =>
  request.get("/tsl/api/app/enrollee/personal-details", parmas);
