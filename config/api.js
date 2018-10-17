var NewApiRootUrl = 'http://localhost:8080/api/';
//var NewApiRootUrl = "https://www.gift.wananhevip.com/api/";
module.exports = {
   
  WXLogin: NewApiRootUrl + 'merchant/user/login',//微信登录

  QueryBanner: NewApiRootUrl + 'index/banners',//查询轮播图

  QueryTGList: NewApiRootUrl + 'merchant/groupPurchase/list', ///获取团购信息
  Friends: NewApiRootUrl + "merchant/groupPurchase/friends",//参团好友

  
  QueryOrderDetail: NewApiRootUrl + "merchant/groupPurchase/orderList",//获取参团详情（我的参团-兑现)
  LeadOrder: NewApiRootUrl + "merchant/groupPurchase/leadOrder",//领货
  
  Partner: NewApiRootUrl + "common/partner", //成为伙伴（成为伙伴页）
  Pay: NewApiRootUrl + "common/pay", ///支付
};