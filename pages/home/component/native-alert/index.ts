import storeBehavior from "@/behaviors/store/index";
import { initGpsBySetting, initGpsInfo } from "@/util/common-permission";

Component({
  mixins: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    // 登录的token
    token: "",
    // 开启定位
    enableLocate: false,
    // 是否开城了
    enableCity: false,
    // 首次
    isFirst: true
  },
  methods: {
    onGlobalDataChange(globalData) {
      this.setData({
        enableLocate: !!globalData.currentLocationInfo.isGpsOpen,
        enableCity: !!globalData.selectedPointInfo.pickUpPointInfo.no,
      });


      // 刚刚登录，初始化下权限信息
      if (!this.data.token && globalData.token) {
        this.setData({
          token: globalData.token
        });
      }

      
      // 首次进入，需要申请用户权限
      if (this.data.isFirst) {
        this.setData({
          isFirst: false
        })
        this.initPermission();
      }
    },
    async initPermission() {
      await initGpsInfo(this.globalDataProxy);
    },
    handleOpenLocate() {
      initGpsBySetting(this.globalDataProxy);
    },
  },
});
