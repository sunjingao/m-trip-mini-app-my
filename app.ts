
import store from "@/store/global";

App({
  onLaunch() {
    // 改版前存在 userPrivacyStatus，说明之前登录过，去掉相关内容
    if(my.getStorageSync({key: "userPrivacyStatus"}).data) {
      my.setStorageSync({
        key: "token",
        data: ""
      })
      my.setStorageSync({
        key: "userPrivacyStatus",
        data: false
      })
    }

    this.init();
  },

  initStore() {
    this.getGlobalDataProxy = store.getGlobalDataProxy;
    this.addGlobalDataChangeCb = store.addGlobalDataChangeCb;
    this.removeGlobalDataChangeCb = store.removeGlobalDataChangeCb;
    this.clearGlobalData = store.clearGlobalData;

    store.initGlobalData();

    // my.navigateTo({
    //   url:
    //       `/pages/dk/dk-order`,
    // });
  },

  init() {
    this.initStore();

    // my.navigateTo({
    //   url: "/pages/center/platformFeeDetail"
    // })
  },
});
