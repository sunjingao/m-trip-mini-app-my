import { getContentSigningStatusApi } from "@/api/pages/esign/index";
import { getOptions } from "@/util/common-url";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 跳转链接
    url: "",
    orderNo: ""
  },

  handleMesage(message) {
    const type = message && message.detail && message.detail.type
    const url = message && message.detail && message.detail.url
    const token = message && message.detail && message.detail.token
  
    // E签宝
    switch (type) {
      case 'IDENTITY_ALI_FACE_AWAKE':
        // 拉起支付宝刷脸
        my.startAPVerify({
          url,
          certifyId: token,
          success: function (res) {
            console.log('success 刷脸成功', res)
          },
          fail: function (res) {
            console.log('fail 刷脸失败', res)
          }
        })
        break;
      case 'SIGN_SUCCESS':
        // 签署成功
        setTimeout(
          () => {
            my.navigateBack();
          },
          1000
        )
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);

    this.setData({
      url: params.url,
      orderNo: params.no
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {

    // 是否已经签署过合同了
    const hasSign = await getContentSigningStatusApi({
      orderNo: this.data.orderNo,
    });

    if (!hasSign) {
      return;
    }

    my.navigateBack();
    my.showToast({
      content: "签署成功!",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() { },

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
