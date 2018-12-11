// pages/myShop/myShop.js
const app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    list: [],
    start: 1, // 页码
    totalPage: 0, // 共有页
    limit: 5,//每页条数
    hideHeader: true, //隐藏顶部提示
    hideBottom: true, //隐藏底部提示
    srollViewHeight: 0, //滚动分页区域高度
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
          userInfo: userInfo,
      });
    this.$wuxLoading = app.Wux().$wuxLoading //加载
    this.$wuxToast = app.Wux().$wuxToast

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
      _this.getOrderList();
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
      _this.getOrderList();
      wx.stopPullDownRefresh();
    }, 300);
  },

  //获取店铺订单
  getOrderList: function () {
      let _this = this;
    console.log("getOrderList ---- " + _this.data.userInfo.merchantId);
      util.request(api.QueryOrderList, {
        start: _this.data.start,
        limit: _this.data.limit,
        merchantId: _this.data.userInfo.merchantId,
      }, "POST").then(function (res) {
          if (res.rs === 1) {
            var list = res.data.list;
            console.log("getOrderList ---- " + JSON.stringify(list));
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
    //跳转到详情页
  goDetail(e){
      let orderId = e.currentTarget.dataset.orderid;
     
      wx.navigateTo({
        url: '/pages/goods/lendTheGoods?leadType=2&id='+orderId,
      });
  },
  
})
