// pages/announcement/announcement.js
const app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const statusArr = [1,2];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.globalData._base_path, //基础路径
    userInfo: {},
    list: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 8,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间
    loadMoreData: '上拉加载更多',
    tabIndex:0,
    searchText:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });
    this.queryList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //切换
  switchTabs:function(e) {
    let _this = this;
    var index = e.currentTarget.dataset.index;
    _this.setData({
      list: [],
      start: 1, // 页码
      totalPage: 0, // 共有页
      tabIndex: index,
      searchText: "",
    });

    _this.queryList();
  },
  
  //监听输入框变化
  bindSearchText: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  //商品上下架
  changeStatus:function(e){
    let _this = this;
    var id = e.currentTarget.dataset.id;
    var status = 1;
    if (_this.data.tabIndex == 0) {
      status = 2;
    }
    var data = {
      status: status,
      merchantId: _this.data.userInfo.merchantId,
      detailId:id,
    }

    util.request(api.PurchasGoodsUpDown,data, "POST").then(function (res) {
        if (res.rs == 1) {
          wx.showToast({
            title: "操作成功!",
          })
          _this.setData({
            list: [],
            start: 1, // 页码
            totalPage: 0, // 共有页
            tabIndex: (_this.data.tabIndex == 0) ? 1 : 0,
          });
          _this.queryList();
        } else {
          wx.showToast({
            icon: "none",
            title: res.info,
          })
        }
    });
  },
  
  //去编辑页
  toEditPage: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/manageGoods/editGoods?id=' + id,
    })
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
    let _this = this;
    // 当前页是最后一页
    if (_this.data.start == _this.data.totalPage) {
      _this.setData({ loadMoreData: '我是有底线的' })
      return;
    }
    setTimeout(function () {
      _this.setData({
        start: _this.data.start + 1,
        hideBottom: false
      })
      _this.queryList();
    }, 300);
  },

  // 下拉刷新
  refresh: function (e) {
    let _this = this;
    setTimeout(function () {
      console.log('下拉刷新');
      _this.setData({
        start: 1,
        refreshTime: new Date().toLocaleTimeString(),
        hideHeader: false
      })
      _this.queryList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  queryList: function () {
    let _this = this;
    var data = {
      start: _this.data.start,
      limit: _this.data.limit,
      status:statusArr[_this.data.tabIndex],
      searchText: _this.data.searchText,
      merchantId: _this.data.userInfo.merchantId,
    }
    util.request(api.QueryPurchasGoodsList, data, "POST").then(function (res) {
      if (res.rs === 1) {
        var list = res.data.list;
 
        var totalPage = res.data.totalPage;

        if (_this.data.start == 1) { // 下拉刷新
          _this.setData({
            list: list,
            hideHeader: true,
            totalPage: res.data.totalPage,
          })
        } else { // 加载更多
          var tempArray = _this.data.list;
          tempArray = tempArray.concat(list);
          _this.setData({
            totalPage: res.data.totalPage,
            list: tempArray,
          })
        }
      } else {
        wx.showToast({
          icon:"none",
          title: res.info,
        })
      }
    });
  },

})