import {
  postAppGpsApi,
  getRegeoApi,
  getTimeHorizonApi,
  postReservationLocationPageApi,
} from "@/api/pages/main/index";

async function initPointInfo(globalDataProxy) {
  let pointRes = await postReservationLocationPageApi({
    cityCode: globalDataProxy.selectedPointInfo.cityInfo.cityCode,
    latitude: globalDataProxy.currentLocationInfo.latitude,
    longitude: globalDataProxy.currentLocationInfo.longitude,
    current: 0,
    size: 1,
  });

  pointRes = pointRes.data;

  if (pointRes && pointRes.length > 0) {
    globalDataProxy.timeLimitInfo.openTime = pointRes[0].openTime;
    globalDataProxy.timeLimitInfo.closeTime = pointRes[0].closeTime;

    globalDataProxy.selectedPointInfo.pickUpPointInfo.name = pointRes[0].name;
    globalDataProxy.selectedPointInfo.pickUpPointInfo.no = pointRes[0].no;
    globalDataProxy.selectedPointInfo.pickUpPointInfo.distance =
      pointRes[0].distance;

    globalDataProxy.selectedPointInfo.returnPointInfo.name = pointRes[0].name;
    globalDataProxy.selectedPointInfo.returnPointInfo.no = pointRes[0].no;
    globalDataProxy.selectedPointInfo.returnPointInfo.distance =
      pointRes[0].distance;
  } else {
    globalDataProxy.selectedPointInfo.pickUpPointInfo.name = "";
    globalDataProxy.selectedPointInfo.pickUpPointInfo.no = "";
    globalDataProxy.selectedPointInfo.pickUpPointInfo.distance = NaN;

    globalDataProxy.selectedPointInfo.returnPointInfo.name = "";
    globalDataProxy.selectedPointInfo.returnPointInfo.no = "";
    globalDataProxy.selectedPointInfo.returnPointInfo.distance = NaN;
  }
}

async function initTimeLimitAndPoint(globalDataProxy) {
  const [limitRes] = await Promise.all([
    getTimeHorizonApi(globalDataProxy.selectedPointInfo.cityInfo.cityCode),
    initPointInfo(globalDataProxy),
  ]);

  globalDataProxy.timeLimitInfo.appointmentTime = limitRes.appointmentTime;
  globalDataProxy.timeLimitInfo.calendarMonthNum = limitRes.calendarMonthNum;
  globalDataProxy.timeLimitInfo.maxTenancyTerm = limitRes.maxTenancyTerm;
  globalDataProxy.timeLimitInfo.fetchTime = limitRes.fetchTime;
  globalDataProxy.timeLimitInfo.returnTime = limitRes.returnTime;
}

async function setGpsData(globalDataProxy, location) {
  // 全局数据赋值
  globalDataProxy.currentLocationInfo.longitude = location.longitude;
  globalDataProxy.currentLocationInfo.latitude = location.latitude;
  const [gpsInfo, locationRes] = await Promise.all([
    postAppGpsApi(location.longitude, location.latitude),
    getRegeoApi({
      location: `${location.longitude},${location.latitude}`,
    }),
  ]);
  globalDataProxy.selectedPointInfo.cityInfo.cityCode = gpsInfo.cityCode;
  globalDataProxy.selectedPointInfo.cityInfo.cityName = gpsInfo.cityName;

  globalDataProxy.currentLocationInfo.cityName = gpsInfo.cityName;
  globalDataProxy.currentLocationInfo.cityCode = gpsInfo.cityCode;

  globalDataProxy.currentLocationInfo.locationName = locationRes;

  initTimeLimitAndPoint(globalDataProxy);
}

async function initGpsInfo(globalDataProxy) {
  my.getLocation({
    type: 0,
    success: async (location) => {
      globalDataProxy.currentLocationInfo.isGpsOpen = true;
      setGpsData(globalDataProxy, location);
    },
  });
}

async function initGpsBySetting(globalDataProxy) {
  my.openSetting({
    success: () => {
      my.getSetting({
        success: (res) => {
          const authSetting = res.authSetting;

          if (!authSetting["location"]) {
            return;
          }

          initGpsInfo(globalDataProxy);
        },
      });
    },
  });
}

export {
  initGpsInfo,
  setGpsData,
  initPointInfo,
  initTimeLimitAndPoint,
  initGpsBySetting,
};
