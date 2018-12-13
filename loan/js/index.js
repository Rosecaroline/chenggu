
// 获取首页
var homePageUrl = baseUrl + 'home';
var popClickUrl = baseUrl + "pop/click";
var CACHEVISITOR = "visitorCache";

$(document).ready(function() {

    // 获取首页
    $.ajax({
        url: homePageUrl, // 加随机数防止缓存
        type: "post",
        dataType: "json",
        data: {},
        success: function (data) {
            if (data.respCode == '0') {
                console.log(data);
                var tabsList = data.obj;
                // tab展示
                showTabs(tabsList);
            } else {
                $("#wrap").css("display", "none");
                $("#no-data").css("display", "block");
            }
        }
    });
});

/**
 * 栏位展示判断
 * @param tabsList
 */
function showTabs(tabsList) {
    if (tabsList == null) {
        $(".public-item").css("display","none");
        return;
    }
    // 判断极速匹配栏展示
    if (tabsList.speedMatchList == null) {
        $(".speedMatchList").css("display","none");
    } else {
        showSpeedMatchList(tabsList.speedMatchList);
    }
    // 判断极速超过通过率栏展示
    if (tabsList.highPassList == null) {
        $(".highPassList").css("display","none");
    } else {
        showMidList("highPassList", tabsList.highPassList);
    }
    // 判断只需要身份证栏展示
    if (tabsList.onlyIdcardList == null) {
        $(".onlyIdcardList").css("display","none");
    } else {
        showMidList("onlyIdcardList", tabsList.onlyIdcardList);
    }
    // 判断不查征信栏展示
    if (tabsList.noInvestigationCreditList == null) {
        $(".noInvestigationCreditList").css("display","none");
    } else {
        showMidList("noInvestigationCreditList", tabsList.noInvestigationCreditList);
    }
    if (tabsList.newTabList != null) {
        showNewTabList(tabsList.newTabList);
    }
}

/**
 * 展示极速匹配信息
 * @param speedMatchList
 */
function showSpeedMatchList(speedMatchList) {
    var speedMatch = $("#speedMatchList");
    for (var i = 0; i < speedMatchList.length; i++) {
        var promotion = speedMatchList[i];
        var promotionStr = JSON.stringify(promotion);
        speedMatch.append("<li class=\"clearfix\" onclick='gotoPop(" + promotionStr + ")'>\n" +
            "<div class=\"fl match-left\">\n" +
            "<img src=" + promotion.productLogo + " alt=\"\">\n" +
            "<div class=\"match-item-info\">\n" +
            "<span>"+ promotion.productName +"</span>\n" +
            "<p>" + promotion.productSummary + "</p>\n" +
            "</div>\n" +
            "</div>\n" +
            "<a href=\"javascript:void(0)\" class=\"apply fr\">立即申请</a>\n" +
            "</li>");
    }
}

/**
 * 展示中间列表
 * @param midId
 * @param midList
 */
function showMidList(midId, midTabList) {
    var midTab = $("#" + midId);
    for (var i = 0; i < midTabList.length; i = i + 2) {
        var promotion = midTabList[i];
        var promotion1 = midTabList[i + 1];

        var promotionStr = JSON.stringify(promotion);
        var promotion1Str = JSON.stringify(promotion1);

        if (promotion1 != null && promotion1 != 'undefined') {
            midTab.append("<li class=\"clearfix\">\n" +
                "<div class=\"pass-half\" onclick='gotoPop(" + promotionStr + ")'>\n" +
                "<img src=" + promotion.productLogo + " alt=\"\">\n" +
                "<div class=\"pass-item-info\">\n" +
                "<span>" + promotion.productName + "</span>\n" +
                "<p>" + promotion.productSummary + "</p>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class=\"pass-half pass-half-right\" onclick='gotoPop(" + promotion1Str + ")'>\n" +
                "<img src=" + promotion1.productLogo + " alt=\"\">\n" +
                "<div class=\"pass-item-info pass-item-info-right\" >\n" +
                "<span>" + promotion1.productName + "</span>\n" +
                "<p>" + promotion1.productSummary + "</p>\n" +
                "</div>\n" +
                "</div>\n" +
                "</li>");
        } else {
            midTab.append("<li class=\"clearfix\" onclick='gotoPop(" + promotionStr + ")'>\n" +
                "<div class=\"pass-half\">\n" +
                "<img src=" + promotion.productLogo + " alt=\"\">\n" +
                "<div class=\"pass-item-info\">\n" +
                "<span>" + promotion.productName + "</span>\n" +
                "<p>" + promotion.productSummary + "</p>\n" +
                "</div>\n" +
                "</div>\n" +
                "</li>");
        }
    }
}

/**
 * 最新口子
 * @param newTabList
 */
function showNewTabList(newTabList) {
    var newTab = $("#newTabList");
    for (var i = 0; i < newTabList.length; i++) {
        var promotion = newTabList[i];
        var promotionStr = JSON.stringify(promotion);
        newTab.append("<li class=\"clearfix\" onclick='gotoPop(" + promotionStr + ")'>\n" +
            "<div class=\"fl latest-left\">\n" +
            "<img src=" + promotion.productLogo + " alt=\"\">\n" +
            "<span>"+ promotion.productName + "</span>\n" +
            "</div>\n" +
            "<div class=\"fr latest-right\">\n" +
            "<a href=\"##\" title=\"\">立即申请</a>\n" +
            "<img src=\"img/arrow.png\" alt=\"\">\n" +
            "</div>\n" +
            "</li>");
    }
}

/**
 * 跳转到渠道推广页
 * @param promotion
 */
function gotoPop(promotion) {
    console.log(promotion);
    // 统计点击量
    addClick(promotion);
    // 跳转
    window.location.href = promotion.productPopUrl;
}

/**
 * 添加点击
 * @param promotion
 */
function addClick(promotion) {
    var cacheValue = "N" + promotion.id + "P" + promotion.productId + "T" + promotion.promotionTypeId;
    // 获取推广计划是否点击
    var visitorCache = getCacheByKey(CACHEVISITOR + promotion.id);
    var uv = 1;
    if (visitorCache == cacheValue) {
        uv = 0;
    }
    var requestData = {
        "promotionPlanId" : promotion.id,
        "productId" : promotion.productId,
        "promotionTypeId" : promotion.promotionTypeId,
        "pv" : 1,
        "uv" : uv
    };
    $.ajax({
        url: popClickUrl,
        type: "post",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(requestData),
        success: function (data) {
            if (data.respCode == '0') {
                console.log("统计成功!");
            }else {
                console.log("统计失败!");
            }
        }
    });
    setCache(CACHEVISITOR + promotion.id, cacheValue);
}

//错误信息显示
function errMsg(html){
    var str='<div class="error">'+html+'</div>';
    return str;
}

function getCacheByKey(key) {
    return window.localStorage.getItem(key);
}

function setCache(key, value) {
    window.localStorage.setItem(key, value);
}

function resetTip(){
    top.$.jBox.tip.mess = null;
}
function showTip(mess, type, timeout, lazytime){
    resetTip();
    setTimeout(function(){
        top.$.jBox.tip(mess, (type == undefined || type == '' ? 'info' : type), {opacity:0,
            timeout:  timeout == undefined ? 2000 : timeout});
    }, lazytime == undefined ? 500 : lazytime);
}

function showError(mess){
    $('[name = code]').after(errMsg(mess));
    timer();
}

