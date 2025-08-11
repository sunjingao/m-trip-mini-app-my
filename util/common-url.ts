export function getCosImgUrl(key) {
  return `https://mobje-pro-04-cos.mobje.cn/mini/mini/${key}`;
}

function getTripMiniH5BaseUrl() {
  // develop：开发 trial：体验 release：线上
  const accountInfo = my.getAccountInfoSync();
  const environment = accountInfo.miniProgram.envVersion;
  if (environment === "develop") {
    // return "http://localhost:8899/trip-mini-h5/index.html";
    return "https://trip-sit-tc.mobje.cn/trip-mini-h5/index.html";
  } else if (environment === "trial") {
    return "https://trip-sit-tc.mobje.cn/trip-mini-h5/index.html";
  } else {
    return "https://trip-tc.mobje.cn/trip-mini-h5/index.html";
  }
}

function getTripMiniH5Path(routePath) {
  const baseUrl = getTripMiniH5BaseUrl();
  return `${baseUrl}/#/${routePath}`;
}

export function jumpTripMiniH5Webview(routePath) {
  const routeUrl = getTripMiniH5Path(routePath);

  const url = "/pages/web-view-h5/index?url=" + encodeURIComponent(routeUrl);

  console.log("url", url);

  my.navigateTo({
    url: url,
  });
}

export function redirectToTripMiniH5Webview(routePath) {
  const routeUrl = getTripMiniH5Path(routePath);

  const url = "/pages/web-view-h5/index?url=" + encodeURIComponent(routeUrl);

  my.redirectTo({
    url: url,
  });
}

export function jumpNormalWebview(path) {
  const url = "/pages/web-view-normal/index?url=" + encodeURIComponent(path);

  my.navigateTo({
    url: url,
  });
}

export function getOptions(options) {
  const res = {};
  for (const [k, v] of Object.entries(options)) {
    res[k] = JSON.parse(decodeURIComponent(decodeURIComponent(v)));
  }
  return res;
}
