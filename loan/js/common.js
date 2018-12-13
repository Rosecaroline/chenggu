// 基地址
// var baseUrl = 'http://csl.api.app.beecloud.vip/api/cashloan/client/';
var baseUrl = 'http://apitest.rc.chenggutek.com/api/cashloan/inner/biz/loanmarket/h5/';
// var baseUrl = 'http://localhost:10001/api/cashloan/inner/biz/loanmarket/h5/';



// 获取url参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)" +  name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) {
        return unescape(r[2])
    }
    return null;
}

// 判断浏览器
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var clientType = "web";
if (isAndroid || isiOS) {
    clientType = "h5";
}
