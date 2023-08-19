const utils = {
    REGEXFORLOGIN: {
        email: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
        phone11: /^(\d){11}$/,
        phone12: /^(\d){12}$/,
        verifyCode: /^(\d){6}$/,
        password: /.{6,20}$/, // 判断位数6-20位
        loginPassword: /[^\s]/ // 判断是否非空
    },
    // checkInput(obj) {
    //     for (let key in obj) {
    //         if (!reg.REGEXFORLOGIN[key].test(obj[key])) {
    //             return false
    //         }
    //     }
    //     return true
    // },
     toChinesNum :(num) => {
        let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        let unit = ["", "十", "百", "千", "万"];
        num = parseInt(num);
        let getWan = (temp) => {
        　　let strArr = temp.toString().split("").reverse();
        　　let newNum = "";
        　　for (var i = 0; i < strArr.length; i++) {
          　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        　　}
         　 return newNum;
       }
       let overWan = Math.floor(num / 10000);
       let noWan = num % 10000;
       if (noWan.toString().length < 4) {　　　　　　noWan = "0" + noWan;　　　 }
       return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    }
}

export default utils