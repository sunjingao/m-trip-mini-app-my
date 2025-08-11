import storeBehavior from "@/behaviors/store/index";
import { getCityLocationValidApi } from "@/api/pages/main/index";
import { getIsTimeValid } from "@/util/common-date";
import { jumpTripMiniH5Webview } from "@/util/common-url";

Component({
  mixins: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {},
  methods: {
    async getIsPointValid(selectedPointInfo) {
      return new Promise((resolve, reject) => {
        if (!selectedPointInfo.pickUpPointInfo.no) {
          my.showToast({
            content: `请选择取车网点`,
            type: "none",
          });
          reject();
        }

        if (
          selectedPointInfo.isDifferent &&
          !selectedPointInfo.returnPointInfo.no
        ) {
          my.showToast({
            content: `请选择还车网点`,
            type: "none",
          });
          reject();
        }

        resolve();
      });
    },

    async handleSelectCar() {
      await getIsTimeValid(this.globalDataProxy.timeLimitInfo);

      await this.getIsPointValid(this.globalDataProxy.selectedPointInfo);

      await getCityLocationValidApi(
        this.globalDataProxy.selectedPointInfo.cityInfo.cityCode,
        this.globalDataProxy.selectedPointInfo.pickUpPointInfo.no,
        this.globalDataProxy.selectedPointInfo.returnPointInfo.no
      );

      jumpTripMiniH5Webview("select-car");
    },
  },
});
