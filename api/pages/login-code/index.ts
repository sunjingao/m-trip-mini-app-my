import request from "@/util/common-request";


// 注册验证码
export const getCaptcha = (data) =>
  request.post('/tsl/api/app/captcha/register-ali', data)

// 登录接口
export const getLogin = (data) =>
  request.post('/tsl/api/app/enrollee/user/register-login-captcha-ali', data)


