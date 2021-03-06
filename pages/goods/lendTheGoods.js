// pages/goods/lengSHops.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo:{},
    id: 1,  //订单编号
    leadType:1,
    status: 0,// 订单状态 0 待支付 1 已支付 2 待领取 3 已完成 4 放弃 5 退货
    orderId: 0,  //订单id
    name: "",	   //团购名称
    userName: "",	   //参团人
    joinTime: "", //参团时间，注意格式
    goodsList: [], //订单商品列表
    count: 0, //提交计数
    needPay:0,
    toggleflag:true,//是否勾选清单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
    console.log("orderId ---" + options.id);
    this.setData({
      orderId: options.id,
      leadType: options.leadType
    });
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });


    this.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      count: 0, //提交计数
    });
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
      });
    }
  },

 

  //确认领取
  leadOrder: function () {
    var _this = this;
    if (_this.data.count > 0) {
      return;
    }
    _this.setData({
      count: _this.data.count + 1,
    });

    if (_this.data.status != 2){
      _this.setData({
        count: 0,
      });
      return;
    }
    var goodsIdArr = [];
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        if (o.status == 0 && o.checked == 1) {
          goodsIdArr.push(o.id);
        }
      });
    }

    if(goodsIdArr.length == 0) {
      _this.$wuxToast.show({ type: 'forbidden', text: "请选择要领取商品", });
      _this.setData({
        count: 0,
      });
      return;
    }
    util.request(api.LeadOrder, {
      id: _this.data.id,
      merchantId: _this.data.userInfo.id,
      goodsIds: goodsIdArr.join(","),
      leadType: _this.data.leadType,
     }, "POST").then(function (res) {
      if (res.rs === 1) {
        wx.showToast({
          title: '领取成功!',
        })
        if (_this.data.leadType == 2){
          wx.navigateTo({
            url: '/pages/myShop/myShop',
          })
        }else {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
       
      }else{
        _this.setData({
          count: 0,
        });
        _this.$wuxToast.show({ type: 'forbidden', text: res.info, });
        wx.redirectTo({
          url: '/pages/goods/noneOrder',
        })
      }
    });
  },

  //跳转首页(知道了)
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  checkGoogs:function(e) {
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var goodsList = _this.data.goodsList;
    if (goodsList != null && goodsList.length > 0) {
      goodsList.forEach(o => {
        console.log("o.checked  ----" + o.checked);
        if (o.id == id && o.status == 0 && o.checked == 1) {
          o.checked = 0;
        } else if (o.id == id && o.status == 0 && o.checked == 0)  {
          o.checked = 1;
        }
        console.log("o.checked 1  ----" + o.checked );
      });
    }

    _this.setData({
      goodsList: goodsList, //订单商品列表
    });

  },

  getData:function() {
    let that = this;
    util.request(api.QueryOrderDetail, { orderId: that.data.orderId, merchantId: that.data.userInfo.id  },"POST").then(function (res) {
      console.log("QueryOrderDetail ---- " + JSON.stringify(res.data) );
      if (res.data == null || res.data == undefined) {
        wx.redirectTo({
          url: '/pages/goods/noneOrder',
        })
        return;
      }
      if (res.rs === 1) {
        var goodsList = res.data.goodsList;
        if (goodsList != null && goodsList.length > 0) {
          goodsList.forEach(o => {
            if (o.status == 0) {
              o.checked = 0;
            }

          });
        }
        that.setData({
          id: res.data.id,
          status: res.data.status,
          name: res.data.name,	   //团购名称
          userName: res.data.userName,	   //参团人
          joinTime: res.data.joinTime, //参团时间，注意格式
          orderId:res.data.orderId,//订单编号
          needPay: res.data.needPay,//总金额
          goodsList: goodsList, //订单商品列表
        });
      }else{
        that.$wuxToast.show({ type: 'forbidden', text: res.info, });
      }
    });
  }
})
