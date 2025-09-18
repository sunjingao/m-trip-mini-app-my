Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 传递过来的参数，用于支付使用
    params: {
      tradeNO: "", // tradeNO
    },
  },

  pay() {
    const params = this.data.params;
    my.tradePay({
      tradeNO: this.data.params.tradeNO, // 小程序appid
      success: function (res) {
        console.log(111, res)
        my.navigateBack();
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    debugger
    console.log("options", options)
    this.setData({
      params: JSON.parse(decodeURIComponent(options.params)),
    });
    console.log("this.data", this.data)
    this.pay();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

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
