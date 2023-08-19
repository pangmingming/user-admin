const path = require("path");
const webpack = require('webpack')

const _URL = "http://120.27.209.186:713/";
function resolve(...dirs) {
  return path.join(__dirname, ...dirs);
}
console.log('process.env.DEPLOY_ENV====>', process.env.DEPLOY_ENV)

module.exports = {
  publicPath: './',
  devServer: {
    host: "0.0.0.0",
    disableHostCheck: true,
    contentBase: resolve("public"),
    port: 3000,
    hot: false,
    inline: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    proxy: {
      "/api": {
        target: `${_URL}`,
        changeOrigin: true,
        headers: {
          Accept: "application/json",
        },
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
          "^/api": "/",
        },
      },
    },
  },
  configureWebpack:{
    plugins:[
      new webpack.DefinePlugin({
        "process.env":{
          DEPLOY_ENV: JSON.stringify(process.env.DEPLOY_ENV)
        }
      })
    ]
  }
}

