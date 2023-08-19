var request = require('request');
var COS = require('cos-js-sdk-v5');
import { Loading } from "element-ui";
let loading;
function start() {
  loading = Loading.service({
    lock: true,
    text: "正在上传",
    background: "rgba(0,0,0,0.3)",
  });
}

function end() {
    loading.close();
  }
let guid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}
/**
 * 修改文件名字
 */
let fileName = (file) => {
    let arr = file.name.split('.')
    var uuid = 'oss' + guid()
    if (arr.length > 1) {
      return uuid + '.' + arr[arr.length - 1]
    } else {
      return uuid
    }
  }
var cos = new COS({
    getAuthorization: function (options, callback) {
        // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
        // 异步获取临时密钥
        request({
            url: 'http://interface.hjsza.fun/web/file/getCosToken',
            headers: {
                token:localStorage.getItem("token")|| ''
            },
            data: {
                // 可从 options 取需要的参数
            }
        }, function (err, response, body) {

            try {
                var data = JSON.parse(body);
                console.log('data=======>', data)
                var credentials = data.data;
            } catch(e) {}
            if (!data || !credentials) return console.error('credentials invalid');
            let params = {
                TmpSecretId: credentials.accessKeyId,        // 临时密钥的 tmpSecretId
                TmpSecretKey: credentials.accessKeySecret,      // 临时密钥的 tmpSecretKey
                SecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
                ExpiredTime: credentials.expiredTime,               // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
            }
            console.log('params===>',params)
            callback(params);
        });
    }
});
const ossPut = function (file) {
    const { name } = file
    console.log(file)
    let key = fileName(file)
    start()
  return  new Promise((resolve, reject)=>{
        cos.uploadFile({
            Bucket: 'image-task-1318684421', /* 填入您自己的存储桶，必须字段 */
            Region: 'ap-nanjing',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
            Key: key,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
            Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
            SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
            onTaskReady: function(taskId) {                   /* 非必须 */
                console.log(taskId);
            },
            onProgress: function (progressData) {           /* 非必须 */
                console.log(JSON.stringify(progressData));
            },
            onFileFinish: function (err, data, options) {   /* 非必须 */
            console.log(options.Key + '上传' + (err ? '失败' : '完成'),data);
            
            },
        }, function (err, data) {
            end()
            console.log('fin',data)
            if (err) {
                reject(err)
            } else {
                console.log('上传成功：=====》','https://'+data.Location)
                resolve('https://'+data.Location)
            }
            console.log(err || data);
        });
    }) 
}


export default {ossPut}