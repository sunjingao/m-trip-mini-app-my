import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { BASE_URL } from "@/const/config";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: ""
  },

  onGlobalDataChange(globalData) {
    // if (!globalData.token) {
    //   return;
    // }
    this.setData({
      url: `${BASE_URL}/travel-h5/#/activity-student?token=${globalData.token}&source=WX`
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    addBehaviorInLoad(this)
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
    removeBehaviorInUnMount(this)
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
    return {
      title: '大学生领券享8折专属特惠',
      path: `/pages/activity-student/index`,
      imageUrl: 'https://mobje-pro-04-1309183960.cos.ap-beijing.myqcloud.com/share.jpg',
      success: function(res) {
        // 分享成功后的回调
        console.log('分享成功', res)
      },
      fail: function(res) {
        // 分享失败后的回调
        console.log('分享失败', res)
      }
    }
  }
})