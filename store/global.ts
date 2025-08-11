import { getFetchTime, getReturnTime } from "@/util/common-date";
import { debounce, cloneDeep, createDeepProxy } from "@/util/common-bom";

const globalData = {
  // 是否签署微信协议
  isAgreePrivacy: false,
  // 登录后返回的信息
  token: "",
  // 登录后，拿到的微信登录的code换取的openId，h5支付的时候需要
  openId: "",
  // 跳转来源
  source: "ALI", // WX 或者 ALI
  // 选中的城市-网点信息
  selectedPointInfo: {
    // 是否在同一网点取还车
    isDifferent: false,
    // 取车城市信息
    cityInfo: {
      // 城市编号
      cityCode: "000002",
      // 城市名称
      cityName: "北京市",
    },
    // 取车网点信息
    pickUpPointInfo: {
      // 网点名称
      name: "",
      // 网点编号
      no: "",
      // 距离
      distance: NaN,
    },
    // 还车网点信息
    returnPointInfo: {
      // 网点名称
      name: "",
      // 网点编号
      no: "",
      // 距离
      distance: NaN,
    },
  },
  // 当前位置信息，这个是获取定位信息后通过接口拿到的
  currentLocationInfo: {
    // 用户是否允许开启定位
    isGpsOpen: false,
    // 当前城市名称
    cityName: "北京市",
    // 当前城市编码
    cityCode: "000002",
    // 主要用于网点筛选时上方显示的位置信息
    locationName: "",
    // 经度，还车等时候也会用到
    longitude: 116.397428,
    // 纬度，还车等时候也会用到
    latitude: 39.90923,
  },
  // 选车时间限制信息
  timeLimitInfo: {
    // 提前预约小时数 正整数 (备注: 后端返的为字符串类型, 获取后应转为数字类型)
    appointmentTime: "1",
    // 预约用车日历展示月数 正整数
    calendarMonthNum: "2",
    // 单次最长租期 单位:天 (备注: 用户可以选择的最长天数, 预约业务线所有城市一样)
    maxTenancyTerm: 30,
    // 展示的取车时间
    fetchTime: getFetchTime(),
    // 展示的还车时间
    returnTime: getReturnTime(),
    // 早上营业的时间，如09:00。切换的城市会有一个，选择网点的时候会有一个
    openTime: "00:00",
    // 晚上营业截止的时间，如18:00。切换的城市会有一个，选择网点的时候会有一个
    closeTime: "23:30",
  },
};

const globalDataProxy = {
  proxyInstance: null,
  callback: [],
};

const debounceCb = debounce(function name(proxyIns) {
  globalDataProxy.callback.forEach((itemCb) => {
    Object.keys(globalDataProxy.proxyInstance).forEach((keyName) => {
      my.setStorageSync({
        key: keyName,
        data: globalData[keyName],
      })
    });

    itemCb(cloneDeep(globalData));
  });
}, 60);

function getGlobalDataProxy() {
  if (globalDataProxy.proxyInstance) {
    return globalDataProxy.proxyInstance;
  }

  globalDataProxy.proxyInstance = createDeepProxy(globalData, {
    get(target, property) {
      return target[property];
    },
    set(target, property, value, keysPath) {
      target[property] = value;

      debounceCb(globalData, keysPath);

      return true;
    },
  });

  return globalDataProxy.proxyInstance;
}

function addGlobalDataChangeCb(callback) {
  // 绑定时就执行一次首次先执行
  debounceCb(globalDataProxy.proxyInstance);
  // 放入数组中
  globalDataProxy.callback.push(callback);
}

function removeGlobalDataChangeCb(callback) {
  globalDataProxy.callback.splice(
    globalDataProxy.callback.indexOf(callback),
    1
  );
}

function clearGlobalData() {
  my.removeStorage({ key: "token" });
  my.removeStorage({ key: "openId" });
  my.removeStorage({ key: "selectedPointInfo" });
}

function initGlobalData() {
  // 是否同意协议和是否登录不一样，这里是是否同意协议
  my.getStorage({
    key: "isAgreePrivacy",
    success(res) {
      if (res.data) {
        getGlobalDataProxy().isAgreePrivacy = res.data;
      }
    }
  })


  my.getStorage({
    key: "selectedPointInfo",
    success(res) {
      if (res.data) {
        getGlobalDataProxy().selectedPointInfo = res.data;
      }
    }
  })

  my.getStorage({
    key: "openId",
    success(res) {
      if (res.data) {
        getGlobalDataProxy().openId = res.data;
      }
    }
  })

  // 是否登录
  my.getStorage({
    key: "token",
    success(res) {
      if (res.data) {
        getGlobalDataProxy().token = res.data;
      }
    }
  })
}

export default {
  getGlobalDataProxy,
  addGlobalDataChangeCb,
  removeGlobalDataChangeCb,
  initGlobalData,
  clearGlobalData,
};
