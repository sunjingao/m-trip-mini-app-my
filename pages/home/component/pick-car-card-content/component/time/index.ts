import { jumpTripMiniH5Webview } from "@/util/common-url";
import storeBehavior from "@/behaviors/store/index"
import timeBehavior from "./behaviors/time"

Component({

  mixins: [storeBehavior, timeBehavior],

  /**
   * 组件的初始数据
   */
  data: {
    // 选车时间限制信息
    timeLimitInfo: {
      // 提前预约小时数 正整数 (备注: 后端返的为字符串类型, 获取后应转为数字类型)
      appointmentTime: "",
      // 预约用车日历展示月数 正整数
      calendarMonthNum: "",
      // 单次最长租期 单位:天 (备注: 用户可以选择的最长天数, 预约业务线所有城市一样)
      maxTenancyTerm: NaN,
      // 展示的取车时间
      fetchTime: NaN,
      // 展示的还车时间
      returnTime: NaN,
      // 早上营业的时间，如09:00。切换的城市会有一个，选择网点的时候会有一个
      openTime: "",
      // 晚上营业截止的时间，如18:00。切换的城市会有一个，选择网点的时候会有一个
      closeTime: "",
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGlobalDataChange(globalData) {
      this.setData({
        timeLimitInfo: globalData.timeLimitInfo
      })
      this.initDayTime(globalData.timeLimitInfo)
    },
    handleShowTimeDetail() {
      jumpTripMiniH5Webview("date-time-select")
    }
  }
})