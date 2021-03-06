//var NewApiRootUrl = 'http://localhost:8080/api/';
//var NewApiRootUrl = 'https://mcapp.iliangpin.cn/api/';
//var NewApiRootUrl = "http://101.201.213.248:8093/api/";
//var NewApiRootUrl = "https://wxapp.iliangpin.cn/api/";
var NewApiRootUrl = "https://mcapp.iliangpin.cn/api/";

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

    /** 通用模块 */
    GetVerifiCode: NewApiRootUrl + "common/sendMsg", //短信验证码
    CollectLogs: NewApiRootUrl + "common/logCollection",//日志采集
    UplodUrl: NewApiRootUrl + "fileupload/upload",//上传
    QueryCategories: NewApiRootUrl + "common/getBaseData",//分类
  

    ///绑定手机号相关
    BindMobile: NewApiRootUrl + "common/savePhone",//绑定手机号
    PareseMobile: NewApiRootUrl + "merchant/getPhoneNumber",//绑定手机号

    ///商品管理相关
    CheckPurchasGoodsPromise: NewApiRootUrl + 'merchant/groupPurchase/verifySelfSupport', ///校验编辑商品权限
    QueryPurchasGoodsList: NewApiRootUrl + 'merchant/groupPurchase/tolist', ///商品列表
    PurchasGoodsUpDown: NewApiRootUrl + 'merchant/groupPurchase/updateStatus', ///商品上下架
    QueryPurchasGoods: NewApiRootUrl + 'merchant/groupPurchase/toEdit', ///查询商品
    EditPurchasGoods: NewApiRootUrl + 'merchant/groupPurchase/submit', ///编辑团购商品

    ///优惠券相关
    QueryMyCouponList: NewApiRootUrl + "discountCoupon/merchant/mylist", //我的优惠券
    QueryMyCouponDetail: NewApiRootUrl + "discountCoupon/merchant/myDetail", //我的优惠券详情
    QuerysalesVolume: NewApiRootUrl + "discountCoupon/merchant/salesVolume", //我的优惠券销量
    LeadCoupon: NewApiRootUrl + "discountCoupon/merchant/leadOrder", //优惠券领货
    QueryCouponDetail: NewApiRootUrl + "merchant/discountCoupon/details", //二维码扫描结果

  
};
