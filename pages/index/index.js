const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const maps = require('../../utils/maps.js');
const wecache = require('../../utils/wecache.js');

const pointKey = "userLocation";
const upgrade = "UPGRADE";

//获取应用实例
const app = getApp()
Page({
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    merchantName:"",
    banners: [],
    notice:null,
  },
  onShareAppMessage: function () {
    return {
      title: 'NideShop',
      desc: '美超团购',
      path: '/pages/index/index'
    }
  },
  
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });

    this.queryBanner();
    this.queryNotices();
    this.getCurrentLocation();

  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/auth/login/login'
      });
    } else {
      this.setData({
        userInfo: userInfo,
        merchantName: userInfo.name,
      });
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  //导航跳转
  navTo: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url == "null" || url == null) {
      return;
    }
    //跳转TabBar路径
    if (e.currentTarget.dataset.way == 1) {
      wx.switchTab({
        url: e.currentTarget.dataset.url
      });
    } else {
      wx.navigateTo({
        url: "/pages/thirdPage/thirdPage?url=" + url,
      })
    }
  },

  //领货扫描二维码
  scanQrCode: function(){ 
    var _this = this;
    wx.scanCode({
      success: (res) => {
        var orderId = res.result;
        wx.redirectTo({
          url: '/pages/goods/lendTheGoods?leadType=1&id='+orderId,
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描订单失败,请重试！',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },

  /**
   * 查询首页录播图
   */
  queryBanner: function () {
    let that = this;
    util.request(api.QueryBanner, { token: "" }, "POST").then(function (res) {
      if (res.rs === 1) {
        that.setData({
          banners: res.data.banners
        });
      }
    });

  },
  
  ///查询公告信息
  queryNotices: function() {
    let that = this;
    util.request(api.QueryNotices, 
     {
        token: "", start: 1, // 页码
        start: 1, 
        limit: 1,
      }, "POST").then(function (res) {
      if (res.rs === 1) {
        var list = res.data.list;
        if (null != list && list.length > 0){
          that.setData({
            notice: list[0]
          });
        }else{
          that.setData({
            notice: null
          });
        }
      
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
  goMyTuan: function() {
    wx.switchTab({
      url: '/pages/goods/my_group',
    })
  },
  goMyHuoban: function () {
    wx.switchTab({
      url: '/pages/ucenter/partner/partner',
    })
  },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

  goShop:function(){
    wx.navigateTo({
      url: '/pages/myShop/myShop',
    })
  },
  //商品管理
  goManage:function(){
    let that = this;
    util.request(api.CheckPurchasGoodsPromise, 
       { 
         token: "",
         merchantId: that.data.userInfo.merchantId,
        }, "POST").then(function (res) {
          if (res.rs == 1) {
            wx.navigateTo({
              url: '/pages/manageGoods/goodsList',
            })
          }else {
             wx.showToast({
               icon:"none",
               title: res.info,
             })
          }
    });
  
  },
})
