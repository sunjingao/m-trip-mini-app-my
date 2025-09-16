
import store from "@/store/global";

App({
  onLaunch() {
    this.init();
  },

  initStore() {
    this.getGlobalDataProxy = store.getGlobalDataProxy;
    this.addGlobalDataChangeCb = store.addGlobalDataChangeCb;
    this.removeGlobalDataChangeCb = store.removeGlobalDataChangeCb;
    this.clearGlobalData = store.clearGlobalData;

    store.initGlobalData();
  },

  init() {
    this.initStore();

    // my.navigateTo({
    //   url: "/pages/center/platformFeeDetail"
    // })
  },
});
