import request from "@/util/common-request";

// 查询合同是否签署
const getContentSigningStatusApi = (parmas) => {
  return request.get(
    `/tsl/api/app/m/contract/content-signing-status/${parmas.orderNo}`,
    {}
  );
};

// 签署合同
const postCreateContentApi = (data) => {
  return request.post("/tsl/api/app/m/contract/create-content", data);
};

// 用户未完成预约订单
const getUnFinishOrderListApi = () =>
  request.get(`/tsl/api/app/order-sr/scheduled/un-finish-order-list`, {});

// 获取当前所在的城市
const postAppGpsApi = (longitude, latitude) =>
  request.post("/tsl/api/app/config/operation-city/app-gps?lob=SC", {
    longitude,
    latitude,
    no: 0,
  });

// 获取当前的具体位置信息，显示在网点列表上面
const getRegeoApi = (params) =>
  request.get("/tsl/api/app/config/location/regeo", params);

// 获取当前城市的时间筛选及默认选中的接口
const getTimeHorizonApi = (cityCode) =>
  request.get(
    `/tsl/api/app/config/sc-order/time-horizon?cityCode=${cityCode}`,
    {}
  );

// 这个接口是网点信息
const postReservationLocationPageApi = (data) =>
  request.post("/tsl/api/app/config/sc-order/reservation-location-page", data);

// 立即选车按钮点击时校验城市与网点是否合法
const getCityLocationValidApi = (
  cityCode,
  pickUpLocationNo,
  returnCarLocationNo
) =>
  request.get(
    `/tsl/api/app/config/sc-order/city-location-valid?serviceType=short_rental&cityCode=${cityCode}&strlocationNo=${pickUpLocationNo}${
      returnCarLocationNo ? `&endlocationNo=${returnCarLocationNo}` : ""
    }`,
    {}
  );

// 预约短租运营城市列表
const getOperationCityListApi = () =>
  request.get("/tsl/api/app/config/sc-order/operation-city-list", {});

export {
  getContentSigningStatusApi,
  postCreateContentApi,
  getUnFinishOrderListApi,
  postAppGpsApi,
  getRegeoApi,
  getTimeHorizonApi,
  postReservationLocationPageApi,
  getCityLocationValidApi,
  getOperationCityListApi,
};
