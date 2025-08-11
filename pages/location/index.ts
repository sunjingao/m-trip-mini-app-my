
import { addBehaviorInLoad, removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { postReservationLocationPageApi } from "@/api/pages/main/index";
import { initGpsBySetting } from "@/util/common-permission";

Page({

    /**
   * 页面的初始数据
   */
  data: {
    type: "", // 取车城市 或 还车城市; pickup | return
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

    list: [],
    fuzzySearch: "",
    current: 0,
    size: 10,
    hasMore: true, // 是否还有更多数据
    isRequesting: false, // 是否加载中，防止多次触发
  },

  async onGlobalDataChange(globalData) {
    this.setData({
      selectedPointInfo: globalData.selectedPointInfo,
      currentLocationInfo: globalData.currentLocationInfo,
      current: 0,
    });

    const list = await this.loadData();

    this.setData({
      list: list,
    });
  },

  async handleSearchChange(content) {
    this.setData({
      current: 0,
      fuzzySearch: content,
    });
  },

  async handleSearch() {
    this.data.current = 0;
    const list = await this.loadData();
    this.setData({
      list: list,
    });
  },

  async handleLocate() {
    initGpsBySetting(this.globalDataProxy);
  },

  // 加载数据
  async loadData() {
    this.data.isRequesting = true;
    let result = await postReservationLocationPageApi({
      cityCode: this.data.selectedPointInfo.cityInfo.cityCode,
      fuzzySearch: this.data.fuzzySearch,
      latitude: this.data.currentLocationInfo.latitude,
      longitude: this.data.currentLocationInfo.longitude,
      current: this.data.current,
      size: 10,
    });

    this.data.isRequesting = false;

    this.setData({
      hasMore: result.pageable.totalPages !== this.data.current && result.data.length !== 0,
    });

    result.data.forEach((element) => {
      let showDistance = element.distance;
      if (showDistance < 1000) {
        showDistance = `距您${showDistance}m`;
      } else {
        showDistance = (Math.round(showDistance * 100) / 100 / 1000).toFixed(2);
        showDistance = `距您${showDistance}km`;
      }
      element.showDistance = showDistance;
    });

    return Promise.resolve(result.data);
  },

  // 滚动到底部事件
  async onScrollToLower() {
    if (!this.data.hasMore || this.data.isRequesting) {
      return;
    }
    this.data.current += 1;
    const list = await this.loadData();

    this.setData({
      list: [...this.data.list, ...list],
    });
  },

  handleChooseItem(dataType) {
    const index = dataType.currentTarget.dataset.index;
    
    if (this.data.type === "pickup") {
      this.globalDataProxy.selectedPointInfo.pickUpPointInfo.name = this.data.list[
        index
      ].name;
      this.globalDataProxy.selectedPointInfo.pickUpPointInfo.no = this.data.list[
        index
      ].no;
      this.globalDataProxy.selectedPointInfo.pickUpPointInfo.distance = this.data.list[
        index
      ].distance;

      if (!this.globalDataProxy.selectedPointInfo.isDifferent) {
        this.globalDataProxy.selectedPointInfo.returnPointInfo.name = this.data.list[
          index
        ].name;
        this.globalDataProxy.selectedPointInfo.returnPointInfo.no = this.data.list[
          index
        ].no;
        this.globalDataProxy.selectedPointInfo.returnPointInfo.distance = this.data.list[
          index
        ].distance;
      }
    } else {
      this.globalDataProxy.selectedPointInfo.returnPointInfo.name = this.data.list[
        index
      ].name;
      this.globalDataProxy.selectedPointInfo.returnPointInfo.no = this.data.list[
        index
      ].no;
      this.globalDataProxy.selectedPointInfo.returnPointInfo.distance = this.data.list[
        index
      ].distance;
    }

    my.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    addBehaviorInLoad(this)
    const type = options.type || 'pickup';
    this.setData({
      type: type,
    });
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    removeBehaviorInUnMount(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
  },
});
