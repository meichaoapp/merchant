const app = getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
Page({

    data: {
        basePath: app.globalData._base_path, //基础路径
        list: [],
        start: 1, // 页码
        totalPage: 0, // 共有页
        limit: 10,//每页条数
        hideHeader: true, //隐藏顶部提示
        hideBottom: true, //隐藏底部提示
        srollViewHeight: 0, //滚动分页区域高度
        refreshTime: '', // 刷新的时间
        loadMoreData: '上拉加载更多',
        date:'',//日期
    },

    onLoad: function (options) {
      let userInfo = wx.getStorageSync('userInfo');
      var d = new Date();
      var year = d.getFullYear();
      var month = d.getMonth() + 1;
      var mt = (month < 10) ? ("0" + month) : month;
      var date = year + "-" + mt;
      this.setData({
        date:date,
        userInfo: userInfo,
      });
      this.getList();
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
        url: '/pages/auth/login/login'
      });
    } else {
      this.setData({
        userInfo: userInfo,
      });
    }
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMore();
  },

  // 上拉加载更多
  loadMore: function () {
    console.log('上拉加载更多');
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.getList();
    }, 300);
  },

  // 下拉刷新
  refresh: function (e) {
    let _this = this;
    setTimeout(function () {
      //console.log('下拉刷新');
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      _this.getList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  //获取店铺订单
  getList: function () {
    let _this = this;
    util.request(api.QuerymMyTradeList, {
      start: _this.data.start,
      limit: _this.data.limit,
      userId: _this.data.userInfo.id,
      merchantId: _this.data.userInfo.merchantId,
      date: _this.data.date,
    }, "POST").then(function (res) {
      if (res.rs === 1) {
        var list = res.data.list;
        if (_this.data.start == 1) { // 下拉刷新
          _this.setData({
            list: list,
            hideHeader: true,
            totalPage: res.data.totalPage,
          })
        } else { // 加载更多
          //console.log('加载更多');
          var tempArray = _this.data.list;
          tempArray = tempArray.concat(list);
          _this.setData({
            totalPage: res.data.totalPage,
            list: tempArray,
            //hideBottom: true
          })
        }

      }
    });
  },
  //点击日期组件确定事件
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      start: 1,
      list: [],
      start: 1, // 页码
      totalPage: 0, // 共有页
      limit: 10,//每页条数
      orderInfo: {},
      hideHeader: true, //隐藏顶部提示
      hideBottom: true, //隐藏底部提示
    })
    this.getList();
  },
})