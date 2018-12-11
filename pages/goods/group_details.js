const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    getFriendslist: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    joinNum:0,//参团人数
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      id: options.id
    });
    
    that.getFriendslist();
  },
  onReady: function () {

  },

  onShow: function () {

  },
  onHide: function () {

  },
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
  getFriendslist: function (e) {
    // 获取我的团列表信息
    let that = this;
    //console.log("id ------" + that.data.id);
    util.request(api.Friends,{id : that.data.id },"POST").then(function (res) {
      if (res.rs === 1) {
        var getFriendslist = res.data.list;
        that.setData({
          joinNum:res.data.joinNum,
          getFriendslist: getFriendslist
        })
        //console.log(getFriendslist);
      }
    });

  }
})