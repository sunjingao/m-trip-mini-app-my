import request from "@/util/common-request";

// 快捷登录
export const postQuickLoginWxApi = (data) =>
  request.post("/tsl/api/app/enrollee/user/quick-login-wx", data);

// 登录接口
export const postRegisterLoginCaptchaWxApi = (data) =>
  request.post("/tsl/api/app/enrollee/user/register-login-captcha-wx", data);

export const postRegisterAliApi = (data) =>
  request.post("/tsl/api/app/captcha/register-ali", data);

/**
 * 获取用户oppenid
 * @param {*} params
 * @returns
 */
export const getOpenIdApi = (params) =>
  request.get("/tsl/api/app/enrollee/getOpenId", params);
