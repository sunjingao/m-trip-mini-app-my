import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { getOperationCityListApi } from "@/api/pages/main/index";
import {
  initGpsBySetting,
  initTimeLimitAndPoint,
} from "@/util/common-permission";
import pinyin from "pinyin";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前位置信息，这个是获取定位信息后通过接口拿到的
    currentLocationInfo: {
      // 用户是否允许开启定位
      isGpsOpen: false,
      // 当前城市名称
      cityName: "",
      // 当前城市编码
      cityCode: "",
      // 主要用于网点筛选时上方显示的位置信息
      locationName: "",
      // 经度，还车等时候也会用到
      longitude: 116.397428,
      // 纬度，还车等时候也会用到
      latitude: 39.90923,
    },
    current: "",
    // 获取到的列表数据
    list: [],
    // 展示的列表数据
    indexMap: {},
    // 展示的索引列表
    indexKeys: []
  },

  onGlobalDataChange(globalData) {
    this.setData({
      currentLocationInfo: globalData.currentLocationInfo,
    });
  },

  handleLocate() {
    initGpsBySetting(this.globalDataProxy);
  },

  handleSelectCity(dataType) {
    const cityCode = dataType.currentTarget.dataset.cityCode;
    const item = this.data.list.find((item) => {
      return item.cityCode === cityCode;
    });

    this.globalDataProxy.selectedPointInfo.cityInfo.cityCode = item.cityCode;
    this.globalDataProxy.selectedPointInfo.cityInfo.cityName = item.cityName;

    initTimeLimitAndPoint(this.globalDataProxy);

    my.redirectTo({
      url: "/pages/location/index",
    });
  },

  async getListData() {
    const result = await getOperationCityListApi();
    this.processCityData(result);
  },

  processCityData(data) {
    // 小程序中的对象是有顺序的，所以这里这么写了
    const cityMap = {
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [],
      T: [],
      U: [],
      V: [],
      W: [],
      X: [],
      Y: [],
      Z: [],
    };
    data.forEach((item) => {
      const firstChar = this.getFirstLetter(item);
      item.index = firstChar;
      cityMap[firstChar].push(item);
    });

    for (const [k, v] of Object.entries({ ...cityMap })) {
      if (v.length === 0) {
        delete cityMap[k];
      }
    }

    this.setData({
      list: data,
      indexMap: cityMap,
      current: Object.keys(cityMap)[0],
      indexKeys: Object.keys(cityMap).map(item => {
        return {
          label: item
        }
      }),
    });
  },

  getFirstLetter(item) {
    const firstChar = pinyin(item["cityName"][0], {
      style: pinyin.STYLE_NORMAL, // 不带声调
      heteronym: false // 不处理多音字（只取第一个读音）
    }).map(pinyinItem => {
      // 处理可能的空值，取拼音数组的第一个元素
      const py = pinyinItem[0] || '';
      return py.charAt(0).toUpperCase(); // 取首字母并大写
    });
    return firstChar;
  },

  onChange(...args) {
    const [item, index] = args;
    console.log(item, index);
    this.setData({ current: item.label });
  },

    /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    addBehaviorInLoad(this)
    this.getListData();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
        removeBehaviorInUnMount(this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
