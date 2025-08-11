import storeBehavior from "@/behaviors/store/index"

Component({

  mixins: [storeBehavior],

  /**
   * 组件的初始数据
   */
  data: {
    // 选中的城市-网点信息
    selectedPointInfo: {
      // 是否在同一网点取还车
      isDifferent: false,
      // 取车城市信息
      cityInfo: {
        // 城市编号
        cityCode: "",
        // 城市名称
        cityName: ""
      },
      // 取车网点信息
      pickUpPointInfo: {
        // 网点名称
        name: "",
        // 网点编号
        no: "",
        // 距离
        distance: NaN
      },
      // 还车网点信息
      returnPointInfo: {
        // 网点名称
        name: "",
        // 网点编号
        no: "",
        // 距离
        distance: NaN
      }
    },
    pickupPointDis: null,
    returnPointDis: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGlobalDataChange(globalData) {
      let pickupPointDis = globalData.selectedPointInfo.pickUpPointInfo.distance
      let returnPointDis = globalData.selectedPointInfo.returnPointInfo.distance

      pickupPointDis = this.getDIstance(pickupPointDis)
      returnPointDis = this.getDIstance(returnPointDis)


      this.setData({
        selectedPointInfo: globalData.selectedPointInfo,
        pickupPointDis: pickupPointDis,
        returnPointDis: returnPointDis,
      })
    },

    getDIstance(distance) {
      if (distance === null || isNaN(distance)) {
        return "";
      }

      if (distance > 1000) {
        return (distance / 1000).toFixed(2) + 'km'
      }
      return distance + 'm'
    },

    handleCity(content) {
      const type = content.currentTarget.dataset.type
      my.navigateTo({
        url: `/pages/city-select-page/index?type=${type}`
      })
    },

    handlePoint(content) {
      const type = content.currentTarget.dataset.type

      my.navigateTo({
        url: `/pages/location/index?type=${type}`
      })
    },
    
    handleDiffer() {
      // 响应式监听的地方会自动修改
      this.globalDataProxy.selectedPointInfo.isDifferent = !this.globalDataProxy.selectedPointInfo.isDifferent

      if (!this.globalDataProxy.selectedPointInfo.isDifferent) {
        this.globalDataProxy.selectedPointInfo.returnPointInfo = { ...this.globalDataProxy.selectedPointInfo.pickUpPointInfo }
      }
    },
  }
})