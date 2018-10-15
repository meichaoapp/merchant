const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const maps = require('../../utils/maps.js');
const wecache = require('../../utils/wecache.js');

const pointKey = "userLocation";
 
//获取应用实例
const app = getApp()
Page({
  data: {
    cityname:"",
    merchantName:"生源超市",
    banners: [],
    navs:[
      {
        id : 1,
        name:'兑换',
        url:'/pages/ucenter/coupon/coupon',
        icon_url:'/static/images/img-share-cash.png',
        way: 0,
      },
      {
        id: 2,
        name: '好礼',
        url: '/pages/hotGoods/hotGoods',
        icon_url: '/static/images/icon-user-yhq.png',
        way: 0,
      },
      {
        id: 3,
        name: '送礼',
        url: '/pages/cart/cart',
        icon_url: '/static/images/icon-user-lingqu.png',
        way: 1,
      },
      {
        id: 4,
        name: '提现',
        url: '/pages/ucenter/withdraw/index',
        icon_url: '/static/images/img-share-price.png',
        way:0,
      },
    ],
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '美超团购',
      path: '/pages/index/index'
    }
  },

  /**
   * 查询首页录播图
   */
  queryBanner: function () {
    let that = this;
    util.request(api.QueryBanner).then(function (res) {
      if (res.rs === 1) {
        that.setData({
          banners: res.data.banners
        });
      }
    });

  },
  //选择位置
  selectLocation: function () {
    let _this = this;
    maps.getLocation().then(res => {
      _this.setData({
        pointName: res.name,//具体的出发地点
        longitude: res.longitude,
        latitude: res.latitude,
      })
      //设置缓存信息
      var userLocation = {
        pointName: res.name,
        longitude: res.longitude,
        latitude: res.latitude,
      };
      wecache.put(pointKey, userLocation, -1);
    });
    _this.refresh(); // 加载行程信息
  },
  //导航跳转
  navTo: function (e) {
    //跳转TabBar路径
    if (e.currentTarget.dataset.way == 1 ) {
        wx.switchTab({
          url: e.currentTarget.dataset.url
        });  
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
        success: function (res) {
        },
        fail: function (e) {
          console.log("error--", e);
        }
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    this.queryBanner();
    this.getCurrentLocation();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /**
  * 获取当前地理位置信息
  */
  getCurrentLocation: function () {
    var that = this;
    var userLocation = wecache.get(pointKey, null);
    if (userLocation == null) {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function (res) {
          var latitude = res.latitude//维度
          var longitude = res.longitude//经度
          ///设置当前地理位置
          that.setData({
            latitude: latitude,
            longitude: longitude,
          });
          maps.getRegeo(latitude, longitude).then(res => {
            that.setData({
              pointName: res.poisData[0].address,
            });

          });
        }
      })
    } else {
      that.setData({
        pointName: userLocation.pointName,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
      })
    }

    //that.refresh(); // 加载行程信息
  },
})
