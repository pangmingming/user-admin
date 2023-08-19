import axios from "axios";
import { Loading } from "element-ui";
let loading;
let loadingCount = 0;
function start() {
  loading = Loading.service({
    lock: true,
    text: "加载中",
    background: "rgba(0,0,0,0.3)",
  });
}

function end() {
  loading.close();
}

function showLoaing() {
  if (loadingCount == 0) {
    start();
  }
  loadingCount++;
}

function hideLoading() {
  loadingCount--;
  if (loadingCount == 0) {
    end();
  }
}

const http = axios.create({
  baseURL:process.env.DEPLOY_ENV === 'prod' ?'http://interface.hjsza.fun/web/':'http://interface.hjsza.fun/web/',
  headers: {
    Accept: "application/json",
  },
});
http.interceptors.request.use((config) => {
  showLoaing();
  config.headers.common["d-token"] =
    localStorage.getItem("token") || "89b90a88bc677204b47212c1bb5d565d";
  return config;
});
http.interceptors.response.use(
  function(response) {
    // console.log('response', response)
    // 对响应数据做点什么
    hideLoading();
    if (response.data.code === 401) {
      localStorage.removeItem("token");
      window.app.$router.replace({
        path: "/login",
      });
    } else if (response.data.code !== 0) {
      window.app.$message({
        message: response.data.msg,
      });
      return response.data;
    } else {
      return response.data;
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;
