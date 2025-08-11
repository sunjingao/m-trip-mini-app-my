import dayjs from "dayjs";
import { getSpaceDay } from "@/util/common-date"


export default {
  // 定义数据
  data: {
    startDay: "",
    startTime: "",
    longTime: "",
    endDay: "",
    endTime: "",
  },
  // 定义方法
  methods: {
    setStartDay(timeLimitInfo) {
      if (!timeLimitInfo.fetchTime) {
        return "";
      }

      this.setData({
        startDay: dayjs(timeLimitInfo.fetchTime).format('MM月DD日')
      })
    },
    setStartTime(timeLimitInfo) {
      if (!timeLimitInfo.fetchTime) {
        return "";
      }

      const day = new Date(timeLimitInfo.fetchTime).getDay()

      const DateMap = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        0: '周日',
      }
      const showDay = DateMap[day]
      const showTime = dayjs(timeLimitInfo.fetchTime).format('H:mm')
      this.setData({
        startTime: `${showDay} ${showTime}`
      })
    },
    setLongTime(timeLimitInfo) {
      if (!timeLimitInfo.fetchTime) {
        return "";
      }

      const result = getSpaceDay(timeLimitInfo)

      this.setData({
        longTime: `${result}天`
      })
    },
    setEndDay(timeLimitInfo) {
      if (!timeLimitInfo.returnTime) {
        return "";
      }

      this.setData({
        endDay: dayjs(timeLimitInfo.returnTime).format('MM月DD日')
      })
    },
    setEndTime(timeLimitInfo) {
      if (!timeLimitInfo.returnTime) {
        return "";
      }

      const day = new Date(timeLimitInfo.returnTime).getDay()
      const DateMap = {
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
        0: '周日',
      }
      const showDay = DateMap[day]
      const showTime = dayjs(timeLimitInfo.returnTime).format('H:mm')
      this.setData({
        endTime: `${showDay} ${showTime}`
      })
    },

    initDayTime(timeLimitInfo) {
      this.setStartDay(timeLimitInfo)
      this.setStartTime(timeLimitInfo)
      this.setLongTime(timeLimitInfo)
      this.setEndDay(timeLimitInfo)
      this.setEndTime(timeLimitInfo)
    },
  },
};
