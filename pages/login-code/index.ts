import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { redirectToTripMiniH5Webview, getOptions } from "@/util/common-url";
import { getCaptcha, getLogin } from '@/api/pages/login-code/index';

Page({
  data: {
    time: 60,
    phone: "",
    queryParams: {
      // 是否返回原h5页面
      fromPath: ''
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

    my.getAuthCode({
      scopes: 'auth_base',
      success: (res) => {
          this.globalDataProxy.openId = res.authCode
      },
      fail: (res) => {
      }
    });

    debugger
    if (this.data.queryParams.fromPath) {
      redirectToTripMiniH5Webview(this.data.queryParams.fromPath)
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
      'queryParams.fromPath': options.fromPath
    })

    this.handleSendCode()
  },

  onUnload() {
    removeBehaviorInUnMount(this)
  },
});
