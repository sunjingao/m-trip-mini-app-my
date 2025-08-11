
const ACCOUNT_INFO = my.getAccountInfoSync();
const ENV_VERSION = ACCOUNT_INFO.miniProgram.envVersion;

let BASE_URL = ""
if (ENV_VERSION !== "release") {
  BASE_URL = "https://trip-sit-tc.mobje.cn"
} else {
  BASE_URL = "https://trip-tc.mobje.cn"
}

export {
  BASE_URL
}
