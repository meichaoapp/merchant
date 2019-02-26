//var NewApiRootUrl = 'http://localhost:8080/api/';
//var NewApiRootUrl = "https://wxapp.galaxyxd.com/api/";
//var NewApiRootUrl = 'https://mcapp.iliangpin.cn/api/';
var NewApiRootUrl = "http://101.201.213.248:8093/api/";
//var NewApiRootUrl = "https://wxapp.iliangpin.cn/api/";
module.exports = {

    WXLogin: NewApiRootUrl + 'merchant/user/login',//微信登录

    QueryBanner: NewApiRootUrl + 'merchant/banners',//查询轮播图
    QueryNotices: NewApiRootUrl + 'merchant/notice/list',//查询公告

    QueryTGList: NewApiRootUrl + 'merchant/groupPurchase/list', ///获取团购信息
    Friends: NewApiRootUrl + "merchant/groupPurchase/friends",//参团好友
    groupPurchase:NewApiRootUrl + "merchant/groupPurchase/",//团购

    QueryOrderDetail: NewApiRootUrl + "merchant/groupPurchase/details",//获取参团详情（我的参团-兑现)
    LeadOrder: NewApiRootUrl + "merchant/groupPurchase/leadOrder",//领货

    Partner: NewApiRootUrl + "common/partner", //成为伙伴（成为伙伴页）
    Pay: NewApiRootUrl + "common/pay", ///支付

    //店铺订单相关
    QueryOrderList: NewApiRootUrl + "merchant/groupPurchase/selfSupport/list",//获取店铺订单
    QueryOrderSumList: NewApiRootUrl + "merchant/groupPurchase/selfSupport/sum",//获取店铺订单汇总

    //我的团相关接口
    OrderDetailsByPerson: NewApiRootUrl + "merchant/groupPurchase/orderDetailsByPerson",//获取团购明细（团员）
    OrderDetailsByDetails: NewApiRootUrl + "merchant/groupPurchase/orderDetailsByDetails",//获取团购明细（团品）
    OrderDetailsByOrder: NewApiRootUrl + "merchant/groupPurchase/orderDetailsByOrder",//获取团购明细（订单）
    ConfirmReceipt: NewApiRootUrl + "merchant/groupPurchase/confirmReceipt", //确认收货
    
    //个人中心相关接
    QueryMyCenter: NewApiRootUrl + "merchant/groupPurchase/myCenter",//查询个人中心
    WithdrawDeposit: NewApiRootUrl + "merchant/groupPurchase/withdrawDeposit",//提现
    QuerymMyTradeList: NewApiRootUrl + "merchant/groupPurchase/myTradeList",//交易列表（个人中心明细）
    QueryGifts: NewApiRootUrl + "common/getgifts",//获取流量超市优惠券
    //收到新消息提醒
    newMsgReminder:NewApiRootUrl + "merchant/groupPurchase/message",//获取新消息提醒

    
    GetVerifiCode: NewApiRootUrl + "common/sendMsg", //短信验证码

    ///绑定手机号相关
    BindMobile: NewApiRootUrl + "common/savePhone",//绑定手机号
    PareseMobile: NewApiRootUrl + "consumer/getPhoneNumber",//绑定手机号
    PareseMobile: NewApiRootUrl + "consumer/getPhoneNumber",//绑定手机号
  
};
