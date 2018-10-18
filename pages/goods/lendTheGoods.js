// pages/goods/lengSHops.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    id: 1,  //订单编号	
    orderId: 0,  //订单id
    name: "",	   //团购名称
    userName: "",	   //参团人
    joinTime: "", //参团时间，注意格式
    goodsList: [], //订单商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxToast = app.Wux().$wuxToast
    this.setData({
      id: options.id
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
    // 页面显示
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (null == userInfo || userInfo == "" || undefined == userInfo) {
      wx.navigateTo({
        url: '/pages/firstLogin/firstLogin'
      });
    } else {
      this.setData({
        userInfo: userInfo,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //确认领取
  leadOrder: function () {
    var _this = this;
    util.request(api.LeadOrder, { id: _this.data.orderId, userId: _this.data.userInfo.id }, "POST").then(function (res) {
      if (res.rs === 1) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }else{
        _this.$wuxToast.show({ type: 'forbidden', text: "领取失败，请重新操作！", });
      }
    });
  },

  //跳转首页(知道了)
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  getData:function() {
    let that = this;
    util.request(api.QueryOrderDetail, { orderId: that.data.id },"POST").then(function (res) {
      if (res.rs === 1) {
        that.setData({
          orderId: res.data.id,
          name: res.data.name,	   //团购名称
          userName: res.data.userName,	   //参团人
          joinTime: res.data.joinTime, //参团时间，注意格式
          goodsList: res.data.goodsList, //订单商品列表
        });
      }
    });
  }
})