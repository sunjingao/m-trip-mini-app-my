import { addBehaviorInLoad, removeBehaviorInUnMount } from '@/util/common-page-behavior';
import { redirectToTripMiniH5Webview } from "@/util/common-url";
import { OperationUrl } from "mo-front-end-util";

Page({
  data: {
  },


  onLoad(options) {
    addBehaviorInLoad(this)


    setTimeout(
      () => {
        const res = my.getLaunchOptionsSync()

        if (!this.globalDataProxy || !this.globalDataProxy.token) {
          my.redirectTo({
            url: `/pages/login/index?fromPath=${encodeURIComponent(encodeURIComponent(JSON.stringify("platformFeeDetail")))}&id=${encodeURIComponent(encodeURIComponent(JSON.stringify(res.query.id)))}`,
          });

          return
        }

        const url = OperationUrl.concat("platform-fee-detail", {
          id: options.id || res.query.id
        });

        redirectToTripMiniH5Webview(url);

      },
      1000
    )

  },

  onUnload() {
    removeBehaviorInUnMount(this)
  }
});
