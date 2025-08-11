import dayjs from "dayjs";

// 获得取还车之间的时间间距
function getSpaceDay(timeLimitInfo) {
  if (!timeLimitInfo.fetchTime) {
    return "";
  }

  const spaceMi = timeLimitInfo.returnTime - timeLimitInfo.fetchTime;

  const hourSpace = parseFloat((spaceMi / 1000 / 60 / 60).toFixed(2));

  let resultDay = parseInt(hourSpace / 24);

  const remainHour = hourSpace % 24;

  if (remainHour !== 0) {
    if (remainHour < 4) {
      resultDay += 0.5;
    } else {
      resultDay += 1;
    }
  }

  return resultDay;
}

async function getIsTimeValid(timeLimitInfo) {
  return new Promise((resolve, reject) => {
    // 校验是否超过在允许提前预约的时间内
    if (
      new Date(timeLimitInfo.returnTime).getHours - new Date().getHours() <
      timeLimitInfo.appointmentTime
    ) {
      my.showToast({
        content: `取车时间距离当前时间至少${timeLimitInfo.appointmentTime}小时`,
        type: "none",
      });
      reject();
    }

    // 校验是否超过最长租期时间
    const spaceDays = getSpaceDay(timeLimitInfo);
    if (spaceDays > timeLimitInfo.maxTenancyTerm) {
      my.showToast({
        content: `最长租期为${timeLimitInfo.maxTenancyTerm}`,
        type: "none",
      });
      reject();
    }

    // 校验是否超过早上允许的时间
    if (new Date(timeLimitInfo.fetchTime).getHours() < timeLimitInfo.openTime) {
      my.showToast({
        content: "取车时间不在网点营业时间内",
        type: "none",
      });
      reject();
    }
    if (
      new Date(timeLimitInfo.returnTime).getHours() < timeLimitInfo.openTime
    ) {
      my.showToast({
        content: "取车时间不在网点营业时间内",
        type: "none",
      });
      reject();
    }
    // 校验是否超过晚上允许的时间
    if (
      new Date(timeLimitInfo.fetchTime).getHours() > timeLimitInfo.closeTime
    ) {
      my.showToast({
        content: "取车时间不在网点营业时间内",
        type: "none",
      });
      reject();
    }
    if (
      new Date(timeLimitInfo.returnTime).getHours() > timeLimitInfo.closeTime
    ) {
      my.showToast({
        content: "取车时间不在网点营业时间内",
        type: "none",
      });
      reject();
    }

    // 时间允许
    resolve(true);
  });
}

// 获取默认的取车时间
function getFetchTime() {
  let adjustedTime = NaN;
  // 获取当前时间
  const currentTime = dayjs();
  // 计算一小时后的时间
  const oneHourLater = currentTime.add(1, "hour");
  // 检查分钟数是否小于 30
  if (oneHourLater.minute() > 0 && oneHourLater.minute() < 30) {
    // 若小于 30，将分钟设置为 30
    adjustedTime = oneHourLater.minute(30);
  } else if (oneHourLater.minute() > 30 && oneHourLater.minute() < 60) {
    adjustedTime = oneHourLater.minute(0).add(1, "hour");
  } else {
    adjustedTime = oneHourLater;
  }
  // 获取调整后时间的时间戳
  const timestamp = adjustedTime.valueOf();

  return timestamp;
}

// 获取默认的还车时间
function getReturnTime() {
  const startTime = getFetchTime();
  // 获取当前时间
  const currentTime = dayjs(startTime);
  // 增加两天时间
  const twoDaysLater = currentTime.add(2, "day");
  // 获取时间戳
  const timestamp = twoDaysLater.valueOf();
  return timestamp;
}

function minuteFormatter(millisecond) {
  const _day = Math.floor(millisecond / 60 / 60 / 24 / 1000);
  const _hour = Math.floor((millisecond / 60 / 1000 / 60) % 24);
  let _minutes = Math.floor(millisecond / 1000 / 60) % 60;
  const _seconds = (millisecond / 1000) % 60;
  if (_seconds) {
    _minutes += 1;
  }

  let resultText = "";
  if (_day > 0) {
    resultText += `${_day}天`;
  }
  if (_hour > 0) {
    resultText += `${_hour}小时`;
  }
  resultText += `${_minutes}分钟`;
  return resultText;
}

export {
  getSpaceDay,
  getIsTimeValid,
  getFetchTime,
  getReturnTime,
  minuteFormatter,
};

export default {
  getSpaceDay,
  getIsTimeValid,
  getFetchTime,
  getReturnTime,
  minuteFormatter,
};
