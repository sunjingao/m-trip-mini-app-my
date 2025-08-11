import { BASE_URL } from "@/const/config";
import { postFaceResultApi } from '@/api/pages/id-card-face-recognition/index';
import { getPersonalDetailsApi } from "@/api/common/user/index";
import { getOptions } from "@/util/common-url";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepsConfig: {
      steps: [
        {
          title: '',
        },
        {
          title: '',
        }
      ],
      current: 0
    },
    faceUrl: "https://mobje-pro-04-cos.mobje.cn/mini/mini/face.png",
    checked: false,
    queryParams: {
      scene: ''
    }
  },


  handleChangeAgree() {
    this.setData({
      checked: !this.data.checked
    })
  },

  handleConfirm() {

    if (!this.data.checked) {
      return my.showToast({
        content: '请同意协议'
      });
    }

    const url = "/pages/face/index?scene=" + encodeURIComponent(encodeURIComponent(JSON.stringify(this.data.queryParams.scene)));

    my.redirectTo({
      url: url
    })
  },

  handleReject() {
    my.navigateBack();
  },

  handleGoAgreement() {
    my.navigateTo({
      url:
        `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/recognition.html") }`,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const params = getOptions(options);
    this.data.queryParams.scene = params.scene
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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