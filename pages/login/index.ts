import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { jumpNormalWebview, getOptions } from "@/util/common-url";
import { BASE_URL } from "@/const/config";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    disabled: true,
    checked: false,
    queryParams: {
      // 是否返回原h5页面
      fromPath: '',
      // 代课下单中会传入这个值
      orderNo: ''
    }
  },

  onGlobalDataChange(globalData) {
   },

  clearToken() {
    this.globalDataProxy.token = ""
  },

  handleChangePhone(value) {
    this.setData({
      phone: value
    })

    let reg = /^[1][1-9][0-9]{9}$/
    if (this.data.phone && reg.test(this.data.phone)) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },

  handleChangeAgree(value) {
    this.setData({
      checked: value
    })
  },

  async handleGoCodePage() {
    if (!this.data.checked) {
      return my.showToast({
        content: "请选择用户协议!"
      })
    }

    try {
      this.setData({
        disabled: true
      })

      my.redirectTo({
        url: `/pages/login-code/index?phone=${this.data.phone}&fromPath=${this.data.queryParams.fromPath || ''}&orderNo=${this.data.queryParams.orderNo || ''}`
      })
    } finally {
      this.setData({
        disabled: false
      })
    }
  },

  goUser() {
    jumpNormalWebview(
      `${BASE_URL}/static/mini/register.html`
    )
  },

  clickPrivacy() {
    jumpNormalWebview(
      `${BASE_URL}/static/secret-mini.html`
    )
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    addBehaviorInLoad(this)
    const params = getOptions(options);
    // 进入到页面中，应该就清除token
    this.clearToken();
    this.data.queryParams.fromPath = params.fromPath
    this.data.queryParams.orderNo = params.orderNo
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    removeBehaviorInUnMount(this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() { },
});
