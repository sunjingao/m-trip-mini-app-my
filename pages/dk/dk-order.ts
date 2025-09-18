
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Decimal } from 'decimal.js'
import { OperationUrl } from "mo-front-end-util";
import { addBehaviorInLoad,  removeBehaviorInUnMount} from '@/util/common-page-behavior';
import { getCosImgUrl, jumpTripMiniH5Webview } from '@/util/common-url'
import {
  getUserOrderDetailApi,
  getDepositAmountApi,
  getGuaranteeInfoDataApi,
  getNewestOrderApi,
  getForegiftInfoApi,
  postPreAuthApi,
  getEvaluationApi
} from '@/api/pages/dk/index'
import {BASE_URL} from "@/const/config";

dayjs.extend(duration)

Page({
  options: {
    // 使用基础库内置的数据变化观测器
    observers: true,
  },

  data: {
    DayMapping: {
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
      0: '周日'
    },
    DKStatusMap: [
      'BOOK',
      'WAIT_PICK_UP',
      'WAIT_DROP_OFF',
      'RETURN',
      'CANCELLED',
      'FINISH'
    ],
    leaseFullCoverageMap: {
      0: '租期内未覆盖',
      1: '租期内覆盖',
      2: '以下租期内覆盖'
    },
    pickUpTypeMap: {
      SELF: '门店自取',
      ON_DOOR: '上门送车'
    },
    pickDownTypeMap: {
      SELF: '门店自还',
      ON_DOOR: '上门取车'
    },
    current: 0,
    time: {},
    orderInfo: {},
    vehicleForegift: 0,
    foregiftData: {
      foregiftStatus: '',
      foregiftInsufficient: false
    },
    orderNo: "",
    checked: false,
    evaluation: '',
    error: {
      netError: false,
      phoneError: false,
      phone: ''
    },
    foregiftPay: "preauth",
    countDown: '',
    isGuaranteeNameShow: false,
    guaranteeInfoRef: [],
    countDownValue: '',
    needRecharge: undefined,
    bookPickUpTimeCn: '',
    formatHourFeeDaysCn: '',
    bookReturnTimeCn: '',
    locationImgUrl: getCosImgUrl('location5.png'),
    preauthImgUrl: getCosImgUrl('preauth.png'),
    forgetImgUrl: getCosImgUrl('forget.png'),
    phoneErrorImgUrl: getCosImgUrl('phone_error.png'),
    amountPrice: '',
    priceText: '',
    needPay: '',
    startEnergyShow: '',
    endEnergyShow: '',
    allCostShow: '',
    paidAmountShow: '',
    unpaidAmountShow: '',
    cotinueBookEndTimeSow: ''
  },

  observers: {
    "orderInfo": function(orderInfo) {
      const result = orderInfo.paymentStatus === 'UPDATE_UNPAID'
          ? dayjs(orderInfo.lastEditTime).add(30, 'minute').diff(dayjs())
          : orderInfo.leasePaymentStatus === 'UNPAID'
              ? dayjs(orderInfo.leaseStartTime).add(15, 'minute').diff(dayjs())
              : dayjs(orderInfo.createdDate).add(1, 'hour').diff(dayjs())

      this.setData({
        bookPickUpTimeCn: this.formatDate(dayjs(orderInfo.bookPickUpTime)),
        bookReturnTimeCn: this.formatDate(dayjs(orderInfo.bookReturnTime)),
        formatHourFeeDaysCn: this.formatHourFeeDays(),
        countDownValue: result / 1000,
        amountPrice: this.priceFormat(orderInfo.amount),
        priceText: this.getPriceText(),
        needPay: this.priceFormat(this.data.orderInfo.unpaidAmount || this.data.orderInfo.amount),

        startEnergyShow: this.formatEnergy(this.data.orderInfo.startEnergy),
        endEnergyShow: this.formatEnergy(this.data.orderInfo.endEnergy),
        allCostShow: this.priceFormat(this.data.orderInfo.allCost),
        paidAmountShow: this.priceFormat(this.data.orderInfo.paidAmount),
        unpaidAmountShow: this.priceFormat(this.data.orderInfo.unpaidAmount),
        cotinueBookEndTimeSow: dayjs(this.data.orderInfo.bookEndTime).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    "vehicleForegift, foregiftData.amount": function(vehicleForegift, amount) {
      this.setData({
        needRecharge: new Decimal(vehicleForegift).sub(new Decimal(amount)).toNumber()
      })
    }
  },

  // onGlobalDataChange(globalData) {
  //   if (!globalData.token) {
  //     return;
  //   }

  //   this.getDetail()
  //   this.getGuaranteeInfo()
  // },

  priceFormat(price) {
    return ((price || 0) / 100).toFixed(
        price % 100 === 0 ? 0 : price % 10 == 0 ? 1 : 2
    )
  },

  agreeChange() {
    this.setData({
      checked: !this.data.checked
    })
  },

  async getForegift() {
    const res = await getForegiftInfoApi()

    let foregiftData = this.data.foregiftData;
    let foregiftPay = this.data.foregiftPay;
    let vehicleForegift = this.data.vehicleForegift;

    Object.assign(foregiftData, res)
    foregiftData.foregiftInsufficient =
        foregiftData.foregiftAccountStatus != 1 &&
        Number(foregiftData.amount) > 0 &&
        Number(foregiftData.amount) < vehicleForegift
    foregiftPay = foregiftData.foregiftInsufficient
        ? 'foregift'
        : 'preauth'
    if (
        foregiftData.freezenPre != '2' &&
        Number(foregiftData.preAuthAmount) >= vehicleForegift
    ) {
      foregiftData.foregiftStatus = 'preauth'
    } else if (
        foregiftData.foregiftAccountStatus != 1 &&
        (Number(foregiftData.amount) >= vehicleForegift ||
            Number(foregiftData.exemptionDeposit) >= vehicleForegift)
    ) {
      foregiftData.foregiftStatus = 'foregift'
    } else {
      foregiftData.foregiftStatus = ''
    }

    this.setData({
      foregiftData,
      foregiftPay,
      vehicleForegift,
    })
  },

  async getDetail() {
    if (!this.data.orderNo) {
      return;
    }

    try {
      const result = await getUserOrderDetailApi({ orderNo: this.data.orderNo })


      setTimeout(
        () => {
          console.log(
            'result',
            result
          )
        },
        1000 * 5
      )


      Object.assign(this.data.orderInfo, result)
      this.data.orderInfo.includeGuaranteeFee = this.data.orderInfo.includeGuaranteeFee
          ? JSON.parse(this.data.orderInfo.includeGuaranteeFee)
          : {}
      this.data.orderInfo.leaseIncludeGuaranteeFee =
          this.data.orderInfo.leaseIncludeGuaranteeFee
              ? JSON.parse(this.data.orderInfo.leaseIncludeGuaranteeFee)
              : {}

      this.data.error.phoneError = false
      this.data.error.netError = false
      if (
          this.data.orderInfo.status === this.data.DKStatusMap[3] ||
          this.data.orderInfo.status === this.data.DKStatusMap[5]
      ) {
        const res = await getEvaluationApi({ orderNo: this.data.orderNo })

        this.data.evaluation = res.evaluationTime ? 'detail' : 'to'
      } else {
        this.data.evaluation = ''
      }

      // 更新
      this.setData({
        orderInfo: this.data.orderInfo,
        error: this.data.error,
        evaluation: this.data.evaluation
      })

      const res = await getDepositAmountApi({ orderNo: this.data.orderNo })
      this.setData({
        vehicleForegift: res
      })
      if (this.data.orderInfo.paymentStatus === 'BOOK_UNPAID') {
        this.getForegift()
      }
    } catch (res) {
      if (res.data.errors?.[0].errcode == '15003') {
        this.setData({
          'error.phoneError': true,
          'error.phone': res.data.errors?.[0].errmsg,
        })
      } else {
        this.setData({
          'error.phoneError': false,
          'error.netError': true,
        })
        // my.showToast({
        //   content: res.data.errors?.[0].errmsg,
        //   type: "none",
        // });
      }
    }
  },

  formatHourFeeDays() {
    const startTime = dayjs(this.data.orderInfo.bookPickUpTime)
    const endTime = dayjs(this.data.orderInfo.bookReturnTime)

    // 计算小时数
    let diffInHours = endTime.diff(startTime, 'hour')

    // 计算剩余的分钟数
    let remainingMinutes = endTime.diff(startTime, 'minute') % 60

    // 如果有剩余的分钟数，增加一个小时
    if (remainingMinutes > 0) {
      diffInHours += 1
    }

    if (diffInHours <= 0) return '0天'

    const days = Math.floor(diffInHours / 24)
    const hours = diffInHours % 24
    return `${days > 0 ? days + '天' : ''}${hours > 0 ? hours + '小时' : ''}`
  },

  formatDate(date) {
    return (
        date.format('M月DD日') +
        ` ${this.data.DayMapping[date.day()]}` +
        ` ${date.format('HH:mm')}`
    )
  },

  formatEnergy(value) {
    return `${this.data.orderInfo.vehicleDynamicModel === 'ELECTRIC' ? '电量' : '油量'}：${
        value != '' && value != null
            ? value + (this.data.orderInfo.vehicleDynamicModel === 'ELECTRIC' ? '%' : 'L')
            : ''
    }`
  },

  getPriceText() {
    return (
        this.data.orderInfo.guaranteeNames &&
        this.data.orderInfo.guaranteeNames.length > 0 &&
        this.data.orderInfo.guaranteeNames.join('、')
    )
  },

  onChange(e) {
    Object.assign(this.data.time, e)
    this.setData({
      time: this.data.time
    })
    if (this.data.time.hours === 0 && this.data.time.minutes === 0 && this.data.time.seconds === 1) {
      my.showModal({
        title: "订单已取消",
        content: "支付倒计时结束，系统已为您自动取消订单",
        confirmText: "知道了",
        showCancel: false,
        success:  (res)=> {
          if (res.confirm) {
            this.getDetail()
          }
        },
      });
    }
  },

  async getGuaranteeInfo() {
    const result = await getGuaranteeInfoDataApi({
      orderNo: this.data.orderNo
    })

    this.setData({
      guaranteeInfoRef: result.data
    })
  },

  toWebView() {
    my.navigateTo({
      url:
          `/pages/web-view-normal/index?url=${ encodeURIComponent(BASE_URL + "/static/mini/personalInfoAuthorization.html?title=个人信息授权书") }`,
    });
  },

  toLogin() {
    my.navigateTo({
      url: '/pages/login/index'
    })
  },

  copy(e) {
    const no = e.target.dataset.no
    my.setClipboard({
      text: no,
      success: function (res) {
        my.showToast({
          content: `复制成功`,
          type: "none",
        });
      },
      fail: function (error) {
        my.showToast({
          content: `复制失败`,
          type: "none",
        });
      }
    });
  },

  callClick(){
    my.makePhoneCall({
      number: this.data.orderInfo.maintainPhone, // 要拨打的电话号码，字符串类型
    })
  },

  async gotoPay() {
    const url = OperationUrl.concat("pay", {
      orderNo: this.data.orderInfo.no,
      orderId: this.data.orderInfo.id,
      payAmount: this.data.orderInfo.unpaidAmount || this.data.orderInfo.amount,
      type: 'DK'
    });
    jumpTripMiniH5Webview(url);
  },

  async payClick() {
    if (
        this.data.orderInfo.paymentStatus === 'BOOK_UNPAID' &&
        this.data.foregiftData.foregiftStatus == ''
    ) {
      this.foregitPay()
      return
    }
    try {
      const res = await getNewestOrderApi({
        orderNo: this.data.orderInfo.no,
        lastEditTime: this.data.orderInfo.lastEditTime
      })

      if (res) {
        this.handleCheck()
      } else {
        this.gotoPay()
      }
    } catch (e) {
      this.gotoPay()
    }
  },

  leasePayClick() {
    const url = OperationUrl.concat("pay", {
      orderNo: this.data.orderInfo.no,
      leaseNo: this.data.orderInfo.leaseNo,
      orderId: this.data.orderInfo.id,
      payAmount: this.data.orderInfo.allCost,
      type: 'DKLEASE'
    });
    jumpTripMiniH5Webview(url);
  },

  handleCheck() {
    my.showModal({
      content: '订单信息已更新，请重新确认订单',
      confirmText: "知道了",
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          this.getDetail()
          this.getGuaranteeInfo()
        }
      },
    });
  },

  navigation(e) {
    const type = e.target.dataset.type
    if (type === 'pickUp') {
      my.openLocation({
        latitude: Number(this.data.orderInfo.pickUpLatitude),
        longitude: Number(this.data.orderInfo.pickUpLongitude),
        scale: 28,
        address: this.data.orderInfo.pickUpAddress,
        name: this.data.orderInfo.cityName
      })
    } else {
      my.openLocation({
        latitude: Number(this.data.orderInfo.returnLatitude),
        longitude: Number(this.data.orderInfo.returnLongitude),
        scale: 28,
        address: this.data.orderInfo.dropOffAddress,
        name: this.data.orderInfo.cityName
      })
    }
  },

  reAuthClick() {
    if (this.data.foregiftData.preAuthAmount) {
      my.showModal({
        title: '是否重新预授权',
        content:
            '您当前已有预授权，重新授权后，原预授权将自动解除。如有疑问可详询客服。',
        confirmText: "确定",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.getPreAuth()
          }
        },
      });
      return
    }
    this.getPreAuth()
  },

  async getPreAuth() {
    const res = await postPreAuthApi(0)
      my.tradePay({
        orderStr: res.aliPayParaStr,
        success: (res) => {
          if (res.resultCode == '9000') {
            my.showModal({
              title: '授权成功',
              confirmText: '确定',
              showCancel: false
            })
            this.getDetail()
          }
        },
        fail: (res) => {
          my.showModal({
            title: '授权失败',
            content: JSON.stringify(res),
            confirmText: '确定',
            showCancel: false
          })
        }
      })

  },

  rechargeClick() {
    if (this.data.foregiftData.foregiftAccountStatus == 1) {
      my.showModal({
        title: '提示',
        content: '押金不足，请完成预授权操作',
        confirmText: '去完成',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            this.getPreAuth()
          }
        }
      })
      return
    }
    // let str = encodeURIComponent(JSON.stringify({
    //   enrolleeId: this.data.foregiftData.enrolleeId,
    //   payAmount: Math.abs(this.data.vehicleForegift - this.data.foregiftData.amount) * 100,
    //   foregiftAmount: this.data.vehicleForegift,
    //   type: 'FOREGIFT',
    //   certification: 0,
    //   orderId: this.data.orderInfo.id
    // }))

    const url = OperationUrl.concat("pay", {
      enrolleeId: this.data.foregiftData.enrolleeId,
      payAmount: Math.abs(this.data.vehicleForegift - this.data.foregiftData.amount) * 100,
      foregiftAmount: this.data.vehicleForegift,
      type: 'FOREGIFT',
      certification: 0,
      orderId: this.data.orderInfo.id,
      orderNo: this.data.orderNo,
    });

    jumpTripMiniH5Webview(url);
    // // sja
    // my.navigateTo({
    //   url: `/pages/pay/index?params=${str}`
    // })
  },

  foregitPay() {
    if (
        this.data.foregiftData.freezenPre == '2' &&
        this.data.foregiftData.foregiftAccountStatus == 1
    ) {
      my.showModal({
        title: '提示',
        content: '押金及预授权额度均不足\n无法完成支付',
        confirmText: '知道了',
        showCancel: false
      })
    } else if (this.data.foregiftPay == 'preauth') {
      if (this.data.foregiftData.freezenPre == '2') {
        my.showModal({
          title: '提示',
          content: '预授权额度不足，请完成押金充值',
          confirmText: '去完成',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.rechargeClick()
            }
          }
        })
      } else {
        my.showModal({
          title: '提示',
          content: '押金及预授权额度不足请充值押金或重新预授权',
          confirmText: '去完成',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.reAuthClick()
            }
          }
        })
      }
    } else {
      if (this.data.foregiftData.foregiftAccountStatus == 1) {
        my.showModal({
          title: '提示',
          content: '押金不足，请完成预授权操作',
          confirmText: '去完成',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.reAuthClick()
            }
          }
        })
      } else {
        my.showModal({
          title: '提示',
          content: '押金及预授权额度不足请充值押金或重新预授权',
          confirmText: '去完成',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.rechargeClick()
            }
          }
        })
      }
    }
  },

  toEvaluate(detail = '') {
    const url = OperationUrl.concat("evaluation", {
      orderType: "dk",
      orderId: this.data.orderInfo.id,
      orderNo: this.data.orderInfo.orderNo
    });
    jumpTripMiniH5Webview(url);
  },

  handleGoguarantee() {
    this.setData({
      isGuaranteeNameShow: true
    })
  },

  handleChangeDeposit(event) {
    this.setData({
      foregiftPay: event.target.dataset.type
    })
  },

  onLoad(option) {
    addBehaviorInLoad(this)

    setTimeout(
        () => {
          const res = my.getLaunchOptionsSync()

          if (!this.globalDataProxy || !this.globalDataProxy.token) {
            my.redirectTo({
              url: `/pages/login/index?fromPath=${encodeURIComponent(encodeURIComponent(JSON.stringify("dk")))}&orderNo=${encodeURIComponent(encodeURIComponent(JSON.stringify(res.query.orderNo)))}`,
            });

            return
          }

          // orderNo可能是扫码获取的，也可能是从登录跳转回来的
          this.setData({
            orderNo: option.orderNo || res.query.orderNo
            // sja
            // orderNo: "000582042509161123000001"
          })

          this.getDetail()
          this.getGuaranteeInfo()
        },
        1000
    )
  },

  onShow() {
    if (!this.data.orderNo) {
      return
    }

    this.getDetail()
    this.getGuaranteeInfo()
  },

  onUnload() {
    removeBehaviorInUnMount(this)
  }
});
