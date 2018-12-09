// pages/myShop/myShop.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},
      orderList:[],//店铺订单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
          userInfo: userInfo,
      });
      this.getOrderList();
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
  //获取店铺订单
  getOrderList: function () {
      let that = this;
      util.request(api.QueryOrderList, {
          merchantId: that.data.userInfo.id,
      }, "POST").then(function (res) {
        console.log(res);
          if (res.rs === 1) {
              that.setData({
                  orderList: res.data.data.list
              });
          }
      });
  },
    //跳转到详情页
  goDetail(e){
      let orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
          url: '/pages/goods/lendTheGoods?id='+orderId,
      });
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

  }
})
