import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { getPersonalDetailsApi } from "@/api/common/user/index";
import { jumpTripMiniH5Webview } from "@/util/common-url";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 是否登录了
    name: "", // 姓名或者身份证号
    review: "", // 认证状态
    headPortrait: "", // 头像图片
    userInfo: {}, // 用户信息
    list: [
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/i_person.png",
        title: "我的资料",
        route: "my-infor",
        login: true
      },
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/ticket.png",
        title: "我的钱包",
        route: "my-wallet",
        login: true
      },
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/note.png",
        title: "我的订单",
        route: "my-order",
        login: true
      },
      {
        icon: "./asset/png/pay.png",
        title: "平台缴费",
        route: "platform-fee",
        login: true
      },
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/invoice.png",
        title: "发票管理",
        route: "invoice",
        login: true
      },
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/note.png",
        title: "条款规则",
        route: "rule",
        login: true
      },
      {
        icon: "https://mobje-pro-04-cos.mobje.cn/mini/mini/about.png",
        title: "关于",
        route: "about",
        login: false
      },
    ],
    bottomLogo: "https://mobje-pro-04-cos.mobje.cn/mini/mini/group.png",
  },

  onGlobalDataChange(globalData) {
    if (!globalData.token) {

      // 退出登录后的操作
      this.setData({
        isLogin: false,
        name: "",
        review: "",
        headPortrait: "",
        userInfo: {}
      })

      return;
    }

    this.setData({
      isLogin: !!globalData.token,
    });

    if (Object.keys(this.data.userInfo).length === 0) {
      this.setUserInfo();
    }
  },

  handleLogin() {
    my.navigateTo({
      url: "/pages/login/index",
    });
  },

  handleJump(event) {
    const isLogin = event.target.dataset.login;

    if (isLogin && !this.globalDataProxy.token) {
      return my.navigateTo({
        url: "/pages/login/index",
      });
    }

    jumpTripMiniH5Webview(event.currentTarget.dataset.route);
  },

  async setUserInfo() {
    const result = await getPersonalDetailsApi();
    this.setData({
      userInfo: result,
      review: result.reviewType === "APPROVED" ? "已认证" : "未认证",
      headPortrait: result.headPortraitId
        ? result.headPortraitId
        : "https://mobje-pro-04-cos.mobje.cn/mini/mini/avatar2.png",
      name: result.name
        ? result.name
        : (result.phone?.slice(0, 3) || "") +
          "****" +
          (result.phone?.slice(7) || ""),
    });
  },

  onLoad() {
    addBehaviorInLoad(this)
  },

  onUnload() {
    removeBehaviorInUnMount(this)
  },

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
