import dayjs from "dayjs";
import { OperationUrl } from "mo-front-end-util";
import {
  getContentSigningStatusApi,
  postCreateContentApi,
  getUnFinishOrderListApi,
} from "@/api/pages/main/index";
import { ORDER_PAYMENT_STATUS, ORDER_STATUS } from "@/const/order";
import storeBehavior from "@/behaviors/store/index";
import DateUtils from "@/util/common-date";
import { jumpTripMiniH5Webview } from "@/util/common-url";
import { cloneDeep } from "@/util/common-bom";

Component({
  options: {
    // 允许基础库识别 lifetimes 字段以支持 lifetimes 功能
    lifetimes: true,
  },

  mixins: [storeBehavior],

  /**
   * 页面的初始数据
   */
  data: {
    times: 1754213982681,
    ORDER_STATUS: ORDER_STATUS,
    ORDER_PAYMENT_STATUS: ORDER_PAYMENT_STATUS,
    // 是否展示
    isShow: false,
    // 是否已经惊醒过合同签署，true 不展示
    isSign: true,
    // 是否展示位错误信息
    isShowError: "false",
    // 订单详情
    orderDetail: {},
    // 倒计时
    countDown: {
      isShow: false,
      time: 0,
    },
    // 展示的动力类型、变速箱类型、座位信息
    vehicleModelPropertyName: "",
    // 用车状态
    orderStatusLabel: "",
  },

  methods: {
    onGlobalDataChange(globalData) {
      if (!globalData.token) {
        this.setData({
          isShow: false
        })
        return;
      }
      this.reqUnFinishOrderList();
    },
    
    // 时间格式化
    dateToCnFormat(date) {
      if (!date) {
        return "";
      }
      return dayjs(date).format("M月DD日 HH:mm");
    },

    // 倒计时结束
    handleCountdownEnd() {
      this.setData({
        "countDown.isShow": false,
      });
    },

    // 跳转详情页
    handleClickOrderCard() {
      const url = OperationUrl.concat("order-detail", {
        orderId: this.data.orderDetail.id,
        orderNo: this.data.orderDetail.no,
      });
      jumpTripMiniH5Webview(url);
    },

    // 跳转合同签署部分
    async handleGoSignContract(e) {
      try {
        const result = await postCreateContentApi(
          {
            redirectUrl: "wechat://back",
            orderNo: this.data.orderDetail.no,
          }
        );

        if (!result) {
          return;
        }

        const url = OperationUrl.concat("/pages/esign/index", {
          flowId: result.flowId,
          no: this.data.orderDetail.no,
          accountId: result.psnId,
        });

        my.navigateTo({
          url: url
        })
      } catch (error) {
        if (error.errcode == "18033") {
          my.showModal({
            title: "",
            content:
              error.errmsg || "您的证件信息尚未完善或已过期,请先更新证件",
            confirmText: "去更新",
            cancelText: "取消",
            cancelColor: "#000",
            success: function (res) {
              if (res.confirm) {
                jumpTripMiniH5Webview("my-infor");
              }
            },
          });
        } else {
          my.showToast({
            content: error.errmsg
          });
        }
      }
    },

    async reqUnFinishOrderList() {
      const tempResult = await getUnFinishOrderListApi();

      const result = tempResult && tempResult[0];

      if (!result) {
        this.setData({
          isShow: false
        })
        return;
      }

      this.setDetailData(result);

      this.setOrderStatusLabel();

      this.setSignContract();

      this.setVehicleModelPropertyName();

      this.setCountDown();

      this.setIsShow();
    },

    async setSignContract() {
      const result = await getContentSigningStatusApi(
        {
          orderNo: this.data.orderDetail.no,
        }
      );

      this.setData({
        isSign: result,
      });
    },

    // 展示的动力类型、变速箱类型、座位
    setVehicleModelPropertyName() {
      const {
        vehicleDynamicModel,
        vehicleGearBox,
        vehicleSeat,
      } = this.data.orderDetail;

      let text = "";

      if (vehicleDynamicModel === "OIL") {
        text += `油车`;
      } else {
        text += `电车`;
      }

      if (vehicleGearBox) {
        text += ` | ${vehicleGearBox}`;
      }

      if (vehicleSeat) {
        text += ` | ${vehicleSeat}座`;
      }

      this.setData({
        vehicleModelPropertyName: text,
      });
    },

    // 展示状态
    setOrderStatusLabel() {
      let text = "";
      const { status, paymentStatus } = this.data.orderDetail;
      if (status === ORDER_STATUS.BOOK) {
        // 已预约
        text =
          paymentStatus === ORDER_PAYMENT_STATUS.BOOK_UNPAID
            ? "待支付"
            : "待取车";
      } else if (status === ORDER_STATUS.ALLOCATED) {
        // 待取车
        text = "待取车";
      } else if (status === ORDER_STATUS.CANCELLED) {
        // 已取消
        switch (paymentStatus) {
          case ORDER_PAYMENT_STATUS.BOOK_REFUND_FAILED:
          case ORDER_PAYMENT_STATUS.BOOK_REFUNDING:
            text = "退款中";
            break;
          default:
            text = "已取消";
            break;
        }
      } else if (status === ORDER_STATUS.PICK_UP) {
        // 待还车
        text = "待还车";
      } else if (status === ORDER_STATUS.RETURN) {
        // 这里和产品确认过，如果不需要付款，可能没有这个状态
        // 已还车
        text =
          paymentStatus === ORDER_PAYMENT_STATUS.FINISH_NEED_REFUND
            ? "待退款"
            : "待支付";
      } else if (status === ORDER_STATUS.FINISH) {
        // 已完成
        if (
          paymentStatus === ORDER_PAYMENT_STATUS.FINISH_REFUND_FAILED ||
          paymentStatus === ORDER_PAYMENT_STATUS.FINISH_REFUNDING
        ) {
          text = "退款中";
        } else {
          text = "已完成";
        }
      } else {
        text = "";
      }

      console.log('orderStatusLabel', text);

      this.setData({
        orderStatusLabel: text,
      });
    },

    // 设置倒计时
    setCountDown() {
      // 倒计时内容处理
      this.data.countDown.isShow =
        this.data.orderDetail.status === ORDER_STATUS.BOOK &&
        this.data.orderDetail.paymentStatus ===
          ORDER_PAYMENT_STATUS.BOOK_UNPAID;

      const _endPayDate = dayjs(this.data.orderDetail.createdDate).add(
        15,
        "minutes"
      );

      this.data.countDown.time = _endPayDate.isAfter(dayjs())
        ? _endPayDate.diff() / 1000
        : 0;

      this.setData({
        countDown: this.data.countDown
      });
    },

    setIsShow() {
      const isShow = [
        "待支付",
        "待取车",
        "待还车",
        "待退款",
        "已取消",
      ].includes(this.data.orderStatusLabel);

      this.setData({
        isShow: isShow,
      });
    },

    setDetailData(oriData) {
      const resData = cloneDeep(oriData);
      // 取还车时间处理
      if (resData.bookPickUpTime) {
        resData.bookPickUpTime = this.dateToCnFormat(resData.bookPickUpTime);
      }
      if (resData.pickUpTime) {
        resData.pickUpTime = this.dateToCnFormat(resData.pickUpTime);
      }
      if (resData.bookReturnTime) {
        resData.bookReturnTime = this.dateToCnFormat(resData.bookReturnTime);
      }
      if (resData.returnTime) {
        resData.returnTime = this.dateToCnFormat(resData.returnTime);
      }

      // 计算剩余或者超时时间
      if (this.data.orderStatusLabel === "待取车") {
        const _diff = dayjs(oriData.bookPickUpTime).diff();
        // 距离取车时间不足1小时才展示倒计时, 且无超时
        if (_diff > 0 && _diff < 60 * 60 * 1000) {
          resData.bookOrReturnRemainTip = `剩余${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        } else if (_diff < 0) {
          resData.bookOrReturnRemainTip = `超时${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        }
      } else if (this.data.orderStatusLabel === "待还车") {
        const _diff = dayjs(oriData.bookReturnTime).diff();
        if (_diff > 0 && _diff < 60 * 60 * 1000) {
          resData.bookOrReturnRemainTip = `剩余${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        } else if (_diff < 0) {
          resData.bookOrReturnRemainTip = `超时${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        }
      } else if (this.data.orderStatusLabel === "待支付") {
        const _diff = dayjs(oriData.returnTime).diff(
          dayjs(resData.bookReturnTime)
        );
        if (_diff > 0) {
          resData.bookOrReturnRemainTip = `剩余${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        } else if (_diff < 0) {
          resData.bookOrReturnRemainTip = `超时${DateUtils.minuteFormatter(
            Math.abs(_diff)
          )}`;
        }
      }

      const isShowError = String(resData.bookOrReturnRemainTip).includes(
        "超时"
      );

      this.setData({
        isShowError: isShowError,
        orderDetail: resData,
      });
    },
  },

});
