import { BASE_URL } from "@/const/config";
import { getPersonalDetailsApi } from "@/api/common/user/index";
import { postDistinguishApi, postFaceResultApi, postOrderFaceResultApi } from '@/api/pages/pickup-car-face/index';
import { getOptions } from "@/util/common-url";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    redirect_url: "",
    queryParams: {
      scene: ''
    }
  },

  async handleMesage({ detail }) {
    if (detail.type !== 'faceback') {
      return;
    }

    const { biztoken, result_id } = detail.data
    await postFaceResultApi({
      biztoken,
      result_id,
      scene: this.data.queryParams.scene,
      userId: this.data.userId
    })

    if (this.data.queryParams.scene === "ORDER_CREATE") {
      await postOrderFaceResultApi({
        orderNo: this.data.queryParams.orderNo,
        faceResult: true
      })
    }

    my.navigateBack();
  }, 

  async getUrl() {
    const res = await postDistinguishApi({
      scene: this.data.queryParams.scene,
      userId: this.data.userId,
      redirect_url: this.data.redirect_url
    })

    this.setData({
      url: res.liveness_detection_url
    })
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const params = getOptions(options);
    this.data.queryParams.scene = params.scene;
    this.data.queryParams.orderNo = params.orderNo;
    const result = await getPersonalDetailsApi()
    this.data.userId = result.id

    this.data.redirect_url = `${BASE_URL}/m-content-h5/mini/faceback`

    this.getUrl()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})