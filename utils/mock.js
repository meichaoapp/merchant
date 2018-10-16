var api = require('../config/api.js');

const RS = {
  "rs": 1,
  "info": null,
  "data": {
  }
};

function getData(url, p) {
  if (undefined != p && p != null) {
    console.log("参数为：" + JSON.stringify(p));
  }

  RS.data = {}


  //微信登录
  if (url == api.WXLogin) {
    return wxLogin();
  }
  //-----------------------首页
  //查询banner
  if (url == api.QueryBanner) {
    return QueryBanner();
  }

  //获取团购信息
  if (url == api.QueryTGList) {
    return QueryTGList();
  }

  //参团好友
  if (url == api.Friends){
    return Friends();
  }

  //--------------------成为伙伴（成为伙伴页）
  if (url == api.Partner) {
    return JSON.stringify(RS);
  }


  //LeadOrder
  if (url == api.LeadOrder) {
    return JSON.stringify(RS);
  }

  //获取参团详情（我的参团-兑现)
  if (url == api.QueryOrderDetail) {
    return QueryOrderDetail();
  }
  
  //支付
  if(url == api.Pay){
    return JSON.stringify(RS);
  }

  // 我的团
  if (url == api.lendTheGoods) {
    return JSON.stringify(RS);
  }
  


}

//微信登录
function wxLogin() {
  var user = {
    "id": 1,  //id	
    "name": "wangwang",	   //商户名称
    "address": "北京市海淀区上地华联商厦",	   //商户地址
    "longitude": 34.1,	   //经度
    "latitude": 110.1,	   //纬度
    "nickName": "wangwang",	      //微信昵称
    "openid": "P90FDeUdnFMZkwZ274fEWnWqE",        // openid
    "sex": 0,        // 性别 0 男 1 女
    "avatar": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLW3U1bBXQGaRILfI9mUgMNuX3MRicwXdVshxp7WWia3Ojq4K4ZL2V4HrTic9BATHKyQQbeFOHb4Rw2w/0" //头像	
  }


  RS.data.user = user;
  RS.data.token = "773b8bde7ed698bc2cc2227d5c765704";
  return JSON.stringify(RS);

}

//获取团购信息
function QueryTGList() {
  var list = [
    {
      "id": 1,  //id	
      "merchantId": 1,  //商户ID	
      "merchantName": "我是一只熊",
      "name": "快乐的蛋 出厂价团 只为宣传",	   //团购名称
      "url": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/3299989615/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "精品羊排新鲜出厂", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 90, //参团人数
      "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
      "endTime": "2018/09/16 00:00:00", //结束时间，注意格式
    },
    {
      "id": 2,  //id	
      "merchantId": 1,  //商户ID	
      "merchantName": "快乐山鸡",
      "name": "快乐的蛋 出厂价团 只为宣传",	   //团购名称
      "url": "https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/3299989615/TB1baFLaOrpK1RjSZFhXXXSdXXa_!!0-item_pic.jpg_250x250.jpg",	   //展示url
      "price": "15元", //团购价
      "status": 0, //0 未开始 1 进行中 2 已成团 3 已过期
      "comments": "精品羊排新鲜出厂", //简述
      "limitNum": 99, //参团人数上限
      "joinNum": 90, //参团人数
      "startTime": "2018/09/16 00:00:00", //开始时间，注意格式
      "endTime": "2018/09/18 23:00:00", //结束时间，注意格式
    },
  ];

  RS.data.list = list;
  RS.data.totalPage = 2;
  return JSON.stringify(RS);
}




//查询banner
function QueryBanner() {
  var banners = [
    {
      "id": 1,  //id	
      "name": "轮播图1",	   //轮播图名称
      "url": "https://gw.alicdn.com/tfs/TB1dHNDXMHqK1RjSZFEXXcGMXXa-750-291.jpg_Q90.jpg",	   //url
      "target": "" //跳转地址
    },
    {
      "id": 2,  //id	
      "name": "轮播图2",	   //轮播图名称
      "url": "https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/bff2e49136fcef1fd829f5036e07f116.jpg",	   //url
      "target": "" //跳转地址
    }
  ];
  RS.data.banners = banners;

  return JSON.stringify(RS);
}



//参团好友
function Friends(){
  var data = {
    "joinNum": 90, //参团人数
    "list": [
      {
        "id":1,  //id	
        "name":"wangwang",	   //客户名称
        "nickName": "wangwang",	      //微信昵称
        "openid":"P90FDeUdnFMZkwZ274fEWnWqE",        // openid
        "avatar":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLW3U1bBXQGaRILfI9mUgMNuX3MRicwXdVshxp7WWia3Ojq4K4ZL2V4HrTic9BATHKyQQbeFOHb4Rw2w/0", //头像	
        "goodsList": [
          {
            "id": 1, // 商品id
            "url": "",//展示图片
            "name": "",//名称
            "specifications": "整箱20个",//规格
            "marketPrice": 10.05,//市场价
            "price": 10.05,//单价
            "buyNum": 100,//购买数量
          }
        ]//商品清单
      }
    ]
  }

  RS.data = data;
  return JSON.stringify(RS);
}


//获取参团详情（我的参团-兑现）
function QueryOrderDetail(){
  var data = {
    "id": 1,  //订单id	  
    "name": "精品羊排 新鲜出厂当日即达",	   //团购名称
    "userName": "快乐的山羊",	   //参团人
    "joinTime": "2018/09/16", //参团时间，注意格式
    "goodsList": [
      {
        "id": 1, // 商品id
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g1.png",//展示图片
        "name": "细嫩多汁蜜蜂21.5C绿心奇异果",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 11.05,//市场价
        "price": 10.05,//单价
        "unit": "盒",//单位
        "buyNum": 100,//购买数量
      },
      {
        "id": 2, // 商品id
        "url": "https://s-mall.oss-cn-beijing.aliyuncs.com/meichao/g2.png",//展示图片
        "name": "精品羊排 新鲜出厂当日即达",//名称
        "specifications": "整箱20个",//规格
        "marketPrice": 19.05,//市场价
        "price": 10.05,//单价
        "unit": "盒",//单位
        "buyNum": 100,//购买数量
      }
    ]//商品清单

  }
  RS.data = data;
  return JSON.stringify(RS);
}



module.exports = {
  getData,
}