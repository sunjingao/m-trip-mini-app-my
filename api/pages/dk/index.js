import request from "@/util/common-request";

export const getUserOrderDetailApi = (params) =>
    request.get('/tsl/api/app/order/mini/user-order-detail', params)

export const getDepositAmountApi = (params) =>
    request.get('/tsl/api/app/order/mini/get-deposit-amount', params)

export const getGuaranteeInfoDataApi = (params) =>
    request.get('/tsl/api/app/order/mini/guarantee-by-order', params)

export const getNewestOrderApi = (params) =>
    request.get('/tsl/api/app/order/mini/is-newest-order', params, { isHideError: true })

/**
 * 获取押金信息
 * @returns
 */
export const getForegiftInfoApi = () =>
    request.get('/tsl/api/app/foregift-account/info')

/**
 * 支付宝预授权
 * @param {*} params
 * @returns
 */
export const postPreAuthApi = (params) =>
    request.post(`/tsl/api/app/pre-auth/auth?certification=${params}`)

// 订单评价记录查询
export const getEvaluationApi = (params) =>
    request.get('/tsl/api/app/order/evaluation/query', params)
