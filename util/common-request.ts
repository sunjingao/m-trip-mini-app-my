import { BASE_URL } from "@/const/config";
import CryptoJS from "crypto-js";

// token加密
const encryptByDESModeCBCUtf8to64 = (message) => {
  const keyHex = CryptoJS.enc.Utf8.parse("fawmc-count-des-key!#@$%");
  const iv = CryptoJS.enc.Utf8.parse("cbc!#@IV");
  const encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

// 获取token
export const getToken = () => {
  const token = my.getStorageSync({key: "token"}).data;
  const timestamp = Date.now();
  return token ? encryptByDESModeCBCUtf8to64(token + "&" + timestamp) : "";
};

const getData = function (
  params = {
    url: "",
    data: {},
    config: {},
    method: "get",
  }
) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      url: `${BASE_URL}${params.url}`,
      data: params.data,
      method: params.method,
      ...(params.config || {}),
      timeout: 1000 * 30,
      "dataType": "json",
      headers: {
        token: getToken(),
      },
      success(res) {
        // 此处Code根据自己项目实际情况来写
        if (res.statusCode === 200) {
          if (
            res.data &&
            res.data.errors &&
            (res.data.errors?.[0].errcode === "user.00006" ||
              res.data.errors?.[0].errcode === "user.00002" ||
              res.data.errors[0].errcode === "user.00004" ||
              res.data.errors[0].errcode === "user.00005")
          ) {
            my.showModal({
              title: "温馨提示",
              content: "尚未登录，是否现在登录？",
              confirmText: "立即登录",
              success: (res) => {
                if (res.confirm) {
                  my.navigateTo({
                    url: "/pages/login/index",
                  });
                }
              },
            });
          } else if (res.data.errors && res.data.errors.length > 0) {
            my.showToast({ content: res.data.errors[0].errmsg, type: "none" });
          } else {
            let result = {};
            if (res.data.pageable) {
              result.data = res.data.data;
              result.pageable = res.data.pageable;
            } else {
              result = res.data.data;
            }
            return resolve(result);
          }
        }
        return reject(res);
      },
      fail(err) {
        my.showToast({ content: "网络偷懒", type: "none" });
        return reject(err);
      },
    };

    my.request(requestOptions);
  });
};

const get = function (url, data) {
  return getData({
    url,
    method: "get",
    data,
  });
};

const post = function (url, data) {
  return getData({
    url,
    method: "post",
    data,
  });
};

export default {
  get,
  post,
};
