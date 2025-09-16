import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { redirectToTripMiniH5Webview, getOptions } from "@/util/common-url";
import { getCaptcha, getLogin } from '@/api/pages/login-code/index';

Page({
  data: {
    time: 60,
    phone: "",
    queryParams: {
      // 是否返回原h5页面
      fromPath: '',
      // 订单号
      orderNo: '',
      // 推费用到的id
      id: ''
    }
  },

  startCountdown() {
    this.data.timer = setInterval(() => {
      this.setData({
        time: --this.data.time 
      })
      if (this.data.time === 0) {
        clearInterval(this.data.timer)
      }
    }, 1000)
  },

  async sendCode() {
    await getCaptcha({
      phone: this.data.phone
    })

    my.showToast({
      content: "发送成功"
    })
  },

  handleSendCode() {
    this.setData({
      time: 60
    })
    this.startCountdown()
    this.sendCode()
  },

  async handleFinish(value) {
    const result = await getLogin({
      phone: this.data.phone,
      captCha: value
    })

    this.globalDataProxy.token = result.token;


    const ret = await my.getAuthCode();
    this.globalDataProxy.openId = ret.authCode

    // my.getAuthCode({
    //   success: (res) => {
    //       this.globalDataProxy.openId = res.authCode
    //   },
    //   fail: (res) => {
    //   }
    // });


    if (this.data.queryParams.fromPath) {

      // 活动页，直接跳转
      if (this.data.queryParams.fromPath === "activity-student") {
        my.redirectTo({
          url: "/pages/web-view-special/activity-student/index"
        })
      } else if (this.data.queryParams.fromPath === "dk") {
        // 支付宝扫描二维码 alipays://platformapi/startapp 方法打开，token没存储，暂时忽略这个特殊的处理。可能因为时间的问题，导致proxy没有存储，而重新启动。时间问题，暂时不予验证
        my.setStorageSync({
          key: "token",
          data: result.token,
        })
        my.redirectTo({
          url: `/pages/dk/dk-order?orderNo=${this.data.queryParams.orderNo}`
        })
      } else if (this.data.queryParams.fromPath === "platformFeeDetail") {
        // 支付宝扫描二维码 alipays://platformapi/startapp 方法打开，token没存储，暂时忽略这个特殊的处理。可能因为时间的问题，导致proxy没有存储，而重新启动。时间问题，暂时不予验证
        my.setStorageSync({
          key: "token",
          data: result.token,
        })
        my.redirectTo({
          url: `/pages/center/platformFeeDetail?id=${this.data.queryParams.id}`
        })
      } else {
        redirectToTripMiniH5Webview(this.data.queryParams.fromPath) 
      }
    } else {
      my.switchTab({
        url: '/pages/home/index'
      })
    }
  },

  onLoad(options) {
    addBehaviorInLoad(this)
    this.setData({
      phone: options.phone,
      'queryParams.fromPath': options.fromPath,
      'queryParams.orderNo': options.orderNo,
      'queryParams.id': options.id,
    })

    this.handleSendCode()
  },

  onUnload() {
    removeBehaviorInUnMount(this)
  },
});
