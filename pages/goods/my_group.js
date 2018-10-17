const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const statusArr = ["修改", "团购进行中", "备货", "已完成"];//0 修改 1 团购进行中 2 备货 3 已完成
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    id: 0,
    list: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    this.getgroupList();
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
getgroupList: function (e) {
  // 获取我的团列表信息
    let that = this;
    util.request(api.QueryTGList).then(function (res) {
      if (res.rs === 1) {
        var list = res.data.list;
        var totalPage = res.data.totalPage;
        
        that.setData({
          list: list,
          totalPage: totalPage,
        })
        console.log(list);
      }
    });

  }
})