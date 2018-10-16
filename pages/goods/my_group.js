const util = require('../../utils/util.js');
const api = require('../../config/api.js');


//获取应用实例
const app = getApp()
const statusArr = ["未开始", "进行中", "发放中", "已完成"];//0 未开始 1 进行中 2 已成团 3 已过期
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    list: [], // 团购列表
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 3,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.queryTGList();
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
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    this.setData({
      userInfo: userInfo,
    });

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

  // 上拉加载更多
  loadMore: function () {
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '已加载全部内容' })
      return;
    }
    setTimeout(function () {
      //console.log('上拉加载更多');
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryTGList();
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
      _this.queryTGList();
    }, 300);
  },

  queryTGList: function () {
    let _this = this;
    var data = {
      start: _this.data.start,
      limit: _this.data.limit,
      merchantId: _this.data.userInfo.id,
    }
    util.request(api.QueryTGList, data, "POST").then(function (res) {
      if (res.rs === 1) {
        var list = res.data.list;
        if(list != null && list.length > 0){
          // 获取当前时间，同时得到活动结束时间数组
          let newTime = new Date().getTime();
          list.forEach(o => {
            let startTime = new Date(o.startTime).getTime();
            let endTime = new Date(o.endTime).getTime();

            if (newTime - startTime >= 0) {
              // 如果活动未结束，对时间进行处理
              if (endTime - newTime > 0) {
                let time = (endTime - newTime) / 1000;
                o.status = 1; // 设置状态为进行中
              } else {//活动已结束，全部设置为'00'
                o.status = 2;

              }
            } else {
              o.status = 0;
            }
            o.statusStr = statusArr[o.status];
          })
        }
        
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
            hideBottom: true
          })
        }

      }
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }


})