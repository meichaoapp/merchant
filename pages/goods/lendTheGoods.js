// pages/goods/lengSHops.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const wecache = require('../../utils/wecache.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  getData:function() {
    let that = this;
    var data = {
      latitude: that.data.latitude,
      longitude: that.data.longitude,
    }
    util.request(api.lendTheGoods, data).then(function (res) {
      if (res.rs === 1) {
        _this.setData({
          merchants: res.data.merchants,
        });
      }
    });
  }
})